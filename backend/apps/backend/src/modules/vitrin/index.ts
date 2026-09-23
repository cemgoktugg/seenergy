import { Module } from "@medusajs/framework/utils"

import VitrinModuleService from "./service"

/**
 * SEENERGY Vitrin — the storefront's editable design content: curated product
 * lists, hero slides, banners, brand showcases and site-wide texts.
 */
export const VITRIN_MODULE = "vitrin"

export default Module(VITRIN_MODULE, {
  service: VitrinModuleService,
})
