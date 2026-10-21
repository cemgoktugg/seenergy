import { MedusaContainer } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  createCollectionsWorkflow,
  createInventoryLevelsWorkflow,
  createPriceListsWorkflow,
  createProductCategoriesWorkflow,
  createProductOptionsWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createStockLocationsWorkflow,
  createStoresWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
} from "@medusajs/medusa/core-flows";

import catalog from "../seed/catalog.json";

/**
 * SEENERGY initial data.
 *
 * Runs once, as a migration script, on a fresh database. The catalogue comes
 * from `src/seed/catalog.json` — a one-time snapshot of the storefront's
 * former static catalogue. Medusa is the source of truth from here on: change
 * products in the admin, not in the JSON.
 *
 * Commerce rules carried over from the storefront:
 *   - Prices are TRY and KDV-inclusive, as Turkish shelf prices are.
 *   - A discounted product's `compareAtPrice` is its base price; the price it
 *     actually sells for lives in the "İndirimli Fiyatlar" sale price list, so
 *     Medusa returns both and the storefront derives the percentage.
 *   - Shipping is free from 1.000 TL, matching the old `freeShipping` rule.
 */

const TR = "tr";
const FREE_SHIPPING_FROM = 1000;
const STOREFRONT_URL = process.env.STOREFRONT_URL ?? "http://localhost:3100";

export default async function initial_data_seed({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(
    ModuleRegistrationName.FULFILLMENT
  );

  // Only ever on an EMPTY database. A database restored from
  // deploy/seenergy.sql already has all of this; re-running it there (as a
  // built backend once did, under the script's .js name) created a second
  // sales channel, API key and store before failing on the region.
  const { data: regions } = await query.graph({ entity: "region", fields: ["id"] });
  if (regions.length > 0) {
    logger.info("SEENERGY: the database already holds a region — initial seed skipped.");
    return;
  }

  logger.info("SEENERGY: store, sales channel and publishable key...");
  const {
    result: [salesChannel],
  } = await createSalesChannelsWorkflow(container).run({
    input: {
      salesChannelsData: [
        { name: "SEENERGY Web", description: "seenergy storefront" },
      ],
    },
  });

  const {
    result: [publishableApiKey],
  } = await createApiKeysWorkflow(container).run({
    input: {
      api_keys: [
        { title: "SEENERGY Storefront", type: "publishable", created_by: "" },
      ],
    },
  });

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: { id: publishableApiKey.id, add: [salesChannel.id] },
  });

  await createStoresWorkflow(container).run({
    input: {
      stores: [
        {
          name: "SEENERGY",
          supported_currencies: [
            { currency_code: "try", is_default: true, is_tax_inclusive: true },
          ],
          default_sales_channel_id: salesChannel.id,
        },
      ],
    },
  });

  logger.info("SEENERGY: region and KDV...");
  const {
    result: [region],
  } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Türkiye",
          currency_code: "try",
          countries: [TR],
          payment_providers: ["pp_system_default"],
          is_tax_inclusive: true,
        },
      ],
    },
  });

  await createTaxRegionsWorkflow(container).run({
    input: [
      {
        country_code: TR,
        provider_id: "tp_system",
        default_tax_rate: { rate: 20, code: "KDV", name: "KDV %20" },
      },
    ],
  });

  logger.info("SEENERGY: warehouse and shipping...");
  const {
    result: [stockLocation],
  } = await createStockLocationsWorkflow(container).run({
    input: {
      locations: [
        {
          name: "Merkez Depo",
          address: { city: "İstanbul", country_code: "TR", address_1: "" },
        },
      ],
    },
  });

  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
    [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
  });

  // Created by a core migration script.
  const {
    data: [shippingProfile],
  } = await query.graph({ entity: "shipping_profile", fields: ["id"] });

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "Merkez Depo teslimat",
    type: "shipping",
    service_zones: [
      { name: "Türkiye", geo_zones: [{ country_code: TR, type: "country" }] },
    ],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
    [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
  });

  const storeRules = [
    { attribute: "enabled_in_store", value: "true", operator: "eq" as const },
    { attribute: "is_return", value: "false", operator: "eq" as const },
  ];
  const freeFrom = [
    {
      attribute: "item_total",
      operator: "gte" as const,
      value: FREE_SHIPPING_FROM,
    },
  ];

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standart Kargo",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standart",
          description: "1-3 iş gününde kargoda. 1.000 TL üzeri ücretsiz.",
          code: "standart",
        },
        prices: [
          { currency_code: "try", amount: 99.9 },
          { currency_code: "try", amount: 0, rules: freeFrom },
          { region_id: region.id, amount: 99.9 },
          { region_id: region.id, amount: 0, rules: freeFrom },
        ],
        rules: storeRules,
      },
      {
        name: "Hızlı Kargo",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Hızlı",
          description: "Saat 15:00'e kadar verilen siparişler aynı gün kargoda.",
          code: "hizli",
        },
        prices: [
          { currency_code: "try", amount: 149.9 },
          { region_id: region.id, amount: 149.9 },
        ],
        rules: storeRules,
      },
    ],
  });

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: { id: stockLocation.id, add: [salesChannel.id] },
  });

  logger.info("SEENERGY: categories and brands...");
  const { result: categories } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: catalog.categories.map((c) => ({
        name: c.name,
        handle: c.handle,
        rank: c.rank,
        is_active: true,
        metadata: { key: c.key },
      })),
    },
  });
  const categoryIdByKey = new Map(
    catalog.categories.map((c) => [
      c.key,
      categories.find((created) => created.handle === c.handle)!.id,
    ])
  );

  // A brand is a collection: it has a handle for /marka/<handle> and the admin
  // can already list, rename and reorder collections.
  const { result: collections } = await createCollectionsWorkflow(
    container
  ).run({
    input: {
      collections: catalog.brands.map((b) => ({
        title: b.name,
        handle: b.handle,
      })),
    },
  });
  const collectionIdByBrand = new Map(
    catalog.brands.map((b) => [
      b.name,
      collections.find((created) => created.handle === b.handle)!.id,
    ])
  );

  logger.info(`SEENERGY: ${catalog.products.length} products...`);
  // Every catalogue product is a single model; one option keeps Medusa's
  // variant model satisfied without inventing sizes or colours.
  const {
    result: [modelOption],
  } = await createProductOptionsWorkflow(container).run({
    input: { product_options: [{ title: "Model", values: ["Standart"] }] },
  });

  const { result: products } = await createProductsWorkflow(container).run({
    input: {
      products: catalog.products.map((p) => ({
        title: p.title,
        handle: p.handle,
        status: ProductStatus.PUBLISHED,
        category_ids: [categoryIdByKey.get(p.category)!],
        collection_id: collectionIdByBrand.get(p.brand),
        shipping_profile_id: shippingProfile.id,
        thumbnail: `${STOREFRONT_URL}${p.image}`,
        images: [{ url: `${STOREFRONT_URL}${p.image}` }],
        metadata: {
          legacy_id: p.legacyId,
          brand: p.brand,
          instalment: p.instalment,
          ...(p.badge ? { badge: p.badge } : {}),
        },
        options: [{ id: modelOption.id }],
        variants: [
          {
            title: "Standart",
            sku: p.sku,
            manage_inventory: true,
            options: { Model: "Standart" },
            prices: [
              { currency_code: "try", amount: p.compareAtPrice ?? p.price },
            ],
          },
        ],
        sales_channels: [{ id: salesChannel.id }],
      })),
    },
  });

  logger.info("SEENERGY: sale prices...");
  const variantIdBySku = new Map(
    products.flatMap((product) =>
      (product.variants ?? []).map((v) => [v.sku!, v.id] as const)
    )
  );
  const discounted = catalog.products.filter((p) => p.compareAtPrice !== null);

  await createPriceListsWorkflow(container).run({
    input: {
      price_lists_data: [
        {
          title: "İndirimli Fiyatlar",
          description: "Katalogdaki indirimli ürünlerin satış fiyatları.",
          // Price lists are "sale" by default; the workflow input has no type.
          status: "active",
          prices: discounted.map((p) => ({
            currency_code: "try",
            amount: p.price,
            variant_id: variantIdBySku.get(p.sku)!,
          })),
        },
      ],
    },
  });

  logger.info("SEENERGY: stock levels...");
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id", "sku"],
  });
  const stockBySku = new Map(catalog.products.map((p) => [p.sku, p.stock]));

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryItems.map((item) => ({
        location_id: stockLocation.id,
        inventory_item_id: item.id,
        stocked_quantity: stockBySku.get(item.sku ?? "") ?? 0,
      })),
    },
  });

  logger.info(
    `SEENERGY seed done: ${products.length} products, ${discounted.length} on sale. Publishable key: ${publishableApiKey.token}`
  );
}
