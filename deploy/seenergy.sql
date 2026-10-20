--
-- PostgreSQL database dump
--

\restrict m7gIReFQMB1ifjiGOdeZG1pSH0ajfJYSYktejyO5UtzX9TrqGTtZErI2nd3tVWu

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


--
-- Name: claim_reason_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.claim_reason_enum AS ENUM (
    'missing_item',
    'wrong_item',
    'production_failure',
    'other'
);


--
-- Name: order_claim_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.order_claim_type_enum AS ENUM (
    'refund',
    'replace'
);


--
-- Name: order_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.order_status_enum AS ENUM (
    'pending',
    'completed',
    'draft',
    'archived',
    'canceled',
    'requires_action'
);


--
-- Name: return_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.return_status_enum AS ENUM (
    'open',
    'requested',
    'received',
    'partially_received',
    'canceled'
);


--
-- Name: medusa_search_english; Type: TEXT SEARCH CONFIGURATION; Schema: public; Owner: -
--

CREATE TEXT SEARCH CONFIGURATION public.medusa_search_english (
    PARSER = pg_catalog."default" );

ALTER TEXT SEARCH CONFIGURATION public.medusa_search_english
    ADD MAPPING FOR asciiword WITH english_stem;

ALTER TEXT SEARCH CONFIGURATION public.medusa_search_english
    ADD MAPPING FOR word WITH public.unaccent, english_stem;

ALTER TEXT SEARCH CONFIGURATION public.medusa_search_english
    ADD MAPPING FOR numword WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.medusa_search_english
    ADD MAPPING FOR email WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.medusa_search_english
    ADD MAPPING FOR url WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.medusa_search_english
    ADD MAPPING FOR host WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.medusa_search_english
    ADD MAPPING FOR sfloat WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.medusa_search_english
    ADD MAPPING FOR version WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.medusa_search_english
    ADD MAPPING FOR hword_numpart WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.medusa_search_english
    ADD MAPPING FOR hword_part WITH public.unaccent, english_stem;

ALTER TEXT SEARCH CONFIGURATION public.medusa_search_english
    ADD MAPPING FOR hword_asciipart WITH english_stem;

ALTER TEXT SEARCH CONFIGURATION public.medusa_search_english
    ADD MAPPING FOR numhword WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.medusa_search_english
    ADD MAPPING FOR asciihword WITH english_stem;

ALTER TEXT SEARCH CONFIGURATION public.medusa_search_english
    ADD MAPPING FOR hword WITH public.unaccent, english_stem;

ALTER TEXT SEARCH CONFIGURATION public.medusa_search_english
    ADD MAPPING FOR url_path WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.medusa_search_english
    ADD MAPPING FOR file WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.medusa_search_english
    ADD MAPPING FOR "float" WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.medusa_search_english
    ADD MAPPING FOR "int" WITH simple;

ALTER TEXT SEARCH CONFIGURATION public.medusa_search_english
    ADD MAPPING FOR uint WITH simple;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account_holder; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.account_holder (
    id text NOT NULL,
    provider_id text NOT NULL,
    external_id text NOT NULL,
    email text,
    data jsonb DEFAULT '{}'::jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: api_key; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.api_key (
    id text NOT NULL,
    token text NOT NULL,
    salt text NOT NULL,
    redacted text NOT NULL,
    title text NOT NULL,
    type text NOT NULL,
    last_used_at timestamp with time zone,
    created_by text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_by text,
    revoked_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT api_key_type_check CHECK ((type = ANY (ARRAY['publishable'::text, 'secret'::text])))
);


--
-- Name: application_method_buy_rules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.application_method_buy_rules (
    application_method_id text NOT NULL,
    promotion_rule_id text NOT NULL
);


--
-- Name: application_method_target_rules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.application_method_target_rules (
    application_method_id text NOT NULL,
    promotion_rule_id text NOT NULL
);


--
-- Name: auth_identity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_identity (
    id text NOT NULL,
    app_metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: auth_mfa_factor; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_mfa_factor (
    id text NOT NULL,
    auth_identity_id text NOT NULL,
    provider text NOT NULL,
    status text NOT NULL,
    provider_metadata jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: auth_mfa_recovery_code; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_mfa_recovery_code (
    id text NOT NULL,
    auth_identity_id text NOT NULL,
    code_hash text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: auth_password_reset_token; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_password_reset_token (
    id text NOT NULL,
    auth_identity_id text NOT NULL,
    provider_identity_id text NOT NULL,
    entity_id text NOT NULL,
    token_hash text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: auth_verification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_verification (
    id text NOT NULL,
    auth_identity_id text NOT NULL,
    entity_id text NOT NULL,
    entity_type text NOT NULL,
    code_provider text NOT NULL,
    verified_at timestamp with time zone,
    requested_at timestamp with time zone NOT NULL,
    provider_metadata jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: capture; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.capture (
    id text NOT NULL,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    payment_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    created_by text,
    metadata jsonb
);


--
-- Name: cart; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart (
    id text NOT NULL,
    region_id text,
    customer_id text,
    sales_channel_id text,
    email text,
    currency_code text NOT NULL,
    shipping_address_id text,
    billing_address_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    completed_at timestamp with time zone,
    locale text
);


--
-- Name: cart_address; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_address (
    id text NOT NULL,
    customer_id text,
    company text,
    first_name text,
    last_name text,
    address_1 text,
    address_2 text,
    city text,
    country_code text,
    province text,
    postal_code text,
    phone text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: cart_line_item; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_line_item (
    id text NOT NULL,
    cart_id text NOT NULL,
    title text NOT NULL,
    subtitle text,
    thumbnail text,
    quantity integer NOT NULL,
    variant_id text,
    product_id text,
    product_title text,
    product_description text,
    product_subtitle text,
    product_type text,
    product_collection text,
    product_handle text,
    variant_sku text,
    variant_barcode text,
    variant_title text,
    variant_option_values jsonb,
    requires_shipping boolean DEFAULT true NOT NULL,
    is_discountable boolean DEFAULT true NOT NULL,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    compare_at_unit_price numeric,
    raw_compare_at_unit_price jsonb,
    unit_price numeric NOT NULL,
    raw_unit_price jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    product_type_id text,
    is_custom_price boolean DEFAULT false NOT NULL,
    is_giftcard boolean DEFAULT false NOT NULL,
    CONSTRAINT cart_line_item_unit_price_check CHECK ((unit_price >= (0)::numeric))
);


--
-- Name: cart_line_item_adjustment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_line_item_adjustment (
    id text NOT NULL,
    description text,
    promotion_id text,
    code text,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    provider_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    item_id text,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    CONSTRAINT cart_line_item_adjustment_check CHECK ((amount >= (0)::numeric))
);


--
-- Name: cart_line_item_tax_line; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_line_item_tax_line (
    id text NOT NULL,
    description text,
    tax_rate_id text,
    code text NOT NULL,
    rate real NOT NULL,
    provider_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    item_id text,
    data jsonb
);


--
-- Name: cart_payment_collection; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_payment_collection (
    cart_id character varying(255) NOT NULL,
    payment_collection_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: cart_promotion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_promotion (
    cart_id character varying(255) NOT NULL,
    promotion_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: cart_shipping_method; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_shipping_method (
    id text NOT NULL,
    cart_id text NOT NULL,
    name text NOT NULL,
    description jsonb,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    shipping_option_id text,
    data jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT cart_shipping_method_check CHECK ((amount >= (0)::numeric))
);


--
-- Name: cart_shipping_method_adjustment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_shipping_method_adjustment (
    id text NOT NULL,
    description text,
    promotion_id text,
    code text,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    provider_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    shipping_method_id text
);


--
-- Name: cart_shipping_method_tax_line; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_shipping_method_tax_line (
    id text NOT NULL,
    description text,
    tax_rate_id text,
    code text NOT NULL,
    rate real NOT NULL,
    provider_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    shipping_method_id text,
    data jsonb
);


--
-- Name: credit_line; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.credit_line (
    id text NOT NULL,
    cart_id text NOT NULL,
    reference text,
    reference_id text,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: currency; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.currency (
    code text NOT NULL,
    symbol text NOT NULL,
    symbol_native text NOT NULL,
    decimal_digits integer DEFAULT 0 NOT NULL,
    rounding numeric DEFAULT 0 NOT NULL,
    raw_rounding jsonb NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: customer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customer (
    id text NOT NULL,
    company_name text,
    first_name text,
    last_name text,
    email text,
    phone text,
    has_account boolean DEFAULT false NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    created_by text
);


--
-- Name: customer_account_holder; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customer_account_holder (
    customer_id character varying(255) NOT NULL,
    account_holder_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: customer_address; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customer_address (
    id text NOT NULL,
    customer_id text NOT NULL,
    address_name text,
    is_default_shipping boolean DEFAULT false NOT NULL,
    is_default_billing boolean DEFAULT false NOT NULL,
    company text,
    first_name text,
    last_name text,
    address_1 text,
    address_2 text,
    city text,
    country_code text,
    province text,
    postal_code text,
    phone text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: customer_group; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customer_group (
    id text NOT NULL,
    name text NOT NULL,
    metadata jsonb,
    created_by text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: customer_group_customer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customer_group_customer (
    id text NOT NULL,
    customer_id text NOT NULL,
    customer_group_id text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by text,
    deleted_at timestamp with time zone
);


--
-- Name: fulfillment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fulfillment (
    id text NOT NULL,
    location_id text NOT NULL,
    packed_at timestamp with time zone,
    shipped_at timestamp with time zone,
    delivered_at timestamp with time zone,
    canceled_at timestamp with time zone,
    data jsonb,
    provider_id text,
    shipping_option_id text,
    metadata jsonb,
    delivery_address_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    marked_shipped_by text,
    created_by text,
    requires_shipping boolean DEFAULT true NOT NULL
);


--
-- Name: fulfillment_address; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fulfillment_address (
    id text NOT NULL,
    company text,
    first_name text,
    last_name text,
    address_1 text,
    address_2 text,
    city text,
    country_code text,
    province text,
    postal_code text,
    phone text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: fulfillment_item; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fulfillment_item (
    id text NOT NULL,
    title text NOT NULL,
    sku text NOT NULL,
    barcode text NOT NULL,
    quantity numeric NOT NULL,
    raw_quantity jsonb NOT NULL,
    line_item_id text,
    inventory_item_id text,
    fulfillment_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: fulfillment_label; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fulfillment_label (
    id text NOT NULL,
    tracking_number text NOT NULL,
    tracking_url text NOT NULL,
    label_url text NOT NULL,
    fulfillment_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: fulfillment_provider; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fulfillment_provider (
    id text NOT NULL,
    is_enabled boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: fulfillment_set; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fulfillment_set (
    id text NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: geo_zone; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.geo_zone (
    id text NOT NULL,
    type text DEFAULT 'country'::text NOT NULL,
    country_code text NOT NULL,
    province_code text,
    city text,
    service_zone_id text NOT NULL,
    postal_expression jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT geo_zone_type_check CHECK ((type = ANY (ARRAY['country'::text, 'province'::text, 'city'::text, 'zip'::text])))
);


--
-- Name: image; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.image (
    id text NOT NULL,
    url text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    rank integer DEFAULT 0 NOT NULL,
    product_id text NOT NULL
);


--
-- Name: inventory_item; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.inventory_item (
    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    sku text,
    origin_country text,
    hs_code text,
    mid_code text,
    material text,
    weight integer,
    length integer,
    height integer,
    width integer,
    requires_shipping boolean DEFAULT true NOT NULL,
    description text,
    title text,
    thumbnail text,
    metadata jsonb,
    unit_of_measure text
);


--
-- Name: inventory_level; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.inventory_level (
    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    inventory_item_id text NOT NULL,
    location_id text NOT NULL,
    stocked_quantity numeric DEFAULT 0 NOT NULL,
    reserved_quantity numeric DEFAULT 0 NOT NULL,
    incoming_quantity numeric DEFAULT 0 NOT NULL,
    metadata jsonb,
    raw_stocked_quantity jsonb,
    raw_reserved_quantity jsonb,
    raw_incoming_quantity jsonb
);


--
-- Name: invite; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invite (
    id text NOT NULL,
    email text NOT NULL,
    accepted boolean DEFAULT false NOT NULL,
    token text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: invite_rbac_role; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invite_rbac_role (
    invite_id character varying(255) NOT NULL,
    rbac_role_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: layout_configuration; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.layout_configuration (
    id text NOT NULL,
    zone text NOT NULL,
    user_id text,
    is_system_default boolean DEFAULT false NOT NULL,
    configuration jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: link_module_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.link_module_migrations (
    id integer NOT NULL,
    table_name character varying(255) NOT NULL,
    link_descriptor jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: link_module_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.link_module_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: link_module_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.link_module_migrations_id_seq OWNED BY public.link_module_migrations.id;


--
-- Name: location_fulfillment_provider; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.location_fulfillment_provider (
    stock_location_id character varying(255) NOT NULL,
    fulfillment_provider_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: location_fulfillment_set; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.location_fulfillment_set (
    stock_location_id character varying(255) NOT NULL,
    fulfillment_set_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: mikro_orm_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mikro_orm_migrations (
    id integer NOT NULL,
    name character varying(255),
    executed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.mikro_orm_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNED BY public.mikro_orm_migrations.id;


--
-- Name: notification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notification (
    id text NOT NULL,
    "to" text NOT NULL,
    channel text NOT NULL,
    template text,
    data jsonb,
    trigger_type text,
    resource_id text,
    resource_type text,
    receiver_id text,
    original_notification_id text,
    idempotency_key text,
    external_id text,
    provider_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    status text DEFAULT 'pending'::text NOT NULL,
    "from" text,
    provider_data jsonb,
    CONSTRAINT notification_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'success'::text, 'failure'::text])))
);


--
-- Name: notification_provider; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notification_provider (
    id text NOT NULL,
    handle text NOT NULL,
    name text NOT NULL,
    is_enabled boolean DEFAULT true NOT NULL,
    channels text[] DEFAULT '{}'::text[] NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: order; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."order" (
    id text NOT NULL,
    region_id text,
    display_id integer,
    customer_id text,
    version integer DEFAULT 1 NOT NULL,
    sales_channel_id text,
    status public.order_status_enum DEFAULT 'pending'::public.order_status_enum NOT NULL,
    is_draft_order boolean DEFAULT false NOT NULL,
    email text,
    currency_code text NOT NULL,
    shipping_address_id text,
    billing_address_id text,
    no_notification boolean,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    canceled_at timestamp with time zone,
    custom_display_id text,
    locale text
);


--
-- Name: order_address; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_address (
    id text NOT NULL,
    customer_id text,
    company text,
    first_name text,
    last_name text,
    address_1 text,
    address_2 text,
    city text,
    country_code text,
    province text,
    postal_code text,
    phone text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: order_cart; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_cart (
    order_id character varying(255) NOT NULL,
    cart_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: order_change; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_change (
    id text NOT NULL,
    order_id text NOT NULL,
    version integer NOT NULL,
    description text,
    status text DEFAULT 'pending'::text NOT NULL,
    internal_note text,
    created_by text,
    requested_by text,
    requested_at timestamp with time zone,
    confirmed_by text,
    confirmed_at timestamp with time zone,
    declined_by text,
    declined_reason text,
    metadata jsonb,
    declined_at timestamp with time zone,
    canceled_by text,
    canceled_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    change_type text,
    deleted_at timestamp with time zone,
    return_id text,
    claim_id text,
    exchange_id text,
    carry_over_promotions boolean,
    no_notification boolean,
    CONSTRAINT order_change_status_check CHECK ((status = ANY (ARRAY['confirmed'::text, 'declined'::text, 'requested'::text, 'pending'::text, 'canceled'::text])))
);


--
-- Name: order_change_action; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_change_action (
    id text NOT NULL,
    order_id text,
    version integer,
    ordering bigint NOT NULL,
    order_change_id text,
    reference text,
    reference_id text,
    action text NOT NULL,
    details jsonb,
    amount numeric,
    raw_amount jsonb,
    internal_note text,
    applied boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    return_id text,
    claim_id text,
    exchange_id text
);


--
-- Name: order_change_action_ordering_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.order_change_action_ordering_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: order_change_action_ordering_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.order_change_action_ordering_seq OWNED BY public.order_change_action.ordering;


--
-- Name: order_claim; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_claim (
    id text NOT NULL,
    order_id text NOT NULL,
    return_id text,
    order_version integer NOT NULL,
    display_id integer NOT NULL,
    type public.order_claim_type_enum NOT NULL,
    no_notification boolean,
    refund_amount numeric,
    raw_refund_amount jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    canceled_at timestamp with time zone,
    created_by text
);


--
-- Name: order_claim_display_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.order_claim_display_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: order_claim_display_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.order_claim_display_id_seq OWNED BY public.order_claim.display_id;


--
-- Name: order_claim_item; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_claim_item (
    id text NOT NULL,
    claim_id text NOT NULL,
    item_id text NOT NULL,
    is_additional_item boolean DEFAULT false NOT NULL,
    reason public.claim_reason_enum,
    quantity numeric NOT NULL,
    raw_quantity jsonb NOT NULL,
    note text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: order_claim_item_image; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_claim_item_image (
    id text NOT NULL,
    claim_item_id text NOT NULL,
    url text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: order_credit_line; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_credit_line (
    id text NOT NULL,
    order_id text NOT NULL,
    reference text,
    reference_id text,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    version integer DEFAULT 1 NOT NULL
);


--
-- Name: order_display_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.order_display_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: order_display_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.order_display_id_seq OWNED BY public."order".display_id;


--
-- Name: order_exchange; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_exchange (
    id text NOT NULL,
    order_id text NOT NULL,
    return_id text,
    order_version integer NOT NULL,
    display_id integer NOT NULL,
    no_notification boolean,
    allow_backorder boolean DEFAULT false NOT NULL,
    difference_due numeric,
    raw_difference_due jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    canceled_at timestamp with time zone,
    created_by text
);


--
-- Name: order_exchange_display_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.order_exchange_display_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: order_exchange_display_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.order_exchange_display_id_seq OWNED BY public.order_exchange.display_id;


--
-- Name: order_exchange_item; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_exchange_item (
    id text NOT NULL,
    exchange_id text NOT NULL,
    item_id text NOT NULL,
    quantity numeric NOT NULL,
    raw_quantity jsonb NOT NULL,
    note text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: order_fulfillment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_fulfillment (
    order_id character varying(255) NOT NULL,
    fulfillment_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: order_item; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_item (
    id text NOT NULL,
    order_id text NOT NULL,
    version integer NOT NULL,
    item_id text NOT NULL,
    quantity numeric NOT NULL,
    raw_quantity jsonb NOT NULL,
    fulfilled_quantity numeric NOT NULL,
    raw_fulfilled_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    shipped_quantity numeric NOT NULL,
    raw_shipped_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    return_requested_quantity numeric NOT NULL,
    raw_return_requested_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    return_received_quantity numeric NOT NULL,
    raw_return_received_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    return_dismissed_quantity numeric NOT NULL,
    raw_return_dismissed_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    written_off_quantity numeric NOT NULL,
    raw_written_off_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    delivered_quantity numeric DEFAULT 0 NOT NULL,
    raw_delivered_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    unit_price numeric,
    raw_unit_price jsonb,
    compare_at_unit_price numeric,
    raw_compare_at_unit_price jsonb
);


--
-- Name: order_line_item; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_line_item (
    id text NOT NULL,
    totals_id text,
    title text NOT NULL,
    subtitle text,
    thumbnail text,
    variant_id text,
    product_id text,
    product_title text,
    product_description text,
    product_subtitle text,
    product_type text,
    product_collection text,
    product_handle text,
    variant_sku text,
    variant_barcode text,
    variant_title text,
    variant_option_values jsonb,
    requires_shipping boolean DEFAULT true NOT NULL,
    is_discountable boolean DEFAULT true NOT NULL,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    compare_at_unit_price numeric,
    raw_compare_at_unit_price jsonb,
    unit_price numeric NOT NULL,
    raw_unit_price jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    is_custom_price boolean DEFAULT false NOT NULL,
    product_type_id text,
    is_giftcard boolean DEFAULT false NOT NULL
);


--
-- Name: order_line_item_adjustment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_line_item_adjustment (
    id text NOT NULL,
    description text,
    promotion_id text,
    code text,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    provider_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    item_id text NOT NULL,
    deleted_at timestamp with time zone,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    version integer DEFAULT 1 NOT NULL
);


--
-- Name: order_line_item_tax_line; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_line_item_tax_line (
    id text NOT NULL,
    description text,
    tax_rate_id text,
    code text NOT NULL,
    rate numeric NOT NULL,
    raw_rate jsonb NOT NULL,
    provider_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    item_id text NOT NULL,
    deleted_at timestamp with time zone,
    metadata jsonb,
    data jsonb
);


--
-- Name: order_payment_collection; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_payment_collection (
    order_id character varying(255) NOT NULL,
    payment_collection_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: order_promotion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_promotion (
    order_id character varying(255) NOT NULL,
    promotion_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: order_shipping; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_shipping (
    id text NOT NULL,
    order_id text NOT NULL,
    version integer NOT NULL,
    shipping_method_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    return_id text,
    claim_id text,
    exchange_id text
);


--
-- Name: order_shipping_method; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_shipping_method (
    id text NOT NULL,
    name text NOT NULL,
    description jsonb,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    shipping_option_id text,
    data jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    is_custom_amount boolean DEFAULT false NOT NULL
);


--
-- Name: order_shipping_method_adjustment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_shipping_method_adjustment (
    id text NOT NULL,
    description text,
    promotion_id text,
    code text,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    provider_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    shipping_method_id text NOT NULL,
    deleted_at timestamp with time zone,
    version integer DEFAULT 1 NOT NULL
);


--
-- Name: order_shipping_method_tax_line; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_shipping_method_tax_line (
    id text NOT NULL,
    description text,
    tax_rate_id text,
    code text NOT NULL,
    rate numeric NOT NULL,
    raw_rate jsonb NOT NULL,
    provider_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    shipping_method_id text NOT NULL,
    deleted_at timestamp with time zone,
    metadata jsonb,
    data jsonb
);


--
-- Name: order_summary; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_summary (
    id text NOT NULL,
    order_id text NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    totals jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: order_transaction; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_transaction (
    id text NOT NULL,
    order_id text NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    currency_code text NOT NULL,
    reference text,
    reference_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    return_id text,
    claim_id text,
    exchange_id text
);


--
-- Name: payment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payment (
    id text NOT NULL,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    currency_code text NOT NULL,
    provider_id text CONSTRAINT payment_provider_id_not_null1 NOT NULL,
    data jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    captured_at timestamp with time zone,
    canceled_at timestamp with time zone,
    payment_collection_id text NOT NULL,
    payment_session_id text NOT NULL,
    metadata jsonb
);


--
-- Name: payment_collection; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payment_collection (
    id text NOT NULL,
    currency_code text NOT NULL,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    authorized_amount numeric,
    raw_authorized_amount jsonb,
    captured_amount numeric,
    raw_captured_amount jsonb,
    refunded_amount numeric,
    raw_refunded_amount jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    completed_at timestamp with time zone,
    status text DEFAULT 'not_paid'::text NOT NULL,
    metadata jsonb,
    CONSTRAINT payment_collection_status_check CHECK ((status = ANY (ARRAY['not_paid'::text, 'awaiting'::text, 'authorized'::text, 'partially_authorized'::text, 'canceled'::text, 'failed'::text, 'partially_captured'::text, 'completed'::text])))
);


--
-- Name: payment_collection_payment_providers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payment_collection_payment_providers (
    payment_collection_id text CONSTRAINT payment_collection_payment_provi_payment_collection_id_not_null NOT NULL,
    payment_provider_id text CONSTRAINT payment_collection_payment_provide_payment_provider_id_not_null NOT NULL
);


--
-- Name: payment_provider; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payment_provider (
    id text NOT NULL,
    is_enabled boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: payment_session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payment_session (
    id text NOT NULL,
    currency_code text NOT NULL,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    provider_id text NOT NULL,
    data jsonb DEFAULT '{}'::jsonb NOT NULL,
    context jsonb,
    status text DEFAULT 'pending'::text NOT NULL,
    authorized_at timestamp with time zone,
    payment_collection_id text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT payment_session_status_check CHECK ((status = ANY (ARRAY['authorized'::text, 'captured'::text, 'pending'::text, 'requires_more'::text, 'error'::text, 'canceled'::text, 'pending_authorization'::text])))
);


--
-- Name: price; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.price (
    id text NOT NULL,
    title text,
    price_set_id text NOT NULL,
    currency_code text CONSTRAINT price_money_amount_id_not_null NOT NULL,
    raw_amount jsonb NOT NULL,
    rules_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    price_list_id text,
    amount numeric NOT NULL,
    min_quantity numeric,
    max_quantity numeric,
    raw_min_quantity jsonb,
    raw_max_quantity jsonb
);


--
-- Name: price_list; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.price_list (
    id text NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    starts_at timestamp with time zone,
    ends_at timestamp with time zone,
    rules_count integer DEFAULT 0,
    title text NOT NULL,
    description text NOT NULL,
    type text DEFAULT 'sale'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    metadata jsonb,
    CONSTRAINT price_list_status_check CHECK ((status = ANY (ARRAY['active'::text, 'draft'::text]))),
    CONSTRAINT price_list_type_check CHECK ((type = ANY (ARRAY['sale'::text, 'override'::text])))
);


--
-- Name: price_list_rule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.price_list_rule (
    id text NOT NULL,
    price_list_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    value jsonb,
    attribute text DEFAULT ''::text NOT NULL
);


--
-- Name: price_preference; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.price_preference (
    id text NOT NULL,
    attribute text NOT NULL,
    value text,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: price_rule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.price_rule (
    id text NOT NULL,
    value text NOT NULL,
    priority integer DEFAULT 0 NOT NULL,
    price_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    attribute text DEFAULT ''::text NOT NULL,
    operator text DEFAULT 'eq'::text NOT NULL,
    CONSTRAINT price_rule_operator_check CHECK ((operator = ANY (ARRAY['gte'::text, 'lte'::text, 'gt'::text, 'lt'::text, 'eq'::text])))
);


--
-- Name: price_set; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.price_set (
    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: product; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product (
    id text NOT NULL,
    title text NOT NULL,
    handle text NOT NULL,
    subtitle text,
    description text,
    is_giftcard boolean DEFAULT false NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    thumbnail text,
    weight real,
    length real,
    height real,
    width real,
    origin_country text,
    hs_code text,
    mid_code text,
    material text,
    collection_id text,
    type_id text,
    discountable boolean DEFAULT true NOT NULL,
    external_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    metadata jsonb,
    CONSTRAINT product_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'proposed'::text, 'published'::text, 'rejected'::text])))
);


--
-- Name: product_category; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_category (
    id text NOT NULL,
    name text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    handle text NOT NULL,
    mpath text NOT NULL,
    is_active boolean DEFAULT false NOT NULL,
    is_internal boolean DEFAULT false NOT NULL,
    rank integer DEFAULT 0 NOT NULL,
    parent_category_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    metadata jsonb,
    external_id text
);


--
-- Name: product_category_product; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_category_product (
    product_id text NOT NULL,
    product_category_id text NOT NULL
);


--
-- Name: product_collection; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_collection (
    id text NOT NULL,
    title text NOT NULL,
    handle text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    external_id text
);


--
-- Name: product_option; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_option (
    id text NOT NULL,
    title text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    is_exclusive boolean DEFAULT false NOT NULL
);


--
-- Name: product_option_value; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_option_value (
    id text NOT NULL,
    value text NOT NULL,
    option_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    rank integer
);


--
-- Name: product_product_option; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_product_option (
    id text NOT NULL,
    product_id text NOT NULL,
    product_option_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: product_product_option_value; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_product_option_value (
    id text NOT NULL,
    product_product_option_id text NOT NULL,
    product_option_value_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: product_sales_channel; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_sales_channel (
    product_id character varying(255) NOT NULL,
    sales_channel_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: product_shipping_profile; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_shipping_profile (
    product_id character varying(255) NOT NULL,
    shipping_profile_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: product_tag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_tag (
    id text NOT NULL,
    value text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    external_id text
);


--
-- Name: product_tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_tags (
    product_id text NOT NULL,
    product_tag_id text NOT NULL
);


--
-- Name: product_type; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_type (
    id text NOT NULL,
    value text NOT NULL,
    metadata json,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    external_id text
);


--
-- Name: product_variant; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_variant (
    id text NOT NULL,
    title text NOT NULL,
    sku text,
    barcode text,
    ean text,
    upc text,
    allow_backorder boolean DEFAULT false NOT NULL,
    manage_inventory boolean DEFAULT true NOT NULL,
    hs_code text,
    origin_country text,
    mid_code text,
    material text,
    weight real,
    length real,
    height real,
    width real,
    metadata jsonb,
    variant_rank integer DEFAULT 0,
    product_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    thumbnail text
);


--
-- Name: product_variant_inventory_item; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_variant_inventory_item (
    variant_id character varying(255) NOT NULL,
    inventory_item_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    required_quantity numeric DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: product_variant_option; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_variant_option (
    variant_id text NOT NULL,
    option_value_id text NOT NULL
);


--
-- Name: product_variant_price_set; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_variant_price_set (
    variant_id character varying(255) NOT NULL,
    price_set_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: product_variant_product_image; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_variant_product_image (
    id text NOT NULL,
    variant_id text NOT NULL,
    image_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: promotion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.promotion (
    id text NOT NULL,
    code text NOT NULL,
    campaign_id text,
    is_automatic boolean DEFAULT false NOT NULL,
    type text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    status text DEFAULT 'draft'::text NOT NULL,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    "limit" integer,
    used integer DEFAULT 0 NOT NULL,
    metadata jsonb,
    CONSTRAINT promotion_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'active'::text, 'inactive'::text]))),
    CONSTRAINT promotion_type_check CHECK ((type = ANY (ARRAY['standard'::text, 'buyget'::text])))
);


--
-- Name: promotion_application_method; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.promotion_application_method (
    id text NOT NULL,
    value numeric,
    raw_value jsonb,
    max_quantity integer,
    apply_to_quantity integer,
    buy_rules_min_quantity integer,
    type text NOT NULL,
    target_type text NOT NULL,
    allocation text,
    promotion_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    currency_code text,
    CONSTRAINT promotion_application_method_allocation_check CHECK ((allocation = ANY (ARRAY['each'::text, 'across'::text, 'once'::text]))),
    CONSTRAINT promotion_application_method_target_type_check CHECK ((target_type = ANY (ARRAY['order'::text, 'shipping_methods'::text, 'items'::text]))),
    CONSTRAINT promotion_application_method_type_check CHECK ((type = ANY (ARRAY['fixed'::text, 'percentage'::text])))
);


--
-- Name: promotion_campaign; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.promotion_campaign (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    campaign_identifier text NOT NULL,
    starts_at timestamp with time zone,
    ends_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: promotion_campaign_budget; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.promotion_campaign_budget (
    id text NOT NULL,
    type text NOT NULL,
    campaign_id text NOT NULL,
    "limit" numeric,
    raw_limit jsonb,
    used numeric DEFAULT 0 NOT NULL,
    raw_used jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    currency_code text,
    attribute text,
    CONSTRAINT promotion_campaign_budget_type_check CHECK ((type = ANY (ARRAY['spend'::text, 'usage'::text, 'use_by_attribute'::text, 'spend_by_attribute'::text])))
);


--
-- Name: promotion_campaign_budget_usage; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.promotion_campaign_budget_usage (
    id text NOT NULL,
    attribute_value text NOT NULL,
    used numeric DEFAULT 0 NOT NULL,
    budget_id text NOT NULL,
    raw_used jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: promotion_promotion_rule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.promotion_promotion_rule (
    promotion_id text NOT NULL,
    promotion_rule_id text NOT NULL
);


--
-- Name: promotion_rule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.promotion_rule (
    id text NOT NULL,
    description text,
    attribute text NOT NULL,
    operator text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT promotion_rule_operator_check CHECK ((operator = ANY (ARRAY['gte'::text, 'lte'::text, 'gt'::text, 'lt'::text, 'eq'::text, 'ne'::text, 'in'::text])))
);


--
-- Name: promotion_rule_value; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.promotion_rule_value (
    id text NOT NULL,
    promotion_rule_id text NOT NULL,
    value text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: property_label; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.property_label (
    id text NOT NULL,
    entity text NOT NULL,
    property text NOT NULL,
    label text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: provider_identity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.provider_identity (
    id text NOT NULL,
    entity_id text NOT NULL,
    provider text NOT NULL,
    auth_identity_id text NOT NULL,
    user_metadata jsonb,
    provider_metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: publishable_api_key_sales_channel; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.publishable_api_key_sales_channel (
    publishable_key_id character varying(255) NOT NULL,
    sales_channel_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: refund; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.refund (
    id text NOT NULL,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    payment_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    created_by text,
    metadata jsonb,
    refund_reason_id text,
    note text
);


--
-- Name: refund_reason; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.refund_reason (
    id text NOT NULL,
    label text NOT NULL,
    description text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    code text NOT NULL
);


--
-- Name: region; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.region (
    id text NOT NULL,
    name text NOT NULL,
    currency_code text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    automatic_taxes boolean DEFAULT true NOT NULL
);


--
-- Name: region_country; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.region_country (
    iso_2 text NOT NULL,
    iso_3 text NOT NULL,
    num_code text NOT NULL,
    name text NOT NULL,
    display_name text NOT NULL,
    region_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: region_payment_provider; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.region_payment_provider (
    region_id character varying(255) NOT NULL,
    payment_provider_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: reservation_item; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reservation_item (
    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    line_item_id text,
    location_id text NOT NULL,
    quantity numeric NOT NULL,
    external_id text,
    description text,
    created_by text,
    metadata jsonb,
    inventory_item_id text NOT NULL,
    allow_backorder boolean DEFAULT false,
    raw_quantity jsonb
);


--
-- Name: return; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.return (
    id text NOT NULL,
    order_id text NOT NULL,
    claim_id text,
    exchange_id text,
    order_version integer NOT NULL,
    display_id integer NOT NULL,
    status public.return_status_enum DEFAULT 'open'::public.return_status_enum NOT NULL,
    no_notification boolean,
    refund_amount numeric,
    raw_refund_amount jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    received_at timestamp with time zone,
    canceled_at timestamp with time zone,
    location_id text,
    requested_at timestamp with time zone,
    created_by text
);


--
-- Name: return_display_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.return_display_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: return_display_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.return_display_id_seq OWNED BY public.return.display_id;


--
-- Name: return_fulfillment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.return_fulfillment (
    return_id character varying(255) NOT NULL,
    fulfillment_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: return_item; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.return_item (
    id text NOT NULL,
    return_id text NOT NULL,
    reason_id text,
    item_id text NOT NULL,
    quantity numeric NOT NULL,
    raw_quantity jsonb NOT NULL,
    received_quantity numeric DEFAULT 0 NOT NULL,
    raw_received_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    note text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    damaged_quantity numeric DEFAULT 0 NOT NULL,
    raw_damaged_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL
);


--
-- Name: return_reason; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.return_reason (
    id character varying NOT NULL,
    value character varying NOT NULL,
    label character varying NOT NULL,
    description character varying,
    metadata jsonb,
    parent_return_reason_id character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: sales_channel; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sales_channel (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    is_disabled boolean DEFAULT false NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: sales_channel_stock_location; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sales_channel_stock_location (
    sales_channel_id character varying(255) NOT NULL,
    stock_location_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: script_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.script_migrations (
    id integer NOT NULL,
    script_name character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    finished_at timestamp with time zone
);


--
-- Name: script_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.script_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: script_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.script_migrations_id_seq OWNED BY public.script_migrations.id;


--
-- Name: search_index; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.search_index (
    id text NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    active_version integer
);


--
-- Name: search_index_sync; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.search_index_sync (
    id text NOT NULL,
    job_id text,
    status text DEFAULT 'pending'::text NOT NULL,
    filters jsonb,
    last_key text,
    documents_synced integer DEFAULT 0 NOT NULL,
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    error text,
    search_index_version_id text CONSTRAINT search_index_sync_search_index_id_not_null NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    resumable boolean DEFAULT true NOT NULL,
    CONSTRAINT search_index_sync_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'processing'::text, 'done'::text, 'failed'::text, 'canceled'::text])))
);


--
-- Name: search_index_version; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.search_index_version (
    id text NOT NULL,
    version integer NOT NULL,
    provider text NOT NULL,
    physical_name text NOT NULL,
    definition_hash text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    search_index_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT search_index_version_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'building'::text, 'ready'::text, 'error'::text])))
);


--
-- Name: search_pg_product_v1; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.search_pg_product_v1 (
    id text NOT NULL,
    document jsonb NOT NULL,
    indexed jsonb DEFAULT '{}'::jsonb NOT NULL,
    search_vector tsvector DEFAULT ''::tsvector NOT NULL,
    search_text text DEFAULT ''::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: search_postgres_index; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.search_postgres_index (
    name text NOT NULL,
    table_name text NOT NULL,
    schema_hash text NOT NULL,
    plan jsonb NOT NULL,
    document_count integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: service_zone; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_zone (
    id text NOT NULL,
    name text NOT NULL,
    metadata jsonb,
    fulfillment_set_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: shipping_option; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shipping_option (
    id text NOT NULL,
    name text NOT NULL,
    price_type text DEFAULT 'flat'::text NOT NULL,
    service_zone_id text NOT NULL,
    shipping_profile_id text,
    provider_id text,
    data jsonb,
    metadata jsonb,
    shipping_option_type_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT shipping_option_price_type_check CHECK ((price_type = ANY (ARRAY['calculated'::text, 'flat'::text])))
);


--
-- Name: shipping_option_price_set; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shipping_option_price_set (
    shipping_option_id character varying(255) NOT NULL,
    price_set_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: shipping_option_rule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shipping_option_rule (
    id text NOT NULL,
    attribute text NOT NULL,
    operator text NOT NULL,
    value jsonb,
    shipping_option_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT shipping_option_rule_operator_check CHECK ((operator = ANY (ARRAY['in'::text, 'eq'::text, 'ne'::text, 'gt'::text, 'gte'::text, 'lt'::text, 'lte'::text, 'nin'::text])))
);


--
-- Name: shipping_option_type; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shipping_option_type (
    id text NOT NULL,
    label text NOT NULL,
    description text,
    code text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: shipping_profile; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shipping_profile (
    id text NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: stock_location; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stock_location (
    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    name text NOT NULL,
    address_id text,
    metadata jsonb
);


--
-- Name: stock_location_address; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stock_location_address (
    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    address_1 text NOT NULL,
    address_2 text,
    company text,
    city text,
    country_code text NOT NULL,
    phone text,
    province text,
    postal_code text,
    metadata jsonb
);


--
-- Name: store; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.store (
    id text NOT NULL,
    name text DEFAULT 'Medusa Store'::text NOT NULL,
    default_sales_channel_id text,
    default_region_id text,
    default_location_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: store_currency; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.store_currency (
    id text NOT NULL,
    currency_code text NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    store_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: store_locale; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.store_locale (
    id text NOT NULL,
    locale_code text NOT NULL,
    store_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: tax_provider; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tax_provider (
    id text NOT NULL,
    is_enabled boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: tax_rate; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tax_rate (
    id text NOT NULL,
    rate real,
    code text NOT NULL,
    name text NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    is_combinable boolean DEFAULT false NOT NULL,
    tax_region_id text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by text,
    deleted_at timestamp with time zone
);


--
-- Name: tax_rate_rule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tax_rate_rule (
    id text NOT NULL,
    tax_rate_id text NOT NULL,
    reference_id text NOT NULL,
    reference text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by text,
    deleted_at timestamp with time zone
);


--
-- Name: tax_region; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tax_region (
    id text NOT NULL,
    provider_id text,
    country_code text NOT NULL,
    province_code text,
    parent_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by text,
    deleted_at timestamp with time zone,
    CONSTRAINT "CK_tax_region_country_top_level" CHECK (((parent_id IS NULL) OR (province_code IS NOT NULL))),
    CONSTRAINT "CK_tax_region_provider_top_level" CHECK (((parent_id IS NULL) OR (provider_id IS NULL)))
);


--
-- Name: user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."user" (
    id text NOT NULL,
    first_name text,
    last_name text,
    email text NOT NULL,
    avatar_url text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: user_preference; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_preference (
    id text NOT NULL,
    user_id text NOT NULL,
    key text NOT NULL,
    value jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: user_rbac_role; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_rbac_role (
    user_id character varying(255) NOT NULL,
    rbac_role_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: view_configuration; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.view_configuration (
    id text NOT NULL,
    entity text NOT NULL,
    name text,
    user_id text,
    is_system_default boolean DEFAULT false NOT NULL,
    configuration jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: vitrin_block; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vitrin_block (
    id text NOT NULL,
    "group" text NOT NULL,
    key text,
    rank integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: vitrin_list; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vitrin_list (
    id text NOT NULL,
    key text NOT NULL,
    title text NOT NULL,
    description text,
    product_ids text[] NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: workflow_execution; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.workflow_execution (
    id character varying NOT NULL,
    workflow_id character varying NOT NULL,
    transaction_id character varying NOT NULL,
    execution jsonb,
    context jsonb,
    state character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    retention_time integer,
    run_id text DEFAULT '01M3704BHFBB8X5V44MNY70RE5'::text NOT NULL
);


--
-- Name: link_module_migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.link_module_migrations ALTER COLUMN id SET DEFAULT nextval('public.link_module_migrations_id_seq'::regclass);


--
-- Name: mikro_orm_migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mikro_orm_migrations ALTER COLUMN id SET DEFAULT nextval('public.mikro_orm_migrations_id_seq'::regclass);


--
-- Name: order display_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."order" ALTER COLUMN display_id SET DEFAULT nextval('public.order_display_id_seq'::regclass);


--
-- Name: order_change_action ordering; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_change_action ALTER COLUMN ordering SET DEFAULT nextval('public.order_change_action_ordering_seq'::regclass);


--
-- Name: order_claim display_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_claim ALTER COLUMN display_id SET DEFAULT nextval('public.order_claim_display_id_seq'::regclass);


--
-- Name: order_exchange display_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_exchange ALTER COLUMN display_id SET DEFAULT nextval('public.order_exchange_display_id_seq'::regclass);


--
-- Name: return display_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.return ALTER COLUMN display_id SET DEFAULT nextval('public.return_display_id_seq'::regclass);


--
-- Name: script_migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.script_migrations ALTER COLUMN id SET DEFAULT nextval('public.script_migrations_id_seq'::regclass);


--
-- Data for Name: account_holder; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.account_holder (id, provider_id, external_id, email, data, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: api_key; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.api_key (id, token, salt, redacted, title, type, last_used_at, created_by, created_at, revoked_by, revoked_at, updated_at, deleted_at) FROM stdin;
apk_01M3704J2C68K29YMKH1JFEQGZ	pk_11ce8aef229a358bc58bce50360456b85790a7113cfe2e62a0e4ca6a8c0c1e33		pk_11c***e33	SEENERGY Storefront	publishable	\N		2026-09-23 14:24:11.212+03	\N	\N	2026-09-23 14:24:11.212+03	\N
\.


--
-- Data for Name: application_method_buy_rules; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.application_method_buy_rules (application_method_id, promotion_rule_id) FROM stdin;
\.


--
-- Data for Name: application_method_target_rules; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.application_method_target_rules (application_method_id, promotion_rule_id) FROM stdin;
\.


--
-- Data for Name: auth_identity; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_identity (id, app_metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: auth_mfa_factor; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_mfa_factor (id, auth_identity_id, provider, status, provider_metadata, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: auth_mfa_recovery_code; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_mfa_recovery_code (id, auth_identity_id, code_hash, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: auth_password_reset_token; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_password_reset_token (id, auth_identity_id, provider_identity_id, entity_id, token_hash, expires_at, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: auth_verification; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_verification (id, auth_identity_id, entity_id, entity_type, code_provider, verified_at, requested_at, provider_metadata, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: capture; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.capture (id, amount, raw_amount, payment_id, created_at, updated_at, deleted_at, created_by, metadata) FROM stdin;
\.


--
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cart (id, region_id, customer_id, sales_channel_id, email, currency_code, shipping_address_id, billing_address_id, metadata, created_at, updated_at, deleted_at, completed_at, locale) FROM stdin;
\.


--
-- Data for Name: cart_address; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cart_address (id, customer_id, company, first_name, last_name, address_1, address_2, city, country_code, province, postal_code, phone, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: cart_line_item; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cart_line_item (id, cart_id, title, subtitle, thumbnail, quantity, variant_id, product_id, product_title, product_description, product_subtitle, product_type, product_collection, product_handle, variant_sku, variant_barcode, variant_title, variant_option_values, requires_shipping, is_discountable, is_tax_inclusive, compare_at_unit_price, raw_compare_at_unit_price, unit_price, raw_unit_price, metadata, created_at, updated_at, deleted_at, product_type_id, is_custom_price, is_giftcard) FROM stdin;
\.


--
-- Data for Name: cart_line_item_adjustment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cart_line_item_adjustment (id, description, promotion_id, code, amount, raw_amount, provider_id, metadata, created_at, updated_at, deleted_at, item_id, is_tax_inclusive) FROM stdin;
\.


--
-- Data for Name: cart_line_item_tax_line; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cart_line_item_tax_line (id, description, tax_rate_id, code, rate, provider_id, metadata, created_at, updated_at, deleted_at, item_id, data) FROM stdin;
\.


--
-- Data for Name: cart_payment_collection; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cart_payment_collection (cart_id, payment_collection_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: cart_promotion; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cart_promotion (cart_id, promotion_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: cart_shipping_method; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cart_shipping_method (id, cart_id, name, description, amount, raw_amount, is_tax_inclusive, shipping_option_id, data, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: cart_shipping_method_adjustment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cart_shipping_method_adjustment (id, description, promotion_id, code, amount, raw_amount, provider_id, metadata, created_at, updated_at, deleted_at, shipping_method_id) FROM stdin;
\.


--
-- Data for Name: cart_shipping_method_tax_line; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cart_shipping_method_tax_line (id, description, tax_rate_id, code, rate, provider_id, metadata, created_at, updated_at, deleted_at, shipping_method_id, data) FROM stdin;
\.


--
-- Data for Name: credit_line; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.credit_line (id, cart_id, reference, reference_id, amount, raw_amount, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: currency; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.currency (code, symbol, symbol_native, decimal_digits, rounding, raw_rounding, name, created_at, updated_at, deleted_at) FROM stdin;
usd	$	$	2	0	{"value": "0", "precision": 20}	US Dollar	2026-09-23 14:24:07.545+03	2026-09-23 14:24:07.545+03	\N
cad	CA$	$	2	0	{"value": "0", "precision": 20}	Canadian Dollar	2026-09-23 14:24:07.545+03	2026-09-23 14:24:07.545+03	\N
eur	€	€	2	0	{"value": "0", "precision": 20}	Euro	2026-09-23 14:24:07.545+03	2026-09-23 14:24:07.545+03	\N
aed	AED	د.إ.‏	2	0	{"value": "0", "precision": 20}	United Arab Emirates Dirham	2026-09-23 14:24:07.545+03	2026-09-23 14:24:07.545+03	\N
afn	Af	؋	0	0	{"value": "0", "precision": 20}	Afghan Afghani	2026-09-23 14:24:07.545+03	2026-09-23 14:24:07.545+03	\N
all	ALL	Lek	0	0	{"value": "0", "precision": 20}	Albanian Lek	2026-09-23 14:24:07.545+03	2026-09-23 14:24:07.545+03	\N
amd	AMD	դր.	0	0	{"value": "0", "precision": 20}	Armenian Dram	2026-09-23 14:24:07.545+03	2026-09-23 14:24:07.545+03	\N
aoa	AOA	Kz	2	0	{"value": "0", "precision": 20}	Angolan Kwanza	2026-09-23 14:24:07.545+03	2026-09-23 14:24:07.545+03	\N
ars	AR$	$	2	0	{"value": "0", "precision": 20}	Argentine Peso	2026-09-23 14:24:07.545+03	2026-09-23 14:24:07.545+03	\N
aud	AU$	$	2	0	{"value": "0", "precision": 20}	Australian Dollar	2026-09-23 14:24:07.545+03	2026-09-23 14:24:07.545+03	\N
azn	man.	ман.	2	0	{"value": "0", "precision": 20}	Azerbaijani Manat	2026-09-23 14:24:07.545+03	2026-09-23 14:24:07.545+03	\N
bam	KM	KM	2	0	{"value": "0", "precision": 20}	Bosnia-Herzegovina Convertible Mark	2026-09-23 14:24:07.545+03	2026-09-23 14:24:07.545+03	\N
bdt	Tk	৳	2	0	{"value": "0", "precision": 20}	Bangladeshi Taka	2026-09-23 14:24:07.545+03	2026-09-23 14:24:07.545+03	\N
bgn	BGN	лв.	2	0	{"value": "0", "precision": 20}	Bulgarian Lev	2026-09-23 14:24:07.545+03	2026-09-23 14:24:07.545+03	\N
bhd	BD	د.ب.‏	3	0	{"value": "0", "precision": 20}	Bahraini Dinar	2026-09-23 14:24:07.545+03	2026-09-23 14:24:07.545+03	\N
bif	FBu	FBu	0	0	{"value": "0", "precision": 20}	Burundian Franc	2026-09-23 14:24:07.545+03	2026-09-23 14:24:07.545+03	\N
bnd	BN$	$	2	0	{"value": "0", "precision": 20}	Brunei Dollar	2026-09-23 14:24:07.545+03	2026-09-23 14:24:07.545+03	\N
bob	Bs	Bs	2	0	{"value": "0", "precision": 20}	Bolivian Boliviano	2026-09-23 14:24:07.545+03	2026-09-23 14:24:07.545+03	\N
brl	R$	R$	2	0	{"value": "0", "precision": 20}	Brazilian Real	2026-09-23 14:24:07.545+03	2026-09-23 14:24:07.545+03	\N
bwp	BWP	P	2	0	{"value": "0", "precision": 20}	Botswanan Pula	2026-09-23 14:24:07.545+03	2026-09-23 14:24:07.545+03	\N
byn	Br	руб.	2	0	{"value": "0", "precision": 20}	Belarusian Ruble	2026-09-23 14:24:07.545+03	2026-09-23 14:24:07.545+03	\N
bzd	BZ$	$	2	0	{"value": "0", "precision": 20}	Belize Dollar	2026-09-23 14:24:07.545+03	2026-09-23 14:24:07.545+03	\N
cdf	CDF	FrCD	2	0	{"value": "0", "precision": 20}	Congolese Franc	2026-09-23 14:24:07.545+03	2026-09-23 14:24:07.545+03	\N
chf	CHF	CHF	2	0.05	{"value": "0.05", "precision": 20}	Swiss Franc	2026-09-23 14:24:07.545+03	2026-09-23 14:24:07.545+03	\N
clp	CL$	$	0	0	{"value": "0", "precision": 20}	Chilean Peso	2026-09-23 14:24:07.545+03	2026-09-23 14:24:07.545+03	\N
cny	CN¥	CN¥	2	0	{"value": "0", "precision": 20}	Chinese Yuan	2026-09-23 14:24:07.545+03	2026-09-23 14:24:07.545+03	\N
cop	CO$	$	0	0	{"value": "0", "precision": 20}	Colombian Peso	2026-09-23 14:24:07.545+03	2026-09-23 14:24:07.545+03	\N
crc	₡	₡	0	0	{"value": "0", "precision": 20}	Costa Rican Colón	2026-09-23 14:24:07.545+03	2026-09-23 14:24:07.545+03	\N
cve	CV$	CV$	2	0	{"value": "0", "precision": 20}	Cape Verdean Escudo	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
czk	Kč	Kč	2	0	{"value": "0", "precision": 20}	Czech Republic Koruna	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
djf	Fdj	Fdj	0	0	{"value": "0", "precision": 20}	Djiboutian Franc	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
dkk	Dkr	kr	2	0	{"value": "0", "precision": 20}	Danish Krone	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
dop	RD$	RD$	2	0	{"value": "0", "precision": 20}	Dominican Peso	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
dzd	DA	د.ج.‏	2	0	{"value": "0", "precision": 20}	Algerian Dinar	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
eek	Ekr	kr	2	0	{"value": "0", "precision": 20}	Estonian Kroon	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
egp	EGP	ج.م.‏	2	0	{"value": "0", "precision": 20}	Egyptian Pound	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
ern	Nfk	Nfk	2	0	{"value": "0", "precision": 20}	Eritrean Nakfa	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
etb	Br	Br	2	0	{"value": "0", "precision": 20}	Ethiopian Birr	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
gbp	£	£	2	0	{"value": "0", "precision": 20}	British Pound Sterling	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
gel	GEL	GEL	2	0	{"value": "0", "precision": 20}	Georgian Lari	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
ghs	GH₵	GH₵	2	0	{"value": "0", "precision": 20}	Ghanaian Cedi	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
gmd	D	D	2	0	{"value": "0", "precision": 20}	Gambian Dalasi	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
gnf	FG	FG	0	0	{"value": "0", "precision": 20}	Guinean Franc	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
gtq	GTQ	Q	2	0	{"value": "0", "precision": 20}	Guatemalan Quetzal	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
hkd	HK$	$	2	0	{"value": "0", "precision": 20}	Hong Kong Dollar	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
hnl	HNL	L	2	0	{"value": "0", "precision": 20}	Honduran Lempira	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
hrk	kn	kn	2	0	{"value": "0", "precision": 20}	Croatian Kuna	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
huf	Ft	Ft	0	0	{"value": "0", "precision": 20}	Hungarian Forint	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
idr	Rp	Rp	0	0	{"value": "0", "precision": 20}	Indonesian Rupiah	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
ils	₪	₪	2	0	{"value": "0", "precision": 20}	Israeli New Sheqel	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
inr	Rs	₹	2	0	{"value": "0", "precision": 20}	Indian Rupee	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
iqd	IQD	د.ع.‏	0	0	{"value": "0", "precision": 20}	Iraqi Dinar	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
irr	IRR	﷼	0	0	{"value": "0", "precision": 20}	Iranian Rial	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
irt	IRT	تومان	0	0	{"value": "0", "precision": 20}	Iranian Toman	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
isk	Ikr	kr	0	0	{"value": "0", "precision": 20}	Icelandic Króna	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
jmd	J$	$	2	0	{"value": "0", "precision": 20}	Jamaican Dollar	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
jod	JD	د.أ.‏	3	0	{"value": "0", "precision": 20}	Jordanian Dinar	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
jpy	¥	￥	0	0	{"value": "0", "precision": 20}	Japanese Yen	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
kes	Ksh	Ksh	2	0	{"value": "0", "precision": 20}	Kenyan Shilling	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
khr	KHR	៛	2	0	{"value": "0", "precision": 20}	Cambodian Riel	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
kmf	CF	FC	0	0	{"value": "0", "precision": 20}	Comorian Franc	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
krw	₩	₩	0	0	{"value": "0", "precision": 20}	South Korean Won	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
kwd	KD	د.ك.‏	3	0	{"value": "0", "precision": 20}	Kuwaiti Dinar	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
kzt	KZT	тңг.	2	0	{"value": "0", "precision": 20}	Kazakhstani Tenge	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
lbp	LB£	ل.ل.‏	0	0	{"value": "0", "precision": 20}	Lebanese Pound	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
lkr	SLRs	SL Re	2	0	{"value": "0", "precision": 20}	Sri Lankan Rupee	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
ltl	Lt	Lt	2	0	{"value": "0", "precision": 20}	Lithuanian Litas	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
lvl	Ls	Ls	2	0	{"value": "0", "precision": 20}	Latvian Lats	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
lyd	LD	د.ل.‏	3	0	{"value": "0", "precision": 20}	Libyan Dinar	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
mad	MAD	د.م.‏	2	0	{"value": "0", "precision": 20}	Moroccan Dirham	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
mdl	MDL	MDL	2	0	{"value": "0", "precision": 20}	Moldovan Leu	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
mga	MGA	MGA	0	0	{"value": "0", "precision": 20}	Malagasy Ariary	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
mkd	MKD	MKD	2	0	{"value": "0", "precision": 20}	Macedonian Denar	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
mmk	MMK	K	0	0	{"value": "0", "precision": 20}	Myanma Kyat	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
mnt	MNT	₮	0	0	{"value": "0", "precision": 20}	Mongolian Tugrig	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
mop	MOP$	MOP$	2	0	{"value": "0", "precision": 20}	Macanese Pataca	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
mur	MURs	MURs	0	0	{"value": "0", "precision": 20}	Mauritian Rupee	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
mwk	K	K	2	0	{"value": "0", "precision": 20}	Malawian Kwacha	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
mxn	MX$	$	2	0	{"value": "0", "precision": 20}	Mexican Peso	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
myr	RM	RM	2	0	{"value": "0", "precision": 20}	Malaysian Ringgit	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
mzn	MTn	MTn	2	0	{"value": "0", "precision": 20}	Mozambican Metical	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
nad	N$	N$	2	0	{"value": "0", "precision": 20}	Namibian Dollar	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
ngn	₦	₦	2	0	{"value": "0", "precision": 20}	Nigerian Naira	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
nio	C$	C$	2	0	{"value": "0", "precision": 20}	Nicaraguan Córdoba	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
nok	Nkr	kr	2	0	{"value": "0", "precision": 20}	Norwegian Krone	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
npr	NPRs	नेरू	2	0	{"value": "0", "precision": 20}	Nepalese Rupee	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
nzd	NZ$	$	2	0	{"value": "0", "precision": 20}	New Zealand Dollar	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
omr	OMR	ر.ع.‏	3	0	{"value": "0", "precision": 20}	Omani Rial	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
pab	B/.	B/.	2	0	{"value": "0", "precision": 20}	Panamanian Balboa	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
pen	S/.	S/.	2	0	{"value": "0", "precision": 20}	Peruvian Nuevo Sol	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
php	₱	₱	2	0	{"value": "0", "precision": 20}	Philippine Peso	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
pkr	PKRs	₨	0	0	{"value": "0", "precision": 20}	Pakistani Rupee	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
pln	zł	zł	2	0	{"value": "0", "precision": 20}	Polish Zloty	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
pyg	₲	₲	0	0	{"value": "0", "precision": 20}	Paraguayan Guarani	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
qar	QR	ر.ق.‏	2	0	{"value": "0", "precision": 20}	Qatari Rial	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
ron	RON	RON	2	0	{"value": "0", "precision": 20}	Romanian Leu	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
rsd	din.	дин.	0	0	{"value": "0", "precision": 20}	Serbian Dinar	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
rub	RUB	₽.	2	0	{"value": "0", "precision": 20}	Russian Ruble	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
rwf	RWF	FR	0	0	{"value": "0", "precision": 20}	Rwandan Franc	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
sar	SR	ر.س.‏	2	0	{"value": "0", "precision": 20}	Saudi Riyal	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
sdg	SDG	SDG	2	0	{"value": "0", "precision": 20}	Sudanese Pound	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
sek	Skr	kr	2	0	{"value": "0", "precision": 20}	Swedish Krona	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
sgd	S$	$	2	0	{"value": "0", "precision": 20}	Singapore Dollar	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
sos	Ssh	Ssh	0	0	{"value": "0", "precision": 20}	Somali Shilling	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
syp	SY£	ل.س.‏	0	0	{"value": "0", "precision": 20}	Syrian Pound	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
thb	฿	฿	2	0	{"value": "0", "precision": 20}	Thai Baht	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
tnd	DT	د.ت.‏	3	0	{"value": "0", "precision": 20}	Tunisian Dinar	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
top	T$	T$	2	0	{"value": "0", "precision": 20}	Tongan Paʻanga	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
tjs	TJS	с.	2	0	{"value": "0", "precision": 20}	Tajikistani Somoni	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
try	₺	₺	2	0	{"value": "0", "precision": 20}	Turkish Lira	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
ttd	TT$	$	2	0	{"value": "0", "precision": 20}	Trinidad and Tobago Dollar	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
twd	NT$	NT$	2	0	{"value": "0", "precision": 20}	New Taiwan Dollar	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
tzs	TSh	TSh	0	0	{"value": "0", "precision": 20}	Tanzanian Shilling	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
uah	₴	₴	2	0	{"value": "0", "precision": 20}	Ukrainian Hryvnia	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
ugx	USh	USh	0	0	{"value": "0", "precision": 20}	Ugandan Shilling	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
uyu	$U	$	2	0	{"value": "0", "precision": 20}	Uruguayan Peso	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
uzs	UZS	UZS	0	0	{"value": "0", "precision": 20}	Uzbekistan Som	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
vef	Bs.F.	Bs.F.	2	0	{"value": "0", "precision": 20}	Venezuelan Bolívar	2026-09-23 14:24:07.546+03	2026-09-23 14:24:07.546+03	\N
vnd	₫	₫	0	0	{"value": "0", "precision": 20}	Vietnamese Dong	2026-09-23 14:24:07.547+03	2026-09-23 14:24:07.547+03	\N
xaf	FCFA	FCFA	0	0	{"value": "0", "precision": 20}	CFA Franc BEAC	2026-09-23 14:24:07.547+03	2026-09-23 14:24:07.547+03	\N
xof	CFA	CFA	0	0	{"value": "0", "precision": 20}	CFA Franc BCEAO	2026-09-23 14:24:07.547+03	2026-09-23 14:24:07.547+03	\N
xpf	₣	₣	0	0	{"value": "0", "precision": 20}	CFP Franc	2026-09-23 14:24:07.547+03	2026-09-23 14:24:07.547+03	\N
yer	YR	ر.ي.‏	0	0	{"value": "0", "precision": 20}	Yemeni Rial	2026-09-23 14:24:07.547+03	2026-09-23 14:24:07.547+03	\N
zar	R	R	2	0	{"value": "0", "precision": 20}	South African Rand	2026-09-23 14:24:07.547+03	2026-09-23 14:24:07.547+03	\N
zmk	ZK	ZK	0	0	{"value": "0", "precision": 20}	Zambian Kwacha	2026-09-23 14:24:07.547+03	2026-09-23 14:24:07.547+03	\N
zwl	ZWL$	ZWL$	0	0	{"value": "0", "precision": 20}	Zimbabwean Dollar	2026-09-23 14:24:07.547+03	2026-09-23 14:24:07.547+03	\N
\.


--
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.customer (id, company_name, first_name, last_name, email, phone, has_account, metadata, created_at, updated_at, deleted_at, created_by) FROM stdin;
\.


--
-- Data for Name: customer_account_holder; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.customer_account_holder (customer_id, account_holder_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: customer_address; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.customer_address (id, customer_id, address_name, is_default_shipping, is_default_billing, company, first_name, last_name, address_1, address_2, city, country_code, province, postal_code, phone, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: customer_group; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.customer_group (id, name, metadata, created_by, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: customer_group_customer; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.customer_group_customer (id, customer_id, customer_group_id, metadata, created_at, updated_at, created_by, deleted_at) FROM stdin;
\.


--
-- Data for Name: fulfillment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fulfillment (id, location_id, packed_at, shipped_at, delivered_at, canceled_at, data, provider_id, shipping_option_id, metadata, delivery_address_id, created_at, updated_at, deleted_at, marked_shipped_by, created_by, requires_shipping) FROM stdin;
\.


--
-- Data for Name: fulfillment_address; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fulfillment_address (id, company, first_name, last_name, address_1, address_2, city, country_code, province, postal_code, phone, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: fulfillment_item; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fulfillment_item (id, title, sku, barcode, quantity, raw_quantity, line_item_id, inventory_item_id, fulfillment_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: fulfillment_label; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fulfillment_label (id, tracking_number, tracking_url, label_url, fulfillment_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: fulfillment_provider; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fulfillment_provider (id, is_enabled, created_at, updated_at, deleted_at) FROM stdin;
manual_manual	t	2026-09-23 14:24:07.554+03	2026-09-23 14:24:07.554+03	\N
\.


--
-- Data for Name: fulfillment_set; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fulfillment_set (id, name, type, metadata, created_at, updated_at, deleted_at) FROM stdin;
fuset_01M3704J5Q0HN6F4TG1SCR4RZ1	Merkez Depo teslimat	shipping	\N	2026-09-23 14:24:11.319+03	2026-09-23 14:24:11.319+03	\N
\.


--
-- Data for Name: geo_zone; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.geo_zone (id, type, country_code, province_code, city, service_zone_id, postal_expression, metadata, created_at, updated_at, deleted_at) FROM stdin;
fgz_01M3704J5QFCXVPBVNV0V7WWHV	country	tr	\N	\N	serzo_01M3704J5Q3EE2WPDHDTAXGNRA	\N	\N	2026-09-23 14:24:11.319+03	2026-09-23 14:24:11.319+03	\N
\.


--
-- Data for Name: image; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.image (id, url, metadata, created_at, updated_at, deleted_at, rank, product_id) FROM stdin;
img_01M3704JBFNZTN0DEDQCF1A7VP	http://localhost:3100/mock/products/receiver-graphite.svg	\N	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N	0	prod_01M3704JBCZ0QP0926CX9BKP16
img_01M3704JBG0KWDGXHFR66AJYJ6	http://localhost:3100/mock/products/receiver-black.svg	\N	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N	0	prod_01M3704JBCWEXHNS4YZFR9HJAY
img_01M3704JBGD882PT3G59PYKY2M	http://localhost:3100/mock/products/receiver-silver.svg	\N	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N	0	prod_01M3704JBCDCPWAV799W5MDB2Q
img_01M3704JBGJZGRCT2719C8TZY7	http://localhost:3100/mock/products/receiver-white.svg	\N	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N	0	prod_01M3704JBCPV1Q5RTFKHRY4GX1
img_01M3704JBGBCH5SR6KRXHRJHPM	http://localhost:3100/mock/products/remote-black.svg	\N	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N	0	prod_01M3704JBCJYZMXNJ2CS7S43DB
img_01M3704JBGC60TTPFB9K6K3NVP	http://localhost:3100/mock/products/remote-graphite.svg	\N	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N	0	prod_01M3704JBCZEA31BTY6SM3N08F
img_01M3704JBGXGFZTCRY82BVMSBE	http://localhost:3100/mock/products/acremote-white.svg	\N	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N	0	prod_01M3704JBCBD3VXS7HH1HDG4S9
img_01M3704JBG9NCX7MZF39GEHPWS	http://localhost:3100/mock/products/remote-white.svg	\N	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N	0	prod_01M3704JBC0YEWMERTH5QW3DNK
img_01M3704JBGFVRSMM2AMYQDG59T	http://localhost:3100/mock/products/speaker-black.svg	\N	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N	0	prod_01M3704JBCDPQX120JDNWVFR6W
img_01M3704JBHYTXVN3DP2AFYSRRF	http://localhost:3100/mock/products/speaker-graphite.svg	\N	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N	0	prod_01M3704JBCDH6HRQE2QB4NV2QZ
img_01M3704JBH20YD9KZ2T0RY3AZB	http://localhost:3100/mock/products/speaker-white.svg	\N	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N	0	prod_01M3704JBC53GPRKB7AMPF4Z8W
img_01M3704JBHB13CW8X529PBNEWZ	http://localhost:3100/mock/products/speaker-silver.svg	\N	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N	0	prod_01M3704JBC9ZWFD2XRVPFF74PA
img_01M3704JBHPFHWP4X2AXA0K35D	http://localhost:3100/mock/products/camera-white.svg	\N	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N	0	prod_01M3704JBCKGW9QKMX6ET5A9MW
img_01M3704JBHXZN5Y6V8VRHSES5A	http://localhost:3100/mock/products/camera-graphite.svg	\N	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N	0	prod_01M3704JBCZW219742T87QVVWC
img_01M3704JBJRS02G48X56AB3M89	http://localhost:3100/mock/products/nvr-black.svg	\N	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N	0	prod_01M3704JBCH0JEA9V57VGQSY2H
img_01M3704JBJRN98XYKV39JXCK2V	http://localhost:3100/mock/products/camera-silver.svg	\N	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N	0	prod_01M3704JBCG7P88J5C6V2QN81N
img_01M3704JBJVRZSF4TYZZHHNRRX	http://localhost:3100/mock/products/ledbar-silver.svg	\N	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N	0	prod_01M3704JBCRST6DA5ZZWGCN0KW
img_01M3704JBKHR2A0FHGW6STT4DN	http://localhost:3100/mock/products/ledbar-white.svg	\N	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N	0	prod_01M3704JBC3HDVBT8BGS9QSXPE
img_01M3704JBKZ4ERJ0W7F913AKS3	http://localhost:3100/mock/products/ledbar-graphite.svg	\N	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N	0	prod_01M3704JBCZSBGK4N9DPAEGKK6
img_01M3704JBKDPHCBXS1XCZZ98EF	http://localhost:3100/mock/products/ledbar-black.svg	\N	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N	0	prod_01M3704JBCCTJJEB35F869JJ4S
img_01M3704JBMXT8W3XCKCTMJPZEF	http://localhost:3100/mock/products/adapter-black.svg	\N	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N	0	prod_01M3704JBCFNJER548XVG0FJY2
img_01M3704JBMKZGAA0GGMZYVG2J9	http://localhost:3100/mock/products/adapter-graphite.svg	\N	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N	0	prod_01M3704JBC7GVJT1NVWQHXACTH
img_01M3704JBMDTPNT4B5HMQQG240	http://localhost:3100/mock/products/battery-silver.svg	\N	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N	0	prod_01M3704JBC55PJJQBNQXPZTS6G
img_01M3704JBN5NWEGCE0HDSJP4FM	http://localhost:3100/mock/products/battery-white.svg	\N	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N	0	prod_01M3704JBC39NJ7X4SYRYGEQDR
img_01M3704JBNJ9TFKCA9TQBA5XPD	http://localhost:3100/mock/products/headunit-black.svg	\N	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N	0	prod_01M3704JBCDV7X5ZD399RBPM50
img_01M3704JBNZ3AVQDF1KKYPS4S3	http://localhost:3100/mock/products/headunit-graphite.svg	\N	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N	0	prod_01M3704JBCBAHRF99HDEMCCPER
img_01M3704JBNH0QAFTBGAXJDG90R	http://localhost:3100/mock/products/camera-black.svg	\N	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N	0	prod_01M3704JBC1SP3M5ZRW05WXB7P
img_01M3704JBP4BQ6BSDSZEF9GDY7	http://localhost:3100/mock/products/headunit-white.svg	\N	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.532+03	\N	0	prod_01M3704JBCBCR24HBQVGXA0AZG
img_01M3704JBPXVKV2M90PN5DVTDT	http://localhost:3100/mock/products/router-white.svg	\N	2026-09-23 14:24:11.532+03	2026-09-23 14:24:11.532+03	\N	0	prod_01M3704JBCNXYR2DT3E3TW1SQF
img_01M3704JBQWP3J4KE82CGNQD03	http://localhost:3100/mock/products/router-graphite.svg	\N	2026-09-23 14:24:11.532+03	2026-09-23 14:24:11.532+03	\N	0	prod_01M3704JBCV564EK2V1F4R3AQC
img_01M3704JBQRY77SQ23GMDVX4SD	http://localhost:3100/mock/products/router-black.svg	\N	2026-09-23 14:24:11.532+03	2026-09-23 14:24:11.532+03	\N	0	prod_01M3704JBCMQTBNWRZGEC73B0K
img_01M3704JBQW398PVDGE9MD36WD	http://localhost:3100/mock/products/router-silver.svg	\N	2026-09-23 14:24:11.532+03	2026-09-23 14:24:11.532+03	\N	0	prod_01M3704JBC1NDGX04H6ZDMP2WD
img_01M3704JBQWW5ZFWHT72BRTRKD	http://localhost:3100/mock/products/meter-graphite.svg	\N	2026-09-23 14:24:11.532+03	2026-09-23 14:24:11.532+03	\N	0	prod_01M3704JBCXBV13KW3A3MP20DB
img_01M3704JBQ5FBRAMADTEQZX5X8	http://localhost:3100/mock/products/meter-black.svg	\N	2026-09-23 14:24:11.532+03	2026-09-23 14:24:11.532+03	\N	0	prod_01M3704JBC46SCQVGHC69CRN5B
img_01M3704JBQG19WJKBG531GDJKN	http://localhost:3100/mock/products/meter-silver.svg	\N	2026-09-23 14:24:11.532+03	2026-09-23 14:24:11.532+03	\N	0	prod_01M3704JBCQRVN3RCNR0NRMAHV
img_01M3704JBRNR00GDJXFD8X9C7T	http://localhost:3100/mock/products/meter-white.svg	\N	2026-09-23 14:24:11.532+03	2026-09-23 14:24:11.532+03	\N	0	prod_01M3704JBC20RM7KAAK0W787NZ
img_01M3704JBRM5YN10X4C24HWNP3	http://localhost:3100/mock/products/cable-black.svg	\N	2026-09-23 14:24:11.532+03	2026-09-23 14:24:11.532+03	\N	0	prod_01M3704JBCGTS51DVBBH9T7DAA
img_01M3704JBRY02FX80CBEGMRJ2E	http://localhost:3100/mock/products/cable-graphite.svg	\N	2026-09-23 14:24:11.532+03	2026-09-23 14:24:11.532+03	\N	0	prod_01M3704JBC48SG8WC48C3DF4FG
img_01M3704JBRJE90SS5C2KXAKY93	http://localhost:3100/mock/products/cable-silver.svg	\N	2026-09-23 14:24:11.532+03	2026-09-23 14:24:11.532+03	\N	0	prod_01M3704JBCG873HZHMK2J79AWB
img_01M3704JBRHWCDANTJ0X0BYTRZ	http://localhost:3100/mock/products/cable-white.svg	\N	2026-09-23 14:24:11.532+03	2026-09-23 14:24:11.532+03	\N	0	prod_01M3704JBCVV7WP033B2FAV3EF
img_01M3704JBREX5D6DWHR966C6W5	http://localhost:3100/mock/products/aio-silver.svg	\N	2026-09-23 14:24:11.532+03	2026-09-23 14:24:11.532+03	\N	0	prod_01M3704JBDY5T4BNC6R1RR3V8E
img_01M3704JBS22PYQKYDRF4T73PF	http://localhost:3100/mock/products/monitor-graphite.svg	\N	2026-09-23 14:24:11.532+03	2026-09-23 14:24:11.532+03	\N	0	prod_01M3704JBDHB882SB9JM6H9V3N
img_01M3704JBSXNCW4NKG5YAHMH5W	http://localhost:3100/mock/products/monitor-black.svg	\N	2026-09-23 14:24:11.532+03	2026-09-23 14:24:11.532+03	\N	0	prod_01M3704JBD8NS1N27SP4Z0GEX9
img_01M3704JBSDZ4KT0H0277PWG1M	http://localhost:3100/mock/products/meter-graphite.svg	\N	2026-09-23 14:24:11.532+03	2026-09-23 14:24:11.532+03	\N	0	prod_01M3704JBDV13SJWHGPQB6FTK9
img_01M3704JBSTFC4DW4XQJ238XJN	http://localhost:3100/mock/products/adapter-silver.svg	\N	2026-09-23 14:24:11.532+03	2026-09-23 14:24:11.532+03	\N	0	prod_01M3704JBDMYMEN5T7R3ZJGZV4
img_01M3704JBS06YPR724V678SHFY	http://localhost:3100/mock/products/adapter-white.svg	\N	2026-09-23 14:24:11.532+03	2026-09-23 14:24:11.532+03	\N	0	prod_01M3704JBD2AF9D2XX6AZM5MR0
img_01M3704JBSXP03BTGXWG9299Y2	http://localhost:3100/mock/products/adapter-graphite.svg	\N	2026-09-23 14:24:11.532+03	2026-09-23 14:24:11.532+03	\N	0	prod_01M3704JBDQ9WM8EBJJ8QCCKZ1
img_01M3704JBSEM7B9AC62BKKR0E0	http://localhost:3100/mock/products/receiver-silver.svg	\N	2026-09-23 14:24:11.532+03	2026-09-23 14:24:11.532+03	\N	0	prod_01M3704JBDHDCAZAN36GTYS4YY
img_01M3704JBS1KQRWVBF5E60V8GK	http://localhost:3100/mock/products/dish-white.svg	\N	2026-09-23 14:24:11.532+03	2026-09-23 14:24:11.532+03	\N	0	prod_01M3704JBDAVYAFMG8QYT8P3AF
img_01M3704JBSVKNRB6ZZF8ZWBCJB	http://localhost:3100/mock/products/remote-white.svg	\N	2026-09-23 14:24:11.532+03	2026-09-23 14:24:11.532+03	\N	0	prod_01M3704JBDNSH2EKX4026MTGFC
img_01M3704JBSV0PNT5C64AA8AP88	http://localhost:3100/mock/products/column-white.svg	\N	2026-09-23 14:24:11.532+03	2026-09-23 14:24:11.532+03	\N	0	prod_01M3704JBD9WQG3QSMZ4Z5H80J
img_01M3704JBS5BRYVNWNPRZ7CF6B	http://localhost:3100/mock/products/speaker-silver.svg	\N	2026-09-23 14:24:11.532+03	2026-09-23 14:24:11.532+03	\N	0	prod_01M3704JBDK4NTGGANMJQV51Y9
img_01M3704JBS6Q0JT5ATVFTKKKZ8	http://localhost:3100/mock/products/nvr-white.svg	\N	2026-09-23 14:24:11.532+03	2026-09-23 14:24:11.532+03	\N	0	prod_01M3704JBD714MY8QY02RVEBFE
img_01M3704JBTR3BK2ANWDPZB7EE2	http://localhost:3100/mock/products/dome-graphite.svg	\N	2026-09-23 14:24:11.532+03	2026-09-23 14:24:11.532+03	\N	0	prod_01M3704JBDZBTN971SS3T5QE9B
img_01M3704JBT1Q2T0TENNS8GEATN	http://localhost:3100/mock/products/ledbar-graphite.svg	\N	2026-09-23 14:24:11.532+03	2026-09-23 14:24:11.532+03	\N	0	prod_01M3704JBDVQB3Z6K9KCEJ3A04
img_01M3704JBTT0A3NKN7P0YPWHQ5	http://localhost:3100/mock/products/meter-white.svg	\N	2026-09-23 14:24:11.532+03	2026-09-23 14:24:11.532+03	\N	0	prod_01M3704JBD3M2D2V9RRKJ6D1X1
img_01M3704JBT49WYXHRGVM36TYC2	http://localhost:3100/mock/products/headunit-white.svg	\N	2026-09-23 14:24:11.532+03	2026-09-23 14:24:11.532+03	\N	0	prod_01M3704JBDYP8E9YQ1RV6KX70W
img_01M3704JBTKBG78QY2CRJRDDAX	http://localhost:3100/mock/products/aio-black.svg	\N	2026-09-23 14:24:11.532+03	2026-09-23 14:24:11.532+03	\N	0	prod_01M3704JBD9E0E0PRHYVHS3MZR
img_01M373HQEWAZT5YXPKW657727Q	http://localhost:9000/static/1790166227834-receiver-silver.svg	\N	2026-09-23 15:23:48.456+03	2026-09-23 15:23:57.853+03	2026-09-23 15:23:57.842+03	0	prod_01M373HQESHB6TP1M9JWBZ25DX
img_01M374VN92313YKPVN6030KTJ9	http://localhost:9000/static/1790167565106-20260508%20DFR%2030mm%20aufgewickelt%20komplett.jpeg	\N	2026-09-23 15:46:42.472+03	2026-09-23 15:46:42.472+03	\N	0	prod_01M374VN91HAMJT1T85974N71T
img_01M3P8ZDJCSMG4SMX8M4KYZ1WM	http://localhost:3100/mock/products/aio-white.svg	\N	2026-09-29 12:47:16.429+03	2026-09-29 12:47:16.429+03	\N	0	prod_01M3704JBC1W321MXAWJ5VH65S
img_01M3P8ZDJC18A5BBJCRY829M60	http://localhost:3100/mock/products/aio-graphite.svg	\N	2026-09-29 12:47:16.429+03	2026-09-29 12:47:16.429+03	\N	1	prod_01M3704JBC1W321MXAWJ5VH65S
img_01M3P8ZDJCFK6A55CYDKW9FC58	http://localhost:3100/mock/products/aio-black.svg	\N	2026-09-29 12:47:16.429+03	2026-09-29 12:47:16.429+03	\N	2	prod_01M3704JBC1W321MXAWJ5VH65S
\.


--
-- Data for Name: inventory_item; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.inventory_item (id, created_at, updated_at, deleted_at, sku, origin_country, hs_code, mid_code, material, weight, length, height, width, requires_shipping, description, title, thumbnail, metadata, unit_of_measure) FROM stdin;
iitem_01M3704JJP6EXC7PSKAEWVDK1Q	2026-09-23 14:24:11.737+03	2026-09-23 14:24:11.737+03	\N	ORB-1000	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJPRPE7F48ZWWS7JPS8	2026-09-23 14:24:11.737+03	2026-09-23 14:24:11.737+03	\N	ORB-1007	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJPT58NJ7J678280NPE	2026-09-23 14:24:11.737+03	2026-09-23 14:24:11.737+03	\N	ANT-1014	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJP3CHZFZCYA92XNAXS	2026-09-23 14:24:11.737+03	2026-09-23 14:24:11.737+03	\N	ANT-1021	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJPQNF1103J4XVZ4S2S	2026-09-23 14:24:11.737+03	2026-09-23 14:24:11.737+03	\N	KUM-1028	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJPDSXVCMEJYJV3FR32	2026-09-23 14:24:11.737+03	2026-09-23 14:24:11.737+03	\N	KUM-1035	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJP9JCFAZQX4T2VYXXR	2026-09-23 14:24:11.737+03	2026-09-23 14:24:11.737+03	\N	KUM-1042	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJPGJM8Y8KH7DJVT0K1	2026-09-23 14:24:11.737+03	2026-09-23 14:24:11.737+03	\N	VIZ-1049	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJPSVG3ZQFDMARNDPVW	2026-09-23 14:24:11.737+03	2026-09-23 14:24:11.737+03	\N	SON-1056	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJQYJN4QGTQ943JYKMK	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	SON-1063	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJQYNF9S1X349T4569B	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	SES-1070	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJQ7EA7XTA8AP4X21K0	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	SES-1077	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJQE6AENA5HG8AE3M0E	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	FOT-1084	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJQH6G0DBFV0Y0GXXPG	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	FOT-1091	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJQHC0C6Q44TJASPR6P	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	PRO-1098	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJQVFPNHK0EX0ZQ9DHA	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	PRO-1105	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJQAS1BTXA0EQ1GN8JR	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	LED-1112	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJQTXJMDNECYY8TGMSY	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	LED-1119	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJQXDT9JSCEECH7DS5D	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	LUM-1126	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJQBBMVRTZ0VP16BARD	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	LUM-1133	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJQRM6PJMB24181KNNX	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	POW-1140	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJQMEKAW8EP3H5RAAXA	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	POW-1147	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJQCTBBG364TNRX9ZWT	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	BAT-1154	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJQCJX4EG466SC52B0T	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	BAT-1161	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJQ4B45ZFZVVE26P7MD	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	VOL-1168	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJQA13VCTZ8B8WJAJTT	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	VOL-1175	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJQH4FYSAGDQRB8SA2D	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	VOL-1182	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJQP5WJM11989D2BT2J	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	SIN-1189	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJQTDKTRE34CSPHPXQM	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	NEX-1196	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJQ29GK8MW0G9192SQ4	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	NEX-1203	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJRDHYRCWSV28X20B1P	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	DIG-1210	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJRE8A0DDAZPS2F3AH1	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	DIG-1217	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJRWE0P853ZNNHB25GG	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	MET-1224	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJR6Y8B41E2P2S0JSV0	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	MET-1231	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJRGJ67684WDTP2JPNR	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	DEV-1238	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJR66T75E8EXST5RC9Z	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	DEV-1245	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJRQ4M2AHCN6QQN0TJ4	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	CAB-1252	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJRR5M60FWQPYGP5YPJ	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	CAB-1259	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJR8JCXXXBHFFD1GJMM	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	KAB-1266	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJRQVDBPH8HT8HQWAZM	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	KAB-1273	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJRMX2GR8F145ZN0AY2	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	TEK-1280	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJR5A02HEBMGA8E1KJH	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	TEK-1287	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJR9WMHZ4B0YG68PAJ3	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	TEK-1294	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJR8V7XJTQX8HJJG2AX	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	OPT-1301	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJRJ2RNZ949B8ZJHKAX	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	TAM-1308	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJRJF5N5HX31A8MYECZ	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	TAM-1315	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJR8Z310ZD3ZGT29AAJ	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	SER-1322	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJRJMAXG61PGSVHSQTB	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	MEG-1329	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJR1J8NRYKJXBRJQ300	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	ORB-1336	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJR1B23BJ8ZVRXTEDTA	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	ORB-1343	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJRES81M4N0P5QB4GB6	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	KUM-1350	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJRH7SR44055ECX8KXH	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	SON-1357	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJS0JXERX6XFT3TZE3A	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	SON-1364	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJSDHBZFB6GMP035ZN2	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	PRO-1371	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJSCR03Z8QD92THFBZA	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	PRO-1378	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJSS737DC863S4JRJ6X	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	LED-1385	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJSGHR3KKFBN8V4XFXD	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	LED-1392	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJSBMPDRTCEXGN1Q3QT	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	VOL-1399	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M3704JJSNVT56QEZR7K81GC5	2026-09-23 14:24:11.738+03	2026-09-23 14:24:11.738+03	\N	TEK-1406	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M373HQM8XEA0SC8VS8EKWRQC	2026-09-23 15:23:48.616+03	2026-09-23 15:23:57.815+03	2026-09-23 15:23:57.815+03	ORB-MUE2R268	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
iitem_01M374VNBEVTJ92XM0MMGT7R22	2026-09-23 15:46:42.542+03	2026-09-23 15:46:42.542+03	\N	12	\N	\N	\N	\N	\N	\N	\N	\N	t	Standart	Standart	\N	\N	\N
\.


--
-- Data for Name: inventory_level; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.inventory_level (id, created_at, updated_at, deleted_at, inventory_item_id, location_id, stocked_quantity, reserved_quantity, incoming_quantity, metadata, raw_stocked_quantity, raw_reserved_quantity, raw_incoming_quantity) FROM stdin;
ilev_01M3704JQCF79G7WCBS83GJH2F	2026-09-23 14:24:11.886+03	2026-09-23 14:24:11.886+03	\N	iitem_01M3704JJP3CHZFZCYA92XNAXS	sloc_01M3704J5592G9WZNZPBHXKDQR	120	0	0	\N	{"value": "120", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQCGBQ36PJM4P89M0KH	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJPDSXVCMEJYJV3FR32	sloc_01M3704J5592G9WZNZPBHXKDQR	33	0	0	\N	{"value": "33", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQCRK2J87GD4WZW5WM9	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJPGJM8Y8KH7DJVT0K1	sloc_01M3704J5592G9WZNZPBHXKDQR	17	0	0	\N	{"value": "17", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQCSZQNG0KPC1HWG3GZ	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJPRPE7F48ZWWS7JPS8	sloc_01M3704J5592G9WZNZPBHXKDQR	41	0	0	\N	{"value": "41", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQC68A5RAE4B05EC4SE	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJPSVG3ZQFDMARNDPVW	sloc_01M3704J5592G9WZNZPBHXKDQR	4	0	0	\N	{"value": "4", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQCMHNY76S3ZHWPZQVS	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJPT58NJ7J678280NPE	sloc_01M3704J5592G9WZNZPBHXKDQR	6	0	0	\N	{"value": "6", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQC9GHCR7NAM6GE7WXH	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJQ29GK8MW0G9192SQ4	sloc_01M3704J5592G9WZNZPBHXKDQR	54	0	0	\N	{"value": "54", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQDAVW0G64PB9AD23ZZ	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJQ4B45ZFZVVE26P7MD	sloc_01M3704J5592G9WZNZPBHXKDQR	31	0	0	\N	{"value": "31", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQDB6CW3WZBJE54MWER	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJQ7EA7XTA8AP4X21K0	sloc_01M3704J5592G9WZNZPBHXKDQR	9	0	0	\N	{"value": "9", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQD8ASN1MFP43MBMC8M	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJQA13VCTZ8B8WJAJTT	sloc_01M3704J5592G9WZNZPBHXKDQR	11	0	0	\N	{"value": "11", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQDSZ7K6FHA7R4VBJGD	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJQAS1BTXA0EQ1GN8JR	sloc_01M3704J5592G9WZNZPBHXKDQR	96	0	0	\N	{"value": "96", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQDACECAGZ2NBFF64M6	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJQBBMVRTZ0VP16BARD	sloc_01M3704J5592G9WZNZPBHXKDQR	12	0	0	\N	{"value": "12", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQDQACWAG39X6B8CFPJ	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJQCJX4EG466SC52B0T	sloc_01M3704J5592G9WZNZPBHXKDQR	68	0	0	\N	{"value": "68", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQDJKZPXWERZ3RR3CKA	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJQCTBBG364TNRX9ZWT	sloc_01M3704J5592G9WZNZPBHXKDQR	5	0	0	\N	{"value": "5", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQDATXK35TKDQAW0DWK	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJQE6AENA5HG8AE3M0E	sloc_01M3704J5592G9WZNZPBHXKDQR	52	0	0	\N	{"value": "52", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQDM2KZV34J1RFKS52F	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJQH4FYSAGDQRB8SA2D	sloc_01M3704J5592G9WZNZPBHXKDQR	27	0	0	\N	{"value": "27", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQD01DQ2EN5NY9XD90J	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJQH6G0DBFV0Y0GXXPG	sloc_01M3704J5592G9WZNZPBHXKDQR	38	0	0	\N	{"value": "38", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQDR7GG6GCG21EY8TJH	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJQHC0C6Q44TJASPR6P	sloc_01M3704J5592G9WZNZPBHXKDQR	7	0	0	\N	{"value": "7", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQD03K2E42Y0B0YZ0RD	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJQMEKAW8EP3H5RAAXA	sloc_01M3704J5592G9WZNZPBHXKDQR	45	0	0	\N	{"value": "45", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQDKMTRG45X2DHK65J2	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJQP5WJM11989D2BT2J	sloc_01M3704J5592G9WZNZPBHXKDQR	8	0	0	\N	{"value": "8", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQDNPR0C1AQSP89HNRB	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJQRM6PJMB24181KNNX	sloc_01M3704J5592G9WZNZPBHXKDQR	210	0	0	\N	{"value": "210", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQDMFQ5VNB7NQK5C8GJ	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJQTDKTRE34CSPHPXQM	sloc_01M3704J5592G9WZNZPBHXKDQR	36	0	0	\N	{"value": "36", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQD4YYAACSTHD63D7A2	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJQTXJMDNECYY8TGMSY	sloc_01M3704J5592G9WZNZPBHXKDQR	22	0	0	\N	{"value": "22", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQD3GPHBHAJQD0GHNMR	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJQVFPNHK0EX0ZQ9DHA	sloc_01M3704J5592G9WZNZPBHXKDQR	3	0	0	\N	{"value": "3", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQCT0VK0D6HHDJ6XRQJ	2026-09-23 14:24:11.887+03	2026-09-23 14:59:06.336+03	\N	iitem_01M3704JJPQNF1103J4XVZ4S2S	sloc_01M3704J5592G9WZNZPBHXKDQR	88	0	0	\N	{"value": "88", "precision": 20}	{"value": "1", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQD16W8KB343034VX9F	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJQXDT9JSCEECH7DS5D	sloc_01M3704J5592G9WZNZPBHXKDQR	140	0	0	\N	{"value": "140", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQD5HJAM35RBDM4XNDJ	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJQYNF9S1X349T4569B	sloc_01M3704J5592G9WZNZPBHXKDQR	74	0	0	\N	{"value": "74", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQD36WHC2G9S29S5MMK	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJR1B23BJ8ZVRXTEDTA	sloc_01M3704J5592G9WZNZPBHXKDQR	29	0	0	\N	{"value": "29", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQDBZ0A4CSQ89HDV378	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJR1J8NRYKJXBRJQ300	sloc_01M3704J5592G9WZNZPBHXKDQR	33	0	0	\N	{"value": "33", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQDR36A6QRZN6ZN2B8S	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJR5A02HEBMGA8E1KJH	sloc_01M3704J5592G9WZNZPBHXKDQR	5	0	0	\N	{"value": "5", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQDND9M3DKMXC02PNWH	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJR66T75E8EXST5RC9Z	sloc_01M3704J5592G9WZNZPBHXKDQR	4	0	0	\N	{"value": "4", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQD8EXED6H2S5GMX8ED	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJR6Y8B41E2P2S0JSV0	sloc_01M3704J5592G9WZNZPBHXKDQR	13	0	0	\N	{"value": "13", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQDDTWNNE7QEHQ340TN	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJR8JCXXXBHFFD1GJMM	sloc_01M3704J5592G9WZNZPBHXKDQR	9	0	0	\N	{"value": "9", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQD24T8SF8Z6F6SZEAC	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJR8V7XJTQX8HJJG2AX	sloc_01M3704J5592G9WZNZPBHXKDQR	10	0	0	\N	{"value": "10", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQDBRR58YZMPK0MSXTB	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJR8Z310ZD3ZGT29AAJ	sloc_01M3704J5592G9WZNZPBHXKDQR	88	0	0	\N	{"value": "88", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQD6SJR8T0VF7MHB34H	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJR9WMHZ4B0YG68PAJ3	sloc_01M3704J5592G9WZNZPBHXKDQR	21	0	0	\N	{"value": "21", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQDQ0RAQJY3QS6795N5	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJRDHYRCWSV28X20B1P	sloc_01M3704J5592G9WZNZPBHXKDQR	14	0	0	\N	{"value": "14", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQENGJGAGH9F2H4RTXE	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJRE8A0DDAZPS2F3AH1	sloc_01M3704J5592G9WZNZPBHXKDQR	40	0	0	\N	{"value": "40", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQE3N5YD86XC4BJA8ZG	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJRES81M4N0P5QB4GB6	sloc_01M3704J5592G9WZNZPBHXKDQR	57	0	0	\N	{"value": "57", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQE0KF87KEKY1336MMN	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJRGJ67684WDTP2JPNR	sloc_01M3704J5592G9WZNZPBHXKDQR	6	0	0	\N	{"value": "6", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQEPDZQKS4BBSBPKJRH	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJRH7SR44055ECX8KXH	sloc_01M3704J5592G9WZNZPBHXKDQR	15	0	0	\N	{"value": "15", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQEAWGQ832W0WJ0FGD7	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJRJ2RNZ949B8ZJHKAX	sloc_01M3704J5592G9WZNZPBHXKDQR	34	0	0	\N	{"value": "34", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQEYZHKBTK4W6TS841J	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJRJF5N5HX31A8MYECZ	sloc_01M3704J5592G9WZNZPBHXKDQR	62	0	0	\N	{"value": "62", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQERHRR633V2XGZ6FV5	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJRJMAXG61PGSVHSQTB	sloc_01M3704J5592G9WZNZPBHXKDQR	7	0	0	\N	{"value": "7", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQEXWXPRJHX81B1CTY9	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJRMX2GR8F145ZN0AY2	sloc_01M3704J5592G9WZNZPBHXKDQR	3	0	0	\N	{"value": "3", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQE58F38T7Q00WQ65ZS	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJRQ4M2AHCN6QQN0TJ4	sloc_01M3704J5592G9WZNZPBHXKDQR	58	0	0	\N	{"value": "58", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQE726FA6CCKJTZK645	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJRQVDBPH8HT8HQWAZM	sloc_01M3704J5592G9WZNZPBHXKDQR	47	0	0	\N	{"value": "47", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQE5H1W84KS4J9MWG2K	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJRR5M60FWQPYGP5YPJ	sloc_01M3704J5592G9WZNZPBHXKDQR	132	0	0	\N	{"value": "132", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQEHQS9WPXXDW7TWT9K	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJS0JXERX6XFT3TZE3A	sloc_01M3704J5592G9WZNZPBHXKDQR	12	0	0	\N	{"value": "12", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQEXY1MY0FH2QJMVBDZ	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJSBMPDRTCEXGN1Q3QT	sloc_01M3704J5592G9WZNZPBHXKDQR	26	0	0	\N	{"value": "26", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQEJ4G890TNQMW452J0	2026-09-23 14:24:11.887+03	2026-09-23 14:49:01.024+03	\N	iitem_01M3704JJRWE0P853ZNNHB25GG	sloc_01M3704J5592G9WZNZPBHXKDQR	19	0	0	\N	{"value": "19", "precision": 20}	{"value": "1", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQEM4ZBGC7ZZ454S18D	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJSCR03Z8QD92THFBZA	sloc_01M3704J5592G9WZNZPBHXKDQR	44	0	0	\N	{"value": "44", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQE92QQHDTX7AAF1VF9	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJSDHBZFB6GMP035ZN2	sloc_01M3704J5592G9WZNZPBHXKDQR	16	0	0	\N	{"value": "16", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQEJ0B4E5GQ5KCSM8YA	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJSGHR3KKFBN8V4XFXD	sloc_01M3704J5592G9WZNZPBHXKDQR	18	0	0	\N	{"value": "18", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQEWDJYSDATWE0HKD79	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJSNVT56QEZR7K81GC5	sloc_01M3704J5592G9WZNZPBHXKDQR	2	0	0	\N	{"value": "2", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQEEW08G41CQCTQCMZ6	2026-09-23 14:24:11.887+03	2026-09-23 14:24:11.887+03	\N	iitem_01M3704JJSS737DC863S4JRJ6X	sloc_01M3704J5592G9WZNZPBHXKDQR	48	0	0	\N	{"value": "48", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQCWE1C7M8SR81DD1B9	2026-09-23 14:24:11.887+03	2026-09-23 14:25:21.504+03	\N	iitem_01M3704JJP6EXC7PSKAEWVDK1Q	sloc_01M3704J5592G9WZNZPBHXKDQR	24	0	0	\N	{"value": "24", "precision": 20}	{"value": "1", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQCCGXVHW1D26YGA2C4	2026-09-23 14:24:11.887+03	2026-09-23 14:25:21.504+03	\N	iitem_01M3704JJP9JCFAZQX4T2VYXXR	sloc_01M3704J5592G9WZNZPBHXKDQR	64	0	0	\N	{"value": "64", "precision": 20}	{"value": "1", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M3704JQD5RCJQP14SN15JZ6G	2026-09-23 14:24:11.887+03	2026-09-23 14:42:17.091+03	\N	iitem_01M3704JJQYJN4QGTQ943JYKMK	sloc_01M3704J5592G9WZNZPBHXKDQR	29	0	0	\N	{"value": "29", "precision": 20}	{"value": "1", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M373HQVZ771Y27V140NZSZVE	2026-09-23 15:23:48.863+03	2026-09-23 15:23:57.825+03	2026-09-23 15:23:57.815+03	iitem_01M373HQM8XEA0SC8VS8EKWRQC	sloc_01M3704J5592G9WZNZPBHXKDQR	0	0	0	\N	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01M374VNH1MS4KG6D91W0PNZ0P	2026-09-23 15:46:42.722+03	2026-09-23 15:46:42.722+03	\N	iitem_01M374VNBEVTJ92XM0MMGT7R22	sloc_01M3704J5592G9WZNZPBHXKDQR	12	0	0	\N	{"value": "12", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
\.


--
-- Data for Name: invite; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.invite (id, email, accepted, token, expires_at, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: invite_rbac_role; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.invite_rbac_role (invite_id, rbac_role_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: layout_configuration; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.layout_configuration (id, zone, user_id, is_system_default, configuration, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: link_module_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.link_module_migrations (id, table_name, link_descriptor, created_at) FROM stdin;
1	cart_payment_collection	{"toModel": "payment_collection", "toModule": "payment", "fromModel": "cart", "fromModule": "cart"}	2026-09-23 14:24:05.01549
2	cart_promotion	{"toModel": "promotions", "toModule": "promotion", "fromModel": "cart", "fromModule": "cart"}	2026-09-23 14:24:05.027323
3	customer_account_holder	{"toModel": "account_holder", "toModule": "payment", "fromModel": "customer", "fromModule": "customer"}	2026-09-23 14:24:05.03256
4	location_fulfillment_provider	{"toModel": "fulfillment_provider", "toModule": "fulfillment", "fromModel": "location", "fromModule": "stock_location"}	2026-09-23 14:24:05.037222
5	location_fulfillment_set	{"toModel": "fulfillment_set", "toModule": "fulfillment", "fromModel": "location", "fromModule": "stock_location"}	2026-09-23 14:24:05.043239
6	invite_rbac_role	{"toModel": "rbac_role", "toModule": "rbac", "fromModel": "invite", "fromModule": "user"}	2026-09-23 14:24:05.048628
7	order_cart	{"toModel": "cart", "toModule": "cart", "fromModel": "order", "fromModule": "order"}	2026-09-23 14:24:05.054062
8	order_fulfillment	{"toModel": "fulfillments", "toModule": "fulfillment", "fromModel": "order", "fromModule": "order"}	2026-09-23 14:24:05.059614
9	order_payment_collection	{"toModel": "payment_collection", "toModule": "payment", "fromModel": "order", "fromModule": "order"}	2026-09-23 14:24:05.065426
10	order_promotion	{"toModel": "promotions", "toModule": "promotion", "fromModel": "order", "fromModule": "order"}	2026-09-23 14:24:05.070595
11	return_fulfillment	{"toModel": "fulfillments", "toModule": "fulfillment", "fromModel": "return", "fromModule": "order"}	2026-09-23 14:24:05.075335
12	product_sales_channel	{"toModel": "sales_channel", "toModule": "sales_channel", "fromModel": "product", "fromModule": "product"}	2026-09-23 14:24:05.08014
13	product_shipping_profile	{"toModel": "shipping_profile", "toModule": "fulfillment", "fromModel": "product", "fromModule": "product"}	2026-09-23 14:24:05.085816
14	product_variant_inventory_item	{"toModel": "inventory", "toModule": "inventory", "fromModel": "variant", "fromModule": "product"}	2026-09-23 14:24:05.090911
15	product_variant_price_set	{"toModel": "price_set", "toModule": "pricing", "fromModel": "variant", "fromModule": "product"}	2026-09-23 14:24:05.096734
16	publishable_api_key_sales_channel	{"toModel": "sales_channel", "toModule": "sales_channel", "fromModel": "api_key", "fromModule": "api_key"}	2026-09-23 14:24:05.104369
17	region_payment_provider	{"toModel": "payment_provider", "toModule": "payment", "fromModel": "region", "fromModule": "region"}	2026-09-23 14:24:05.110498
18	sales_channel_stock_location	{"toModel": "location", "toModule": "stock_location", "fromModel": "sales_channel", "fromModule": "sales_channel"}	2026-09-23 14:24:05.116111
19	shipping_option_price_set	{"toModel": "price_set", "toModule": "pricing", "fromModel": "shipping_option", "fromModule": "fulfillment"}	2026-09-23 14:24:05.121619
20	user_rbac_role	{"toModel": "rbac_role", "toModule": "rbac", "fromModel": "user", "fromModule": "user"}	2026-09-23 14:24:05.127669
\.


--
-- Data for Name: location_fulfillment_provider; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.location_fulfillment_provider (stock_location_id, fulfillment_provider_id, id, created_at, updated_at, deleted_at) FROM stdin;
sloc_01M3704J5592G9WZNZPBHXKDQR	manual_manual	locfp_01M3704J5DAR123F5T18DNKDJ2	2026-09-23 14:24:11.310421+03	2026-09-23 14:24:11.310421+03	\N
\.


--
-- Data for Name: location_fulfillment_set; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.location_fulfillment_set (stock_location_id, fulfillment_set_id, id, created_at, updated_at, deleted_at) FROM stdin;
sloc_01M3704J5592G9WZNZPBHXKDQR	fuset_01M3704J5Q0HN6F4TG1SCR4RZ1	locfs_01M3704J69TP8G94A9AEPR9DKD	2026-09-23 14:24:11.337668+03	2026-09-23 14:24:11.337668+03	\N
\.


--
-- Data for Name: mikro_orm_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.mikro_orm_migrations (id, name, executed_at) FROM stdin;
1	Migration20240307161216	2026-09-23 14:23:59.402578+03
2	Migration20241210073813	2026-09-23 14:23:59.402578+03
3	Migration20250106142624	2026-09-23 14:23:59.402578+03
4	Migration20250120110820	2026-09-23 14:23:59.402578+03
5	Migration20240307132720	2026-09-23 14:23:59.532575+03
6	Migration20240719123015	2026-09-23 14:23:59.532575+03
7	Migration20241213063611	2026-09-23 14:23:59.532575+03
8	Migration20251010131115	2026-09-23 14:23:59.532575+03
9	Migration20260815185216	2026-09-23 14:23:59.532575+03
10	InitialSetup20240401153642	2026-09-23 14:23:59.792705+03
11	Migration20240601111544	2026-09-23 14:23:59.792705+03
12	Migration202408271511	2026-09-23 14:23:59.792705+03
13	Migration20241122120331	2026-09-23 14:23:59.792705+03
14	Migration20241125090957	2026-09-23 14:23:59.792705+03
15	Migration20250411073236	2026-09-23 14:23:59.792705+03
16	Migration20250516081326	2026-09-23 14:23:59.792705+03
17	Migration20250910154539	2026-09-23 14:23:59.792705+03
18	Migration20250911092221	2026-09-23 14:23:59.792705+03
19	Migration20250929204438	2026-09-23 14:23:59.792705+03
20	Migration20251008132218	2026-09-23 14:23:59.792705+03
21	Migration20251011090511	2026-09-23 14:23:59.792705+03
22	Migration20251022153442	2026-09-23 14:23:59.792705+03
23	Migration20251029150809	2026-09-23 14:23:59.792705+03
24	Migration20251110180907	2026-09-23 14:23:59.792705+03
25	Migration20251113183352	2026-09-23 14:23:59.792705+03
26	Migration20260224120000	2026-09-23 14:23:59.792705+03
27	Migration20260301002050	2026-09-23 14:23:59.792705+03
28	Migration20260306120000	2026-09-23 14:23:59.792705+03
29	Migration20260623180000	2026-09-23 14:23:59.792705+03
30	Migration20260730104846	2026-09-23 14:23:59.792705+03
31	Migration20230929122253	2026-09-23 14:24:00.156914+03
32	Migration20240322094407	2026-09-23 14:24:00.156914+03
33	Migration20240322113359	2026-09-23 14:24:00.156914+03
34	Migration20240322120125	2026-09-23 14:24:00.156914+03
35	Migration20240626133555	2026-09-23 14:24:00.156914+03
36	Migration20240704094505	2026-09-23 14:24:00.156914+03
37	Migration20241127114534	2026-09-23 14:24:00.156914+03
38	Migration20241127223829	2026-09-23 14:24:00.156914+03
39	Migration20241128055359	2026-09-23 14:24:00.156914+03
40	Migration20241212190401	2026-09-23 14:24:00.156914+03
41	Migration20250408145122	2026-09-23 14:24:00.156914+03
42	Migration20250409122219	2026-09-23 14:24:00.156914+03
43	Migration20251009110625	2026-09-23 14:24:00.156914+03
44	Migration20251112192723	2026-09-23 14:24:00.156914+03
45	Migration20260429163502	2026-09-23 14:24:00.156914+03
46	Migration20240227120221	2026-09-23 14:24:00.413731+03
47	Migration20240617102917	2026-09-23 14:24:00.413731+03
48	Migration20240624153824	2026-09-23 14:24:00.413731+03
49	Migration20241211061114	2026-09-23 14:24:00.413731+03
50	Migration20250113094144	2026-09-23 14:24:00.413731+03
51	Migration20250120110700	2026-09-23 14:24:00.413731+03
52	Migration20250226130616	2026-09-23 14:24:00.413731+03
53	Migration20250508081510	2026-09-23 14:24:00.413731+03
54	Migration20250828075407	2026-09-23 14:24:00.413731+03
55	Migration20250909083125	2026-09-23 14:24:00.413731+03
56	Migration20250916120552	2026-09-23 14:24:00.413731+03
57	Migration20250917143818	2026-09-23 14:24:00.413731+03
58	Migration20250919122137	2026-09-23 14:24:00.413731+03
59	Migration20251006000000	2026-09-23 14:24:00.413731+03
60	Migration20251015113934	2026-09-23 14:24:00.413731+03
61	Migration20251107050148	2026-09-23 14:24:00.413731+03
62	Migration20240124154000	2026-09-23 14:24:00.649401+03
63	Migration20240524123112	2026-09-23 14:24:00.649401+03
64	Migration20240602110946	2026-09-23 14:24:00.649401+03
65	Migration20241211074630	2026-09-23 14:24:00.649401+03
66	Migration20251010130829	2026-09-23 14:24:00.649401+03
67	Migration20240115152146	2026-09-23 14:24:00.797134+03
68	Migration20240222170223	2026-09-23 14:24:00.889203+03
69	Migration20240831125857	2026-09-23 14:24:00.889203+03
70	Migration20241106085918	2026-09-23 14:24:00.889203+03
71	Migration20241205095237	2026-09-23 14:24:00.889203+03
72	Migration20241216183049	2026-09-23 14:24:00.889203+03
73	Migration20241218091938	2026-09-23 14:24:00.889203+03
74	Migration20250120115059	2026-09-23 14:24:00.889203+03
75	Migration20250212131240	2026-09-23 14:24:00.889203+03
76	Migration20250326151602	2026-09-23 14:24:00.889203+03
77	Migration20250508081553	2026-09-23 14:24:00.889203+03
78	Migration20251017153909	2026-09-23 14:24:00.889203+03
79	Migration20251208130704	2026-09-23 14:24:00.889203+03
80	Migration20260626000000	2026-09-23 14:24:00.889203+03
81	Migration20240205173216	2026-09-23 14:24:01.119245+03
82	Migration20240624200006	2026-09-23 14:24:01.119245+03
83	Migration20250120110744	2026-09-23 14:24:01.119245+03
84	InitialSetup20240221144943	2026-09-23 14:24:01.237692+03
85	Migration20240604080145	2026-09-23 14:24:01.237692+03
86	Migration20241205122700	2026-09-23 14:24:01.237692+03
87	Migration20251015123842	2026-09-23 14:24:01.237692+03
88	InitialSetup20240227075933	2026-09-23 14:24:01.339203+03
89	Migration20240621145944	2026-09-23 14:24:01.339203+03
90	Migration20241206083313	2026-09-23 14:24:01.339203+03
91	Migration20251202184737	2026-09-23 14:24:01.339203+03
92	Migration20251212161429	2026-09-23 14:24:01.339203+03
93	Migration20240227090331	2026-09-23 14:24:01.598689+03
94	Migration20240710135844	2026-09-23 14:24:01.598689+03
95	Migration20240924114005	2026-09-23 14:24:01.598689+03
96	Migration20241212052837	2026-09-23 14:24:01.598689+03
97	InitialSetup20240228133303	2026-09-23 14:24:01.745491+03
98	Migration20240624082354	2026-09-23 14:24:01.745491+03
99	Migration20240225134525	2026-09-23 14:24:01.88378+03
100	Migration20240806072619	2026-09-23 14:24:01.88378+03
101	Migration20241211151053	2026-09-23 14:24:01.88378+03
102	Migration20250115160517	2026-09-23 14:24:01.88378+03
103	Migration20250120110552	2026-09-23 14:24:01.88378+03
104	Migration20250123122334	2026-09-23 14:24:01.88378+03
105	Migration20250206105639	2026-09-23 14:24:01.88378+03
106	Migration20250207132723	2026-09-23 14:24:01.88378+03
107	Migration20250625084134	2026-09-23 14:24:01.88378+03
108	Migration20250924135437	2026-09-23 14:24:01.88378+03
109	Migration20250929124701	2026-09-23 14:24:01.88378+03
110	Migration20260411223700	2026-09-23 14:24:01.88378+03
111	Migration20240219102530	2026-09-23 14:24:02.28482+03
112	Migration20240604100512	2026-09-23 14:24:02.28482+03
113	Migration20240715102100	2026-09-23 14:24:02.28482+03
114	Migration20240715174100	2026-09-23 14:24:02.28482+03
115	Migration20240716081800	2026-09-23 14:24:02.28482+03
116	Migration20240801085921	2026-09-23 14:24:02.28482+03
117	Migration20240821164505	2026-09-23 14:24:02.28482+03
118	Migration20240821170920	2026-09-23 14:24:02.28482+03
119	Migration20240827133639	2026-09-23 14:24:02.28482+03
120	Migration20240902195921	2026-09-23 14:24:02.28482+03
121	Migration20240913092514	2026-09-23 14:24:02.28482+03
122	Migration20240930122627	2026-09-23 14:24:02.28482+03
123	Migration20241014142943	2026-09-23 14:24:02.28482+03
124	Migration20241106085223	2026-09-23 14:24:02.28482+03
125	Migration20241129124827	2026-09-23 14:24:02.28482+03
126	Migration20241217162224	2026-09-23 14:24:02.28482+03
127	Migration20250326151554	2026-09-23 14:24:02.28482+03
128	Migration20250522181137	2026-09-23 14:24:02.28482+03
129	Migration20250702095353	2026-09-23 14:24:02.28482+03
130	Migration20250704120229	2026-09-23 14:24:02.28482+03
131	Migration20250910130000	2026-09-23 14:24:02.28482+03
132	Migration20251016160403	2026-09-23 14:24:02.28482+03
133	Migration20251016182939	2026-09-23 14:24:02.28482+03
134	Migration20251017155709	2026-09-23 14:24:02.28482+03
135	Migration20251114100559	2026-09-23 14:24:02.28482+03
136	Migration20251125164002	2026-09-23 14:24:02.28482+03
137	Migration20251210112909	2026-09-23 14:24:02.28482+03
138	Migration20251210112924	2026-09-23 14:24:02.28482+03
139	Migration20251225120947	2026-09-23 14:24:02.28482+03
140	Migration20260106185528	2026-09-23 14:24:02.28482+03
141	Migration20260625000000	2026-09-23 14:24:02.28482+03
142	Migration20260729154253	2026-09-23 14:24:02.28482+03
143	Migration20250717162007	2026-09-23 14:24:02.729774+03
144	Migration20260127081758	2026-09-23 14:24:02.729774+03
145	Migration20260615151246	2026-09-23 14:24:02.729774+03
146	Migration20240205025928	2026-09-23 14:24:02.851365+03
147	Migration20240529080336	2026-09-23 14:24:02.851365+03
148	Migration20241202100304	2026-09-23 14:24:02.851365+03
149	Migration20260514083900	2026-09-23 14:24:02.851365+03
150	Migration20260525090000	2026-09-23 14:24:02.851365+03
151	Migration20260604120000	2026-09-23 14:24:02.851365+03
152	Migration20260616075929	2026-09-23 14:24:02.851365+03
153	Migration20240214033943	2026-09-23 14:24:03.217567+03
154	Migration20240703095850	2026-09-23 14:24:03.217567+03
155	Migration20241202103352	2026-09-23 14:24:03.217567+03
156	Migration20240311145700_InitialSetupMigration	2026-09-23 14:24:03.436257+03
157	Migration20240821170957	2026-09-23 14:24:03.436257+03
158	Migration20240917161003	2026-09-23 14:24:03.436257+03
159	Migration20241217110416	2026-09-23 14:24:03.436257+03
160	Migration20250113122235	2026-09-23 14:24:03.436257+03
161	Migration20250120115002	2026-09-23 14:24:03.436257+03
162	Migration20250822130931	2026-09-23 14:24:03.436257+03
163	Migration20250825132614	2026-09-23 14:24:03.436257+03
164	Migration20251114133146	2026-09-23 14:24:03.436257+03
165	Migration20240509083918_InitialSetupMigration	2026-09-23 14:24:03.828209+03
166	Migration20240628075401	2026-09-23 14:24:03.828209+03
167	Migration20240830094712	2026-09-23 14:24:03.828209+03
168	Migration20250120110514	2026-09-23 14:24:03.828209+03
169	Migration20251028172715	2026-09-23 14:24:03.828209+03
170	Migration20251121123942	2026-09-23 14:24:03.828209+03
171	Migration20251121150408	2026-09-23 14:24:03.828209+03
172	Migration20260805085626	2026-09-23 14:24:04.041601+03
173	Migration20260903085616	2026-09-23 14:24:04.041601+03
174	Migration20260911115931	2026-09-23 14:24:04.041601+03
175	Migration20260807120000	2026-09-23 14:24:04.205833+03
176	Migration20231228143900	2026-09-23 14:24:04.470747+03
177	Migration20241206101446	2026-09-23 14:24:04.470747+03
178	Migration20250128174331	2026-09-23 14:24:04.470747+03
179	Migration20250505092459	2026-09-23 14:24:04.470747+03
180	Migration20250819104213	2026-09-23 14:24:04.470747+03
181	Migration20250819110924	2026-09-23 14:24:04.470747+03
182	Migration20250908080305	2026-09-23 14:24:04.470747+03
183	Migration20260923120401	2026-09-23 15:05:19.155196+03
\.


--
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notification (id, "to", channel, template, data, trigger_type, resource_id, resource_type, receiver_id, original_notification_id, idempotency_key, external_id, provider_id, created_at, updated_at, deleted_at, status, "from", provider_data) FROM stdin;
\.


--
-- Data for Name: notification_provider; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notification_provider (id, handle, name, is_enabled, channels, created_at, updated_at, deleted_at) FROM stdin;
local	local	local	t	{feed}	2026-09-23 14:24:07.561+03	2026-09-23 14:24:07.561+03	\N
\.


--
-- Data for Name: order; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."order" (id, region_id, display_id, customer_id, version, sales_channel_id, status, is_draft_order, email, currency_code, shipping_address_id, billing_address_id, no_notification, metadata, created_at, updated_at, deleted_at, canceled_at, custom_display_id, locale) FROM stdin;
\.


--
-- Data for Name: order_address; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_address (id, customer_id, company, first_name, last_name, address_1, address_2, city, country_code, province, postal_code, phone, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_cart; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_cart (order_id, cart_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_change; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_change (id, order_id, version, description, status, internal_note, created_by, requested_by, requested_at, confirmed_by, confirmed_at, declined_by, declined_reason, metadata, declined_at, canceled_by, canceled_at, created_at, updated_at, change_type, deleted_at, return_id, claim_id, exchange_id, carry_over_promotions, no_notification) FROM stdin;
\.


--
-- Data for Name: order_change_action; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_change_action (id, order_id, version, ordering, order_change_id, reference, reference_id, action, details, amount, raw_amount, internal_note, applied, created_at, updated_at, deleted_at, return_id, claim_id, exchange_id) FROM stdin;
\.


--
-- Data for Name: order_claim; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_claim (id, order_id, return_id, order_version, display_id, type, no_notification, refund_amount, raw_refund_amount, metadata, created_at, updated_at, deleted_at, canceled_at, created_by) FROM stdin;
\.


--
-- Data for Name: order_claim_item; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_claim_item (id, claim_id, item_id, is_additional_item, reason, quantity, raw_quantity, note, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_claim_item_image; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_claim_item_image (id, claim_item_id, url, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_credit_line; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_credit_line (id, order_id, reference, reference_id, amount, raw_amount, metadata, created_at, updated_at, deleted_at, version) FROM stdin;
\.


--
-- Data for Name: order_exchange; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_exchange (id, order_id, return_id, order_version, display_id, no_notification, allow_backorder, difference_due, raw_difference_due, metadata, created_at, updated_at, deleted_at, canceled_at, created_by) FROM stdin;
\.


--
-- Data for Name: order_exchange_item; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_exchange_item (id, exchange_id, item_id, quantity, raw_quantity, note, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_fulfillment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_fulfillment (order_id, fulfillment_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_item; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_item (id, order_id, version, item_id, quantity, raw_quantity, fulfilled_quantity, raw_fulfilled_quantity, shipped_quantity, raw_shipped_quantity, return_requested_quantity, raw_return_requested_quantity, return_received_quantity, raw_return_received_quantity, return_dismissed_quantity, raw_return_dismissed_quantity, written_off_quantity, raw_written_off_quantity, metadata, created_at, updated_at, deleted_at, delivered_quantity, raw_delivered_quantity, unit_price, raw_unit_price, compare_at_unit_price, raw_compare_at_unit_price) FROM stdin;
\.


--
-- Data for Name: order_line_item; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_line_item (id, totals_id, title, subtitle, thumbnail, variant_id, product_id, product_title, product_description, product_subtitle, product_type, product_collection, product_handle, variant_sku, variant_barcode, variant_title, variant_option_values, requires_shipping, is_discountable, is_tax_inclusive, compare_at_unit_price, raw_compare_at_unit_price, unit_price, raw_unit_price, metadata, created_at, updated_at, deleted_at, is_custom_price, product_type_id, is_giftcard) FROM stdin;
\.


--
-- Data for Name: order_line_item_adjustment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_line_item_adjustment (id, description, promotion_id, code, amount, raw_amount, provider_id, created_at, updated_at, item_id, deleted_at, is_tax_inclusive, version) FROM stdin;
\.


--
-- Data for Name: order_line_item_tax_line; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_line_item_tax_line (id, description, tax_rate_id, code, rate, raw_rate, provider_id, created_at, updated_at, item_id, deleted_at, metadata, data) FROM stdin;
\.


--
-- Data for Name: order_payment_collection; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_payment_collection (order_id, payment_collection_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_promotion; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_promotion (order_id, promotion_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_shipping; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_shipping (id, order_id, version, shipping_method_id, created_at, updated_at, deleted_at, return_id, claim_id, exchange_id) FROM stdin;
\.


--
-- Data for Name: order_shipping_method; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_shipping_method (id, name, description, amount, raw_amount, is_tax_inclusive, shipping_option_id, data, metadata, created_at, updated_at, deleted_at, is_custom_amount) FROM stdin;
\.


--
-- Data for Name: order_shipping_method_adjustment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_shipping_method_adjustment (id, description, promotion_id, code, amount, raw_amount, provider_id, created_at, updated_at, shipping_method_id, deleted_at, version) FROM stdin;
\.


--
-- Data for Name: order_shipping_method_tax_line; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_shipping_method_tax_line (id, description, tax_rate_id, code, rate, raw_rate, provider_id, created_at, updated_at, shipping_method_id, deleted_at, metadata, data) FROM stdin;
\.


--
-- Data for Name: order_summary; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_summary (id, order_id, version, totals, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_transaction; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_transaction (id, order_id, version, amount, raw_amount, currency_code, reference, reference_id, created_at, updated_at, deleted_at, return_id, claim_id, exchange_id) FROM stdin;
\.


--
-- Data for Name: payment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payment (id, amount, raw_amount, currency_code, provider_id, data, created_at, updated_at, deleted_at, captured_at, canceled_at, payment_collection_id, payment_session_id, metadata) FROM stdin;
\.


--
-- Data for Name: payment_collection; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payment_collection (id, currency_code, amount, raw_amount, authorized_amount, raw_authorized_amount, captured_amount, raw_captured_amount, refunded_amount, raw_refunded_amount, created_at, updated_at, deleted_at, completed_at, status, metadata) FROM stdin;
\.


--
-- Data for Name: payment_collection_payment_providers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payment_collection_payment_providers (payment_collection_id, payment_provider_id) FROM stdin;
\.


--
-- Data for Name: payment_provider; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payment_provider (id, is_enabled, created_at, updated_at, deleted_at) FROM stdin;
pp_system_default	t	2026-09-23 14:24:07.558+03	2026-09-23 14:24:07.558+03	\N
\.


--
-- Data for Name: payment_session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payment_session (id, currency_code, amount, raw_amount, provider_id, data, context, status, authorized_at, payment_collection_id, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: price; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.price (id, title, price_set_id, currency_code, raw_amount, rules_count, created_at, updated_at, deleted_at, price_list_id, amount, min_quantity, max_quantity, raw_min_quantity, raw_max_quantity) FROM stdin;
price_01M3704J81EQM491MM8G7SJ3JQ	\N	pset_01M3704J82C06PH5B4YE6MM695	try	{"value": "99.9", "precision": 20}	0	2026-09-23 14:24:11.394+03	2026-09-23 14:24:11.394+03	\N	\N	99.9	\N	\N	\N	\N
price_01M3704J81SWT6AY172KFYHXHQ	\N	pset_01M3704J82C06PH5B4YE6MM695	try	{"value": "0", "precision": 20}	1	2026-09-23 14:24:11.395+03	2026-09-23 14:24:11.395+03	\N	\N	0	\N	\N	\N	\N
price_01M3704J825WF5WV1FXY3R156D	\N	pset_01M3704J82C06PH5B4YE6MM695	try	{"value": "99.9", "precision": 20}	1	2026-09-23 14:24:11.395+03	2026-09-23 14:24:11.395+03	\N	\N	99.9	\N	\N	\N	\N
price_01M3704J82HPPF2A04Q0TFF198	\N	pset_01M3704J82C06PH5B4YE6MM695	try	{"value": "0", "precision": 20}	2	2026-09-23 14:24:11.395+03	2026-09-23 14:24:11.395+03	\N	\N	0	\N	\N	\N	\N
price_01M3704J82AF1SJNCPD8PE4N2F	\N	pset_01M3704J82V8NE16ERFSR0MB2Z	try	{"value": "149.9", "precision": 20}	0	2026-09-23 14:24:11.395+03	2026-09-23 14:24:11.395+03	\N	\N	149.9	\N	\N	\N	\N
price_01M3704J82CSDHM5SDYRKYGQ6Y	\N	pset_01M3704J82V8NE16ERFSR0MB2Z	try	{"value": "149.9", "precision": 20}	1	2026-09-23 14:24:11.395+03	2026-09-23 14:24:11.395+03	\N	\N	149.9	\N	\N	\N	\N
price_01M3704JKZVS03CYGVZJX9EBGA	\N	pset_01M3704JKZJXAZEMM2BAMBXA8Z	try	{"value": "3238.52", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	3238.52	\N	\N	\N	\N
price_01M3704JKZGVKXP3JJXQMA9K22	\N	pset_01M3704JKZXW2N40XTKE5M7XZB	try	{"value": "1249.5", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	1249.5	\N	\N	\N	\N
price_01M3704JKZHF7MK6M3C7DNFQ2R	\N	pset_01M3704JKZ8NHDG9EFJJ96KAZ4	try	{"value": "7043.48", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	7043.48	\N	\N	\N	\N
price_01M3704JKZKGH12CX44R6WFNYA	\N	pset_01M3704JKZF64N5VJPP8201A5D	try	{"value": "389.9", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	389.9	\N	\N	\N	\N
price_01M3704JKZS0S38NFCX49A9V8Y	\N	pset_01M3704JKZ2AQGZ03QHVH96JBP	try	{"value": "223.41", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	223.41	\N	\N	\N	\N
price_01M3704JM0075NRXFWKGWSF8BY	\N	pset_01M3704JM0DM9QTJ7W1SDFM0DQ	try	{"value": "449.9", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	449.9	\N	\N	\N	\N
price_01M3704JM0RSVSPAQ5BGF5DA08	\N	pset_01M3704JM02DQ8RB7YDBCHYWQZ	try	{"value": "186.88", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	186.88	\N	\N	\N	\N
price_01M3704JM0D6RRRMK2SHKZ6VGD	\N	pset_01M3704JM0577Q9DQGJ9ATG90C	try	{"value": "279", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	279	\N	\N	\N	\N
price_01M3704JM0N9NPRRWV71DRMXXK	\N	pset_01M3704JM08CXRN80R80KJ5AAW	try	{"value": "16461.54", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	16461.54	\N	\N	\N	\N
price_01M3704JM0HFAZEK88V89JWW0H	\N	pset_01M3704JM066BAR2A28TVTE1E3	try	{"value": "2670.73", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	2670.73	\N	\N	\N	\N
price_01M3704JM0N3YK9D45Q03KDFXS	\N	pset_01M3704JM07QT347TAAXCQJ3TW	try	{"value": "649.9", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	649.9	\N	\N	\N	\N
price_01M3704JM0JH5QSSG2XWDMEB1C	\N	pset_01M3704JM0BTHFAE9W2R9WM2HD	try	{"value": "8989.36", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	8989.36	\N	\N	\N	\N
price_01M3704JM07RD5R2GSQQD82CJT	\N	pset_01M3704JM0KQ79YPP3Q4B6B23A	try	{"value": "1569.65", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	1569.65	\N	\N	\N	\N
price_01M3704JM0EZASNZ8SZS3FHHMF	\N	pset_01M3704JM0A1AZXTX6A44JGJQF	try	{"value": "989", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	989	\N	\N	\N	\N
price_01M3704JM0420GV35E40MQ2WF6	\N	pset_01M3704JM0NN8MSH1Z96WP3294	try	{"value": "6100", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	6100	\N	\N	\N	\N
price_01M3704JM06WG4ZX2J49J1PC45	\N	pset_01M3704JM0286YRQ2B3CHXN5BH	try	{"value": "15178.57", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	15178.57	\N	\N	\N	\N
price_01M3704JM0HQCQKG1WJM0M0AG5	\N	pset_01M3704JM09X4QFNB3NPRYZCAY	try	{"value": "549.9", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	549.9	\N	\N	\N	\N
price_01M3704JM0ZZJ16BDQ94N6XG0P	\N	pset_01M3704JM04TRNSV83QH9Q8SKE	try	{"value": "1449.44", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	1449.44	\N	\N	\N	\N
price_01M3704JM08BCJC214YXM4EVJT	\N	pset_01M3704JM1M30ZGYEXQFS6WS5B	try	{"value": "519.87", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	519.87	\N	\N	\N	\N
price_01M3704JM1YNZAVSC1K0A3WFEA	\N	pset_01M3704JM16SH1K5YC1AJ3R2SQ	try	{"value": "1875", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	1875	\N	\N	\N	\N
price_01M3704JM18E8XQH53GPQ816ZE	\N	pset_01M3704JM1MTNTJ9QPP34MP397	try	{"value": "249.9", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	249.9	\N	\N	\N	\N
price_01M3704JM1XBVGVDEP06GZ1PY6	\N	pset_01M3704JM129NG1V85T6M5CAGK	try	{"value": "783.98", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	783.98	\N	\N	\N	\N
price_01M3704JM1GTQWS3JR0RKS7S2Y	\N	pset_01M3704JM1JTH430C4C2JP3Q7W	try	{"value": "10591.4", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	10591.4	\N	\N	\N	\N
price_01M3704JM1JGA5BQ1MJVEV7HTB	\N	pset_01M3704JM1X31CNP4VRBV4GP5X	try	{"value": "537.37", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	537.37	\N	\N	\N	\N
price_01M3704JM12371Q7AHW76DP435	\N	pset_01M3704JM1CF5SDHT0X1G0JK9T	try	{"value": "2223.53", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	2223.53	\N	\N	\N	\N
price_01M3704JM1KPDPNX8Q5MDVNB48	\N	pset_01M3704JM1FE51SC6J7CQ1Z3XC	try	{"value": "7211.11", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	7211.11	\N	\N	\N	\N
price_01M3704JM1VFNTH0CATM5GXMM4	\N	pset_01M3704JM10H1N3HJ4NJDJ68B0	try	{"value": "1450", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	1450	\N	\N	\N	\N
price_01M3704JM1FT0RPEH9VRDVV883	\N	pset_01M3704JM1TDDMS55346VHW0YF	try	{"value": "4012.2", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	4012.2	\N	\N	\N	\N
price_01M3704JM10FBXPX1R5DD6NH64	\N	pset_01M3704JM1G549K2D1QXPBQVK6	try	{"value": "1590", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	1590	\N	\N	\N	\N
price_01M3704JM1ZXBZJS32DNGCF830	\N	pset_01M3704JM1GGR4QRENDH45V1CC	try	{"value": "961.41", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	961.41	\N	\N	\N	\N
price_01M3704JM16DXDWY4SEEHD86QZ	\N	pset_01M3704JM1Q8A8HD1GAH0BM2C4	try	{"value": "2890", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	2890	\N	\N	\N	\N
price_01M3704JM14EXS72TJ9X7MJFGB	\N	pset_01M3704JM1DQ7MP94RKCXDBBX8	try	{"value": "1033.33", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	1033.33	\N	\N	\N	\N
price_01M3704JM1HJG1X0JFJARGZENM	\N	pset_01M3704JM2QEGVX57S3X4RFQSQ	try	{"value": "1249.9", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	1249.9	\N	\N	\N	\N
price_01M3704JM25NC0AANPHTJK88DD	\N	pset_01M3704JM2Z696YFCWBGJW5K2R	try	{"value": "2076.92", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	2076.92	\N	\N	\N	\N
price_01M3704JM2FKV773ZX34XAK703	\N	pset_01M3704JM2XFRAJVA73RD12ZCC	try	{"value": "4011.63", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	4011.63	\N	\N	\N	\N
price_01M3704JM2DDWZEHTPEC2SC7D8	\N	pset_01M3704JM21CXF8G10JNZJDG9H	try	{"value": "4290", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	4290	\N	\N	\N	\N
price_01M3704JM2WQT8CDKF4C53KJRT	\N	pset_01M3704JM2DVCCYDM3G2AWG9EB	try	{"value": "1890", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	1890	\N	\N	\N	\N
price_01M3704JM2KHSZ4WBBB6M9S3A3	\N	pset_01M3704JM2JD2W69TE2MRBAY9V	try	{"value": "519.87", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	519.87	\N	\N	\N	\N
price_01M3704JM27REB0XZRBFCS86ZD	\N	pset_01M3704JM22E1SHZRY7EZ4JT6A	try	{"value": "5380.43", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	5380.43	\N	\N	\N	\N
price_01M3704JM2H3XB6FV12QEKJZ7N	\N	pset_01M3704JM2F427TYZXX9BKAA8J	try	{"value": "749", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	749	\N	\N	\N	\N
price_01M3704JM272H8EP8X8D2P8PV2	\N	pset_01M3704JM2ZSJ8D4SCS5EV7590	try	{"value": "31837.71", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	31837.71	\N	\N	\N	\N
price_01M3704JM2AMYNQZ24S6ZNA4BY	\N	pset_01M3704JM2PXPDR62PZY4AJ2T4	try	{"value": "19174.92", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	19174.92	\N	\N	\N	\N
price_01M3704JM2A23W27TJ8GA3NZ3E	\N	pset_01M3704JM2XXSZPANJ2Z2TRWSD	try	{"value": "5556.82", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	5556.82	\N	\N	\N	\N
price_01M3704JM2S0YDC6X3PEN4BJRF	\N	pset_01M3704JM25FK31FG6RNJC27PH	try	{"value": "10576.47", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	10576.47	\N	\N	\N	\N
price_01M3704JM2ZP32BTXJTEE9AXX4	\N	pset_01M3704JM2YXQKDQY8EEY275WA	try	{"value": "1612.5", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	1612.5	\N	\N	\N	\N
price_01M3704JM2P93Y0FTS08WHRVMX	\N	pset_01M3704JM2N8SWSMSKXBQD8VB3	try	{"value": "549.9", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	549.9	\N	\N	\N	\N
price_01M3704JM3J0PMY642EJZ8709V	\N	pset_01M3704JM319ZX34A9K4NWHJ00	try	{"value": "289.9", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	289.9	\N	\N	\N	\N
price_01M3704JM30Q60RJH0D97PJWP6	\N	pset_01M3704JM35Z902A0BRK81P1C8	try	{"value": "5337.08", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	5337.08	\N	\N	\N	\N
price_01M3704JM34EH84QVJQM4X3S0X	\N	pset_01M3704JM3PCGSV651AENXCMBA	try	{"value": "1888.78", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	1888.78	\N	\N	\N	\N
price_01M3704JM3SHBVW9XZ7NDMA1QH	\N	pset_01M3704JM33S35063FNF9HB50T	try	{"value": "1290", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	1290	\N	\N	\N	\N
price_01M3704JM3RRNHWKSGYRXHJ33D	\N	pset_01M3704JM3PPQVMJ7CZNDYPXJ5	try	{"value": "374.89", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	374.89	\N	\N	\N	\N
price_01M3704JM3C9R93CYBEYS5VYG1	\N	pset_01M3704JM3TZ4KDTXC9PTX5PN2	try	{"value": "4322.22", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	4322.22	\N	\N	\N	\N
price_01M3704JM3D861TFP4B499Q4A2	\N	pset_01M3704JM310MSHTZ50PW5KXW4	try	{"value": "4250", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	4250	\N	\N	\N	\N
price_01M3704JM3X6JTC14YVKPR23B7	\N	pset_01M3704JM3TBJ3Z24WBF9TX02N	try	{"value": "4875", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	4875	\N	\N	\N	\N
price_01M3704JM3264TM1HN3GM7TJN7	\N	pset_01M3704JM3GFZ0E4493QXBHZG8	try	{"value": "1690", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	1690	\N	\N	\N	\N
price_01M3704JM3VQQMT0ACZNTKT63Y	\N	pset_01M3704JM3CMCGRS5EPD06NHW6	try	{"value": "833.22", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	833.22	\N	\N	\N	\N
price_01M3704JM3H51MA4AQKM15KYD6	\N	pset_01M3704JM3MNNP808QXN6QS7CY	try	{"value": "2450", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	2450	\N	\N	\N	\N
price_01M3704JM33A0NSX7NV4M5FFQ4	\N	pset_01M3704JM3V3Y5354KTXP03B12	try	{"value": "2576.47", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	2576.47	\N	\N	\N	\N
price_01M3704JM3J2XAS5MJTPFE4R4M	\N	pset_01M3704JM3AD62MZ7M7G2AQDD1	try	{"value": "44836.96", "precision": 20}	0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N	\N	44836.96	\N	\N	\N	\N
price_01M3704JPQKQS6ZFQG3GS0HWSD	\N	pset_01M3704JKZJXAZEMM2BAMBXA8Z	try	{"value": "2849.9", "precision": 20}	0	2026-09-23 14:24:11.865+03	2026-09-23 14:24:11.865+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	2849.9	\N	\N	\N	\N
price_01M3704JPQD91TCGJXX5T2PG4A	\N	pset_01M3704JKZ8NHDG9EFJJ96KAZ4	try	{"value": "6480", "precision": 20}	0	2026-09-23 14:24:11.865+03	2026-09-23 14:24:11.865+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	6480	\N	\N	\N	\N
price_01M3704JPQZ5YECGTG9TBBTWD5	\N	pset_01M3704JKZ2AQGZ03QHVH96JBP	try	{"value": "189.9", "precision": 20}	0	2026-09-23 14:24:11.865+03	2026-09-23 14:24:11.865+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	189.9	\N	\N	\N	\N
price_01M3704JPQ52SJ5SS9P1XN0KRK	\N	pset_01M3704JM02DQ8RB7YDBCHYWQZ	try	{"value": "149.5", "precision": 20}	0	2026-09-23 14:24:11.865+03	2026-09-23 14:24:11.865+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	149.5	\N	\N	\N	\N
price_01M3704JPQT82506ARF0CZJA8V	\N	pset_01M3704JM08CXRN80R80KJ5AAW	try	{"value": "14980", "precision": 20}	0	2026-09-23 14:24:11.865+03	2026-09-23 14:24:11.865+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	14980	\N	\N	\N	\N
price_01M3704JPQF6E1ZT5KEP293X8Q	\N	pset_01M3704JM066BAR2A28TVTE1E3	try	{"value": "2190", "precision": 20}	0	2026-09-23 14:24:11.865+03	2026-09-23 14:24:11.865+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	2190	\N	\N	\N	\N
price_01M3704JPQGYPDV5V8TB6DZ5KN	\N	pset_01M3704JM0BTHFAE9W2R9WM2HD	try	{"value": "8450", "precision": 20}	0	2026-09-23 14:24:11.865+03	2026-09-23 14:24:11.865+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	8450	\N	\N	\N	\N
price_01M3704JPQ8JH8K2PGKC93MWV0	\N	pset_01M3704JM0KQ79YPP3Q4B6B23A	try	{"value": "1349.9", "precision": 20}	0	2026-09-23 14:24:11.865+03	2026-09-23 14:24:11.865+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	1349.9	\N	\N	\N	\N
price_01M3704JPQRT9FX23B8NWHS5Y7	\N	pset_01M3704JM0NN8MSH1Z96WP3294	try	{"value": "5490", "precision": 20}	0	2026-09-23 14:24:11.865+03	2026-09-23 14:24:11.865+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	5490	\N	\N	\N	\N
price_01M3704JPQN7NN7ZCM96NJTJHM	\N	pset_01M3704JM0286YRQ2B3CHXN5BH	try	{"value": "12750", "precision": 20}	0	2026-09-23 14:24:11.865+03	2026-09-23 14:24:11.865+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	12750	\N	\N	\N	\N
price_01M3704JPQMXF3QZHA895C3DBJ	\N	pset_01M3704JM04TRNSV83QH9Q8SKE	try	{"value": "1290", "precision": 20}	0	2026-09-23 14:24:11.865+03	2026-09-23 14:24:11.865+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	1290	\N	\N	\N	\N
price_01M3704JPQX66Q0QWES1YMBFXG	\N	pset_01M3704JM1M30ZGYEXQFS6WS5B	try	{"value": "389.9", "precision": 20}	0	2026-09-23 14:24:11.865+03	2026-09-23 14:24:11.865+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	389.9	\N	\N	\N	\N
price_01M3704JPQXQSJN0T95SZM4FN6	\N	pset_01M3704JM129NG1V85T6M5CAGK	try	{"value": "689.9", "precision": 20}	0	2026-09-23 14:24:11.865+03	2026-09-23 14:24:11.865+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	689.9	\N	\N	\N	\N
price_01M3704JPRFDFBX4P3Y5J603YB	\N	pset_01M3704JM1JTH430C4C2JP3Q7W	try	{"value": "9850", "precision": 20}	0	2026-09-23 14:24:11.865+03	2026-09-23 14:24:11.865+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	9850	\N	\N	\N	\N
price_01M3704JPR0CC8YJNCC5BAWF03	\N	pset_01M3704JM1X31CNP4VRBV4GP5X	try	{"value": "429.9", "precision": 20}	0	2026-09-23 14:24:11.865+03	2026-09-23 14:24:11.865+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	429.9	\N	\N	\N	\N
price_01M3704JPRFD67D6CAN07ZYXD7	\N	pset_01M3704JM1CF5SDHT0X1G0JK9T	try	{"value": "1890", "precision": 20}	0	2026-09-23 14:24:11.865+03	2026-09-23 14:24:11.865+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	1890	\N	\N	\N	\N
price_01M3704JPRQHTBD1HJK35HMFQR	\N	pset_01M3704JM1FE51SC6J7CQ1Z3XC	try	{"value": "6490", "precision": 20}	0	2026-09-23 14:24:11.865+03	2026-09-23 14:24:11.865+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	6490	\N	\N	\N	\N
price_01M3704JPRSJ5NK19CFYFZVTBM	\N	pset_01M3704JM1TDDMS55346VHW0YF	try	{"value": "3290", "precision": 20}	0	2026-09-23 14:24:11.865+03	2026-09-23 14:24:11.865+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	3290	\N	\N	\N	\N
price_01M3704JPR8E874YKA2JDE8JAJ	\N	pset_01M3704JM1GGR4QRENDH45V1CC	try	{"value": "749.9", "precision": 20}	0	2026-09-23 14:24:11.865+03	2026-09-23 14:24:11.865+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	749.9	\N	\N	\N	\N
price_01M3704JPRRFMHT4CK5JM9S6WQ	\N	pset_01M3704JM1DQ7MP94RKCXDBBX8	try	{"value": "899", "precision": 20}	0	2026-09-23 14:24:11.865+03	2026-09-23 14:24:11.865+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	899	\N	\N	\N	\N
price_01M3704JPRXCGH2DGFPQT8JHCV	\N	pset_01M3704JM2Z696YFCWBGJW5K2R	try	{"value": "1890", "precision": 20}	0	2026-09-23 14:24:11.865+03	2026-09-23 14:24:11.865+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	1890	\N	\N	\N	\N
price_01M3704JPR120MK3FW6X9CN970	\N	pset_01M3704JM2XFRAJVA73RD12ZCC	try	{"value": "3450", "precision": 20}	0	2026-09-23 14:24:11.865+03	2026-09-23 14:24:11.865+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	3450	\N	\N	\N	\N
price_01M3704JPRSES83EVYG2VK3WYP	\N	pset_01M3704JM2JD2W69TE2MRBAY9V	try	{"value": "389.9", "precision": 20}	0	2026-09-23 14:24:11.865+03	2026-09-23 14:24:11.865+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	389.9	\N	\N	\N	\N
price_01M3704JPRKEKDHNHT0150T4WQ	\N	pset_01M3704JM22E1SHZRY7EZ4JT6A	try	{"value": "4950", "precision": 20}	0	2026-09-23 14:24:11.865+03	2026-09-23 14:24:11.865+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	4950	\N	\N	\N	\N
price_01M3704JPR1BFA4SKVVG85QRNE	\N	pset_01M3704JM2XXSZPANJ2Z2TRWSD	try	{"value": "4890", "precision": 20}	0	2026-09-23 14:24:11.866+03	2026-09-23 14:24:11.866+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	4890	\N	\N	\N	\N
price_01M3704JPR20EZ36E4SG7TS8Z5	\N	pset_01M3704JM25FK31FG6RNJC27PH	try	{"value": "8990", "precision": 20}	0	2026-09-23 14:24:11.866+03	2026-09-23 14:24:11.866+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	8990	\N	\N	\N	\N
price_01M3704JPRA5XE694KPFPXMQGZ	\N	pset_01M3704JM2YXQKDQY8EEY275WA	try	{"value": "1290", "precision": 20}	0	2026-09-23 14:24:11.866+03	2026-09-23 14:24:11.866+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	1290	\N	\N	\N	\N
price_01M3704JPR0CHK31R5J7R9YQAD	\N	pset_01M3704JM35Z902A0BRK81P1C8	try	{"value": "4750", "precision": 20}	0	2026-09-23 14:24:11.866+03	2026-09-23 14:24:11.866+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	4750	\N	\N	\N	\N
price_01M3704JPRDRJM44BG7HABTKYQ	\N	pset_01M3704JM3PCGSV651AENXCMBA	try	{"value": "1699.9", "precision": 20}	0	2026-09-23 14:24:11.866+03	2026-09-23 14:24:11.866+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	1699.9	\N	\N	\N	\N
price_01M3704JPRKMWRMFPWN8HFNN2Z	\N	pset_01M3704JM3PPQVMJ7CZNDYPXJ5	try	{"value": "329.9", "precision": 20}	0	2026-09-23 14:24:11.866+03	2026-09-23 14:24:11.866+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	329.9	\N	\N	\N	\N
price_01M3704JPRETXQKY2HK5WTRYZ3	\N	pset_01M3704JM3TZ4KDTXC9PTX5PN2	try	{"value": "3890", "precision": 20}	0	2026-09-23 14:24:11.866+03	2026-09-23 14:24:11.866+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	3890	\N	\N	\N	\N
price_01M3704JPRHVK734720WMJDY27	\N	pset_01M3704JM3TBJ3Z24WBF9TX02N	try	{"value": "4290", "precision": 20}	0	2026-09-23 14:24:11.866+03	2026-09-23 14:24:11.866+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	4290	\N	\N	\N	\N
price_01M3704JPRY77R1KZZG09490H9	\N	pset_01M3704JM3CMCGRS5EPD06NHW6	try	{"value": "749.9", "precision": 20}	0	2026-09-23 14:24:11.866+03	2026-09-23 14:24:11.866+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	749.9	\N	\N	\N	\N
price_01M3704JPRPDDKA3CGBBW3NDFT	\N	pset_01M3704JM3V3Y5354KTXP03B12	try	{"value": "2190", "precision": 20}	0	2026-09-23 14:24:11.866+03	2026-09-23 14:24:11.866+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	2190	\N	\N	\N	\N
price_01M3704JPRHKGPDQ9KP79XPQNK	\N	pset_01M3704JM3AD62MZ7M7G2AQDD1	try	{"value": "41250", "precision": 20}	0	2026-09-23 14:24:11.866+03	2026-09-23 14:24:11.866+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	41250	\N	\N	\N	\N
price_01M373HQN4YN6NXENGVYXSH7GW	\N	pset_01M373HQN45EFGN61XKPDMBF1F	try	{"value": "1399", "precision": 20}	0	2026-09-23 15:23:48.645+03	2026-09-23 15:23:57.858+03	2026-09-23 15:23:57.85+03	\N	1399	\N	\N	\N	\N
price_01M373HQXSGZWDYPNKQJDET1NK	\N	pset_01M373HQN45EFGN61XKPDMBF1F	try	{"value": "1199.9", "precision": 20}	0	2026-09-23 15:23:48.9189+03	2026-09-23 15:23:57.858+03	2026-09-23 15:23:57.85+03	plist_01M3704JPS4MJRQP516Y6035XF	1199.9	\N	\N	\N	\N
price_01M374VNC1QR03BKT4SXF1F75M	\N	pset_01M374VNC1RXC8RBVPPY5YFRN0	try	{"value": "1249", "precision": 20}	0	2026-09-23 15:46:42.562+03	2026-09-23 15:46:42.562+03	\N	\N	1249	\N	\N	\N	\N
price_01M374VNJPMQEGKHD4QJGJVW3F	\N	pset_01M374VNC1RXC8RBVPPY5YFRN0	try	{"value": "1200", "precision": 20}	0	2026-09-23 15:46:42.769462+03	2026-09-23 15:46:42.769462+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	1200	\N	\N	\N	\N
price_01M3704JPR3XNPE1T6V8W855WV	\N	pset_01M3704JM2ZSJ8D4SCS5EV7590	try	{"value": "29927.45", "precision": 20}	0	2026-09-23 14:24:11.865+03	2026-09-29 15:19:21.825+03	\N	plist_01M3704JPS4MJRQP516Y6035XF	29927.45	\N	\N	\N	\N
\.


--
-- Data for Name: price_list; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.price_list (id, status, starts_at, ends_at, rules_count, title, description, type, created_at, updated_at, deleted_at, metadata) FROM stdin;
plist_01M3704JPS4MJRQP516Y6035XF	active	\N	\N	0	İndirimli Fiyatlar	Katalogdaki indirimli ürünlerin satış fiyatları.	sale	2026-09-23 14:24:11.865+03	2026-09-23 14:24:11.865+03	\N	\N
\.


--
-- Data for Name: price_list_rule; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.price_list_rule (id, price_list_id, created_at, updated_at, deleted_at, value, attribute) FROM stdin;
\.


--
-- Data for Name: price_preference; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.price_preference (id, attribute, value, is_tax_inclusive, created_at, updated_at, deleted_at) FROM stdin;
prpref_01M3704J3J4NCQ1WXVDVR9MEMT	currency_code	try	t	2026-09-23 14:24:11.251+03	2026-09-23 14:24:11.251+03	\N
prpref_01M3704J4DFYZQ8BFJ491FRPSY	region_id	reg_01M3704J3SDN42VG9GH3108N5F	t	2026-09-23 14:24:11.277+03	2026-09-23 14:24:11.277+03	\N
\.


--
-- Data for Name: price_rule; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.price_rule (id, value, priority, price_id, created_at, updated_at, deleted_at, attribute, operator) FROM stdin;
prule_01M3704J81G51XMP741N134WT9	1000	0	price_01M3704J81SWT6AY172KFYHXHQ	2026-09-23 14:24:11.395+03	2026-09-23 14:24:11.395+03	\N	item_total	gte
prule_01M3704J823KGQFT0D08ZWAAT8	reg_01M3704J3SDN42VG9GH3108N5F	0	price_01M3704J825WF5WV1FXY3R156D	2026-09-23 14:24:11.395+03	2026-09-23 14:24:11.395+03	\N	region_id	eq
prule_01M3704J82MPEEFY8YSF1G71CM	reg_01M3704J3SDN42VG9GH3108N5F	0	price_01M3704J82HPPF2A04Q0TFF198	2026-09-23 14:24:11.395+03	2026-09-23 14:24:11.395+03	\N	region_id	eq
prule_01M3704J827T816NG4Y5E02C81	1000	0	price_01M3704J82HPPF2A04Q0TFF198	2026-09-23 14:24:11.395+03	2026-09-23 14:24:11.395+03	\N	item_total	gte
prule_01M3704J82Z0MA865A51CBVR9E	reg_01M3704J3SDN42VG9GH3108N5F	0	price_01M3704J82CSDHM5SDYRKYGQ6Y	2026-09-23 14:24:11.395+03	2026-09-23 14:24:11.395+03	\N	region_id	eq
\.


--
-- Data for Name: price_set; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.price_set (id, created_at, updated_at, deleted_at) FROM stdin;
pset_01M3704J82C06PH5B4YE6MM695	2026-09-23 14:24:11.394+03	2026-09-23 14:24:11.394+03	\N
pset_01M3704J82V8NE16ERFSR0MB2Z	2026-09-23 14:24:11.394+03	2026-09-23 14:24:11.394+03	\N
pset_01M3704JKZJXAZEMM2BAMBXA8Z	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JKZXW2N40XTKE5M7XZB	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JKZ8NHDG9EFJJ96KAZ4	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JKZF64N5VJPP8201A5D	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JKZ2AQGZ03QHVH96JBP	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM0DM9QTJ7W1SDFM0DQ	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM02DQ8RB7YDBCHYWQZ	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM0577Q9DQGJ9ATG90C	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM08CXRN80R80KJ5AAW	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM066BAR2A28TVTE1E3	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM07QT347TAAXCQJ3TW	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM0BTHFAE9W2R9WM2HD	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM0KQ79YPP3Q4B6B23A	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM0A1AZXTX6A44JGJQF	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM0NN8MSH1Z96WP3294	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM0286YRQ2B3CHXN5BH	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM09X4QFNB3NPRYZCAY	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM04TRNSV83QH9Q8SKE	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM1M30ZGYEXQFS6WS5B	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM16SH1K5YC1AJ3R2SQ	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM1MTNTJ9QPP34MP397	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM129NG1V85T6M5CAGK	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM1JTH430C4C2JP3Q7W	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM1X31CNP4VRBV4GP5X	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM1CF5SDHT0X1G0JK9T	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM1FE51SC6J7CQ1Z3XC	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM10H1N3HJ4NJDJ68B0	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM1TDDMS55346VHW0YF	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM1G549K2D1QXPBQVK6	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM1GGR4QRENDH45V1CC	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM1Q8A8HD1GAH0BM2C4	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM1DQ7MP94RKCXDBBX8	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM2QEGVX57S3X4RFQSQ	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM2Z696YFCWBGJW5K2R	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM2XFRAJVA73RD12ZCC	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM21CXF8G10JNZJDG9H	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM2DVCCYDM3G2AWG9EB	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM2JD2W69TE2MRBAY9V	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM22E1SHZRY7EZ4JT6A	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM2F427TYZXX9BKAA8J	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM2ZSJ8D4SCS5EV7590	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM2PXPDR62PZY4AJ2T4	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM2XXSZPANJ2Z2TRWSD	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM25FK31FG6RNJC27PH	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM2YXQKDQY8EEY275WA	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM2N8SWSMSKXBQD8VB3	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM319ZX34A9K4NWHJ00	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM35Z902A0BRK81P1C8	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM3PCGSV651AENXCMBA	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM33S35063FNF9HB50T	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM3PPQVMJ7CZNDYPXJ5	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM3TZ4KDTXC9PTX5PN2	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM310MSHTZ50PW5KXW4	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM3TBJ3Z24WBF9TX02N	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM3GFZ0E4493QXBHZG8	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM3CMCGRS5EPD06NHW6	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM3MNNP808QXN6QS7CY	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM3V3Y5354KTXP03B12	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M3704JM3AD62MZ7M7G2AQDD1	2026-09-23 14:24:11.78+03	2026-09-23 14:24:11.78+03	\N
pset_01M373HQN45EFGN61XKPDMBF1F	2026-09-23 15:23:48.645+03	2026-09-23 15:23:57.85+03	2026-09-23 15:23:57.85+03
pset_01M374VNC1RXC8RBVPPY5YFRN0	2026-09-23 15:46:42.561+03	2026-09-23 15:46:42.561+03	\N
\.


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product (id, title, handle, subtitle, description, is_giftcard, status, thumbnail, weight, length, height, width, origin_country, hs_code, mid_code, material, collection_id, type_id, discountable, external_id, created_at, updated_at, deleted_at, metadata) FROM stdin;
prod_01M3704JBCZ0QP0926CX9BKP16	Orbisat OR-9500 4K Ultra HD Uydu Alıcısı Wi-Fi Destekli	orbisat-or-9500-4k-ultra-hd-uydu-alicisi-wi-fi-destekli	\N	\N	f	published	http://localhost:3100/mock/products/receiver-graphite.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA8RQNT0QSXPCHK4HBF	\N	t	\N	2026-09-23 14:24:11.528+03	2026-09-23 14:24:11.528+03	\N	{"badge": "yeni", "brand": "Orbisat", "legacy_id": "p-001", "instalment": true}
prod_01M3704JBCWEXHNS4YZFR9HJAY	Orbisat OR-7200 Full HD Mini Uydu Alıcısı USB Kayıt	orbisat-or-7200-full-hd-mini-uydu-alicisi-usb-kayit	\N	\N	f	published	http://localhost:3100/mock/products/receiver-black.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA8RQNT0QSXPCHK4HBF	\N	t	\N	2026-09-23 14:24:11.528+03	2026-09-23 14:24:11.528+03	\N	{"brand": "Orbisat", "legacy_id": "p-002", "instalment": true}
prod_01M3704JBCDCPWAV799W5MDB2Q	Antenix AX-4400 Kaskatlı Uydu Santrali 4 Çıkışlı	antenix-ax-4400-kaskatli-uydu-santrali-4-cikisli	\N	\N	f	published	http://localhost:3100/mock/products/receiver-silver.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA8XZGPYWRD3V9WHDMM	\N	t	\N	2026-09-23 14:24:11.528+03	2026-09-23 14:24:11.528+03	\N	{"brand": "Antenix", "legacy_id": "p-003", "instalment": true}
prod_01M3704JBCPV1Q5RTFKHRY4GX1	Antenix AX-120 Single LNB 0.1dB Gürültü Seviyesi	antenix-ax-120-single-lnb-0-1db-gurultu-seviyesi	\N	\N	f	published	http://localhost:3100/mock/products/receiver-white.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA8XZGPYWRD3V9WHDMM	\N	t	\N	2026-09-23 14:24:11.528+03	2026-09-23 14:24:11.528+03	\N	{"brand": "Antenix", "legacy_id": "p-004", "instalment": false}
prod_01M3704JBCJYZMXNJ2CS7S43DB	Kumandax KX-500 Universal Uydu Alıcı Kumandası	kumandax-kx-500-universal-uydu-alici-kumandasi	\N	\N	f	published	http://localhost:3100/mock/products/remote-black.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9SA77AN23Z9G1QTCH	\N	t	\N	2026-09-23 14:24:11.528+03	2026-09-23 14:24:11.528+03	\N	{"brand": "Kumandax", "legacy_id": "p-005", "instalment": false}
prod_01M3704JBCZEA31BTY6SM3N08F	Kumandax KX-780 Akıllı TV Kumandası Sesli Komut	kumandax-kx-780-akilli-tv-kumandasi-sesli-komut	\N	\N	f	published	http://localhost:3100/mock/products/remote-graphite.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9SA77AN23Z9G1QTCH	\N	t	\N	2026-09-23 14:24:11.528+03	2026-09-23 14:24:11.528+03	\N	{"brand": "Kumandax", "legacy_id": "p-006", "instalment": false}
prod_01M3704JBCBD3VXS7HH1HDG4S9	Kumandax KX-210 Klima Kumandası Çok Markalı	kumandax-kx-210-klima-kumandasi-cok-markali	\N	\N	f	published	http://localhost:3100/mock/products/acremote-white.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9SA77AN23Z9G1QTCH	\N	t	\N	2026-09-23 14:24:11.528+03	2026-09-23 14:24:11.528+03	\N	{"badge": "super-firsat", "brand": "Kumandax", "legacy_id": "p-007", "instalment": false}
prod_01M3704JBC0YEWMERTH5QW3DNK	Vizyontek VT-330 Android TV Box Kumanda Seti	vizyontek-vt-330-android-tv-box-kumanda-seti	\N	\N	f	published	http://localhost:3100/mock/products/remote-white.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9PBSRPM9XPG0NPW8E	\N	t	\N	2026-09-23 14:24:11.528+03	2026-09-23 14:24:11.528+03	\N	{"badge": "cok-satan", "brand": "Vizyontek", "legacy_id": "p-008", "instalment": false}
prod_01M3704JBCDPQX120JDNWVFR6W	Sonora SN-1500 15" 1000W Aktif Kabin Hoparlör	sonora-sn-1500-15-1000w-aktif-kabin-hoparlor	\N	\N	f	published	http://localhost:3100/mock/products/speaker-black.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA99V1GY15WQ9G14880	\N	t	\N	2026-09-23 14:24:11.528+03	2026-09-23 14:24:11.528+03	\N	{"brand": "Sonora", "legacy_id": "p-009", "instalment": true}
prod_01M3704JBCDH6HRQE2QB4NV2QZ	Sonora SN-820 Bluetooth Taşınabilir Hoparlör 60W	sonora-sn-820-bluetooth-tasinabilir-hoparlor-60w	\N	\N	f	published	http://localhost:3100/mock/products/speaker-graphite.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA99V1GY15WQ9G14880	\N	t	\N	2026-09-23 14:24:11.528+03	2026-09-23 14:24:11.528+03	\N	{"badge": "super-firsat", "brand": "Sonora", "legacy_id": "p-010", "instalment": true}
prod_01M3704JBC53GPRKB7AMPF4Z8W	Sesyapı SY-40 Tavan Hoparlörü 6" 40W Beyaz	sesyapi-sy-40-tavan-hoparloru-6-40w-beyaz	\N	\N	f	published	http://localhost:3100/mock/products/speaker-white.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA96PR1P44TGXV4KNWK	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"brand": "Sesyapı", "legacy_id": "p-011", "instalment": true}
prod_01M3704JBC9ZWFD2XRVPFF74PA	Sesyapı SY-2400 Anfi ve Mikser 240W 4 Kanal	sesyapi-sy-2400-anfi-ve-mikser-240w-4-kanal	\N	\N	f	published	http://localhost:3100/mock/products/speaker-silver.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA96PR1P44TGXV4KNWK	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"brand": "Sesyapı", "legacy_id": "p-012", "instalment": true}
prod_01M3704JBCKGW9QKMX6ET5A9MW	Fotokam FK-8200 5MP AHD Bullet Güvenlik Kamerası	fotokam-fk-8200-5mp-ahd-bullet-guvenlik-kamerasi	\N	\N	f	published	http://localhost:3100/mock/products/camera-white.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9XY13S3XMR7HXJRTP	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"brand": "Fotokam", "legacy_id": "p-013", "instalment": true}
prod_01M3704JBCZW219742T87QVVWC	Fotokam FK-360 Wi-Fi İç Mekan Kamera 360° Hareketli	fotokam-fk-360-wi-fi-i-c-mekan-kamera-360-hareketli	\N	\N	f	published	http://localhost:3100/mock/products/camera-graphite.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9XY13S3XMR7HXJRTP	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"brand": "Fotokam", "legacy_id": "p-014", "instalment": true}
prod_01M3704JBCH0JEA9V57VGQSY2H	Provista PV-16 16 Kanal AHD Kayıt Cihazı 5MP	provista-pv-16-16-kanal-ahd-kayit-cihazi-5mp	\N	\N	f	published	http://localhost:3100/mock/products/nvr-black.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9MW26QT2PV4P4PWH6	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"badge": "cok-satan", "brand": "Provista", "legacy_id": "p-015", "instalment": true}
prod_01M3704JBCG7P88J5C6V2QN81N	Provista PV-KIT4 4 Kameralı Güvenlik Seti Harddisk Dahil	provista-pv-kit4-4-kamerali-guvenlik-seti-harddisk-dahil	\N	\N	f	published	http://localhost:3100/mock/products/camera-silver.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9MW26QT2PV4P4PWH6	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"brand": "Provista", "legacy_id": "p-016", "instalment": true}
prod_01M3704JBCRST6DA5ZZWGCN0KW	Ledora LD-3228 32" Televizyon Led Bar Takımı	ledora-ld-3228-32-televizyon-led-bar-takimi	\N	\N	f	published	http://localhost:3100/mock/products/ledbar-silver.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9VJF8BYVHSSXE7787	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"brand": "Ledora", "legacy_id": "p-017", "instalment": true}
prod_01M3704JBC3HDVBT8BGS9QSXPE	Ledora LD-5540 55" Televizyon Led Bar Takımı 4K Panel	ledora-ld-5540-55-televizyon-led-bar-takimi-4k-panel	\N	\N	f	published	http://localhost:3100/mock/products/ledbar-white.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9VJF8BYVHSSXE7787	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"brand": "Ledora", "legacy_id": "p-018", "instalment": true}
prod_01M3704JBCZSBGK4N9DPAEGKK6	Lumenta LM-5050 Şerit Led 5 Metre RGB Kumandalı	lumenta-lm-5050-serit-led-5-metre-rgb-kumandali	\N	\N	f	published	http://localhost:3100/mock/products/ledbar-graphite.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA93Y06CPN7P6H9M2RJ	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"badge": "super-firsat", "brand": "Lumenta", "legacy_id": "p-019", "instalment": false}
prod_01M3704JBCCTJJEB35F869JJ4S	Lumenta LM-P10 P10 Led Panel Kontrol Kartı	lumenta-lm-p10-p10-led-panel-kontrol-karti	\N	\N	f	published	http://localhost:3100/mock/products/ledbar-black.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA93Y06CPN7P6H9M2RJ	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"brand": "Lumenta", "legacy_id": "p-020", "instalment": true}
prod_01M3704JBCFNJER548XVG0FJY2	Powerin PW-1220 12V 2A Adaptör Fişli Güç Kaynağı	powerin-pw-1220-12v-2a-adaptor-fisli-guc-kaynagi	\N	\N	f	published	http://localhost:3100/mock/products/adapter-black.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9RCN6B917WBHDTA5Y	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"brand": "Powerin", "legacy_id": "p-021", "instalment": false}
prod_01M3704JBC7GVJT1NVWQHXACTH	Powerin PW-19653 19V 6.53A Notebook Adaptörü	powerin-pw-19653-19v-6-53a-notebook-adaptoru	\N	\N	f	published	http://localhost:3100/mock/products/adapter-graphite.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9RCN6B917WBHDTA5Y	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"badge": "cok-satan", "brand": "Powerin", "legacy_id": "p-022", "instalment": true}
prod_01M3704JBC55PJJQBNQXPZTS6G	Bataryam BT-100 12V 100Ah Jel Akü Derin Döngü	bataryam-bt-100-12v-100ah-jel-aku-derin-dongu	\N	\N	f	published	http://localhost:3100/mock/products/battery-silver.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9MPVHXXB9KFC3KTHK	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"brand": "Bataryam", "legacy_id": "p-023", "instalment": true}
prod_01M3704JBC39NJ7X4SYRYGEQDR	Bataryam BT-18650 Şarj Edilebilir Li-ion Pil 6lı Set	bataryam-bt-18650-sarj-edilebilir-li-ion-pil-6li-set	\N	\N	f	published	http://localhost:3100/mock/products/battery-white.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9MPVHXXB9KFC3KTHK	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"badge": "super-firsat", "brand": "Bataryam", "legacy_id": "p-024", "instalment": false}
prod_01M3704JBCDV7X5ZD399RBPM50	Voltra VT-7010 Oto Teyp Bluetooth USB 4x60W	voltra-vt-7010-oto-teyp-bluetooth-usb-4x60w	\N	\N	f	published	http://localhost:3100/mock/products/headunit-black.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA92R87JGHW60H9KZ28	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"brand": "Voltra", "legacy_id": "p-025", "instalment": true}
prod_01M3704JBCBAHRF99HDEMCCPER	Voltra VT-9200 7" Dokunmatik Oto Multimedya CarPlay	voltra-vt-9200-7-dokunmatik-oto-multimedya-carplay	\N	\N	f	published	http://localhost:3100/mock/products/headunit-graphite.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA92R87JGHW60H9KZ28	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"brand": "Voltra", "legacy_id": "p-026", "instalment": true}
prod_01M3704JBC1SP3M5ZRW05WXB7P	Voltra VT-CAM1 Araç İçi Kayıt Kamerası Full HD	voltra-vt-cam1-arac-i-ci-kayit-kamerasi-full-hd	\N	\N	f	published	http://localhost:3100/mock/products/camera-black.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA92R87JGHW60H9KZ28	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"brand": "Voltra", "legacy_id": "p-027", "instalment": true}
prod_01M3704JBCBCR24HBQVGXA0AZG	Sinyalis SG-40 Oto Anfi 4 Kanal 800W	sinyalis-sg-40-oto-anfi-4-kanal-800w	\N	\N	f	published	http://localhost:3100/mock/products/headunit-white.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9038YG4YEVWVVG095	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"badge": "super-firsat", "brand": "Sinyalis", "legacy_id": "p-028", "instalment": true}
prod_01M3704JBCNXYR2DT3E3TW1SQF	Nexora NX-AC1200 Dual Band Access Point Router	nexora-nx-ac1200-dual-band-access-point-router	\N	\N	f	published	http://localhost:3100/mock/products/router-white.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9K1PDEPYJ1JFBZDGR	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"badge": "cok-satan", "brand": "Nexora", "legacy_id": "p-029", "instalment": true}
prod_01M3704JBCV564EK2V1F4R3AQC	Nexora NX-300 ADSL Modem 4 Port Wi-Fi N300	nexora-nx-300-adsl-modem-4-port-wi-fi-n300	\N	\N	f	published	http://localhost:3100/mock/products/router-graphite.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9K1PDEPYJ1JFBZDGR	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"badge": "super-firsat", "brand": "Nexora", "legacy_id": "p-030", "instalment": true}
prod_01M3704JBCMQTBNWRZGEC73B0K	Digiwave DW-POE8 8 Port PoE Switch Gigabit	digiwave-dw-poe8-8-port-poe-switch-gigabit	\N	\N	f	published	http://localhost:3100/mock/products/router-black.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9ZWBGHE1ST72PJNWZ	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"brand": "Digiwave", "legacy_id": "p-031", "instalment": true}
prod_01M3704JBC1NDGX04H6ZDMP2WD	Digiwave DW-EXT Menzil Genişletici Wi-Fi 6	digiwave-dw-ext-menzil-genisletici-wi-fi-6	\N	\N	f	published	http://localhost:3100/mock/products/router-silver.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9ZWBGHE1ST72PJNWZ	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"brand": "Digiwave", "legacy_id": "p-032", "instalment": true}
prod_01M3704JBCXBV13KW3A3MP20DB	Metrion MT-890 Dijital Multimetre True RMS	metrion-mt-890-dijital-multimetre-true-rms	\N	\N	f	published	http://localhost:3100/mock/products/meter-graphite.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA92GPJHPN03NBXQKPS	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"brand": "Metrion", "legacy_id": "p-033", "instalment": true}
prod_01M3704JBC46SCQVGHC69CRN5B	Metrion MT-330 Pens Ampermetre AC/DC 600A	metrion-mt-330-pens-ampermetre-ac-dc-600a	\N	\N	f	published	http://localhost:3100/mock/products/meter-black.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA92GPJHPN03NBXQKPS	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"brand": "Metrion", "legacy_id": "p-034", "instalment": true}
prod_01M3704JBCQRVN3RCNR0NRMAHV	Devrelab DL-858 Sıcak Hava Havya İstasyonu 700W	devrelab-dl-858-sicak-hava-havya-i-stasyonu-700w	\N	\N	f	published	http://localhost:3100/mock/products/meter-silver.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9EA651W9J4F75WYGJ	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"brand": "Devrelab", "legacy_id": "p-035", "instalment": true}
prod_01M3704JBC20RM7KAAK0W787NZ	Devrelab DL-PSU30 Ayarlı Güç Kaynağı 30V 5A	devrelab-dl-psu30-ayarli-guc-kaynagi-30v-5a	\N	\N	f	published	http://localhost:3100/mock/products/meter-white.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9EA651W9J4F75WYGJ	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"badge": "cok-satan", "brand": "Devrelab", "legacy_id": "p-036", "instalment": true}
prod_01M3704JBCGTS51DVBBH9T7DAA	Cabletek CT-RG6 RG6 U6 Anten Kablosu 100 Metre	cabletek-ct-rg6-rg6-u6-anten-kablosu-100-metre	\N	\N	f	published	http://localhost:3100/mock/products/cable-black.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9CZMMKM7568MDY3AH	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"badge": "yeni", "brand": "Cabletek", "legacy_id": "p-037", "instalment": true}
prod_01M3704JBC48SG8WC48C3DF4FG	Cabletek CT-HDMI21 HDMI 2.1 Kablo 8K 3 Metre	cabletek-ct-hdmi21-hdmi-2-1-kablo-8k-3-metre	\N	\N	f	published	http://localhost:3100/mock/products/cable-graphite.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9CZMMKM7568MDY3AH	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"badge": "super-firsat", "brand": "Cabletek", "legacy_id": "p-038", "instalment": false}
prod_01M3704JBCG873HZHMK2J79AWB	Kablonis KB-CAT6 Cat6 UTP Ağ Kablosu 305m Makara	kablonis-kb-cat6-cat6-utp-ag-kablosu-305m-makara	\N	\N	f	published	http://localhost:3100/mock/products/cable-silver.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9D5BBZ7MKD59VRDR2	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"brand": "Kablonis", "legacy_id": "p-039", "instalment": true}
prod_01M3704JBCVV7WP033B2FAV3EF	Kablonis KB-ALARM 6x0.22 Alarm Kablosu 100 Metre	kablonis-kb-alarm-6x0-22-alarm-kablosu-100-metre	\N	\N	f	published	http://localhost:3100/mock/products/cable-white.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9D5BBZ7MKD59VRDR2	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"brand": "Kablonis", "legacy_id": "p-040", "instalment": true}
prod_01M3704JBDY5T4BNC6R1RR3V8E	Tekniva TK-24AIO 24" All In One Bilgisayar i5 8GB 256GB	tekniva-tk-24aio-24-all-in-one-bilgisayar-i5-8gb-256gb	\N	\N	f	published	http://localhost:3100/mock/products/aio-silver.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9SZY85MB10WH3JFKZ	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"brand": "Tekniva", "legacy_id": "p-042", "instalment": true}
prod_01M3704JBDHB882SB9JM6H9V3N	Tekniva TK-22MON 22" Full HD Monitör IPS 100Hz	tekniva-tk-22mon-22-full-hd-monitor-ips-100hz	\N	\N	f	published	http://localhost:3100/mock/products/monitor-graphite.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9SZY85MB10WH3JFKZ	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"badge": "cok-satan", "brand": "Tekniva", "legacy_id": "p-043", "instalment": true}
prod_01M3704JBD8NS1N27SP4Z0GEX9	Optivolt OV-32SM 32" Smart Led TV HD Wi-Fi	optivolt-ov-32sm-32-smart-led-tv-hd-wi-fi	\N	\N	f	published	http://localhost:3100/mock/products/monitor-black.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA93GBKNXYJ6BXPRSCD	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"brand": "Optivolt", "legacy_id": "p-044", "instalment": true}
prod_01M3704JBDV13SJWHGPQB6FTK9	Tamirix TX-120 Elektronik Tamir Seti 120 Parça	tamirix-tx-120-elektronik-tamir-seti-120-parca	\N	\N	f	published	http://localhost:3100/mock/products/meter-graphite.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9K2QB53G4A6HCWS4C	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"badge": "super-firsat", "brand": "Tamirix", "legacy_id": "p-045", "instalment": true}
prod_01M3704JBDMYMEN5T7R3ZJGZV4	Tamirix TX-LED Fener ve Işıldak Şarjlı 1200 Lümen	tamirix-tx-led-fener-ve-isildak-sarjli-1200-lumen	\N	\N	f	published	http://localhost:3100/mock/products/adapter-silver.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9K2QB53G4A6HCWS4C	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"badge": "yeni", "brand": "Tamirix", "legacy_id": "p-046", "instalment": true}
prod_01M3704JBD2AF9D2XX6AZM5MR0	Servisan SV-ABS ABS Plastik Kutu Seti 10 Adet	servisan-sv-abs-abs-plastik-kutu-seti-10-adet	\N	\N	f	published	http://localhost:3100/mock/products/adapter-white.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA93SB55QEQQ15W1GNV	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"brand": "Servisan", "legacy_id": "p-047", "instalment": false}
prod_01M3704JBDQ9WM8EBJJ8QCCKZ1	Megavolt MV-INV2000 İnvertör 12V 2000W Modifiye Sinüs	megavolt-mv-inv2000-i-nvertor-12v-2000w-modifiye-sinus	\N	\N	f	published	http://localhost:3100/mock/products/adapter-graphite.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9N29RVBQE5XNFSQDY	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"brand": "Megavolt", "legacy_id": "p-048", "instalment": true}
prod_01M3704JBDHDCAZAN36GTYS4YY	Orbisat OR-3100 HD Uydu Alıcısı Ethernet Portlu	orbisat-or-3100-hd-uydu-alicisi-ethernet-portlu	\N	\N	f	published	http://localhost:3100/mock/products/receiver-silver.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA8RQNT0QSXPCHK4HBF	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-23 14:24:11.529+03	\N	{"brand": "Orbisat", "legacy_id": "p-049", "instalment": true}
prod_01M3704JBDAVYAFMG8QYT8P3AF	Orbisat OR-90 90cm Ofset Çanak Anten Seti LNB Dahil	orbisat-or-90-90cm-ofset-canak-anten-seti-lnb-dahil	\N	\N	f	published	http://localhost:3100/mock/products/dish-white.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA8RQNT0QSXPCHK4HBF	\N	t	\N	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N	{"badge": "cok-satan", "brand": "Orbisat", "legacy_id": "p-050", "instalment": true}
prod_01M3704JBDNSH2EKX4026MTGFC	Kumandax KX-900 Öğrenmeli Universal Kumanda 8 Cihaz	kumandax-kx-900-ogrenmeli-universal-kumanda-8-cihaz	\N	\N	f	published	http://localhost:3100/mock/products/remote-white.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9SA77AN23Z9G1QTCH	\N	t	\N	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N	{"brand": "Kumandax", "legacy_id": "p-051", "instalment": false}
prod_01M3704JBD9WQG3QSMZ4Z5H80J	Sonora SN-300 Kolon Hoparlör 120W Çift Yönlü	sonora-sn-300-kolon-hoparlor-120w-cift-yonlu	\N	\N	f	published	http://localhost:3100/mock/products/column-white.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA99V1GY15WQ9G14880	\N	t	\N	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N	{"brand": "Sonora", "legacy_id": "p-052", "instalment": true}
prod_01M3704JBDK4NTGGANMJQV51Y9	Sonora SN-950 Aktif Kabin Hoparlör 12" 600W	sonora-sn-950-aktif-kabin-hoparlor-12-600w	\N	\N	f	published	http://localhost:3100/mock/products/speaker-silver.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA99V1GY15WQ9G14880	\N	t	\N	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N	{"brand": "Sonora", "legacy_id": "p-053", "instalment": true}
prod_01M3704JBD714MY8QY02RVEBFE	Provista PV-8 8 Kanal NVR IP Kayıt Cihazı 4K	provista-pv-8-8-kanal-nvr-ip-kayit-cihazi-4k	\N	\N	f	published	http://localhost:3100/mock/products/nvr-white.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9MW26QT2PV4P4PWH6	\N	t	\N	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N	{"brand": "Provista", "legacy_id": "p-054", "instalment": true}
prod_01M3704JBDZBTN971SS3T5QE9B	Provista PV-DOME3 3MP IP Dome Kamera Gece Görüşlü	provista-pv-dome3-3mp-ip-dome-kamera-gece-goruslu	\N	\N	f	published	http://localhost:3100/mock/products/dome-graphite.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9MW26QT2PV4P4PWH6	\N	t	\N	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N	{"badge": "yeni", "brand": "Provista", "legacy_id": "p-055", "instalment": true}
prod_01M3704JBDVQB3Z6K9KCEJ3A04	Ledora LD-4332 43" Televizyon Led Bar Takımı	ledora-ld-4332-43-televizyon-led-bar-takimi	\N	\N	f	published	http://localhost:3100/mock/products/ledbar-graphite.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9VJF8BYVHSSXE7787	\N	t	\N	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N	{"brand": "Ledora", "legacy_id": "p-056", "instalment": true}
prod_01M3704JBD3M2D2V9RRKJ6D1X1	Ledora LD-TEST Led Bar Test Cihazı 0-300V Dokunmatik	ledora-ld-test-led-bar-test-cihazi-0-300v-dokunmatik	\N	\N	f	published	http://localhost:3100/mock/products/meter-white.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9VJF8BYVHSSXE7787	\N	t	\N	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N	{"badge": "cok-satan", "brand": "Ledora", "legacy_id": "p-057", "instalment": true}
prod_01M3704JBDYP8E9YQ1RV6KX70W	Voltra VT-6100 Oto Multimedya Ekranı 9" Android	voltra-vt-6100-oto-multimedya-ekrani-9-android	\N	\N	f	published	http://localhost:3100/mock/products/headunit-white.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA92R87JGHW60H9KZ28	\N	t	\N	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N	{"brand": "Voltra", "legacy_id": "p-058", "instalment": true}
prod_01M3704JBD9E0E0PRHYVHS3MZR	Tekniva TK-32AIO 32" All In One Bilgisayar i9 32GB 1TB	tekniva-tk-32aio-32-all-in-one-bilgisayar-i9-32gb-1tb	\N	\N	f	published	http://localhost:3100/mock/products/aio-black.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9SZY85MB10WH3JFKZ	\N	t	\N	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N	{"brand": "Tekniva", "legacy_id": "p-059", "instalment": true}
prod_01M373HQESHB6TP1M9JWBZ25DX	Orbisat OR-TEST 4K Deneme Uydu Alıcısı	orbisat-or-test-4k-deneme-uydu-alicisi	\N	\N	f	published	http://localhost:9000/static/1790166227834-receiver-silver.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA8RQNT0QSXPCHK4HBF	\N	t	\N	2026-09-23 15:23:48.455+03	2026-09-23 15:23:57.842+03	2026-09-23 15:23:57.842+03	{"badge": "yeni", "brand": "Orbisat", "instalment": true}
prod_01M374VN91HAMJT1T85974N71T	orbisat uydu	orbisat-uydu	\N	dfdf	f	published	http://localhost:9000/static/1790167565106-20260508%20DFR%2030mm%20aufgewickelt%20komplett.jpeg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA8XZGPYWRD3V9WHDMM	\N	t	\N	2026-09-23 15:46:42.471+03	2026-09-23 15:46:42.471+03	\N	{"badge": "yeni", "brand": "Antenix", "instalment": true}
prod_01M3704JBC1W321MXAWJ5VH65S	Tekniva TK-27AIO 27" All In One Bilgisayar i7 16GB 512GB	tekniva-tk-27aio-27-all-in-one-bilgisayar-i7-16gb-512gb	\N	\N	f	published	http://localhost:3100/mock/products/aio-white.svg	\N	\N	\N	\N	\N	\N	\N	\N	pcol_01M3704JA9SZY85MB10WH3JFKZ	\N	t	\N	2026-09-23 14:24:11.529+03	2026-09-29 15:19:21.52+03	\N	{"brand": "Tekniva", "specs": [{"rows": [{"label": "Ürün tipi", "value": "Hepsi bir arada masaüstü bilgisayar"}, {"label": "İşlemci", "value": "10 çekirdek / 16 iş parçacığı · 3,4 GHz"}, {"label": "Bellek", "value": "16 GB DDR5-5600 · 2 × SO-DIMM yuva"}, {"label": "Depolama", "value": "512 GB NVMe SSD · PCIe 4.0"}, {"note": "Bluetooth 5.3 ile kablosuz klavye ve kulaklık bağlanır.", "label": "Ağ bağlantısı", "value": "Wi-Fi 6 (802.11ax) · 1 × RJ45 1 Gbit/s"}, {"note": "USB-A 5 Gbit/s, USB-C 10 Gbit/s ve DP Alt Mode sağlar.", "label": "Bağlantı noktaları", "value": "2 × USB-A 3.2 Gen 1 · 1 × USB-C Gen 2"}], "title": "Genel"}, {"rows": [{"label": "Panel", "value": "27\\" IPS · mat yüzey"}, {"label": "Çözünürlük", "value": "1920 × 1080 px · 16:9"}, {"label": "Yenileme hızı", "value": "100 Hz"}, {"label": "Tepki süresi", "value": "5 ms (GtG)"}, {"label": "Parlaklık ve renk", "value": "300 cd/m² · sRGB %99"}, {"note": "4K kaynaklar 1920 × 1080 px'e ölçeklenir.", "label": "HDMI giriş", "value": "1 × HDMI 2.1 giriş · 1920 × 1080 px"}], "title": "Ekran"}, {"rows": [{"label": "Besleme", "value": "19 V / 6,32 A · 120 W harici adaptör"}, {"label": "Dahili hoparlör", "value": "2 × 5 W"}, {"label": "Ses bağlantısı", "value": "1 × 3,5 mm kulaklık ve mikrofon"}, {"note": "Ayak sökülerek M4 × 10 mm vida ile monte edilir.", "label": "Montaj deliği", "value": "VESA 100 × 100 mm"}, {"label": "Ölçüler", "value": "540 × 400 × 175 mm (ayak dahil)"}, {"label": "Ağırlık", "value": "6,4 kg"}], "title": "Fiziksel"}], "legacy_id": "p-041", "instalment": true}
\.


--
-- Data for Name: product_category; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_category (id, name, description, handle, mpath, is_active, is_internal, rank, parent_category_id, created_at, updated_at, deleted_at, metadata, external_id) FROM stdin;
pcat_01M3PPXFZS4CMQH7CHA7JRK60C	AHD Sistem		ahd-sistem	pcat_01M3PPXFYD1SRCQHQYWJ1DJ3GZ.pcat_01M3PPXFZS4CMQH7CHA7JRK60C	t	f	0	pcat_01M3PPXFYD1SRCQHQYWJ1DJ3GZ	2026-09-29 16:50:53.434+03	2026-09-29 16:50:53.434+03	\N	\N	\N
pcat_01M3PPXFYFNCDKTETHS0FHPF6A	Kayıt ve Depolama		kayit-ve-depolama	pcat_01M3PPXFYFNCDKTETHS0FHPF6A	t	f	2	\N	2026-09-29 16:50:53.395+03	2026-10-01 10:26:35.433135+03	\N	\N	\N
pcat_01M3PPXFZT45XGRZ7D96QS12GN	IP Sistem		ip-sistem	pcat_01M3PPXFYD1SRCQHQYWJ1DJ3GZ.pcat_01M3PPXFZT45XGRZ7D96QS12GN	t	f	1	pcat_01M3PPXFYD1SRCQHQYWJ1DJ3GZ	2026-09-29 16:50:53.434+03	2026-09-29 16:50:53.434+03	\N	\N	\N
pcat_01M3PPXFYH5EPQMDP407W0DG2F	Aksesuarlar		aksesuarlar	pcat_01M3PPXFYH5EPQMDP407W0DG2F	t	f	8	\N	2026-09-29 16:50:53.395+03	2026-10-01 10:26:35.433135+03	\N	\N	\N
pcat_01M3PPXFYD1SRCQHQYWJ1DJ3GZ	CCTV Güvenlik Sistemleri		cctv-guvenlik-sistemleri	pcat_01M3PPXFYD1SRCQHQYWJ1DJ3GZ	t	f	0	\N	2026-09-29 16:50:53.395+03	2026-10-01 10:26:35.433135+03	\N	\N	\N
pcat_01M3PPXFYECPZHJ7HHFX2W8BH0	Araç Kameraları		arac-kameralari	pcat_01M3PPXFYECPZHJ7HHFX2W8BH0	t	f	1	\N	2026-09-29 16:50:53.395+03	2026-10-01 10:26:35.433135+03	\N	\N	\N
pcat_01M3PPXFZT7BBRZHV1V03HEWJY	WiFi Kameralar		wifi-kameralar	pcat_01M3PPXFYD1SRCQHQYWJ1DJ3GZ.pcat_01M3PPXFZT7BBRZHV1V03HEWJY	t	f	2	pcat_01M3PPXFYD1SRCQHQYWJ1DJ3GZ	2026-09-29 16:50:53.434+03	2026-09-29 16:50:53.434+03	\N	\N	\N
pcat_01M3PPXFZTM144J0Y2KX9H2E19	Solar Kameralar		solar-kameralar	pcat_01M3PPXFYD1SRCQHQYWJ1DJ3GZ.pcat_01M3PPXFZTM144J0Y2KX9H2E19	t	f	3	pcat_01M3PPXFYD1SRCQHQYWJ1DJ3GZ	2026-09-29 16:50:53.434+03	2026-09-29 16:50:53.434+03	\N	\N	\N
pcat_01M3PPXG03X6KEZEPH2AJT6KQF	Ethernet Switch		ethernet-switch	pcat_01M3PPXFYFPCBJ1THC94G83X2Q.pcat_01M3PPXG03X6KEZEPH2AJT6KQF	t	f	0	pcat_01M3PPXFYFPCBJ1THC94G83X2Q	2026-09-29 16:50:53.443+03	2026-09-29 16:50:53.443+03	\N	\N	\N
pcat_01M3PPXG03S8PY9TSSZEZ3RMMJ	PoE Switch		poe-switch	pcat_01M3PPXFYFPCBJ1THC94G83X2Q.pcat_01M3PPXG03S8PY9TSSZEZ3RMMJ	t	f	1	pcat_01M3PPXFYFPCBJ1THC94G83X2Q	2026-09-29 16:50:53.443+03	2026-09-29 16:50:53.443+03	\N	\N	\N
pcat_01M3PPXG0318GEMS8RQ1MDQYE7	Access Point / Router		access-point-router	pcat_01M3PPXFYFPCBJ1THC94G83X2Q.pcat_01M3PPXG0318GEMS8RQ1MDQYE7	t	f	2	pcat_01M3PPXFYFPCBJ1THC94G83X2Q	2026-09-29 16:50:53.443+03	2026-09-29 16:50:53.443+03	\N	\N	\N
pcat_01M3PPXG0B2FTQEPDC7NWEVN8J	Uydu Alıcısı		uydu-alicisi	pcat_01M3704J9YXZK4G618HCDFZBR8.pcat_01M3PPXG0B2FTQEPDC7NWEVN8J	t	f	0	pcat_01M3704J9YXZK4G618HCDFZBR8	2026-09-29 16:50:53.452+03	2026-09-29 16:50:53.452+03	\N	\N	\N
pcat_01M3PPXFYJYTW50606XD1433H6	Geçiş Kontrol Sistemleri		gecis-kontrol-sistemleri	pcat_01M3PPXFYJYTW50606XD1433H6	t	f	10	\N	2026-09-29 16:50:53.395+03	2026-10-01 10:26:35.433135+03	\N	\N	\N
pcat_01M3704JA0MW29XPWYH2EYDA0C	Bilgisayar ve Monitör		bilgisayar	pcat_01M3704JA0MW29XPWYH2EYDA0C	f	f	21	\N	2026-09-23 14:24:11.457+03	2026-10-01 10:26:35.433135+03	\N	{"key": "bilgisayar"}	\N
pcat_01M3PPXFYG6XJ2639F8HF1HSWT	Yangın Algılama Sistemleri		yangin-algilama-sistemleri	pcat_01M3PPXFYG6XJ2639F8HF1HSWT	t	f	4	\N	2026-09-29 16:50:53.395+03	2026-10-01 10:26:35.433135+03	\N	\N	\N
pcat_01M3704JA0BVB2DCJC0K233WT7	Ölçü Aletleri		olcu-aletleri	pcat_01M3704JA0BVB2DCJC0K233WT7	f	f	20	\N	2026-09-23 14:24:11.457+03	2026-10-01 10:26:35.433135+03	\N	{"key": "olcum"}	\N
pcat_01M3PPXG0CV6HGNT5ZQ0SEPVEH	Uydu Santrali		uydu-santrali	pcat_01M3704J9YXZK4G618HCDFZBR8.pcat_01M3PPXG0CV6HGNT5ZQ0SEPVEH	t	f	1	pcat_01M3704J9YXZK4G618HCDFZBR8	2026-09-29 16:50:53.452+03	2026-09-29 16:50:53.452+03	\N	\N	\N
pcat_01M3PPXFYGJ15XWWK5WN3PWDFG	Alarm Sistemleri		alarm-sistemleri	pcat_01M3PPXFYGJ15XWWK5WN3PWDFG	t	f	5	\N	2026-09-29 16:50:53.395+03	2026-10-01 10:26:35.433135+03	\N	\N	\N
pcat_01M3PPXFYJYRQJG63RVNTHAMA4	Monitör		monitor	pcat_01M3PPXFYJYRQJG63RVNTHAMA4	t	f	13	\N	2026-09-29 16:50:53.395+03	2026-10-01 10:26:35.433135+03	\N	\N	\N
pcat_01M3704J9Z5A09PXECM56C960K	Seslendirme Sistemleri		seslendirme-sistemleri	pcat_01M3704J9Z5A09PXECM56C960K	t	f	12	\N	2026-09-23 14:24:11.457+03	2026-10-01 10:26:35.433135+03	\N	{"key": "ses"}	\N
pcat_01M3PPXG0CBWX603ZH83M9266A	LNB		lnb	pcat_01M3704J9YXZK4G618HCDFZBR8.pcat_01M3PPXG0CBWX603ZH83M9266A	t	f	2	pcat_01M3704J9YXZK4G618HCDFZBR8	2026-09-29 16:50:53.452+03	2026-09-29 16:50:53.452+03	\N	\N	\N
pcat_01M3PPXG0CP002ZPXJH6A7M6P6	Uydu Aksesuarları		uydu-aksesuarlari	pcat_01M3704J9YXZK4G618HCDFZBR8.pcat_01M3PPXG0CP002ZPXJH6A7M6P6	t	f	3	pcat_01M3704J9YXZK4G618HCDFZBR8	2026-09-29 16:50:53.452+03	2026-09-29 16:50:53.452+03	\N	\N	\N
pcat_01M3PPXG0CAPQZ0KVMQNA371Y2	Anten		anten	pcat_01M3704J9YXZK4G618HCDFZBR8.pcat_01M3PPXG0CAPQZ0KVMQNA371Y2	t	f	4	pcat_01M3704J9YXZK4G618HCDFZBR8	2026-09-29 16:50:53.452+03	2026-09-29 16:50:53.452+03	\N	\N	\N
pcat_01M3704J9YXZK4G618HCDFZBR8	Uydu Sistemleri		uydu-sistemleri	pcat_01M3704J9YXZK4G618HCDFZBR8	t	f	6	\N	2026-09-23 14:24:11.457+03	2026-10-01 10:26:35.433135+03	\N	{"key": "uydu"}	\N
pcat_01M3704JA0PZMPW4CMWBGDMXCP	Kablo Çeşitleri		kablo-cesitleri	pcat_01M3704JA0PZMPW4CMWBGDMXCP	f	f	22	\N	2026-09-23 14:24:11.457+03	2026-10-01 10:26:35.433135+03	\N	{"key": "kablo"}	\N
pcat_01M3704JA13D3RSYH5GKMXABGD	Hırdavat ve Tamir Malzemeleri		hirdavat-tamir	pcat_01M3704JA13D3RSYH5GKMXABGD	f	f	23	\N	2026-09-23 14:24:11.457+03	2026-10-01 10:26:35.433135+03	\N	{"key": "hirdavat"}	\N
pcat_01M3PPXFYFPCBJ1THC94G83X2Q	Network Ürünleri		network-urunleri	pcat_01M3PPXFYFPCBJ1THC94G83X2Q	t	f	3	\N	2026-09-29 16:50:53.395+03	2026-10-01 10:26:35.433135+03	\N	\N	\N
pcat_01M3704J9ZJ7CQ6K1ZE1R76NJP	Led ve Aydınlatma		led-aydinlatma	pcat_01M3704J9ZJ7CQ6K1ZE1R76NJP	f	f	17	\N	2026-09-23 14:24:11.457+03	2026-10-01 10:26:35.433135+03	\N	{"key": "led"}	\N
pcat_01M3704J9ZA5YRT0SGGPWAQ2QE	Oto Ses ve Görüntü		oto-ses-goruntu	pcat_01M3704J9ZA5YRT0SGGPWAQ2QE	f	f	16	\N	2026-09-23 14:24:11.457+03	2026-10-01 10:26:35.433135+03	\N	{"key": "oto"}	\N
pcat_01M3704J9ZQB0608MT2T2BYF16	Adaptör, Akü, Pil		adaptor-aku-pil	pcat_01M3704J9ZQB0608MT2T2BYF16	f	f	18	\N	2026-09-23 14:24:11.457+03	2026-10-01 10:26:35.433135+03	\N	{"key": "adaptor"}	\N
pcat_01M3PPXFYH6F97VFY7YXNMMG5N	Rack Kabinetler		rack-kabinetler	pcat_01M3PPXFYH6F97VFY7YXNMMG5N	t	f	7	\N	2026-09-29 16:50:53.395+03	2026-10-01 10:26:35.433135+03	\N	\N	\N
pcat_01M3704JA02X1D3J57WZACFQQB	Oem ve Çevre Birimleri		oem-cevre-birimleri	pcat_01M3704JA02X1D3J57WZACFQQB	f	f	19	\N	2026-09-23 14:24:11.457+03	2026-10-01 10:26:35.433135+03	\N	{"key": "oem"}	\N
pcat_01M3PPXFYHZVGY3E8JZGV35VRH	Elektronik Kilit Sistemleri		elektronik-kilit-sistemleri	pcat_01M3PPXFYHZVGY3E8JZGV35VRH	t	f	9	\N	2026-09-29 16:50:53.395+03	2026-10-01 10:26:35.433135+03	\N	\N	\N
pcat_01M3PPXFYJAGXDVXV7AZ3DPH9B	İnterkom Sistemleri		interkom-sistemleri	pcat_01M3PPXFYJAGXDVXV7AZ3DPH9B	t	f	11	\N	2026-09-29 16:50:53.395+03	2026-10-01 10:26:35.433135+03	\N	\N	\N
pcat_01M3704J9Y0JAWJESV44FEJGBE	Kumanda Çeşitleri		kumanda-cesitleri	pcat_01M3704J9Y0JAWJESV44FEJGBE	f	f	14	\N	2026-09-23 14:24:11.457+03	2026-10-01 10:26:35.433135+03	\N	{"key": "kumanda"}	\N
pcat_01M3704J9Z12J6AYP457GRHV72	Güvenlik Sistemleri		guvenlik-sistemleri	pcat_01M3704J9Z12J6AYP457GRHV72	f	f	15	\N	2026-09-23 14:24:11.457+03	2026-10-01 10:26:35.433135+03	\N	{"key": "guvenlik"}	\N
\.


--
-- Data for Name: product_category_product; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_category_product (product_id, product_category_id) FROM stdin;
prod_01M3704JBCZEA31BTY6SM3N08F	pcat_01M3704J9Y0JAWJESV44FEJGBE
prod_01M3704JBCBD3VXS7HH1HDG4S9	pcat_01M3704J9Y0JAWJESV44FEJGBE
prod_01M3704JBC0YEWMERTH5QW3DNK	pcat_01M3704J9Y0JAWJESV44FEJGBE
prod_01M3704JBCDPQX120JDNWVFR6W	pcat_01M3704J9Z5A09PXECM56C960K
prod_01M3704JBCDH6HRQE2QB4NV2QZ	pcat_01M3704J9Z5A09PXECM56C960K
prod_01M3704JBC53GPRKB7AMPF4Z8W	pcat_01M3704J9Z5A09PXECM56C960K
prod_01M3704JBC9ZWFD2XRVPFF74PA	pcat_01M3704J9Z5A09PXECM56C960K
prod_01M3704JBCRST6DA5ZZWGCN0KW	pcat_01M3704J9ZJ7CQ6K1ZE1R76NJP
prod_01M3704JBC3HDVBT8BGS9QSXPE	pcat_01M3704J9ZJ7CQ6K1ZE1R76NJP
prod_01M3704JBCZSBGK4N9DPAEGKK6	pcat_01M3704J9ZJ7CQ6K1ZE1R76NJP
prod_01M3704JBCCTJJEB35F869JJ4S	pcat_01M3704J9ZJ7CQ6K1ZE1R76NJP
prod_01M3704JBC7GVJT1NVWQHXACTH	pcat_01M3704J9ZQB0608MT2T2BYF16
prod_01M3704JBC39NJ7X4SYRYGEQDR	pcat_01M3704J9ZQB0608MT2T2BYF16
prod_01M3704JBCDV7X5ZD399RBPM50	pcat_01M3704J9ZA5YRT0SGGPWAQ2QE
prod_01M3704JBCBAHRF99HDEMCCPER	pcat_01M3704J9ZA5YRT0SGGPWAQ2QE
prod_01M3704JBCBCR24HBQVGXA0AZG	pcat_01M3704J9ZA5YRT0SGGPWAQ2QE
prod_01M3704JBCXBV13KW3A3MP20DB	pcat_01M3704JA0BVB2DCJC0K233WT7
prod_01M3704JBC46SCQVGHC69CRN5B	pcat_01M3704JA0BVB2DCJC0K233WT7
prod_01M3704JBCQRVN3RCNR0NRMAHV	pcat_01M3704JA0BVB2DCJC0K233WT7
prod_01M3704JBC20RM7KAAK0W787NZ	pcat_01M3704JA0BVB2DCJC0K233WT7
prod_01M3704JBC1W321MXAWJ5VH65S	pcat_01M3704JA0MW29XPWYH2EYDA0C
prod_01M3704JBDY5T4BNC6R1RR3V8E	pcat_01M3704JA0MW29XPWYH2EYDA0C
prod_01M3704JBDV13SJWHGPQB6FTK9	pcat_01M3704JA13D3RSYH5GKMXABGD
prod_01M3704JBDMYMEN5T7R3ZJGZV4	pcat_01M3704JA13D3RSYH5GKMXABGD
prod_01M3704JBDQ9WM8EBJJ8QCCKZ1	pcat_01M3704JA13D3RSYH5GKMXABGD
prod_01M3704JBDNSH2EKX4026MTGFC	pcat_01M3704J9Y0JAWJESV44FEJGBE
prod_01M3704JBD9WQG3QSMZ4Z5H80J	pcat_01M3704J9Z5A09PXECM56C960K
prod_01M3704JBDK4NTGGANMJQV51Y9	pcat_01M3704J9Z5A09PXECM56C960K
prod_01M3704JBDVQB3Z6K9KCEJ3A04	pcat_01M3704J9ZJ7CQ6K1ZE1R76NJP
prod_01M3704JBD3M2D2V9RRKJ6D1X1	pcat_01M3704J9ZJ7CQ6K1ZE1R76NJP
prod_01M3704JBDYP8E9YQ1RV6KX70W	pcat_01M3704J9ZA5YRT0SGGPWAQ2QE
prod_01M3704JBD9E0E0PRHYVHS3MZR	pcat_01M3704JA0MW29XPWYH2EYDA0C
prod_01M373HQESHB6TP1M9JWBZ25DX	pcat_01M3704J9YXZK4G618HCDFZBR8
prod_01M374VN91HAMJT1T85974N71T	pcat_01M3704J9Y0JAWJESV44FEJGBE
prod_01M3704JBC1NDGX04H6ZDMP2WD	pcat_01M3PPXG0318GEMS8RQ1MDQYE7
prod_01M3704JBCNXYR2DT3E3TW1SQF	pcat_01M3PPXG0318GEMS8RQ1MDQYE7
prod_01M3704JBCV564EK2V1F4R3AQC	pcat_01M3PPXG0318GEMS8RQ1MDQYE7
prod_01M3704JBC1SP3M5ZRW05WXB7P	pcat_01M3PPXFYECPZHJ7HHFX2W8BH0
prod_01M3704JBC48SG8WC48C3DF4FG	pcat_01M3PPXFYH5EPQMDP407W0DG2F
prod_01M3704JBC55PJJQBNQXPZTS6G	pcat_01M3PPXFYH5EPQMDP407W0DG2F
prod_01M3704JBCFNJER548XVG0FJY2	pcat_01M3PPXFYH5EPQMDP407W0DG2F
prod_01M3704JBCG873HZHMK2J79AWB	pcat_01M3PPXFYH5EPQMDP407W0DG2F
prod_01M3704JBCVV7WP033B2FAV3EF	pcat_01M3PPXFYH5EPQMDP407W0DG2F
prod_01M3704JBD2AF9D2XX6AZM5MR0	pcat_01M3PPXFYH5EPQMDP407W0DG2F
prod_01M3704JBCDCPWAV799W5MDB2Q	pcat_01M3PPXG0CV6HGNT5ZQ0SEPVEH
prod_01M3704JBCG7P88J5C6V2QN81N	pcat_01M3PPXFZS4CMQH7CHA7JRK60C
prod_01M3704JBCKGW9QKMX6ET5A9MW	pcat_01M3PPXFZS4CMQH7CHA7JRK60C
prod_01M3704JBCGTS51DVBBH9T7DAA	pcat_01M3PPXG0CP002ZPXJH6A7M6P6
prod_01M3704JBCJYZMXNJ2CS7S43DB	pcat_01M3PPXG0CP002ZPXJH6A7M6P6
prod_01M3704JBCH0JEA9V57VGQSY2H	pcat_01M3PPXFYFNCDKTETHS0FHPF6A
prod_01M3704JBD714MY8QY02RVEBFE	pcat_01M3PPXFYFNCDKTETHS0FHPF6A
prod_01M3704JBCMQTBNWRZGEC73B0K	pcat_01M3PPXG03S8PY9TSSZEZ3RMMJ
prod_01M3704JBCPV1Q5RTFKHRY4GX1	pcat_01M3PPXG0CBWX603ZH83M9266A
prod_01M3704JBCWEXHNS4YZFR9HJAY	pcat_01M3PPXG0B2FTQEPDC7NWEVN8J
prod_01M3704JBCZ0QP0926CX9BKP16	pcat_01M3PPXG0B2FTQEPDC7NWEVN8J
prod_01M3704JBDHDCAZAN36GTYS4YY	pcat_01M3PPXG0B2FTQEPDC7NWEVN8J
prod_01M3704JBCZW219742T87QVVWC	pcat_01M3PPXFZT7BBRZHV1V03HEWJY
prod_01M3704JBD8NS1N27SP4Z0GEX9	pcat_01M3PPXFYJYRQJG63RVNTHAMA4
prod_01M3704JBDHB882SB9JM6H9V3N	pcat_01M3PPXFYJYRQJG63RVNTHAMA4
prod_01M3704JBDAVYAFMG8QYT8P3AF	pcat_01M3PPXG0CAPQZ0KVMQNA371Y2
prod_01M3704JBDZBTN971SS3T5QE9B	pcat_01M3PPXFZT45XGRZ7D96QS12GN
\.


--
-- Data for Name: product_collection; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_collection (id, title, handle, metadata, created_at, updated_at, deleted_at, external_id) FROM stdin;
pcol_01M3704JA8RQNT0QSXPCHK4HBF	Orbisat	orbisat	\N	2026-09-23 14:24:11.465096+03	2026-09-23 14:24:11.465096+03	\N	\N
pcol_01M3704JA8XZGPYWRD3V9WHDMM	Antenix	antenix	\N	2026-09-23 14:24:11.465096+03	2026-09-23 14:24:11.465096+03	\N	\N
pcol_01M3704JA9SA77AN23Z9G1QTCH	Kumandax	kumandax	\N	2026-09-23 14:24:11.465096+03	2026-09-23 14:24:11.465096+03	\N	\N
pcol_01M3704JA9PBSRPM9XPG0NPW8E	Vizyontek	vizyontek	\N	2026-09-23 14:24:11.465096+03	2026-09-23 14:24:11.465096+03	\N	\N
pcol_01M3704JA99V1GY15WQ9G14880	Sonora	sonora	\N	2026-09-23 14:24:11.465096+03	2026-09-23 14:24:11.465096+03	\N	\N
pcol_01M3704JA96PR1P44TGXV4KNWK	Sesyapı	sesyapi	\N	2026-09-23 14:24:11.465096+03	2026-09-23 14:24:11.465096+03	\N	\N
pcol_01M3704JA9XY13S3XMR7HXJRTP	Fotokam	fotokam	\N	2026-09-23 14:24:11.465096+03	2026-09-23 14:24:11.465096+03	\N	\N
pcol_01M3704JA9MW26QT2PV4P4PWH6	Provista	provista	\N	2026-09-23 14:24:11.465096+03	2026-09-23 14:24:11.465096+03	\N	\N
pcol_01M3704JA9VJF8BYVHSSXE7787	Ledora	ledora	\N	2026-09-23 14:24:11.465096+03	2026-09-23 14:24:11.465096+03	\N	\N
pcol_01M3704JA93Y06CPN7P6H9M2RJ	Lumenta	lumenta	\N	2026-09-23 14:24:11.465096+03	2026-09-23 14:24:11.465096+03	\N	\N
pcol_01M3704JA9RCN6B917WBHDTA5Y	Powerin	powerin	\N	2026-09-23 14:24:11.465096+03	2026-09-23 14:24:11.465096+03	\N	\N
pcol_01M3704JA9MPVHXXB9KFC3KTHK	Bataryam	bataryam	\N	2026-09-23 14:24:11.465096+03	2026-09-23 14:24:11.465096+03	\N	\N
pcol_01M3704JA92R87JGHW60H9KZ28	Voltra	voltra	\N	2026-09-23 14:24:11.465096+03	2026-09-23 14:24:11.465096+03	\N	\N
pcol_01M3704JA9038YG4YEVWVVG095	Sinyalis	sinyalis	\N	2026-09-23 14:24:11.465096+03	2026-09-23 14:24:11.465096+03	\N	\N
pcol_01M3704JA9K1PDEPYJ1JFBZDGR	Nexora	nexora	\N	2026-09-23 14:24:11.465096+03	2026-09-23 14:24:11.465096+03	\N	\N
pcol_01M3704JA9ZWBGHE1ST72PJNWZ	Digiwave	digiwave	\N	2026-09-23 14:24:11.465096+03	2026-09-23 14:24:11.465096+03	\N	\N
pcol_01M3704JA92GPJHPN03NBXQKPS	Metrion	metrion	\N	2026-09-23 14:24:11.465096+03	2026-09-23 14:24:11.465096+03	\N	\N
pcol_01M3704JA9EA651W9J4F75WYGJ	Devrelab	devrelab	\N	2026-09-23 14:24:11.465096+03	2026-09-23 14:24:11.465096+03	\N	\N
pcol_01M3704JA9CZMMKM7568MDY3AH	Cabletek	cabletek	\N	2026-09-23 14:24:11.465096+03	2026-09-23 14:24:11.465096+03	\N	\N
pcol_01M3704JA9D5BBZ7MKD59VRDR2	Kablonis	kablonis	\N	2026-09-23 14:24:11.465096+03	2026-09-23 14:24:11.465096+03	\N	\N
pcol_01M3704JA9SZY85MB10WH3JFKZ	Tekniva	tekniva	\N	2026-09-23 14:24:11.465096+03	2026-09-23 14:24:11.465096+03	\N	\N
pcol_01M3704JA93GBKNXYJ6BXPRSCD	Optivolt	optivolt	\N	2026-09-23 14:24:11.465096+03	2026-09-23 14:24:11.465096+03	\N	\N
pcol_01M3704JA9K2QB53G4A6HCWS4C	Tamirix	tamirix	\N	2026-09-23 14:24:11.465096+03	2026-09-23 14:24:11.465096+03	\N	\N
pcol_01M3704JA93SB55QEQQ15W1GNV	Servisan	servisan	\N	2026-09-23 14:24:11.465096+03	2026-09-23 14:24:11.465096+03	\N	\N
pcol_01M3704JA9N29RVBQE5XNFSQDY	Megavolt	megavolt	\N	2026-09-23 14:24:11.465096+03	2026-09-23 14:24:11.465096+03	\N	\N
\.


--
-- Data for Name: product_option; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_option (id, title, metadata, created_at, updated_at, deleted_at, is_exclusive) FROM stdin;
opt_01M3704JAJ11HMVBGCAMK2ZJYC	Model	\N	2026-09-23 14:24:11.474+03	2026-09-23 14:24:11.474+03	\N	f
\.


--
-- Data for Name: product_option_value; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_option_value (id, value, option_id, metadata, created_at, updated_at, deleted_at, rank) FROM stdin;
optval_01M3704JAJDYF67DC1KB99BBQ3	Standart	opt_01M3704JAJ11HMVBGCAMK2ZJYC	\N	2026-09-23 14:24:11.474+03	2026-09-23 14:24:11.474+03	\N	\N
\.


--
-- Data for Name: product_product_option; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_product_option (id, product_id, product_option_id, created_at, updated_at, deleted_at) FROM stdin;
prodopt_01M3704JBZ20D8CK02MR1P1B8X	prod_01M3704JBCZ0QP0926CX9BKP16	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JBZKNVY6CDHNDRFKV7A	prod_01M3704JBCWEXHNS4YZFR9HJAY	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JBZ42K5X664GNNF7097	prod_01M3704JBCDCPWAV799W5MDB2Q	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JBZ72484RN5TVXP7H96	prod_01M3704JBCPV1Q5RTFKHRY4GX1	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JBZ6V02XPHDKZBHYZ6D	prod_01M3704JBCJYZMXNJ2CS7S43DB	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JBZG6S9JRTVBR1TYK4S	prod_01M3704JBCZEA31BTY6SM3N08F	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JBZ4T37X00KMVP5MCRM	prod_01M3704JBCBD3VXS7HH1HDG4S9	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JBZJ8XV0R9P9X7PXKW9	prod_01M3704JBC0YEWMERTH5QW3DNK	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JBZMVJ10BQKVVZC3HVD	prod_01M3704JBCDPQX120JDNWVFR6W	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JBZ7YXMTGNFTW02F0XG	prod_01M3704JBCDH6HRQE2QB4NV2QZ	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JBZBXE2AZJZ1NC75V5M	prod_01M3704JBC53GPRKB7AMPF4Z8W	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC0QDCY4TCXP46TE8FJ	prod_01M3704JBC9ZWFD2XRVPFF74PA	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC08RYQP20NKNJ27C0J	prod_01M3704JBCKGW9QKMX6ET5A9MW	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC022H1EQXR4APMDYQ2	prod_01M3704JBCZW219742T87QVVWC	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC057T7EEDCSTB03KMM	prod_01M3704JBCH0JEA9V57VGQSY2H	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC0PJYFEQC34QG3CVRD	prod_01M3704JBCG7P88J5C6V2QN81N	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC000DT29E9V70H629H	prod_01M3704JBCRST6DA5ZZWGCN0KW	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC0A7E7RWC261MQYPBF	prod_01M3704JBC3HDVBT8BGS9QSXPE	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC0XQEHEZHS1D34W89F	prod_01M3704JBCZSBGK4N9DPAEGKK6	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC095NRQZPAZGQ901PT	prod_01M3704JBCCTJJEB35F869JJ4S	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC0HB0DEX2KMNZT4H2A	prod_01M3704JBCFNJER548XVG0FJY2	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC04TWQF5W2Q9D3E5HT	prod_01M3704JBC7GVJT1NVWQHXACTH	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC18S35ZZFF536P33CK	prod_01M3704JBC55PJJQBNQXPZTS6G	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC120TQT9PY83CHKGXP	prod_01M3704JBC39NJ7X4SYRYGEQDR	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC1ZAYZK7543PMKCYZN	prod_01M3704JBCDV7X5ZD399RBPM50	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC1W56JMEXMX73Q56F1	prod_01M3704JBCBAHRF99HDEMCCPER	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC1067279HJFWZ958E6	prod_01M3704JBC1SP3M5ZRW05WXB7P	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC1M8B30SQYH163Y7H9	prod_01M3704JBCBCR24HBQVGXA0AZG	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC1SDZK3T0RPEXKGP7P	prod_01M3704JBCNXYR2DT3E3TW1SQF	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC1QHJR0CWTMS4JFJ0W	prod_01M3704JBCV564EK2V1F4R3AQC	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC11ENG44YPJWMCKHNE	prod_01M3704JBCMQTBNWRZGEC73B0K	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC1TF6CJ4J619GVM532	prod_01M3704JBC1NDGX04H6ZDMP2WD	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC1RDF1X9N4T8RJNYZF	prod_01M3704JBCXBV13KW3A3MP20DB	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC2W3RFKA3B5V5EZ1Q5	prod_01M3704JBC46SCQVGHC69CRN5B	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC2V693DQDHF482ZR66	prod_01M3704JBCQRVN3RCNR0NRMAHV	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC2D2AP3KP1QBTKSMNR	prod_01M3704JBC20RM7KAAK0W787NZ	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC2DXBHFNF4H2W9SGZT	prod_01M3704JBCGTS51DVBBH9T7DAA	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC21YABHNMCDW570SHV	prod_01M3704JBC48SG8WC48C3DF4FG	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC2SYW81R8HR6QFTTVF	prod_01M3704JBCG873HZHMK2J79AWB	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC2ASXSP7XSMYTW0SVK	prod_01M3704JBCVV7WP033B2FAV3EF	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC2RCPH2F0V0X9E32HP	prod_01M3704JBC1W321MXAWJ5VH65S	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC3TXSM8F82AFET3ZRA	prod_01M3704JBDY5T4BNC6R1RR3V8E	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC34PW54A0ND6T992MY	prod_01M3704JBDHB882SB9JM6H9V3N	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC3SDRTFT0445HCS1X5	prod_01M3704JBD8NS1N27SP4Z0GEX9	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC3HTV12WF2QCP5FW6S	prod_01M3704JBDV13SJWHGPQB6FTK9	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC38TNAT215AWP04BBP	prod_01M3704JBDMYMEN5T7R3ZJGZV4	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC37YJDJQTSCVX1985F	prod_01M3704JBD2AF9D2XX6AZM5MR0	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC34EK7KMASQC6FTBS8	prod_01M3704JBDQ9WM8EBJJ8QCCKZ1	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC33KD4G7BXS55HQ9H2	prod_01M3704JBDHDCAZAN36GTYS4YY	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC35V5KTJMV06BR01CV	prod_01M3704JBDAVYAFMG8QYT8P3AF	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC3BCNNGYZEBPRBGJBZ	prod_01M3704JBDNSH2EKX4026MTGFC	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC34FF8JSMM3ZTAASAR	prod_01M3704JBD9WQG3QSMZ4Z5H80J	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC3JD88CSH4E0YKHE2C	prod_01M3704JBDK4NTGGANMJQV51Y9	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC3W05WVRE3MR7JR4KT	prod_01M3704JBD714MY8QY02RVEBFE	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC33GQAMRS3ZRFAFVPV	prod_01M3704JBDZBTN971SS3T5QE9B	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC3C86HE0R3D6MZ8CJ8	prod_01M3704JBDVQB3Z6K9KCEJ3A04	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC36KV2N6D2K87Q150B	prod_01M3704JBD3M2D2V9RRKJ6D1X1	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC3A9YH5VYVEZX8WDYP	prod_01M3704JBDYP8E9YQ1RV6KX70W	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M3704JC3NERJCT2Z7RQEG9XY	prod_01M3704JBD9E0E0PRHYVHS3MZR	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodopt_01M373HQF5D0QZFCTRD5756VJP	prod_01M373HQESHB6TP1M9JWBZ25DX	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 15:23:48.456+03	2026-09-23 15:23:48.456+03	\N
prodopt_01M374VN97YQSXVC70XM4WBZFQ	prod_01M374VN91HAMJT1T85974N71T	opt_01M3704JAJ11HMVBGCAMK2ZJYC	2026-09-23 15:46:42.471+03	2026-09-23 15:46:42.471+03	\N
\.


--
-- Data for Name: product_product_option_value; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_product_option_value (id, product_product_option_id, product_option_value_id, created_at, updated_at, deleted_at) FROM stdin;
prodoptval_01M3704JC4CGT0Q8HAKFMD54K2	prodopt_01M3704JBZ20D8CK02MR1P1B8X	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.53+03	2026-09-23 14:24:11.53+03	\N
prodoptval_01M3704JC409A0TZ08TZ2C4KHN	prodopt_01M3704JBZKNVY6CDHNDRFKV7A	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC4DGN1R7DRAG6CE830	prodopt_01M3704JBZ42K5X664GNNF7097	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC4WMKP15Q7SM6GXS9P	prodopt_01M3704JBZ72484RN5TVXP7H96	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC4SD253KDWR9ZNGJ1N	prodopt_01M3704JBZ6V02XPHDKZBHYZ6D	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC4838Y6BN15XAE8Z89	prodopt_01M3704JBZG6S9JRTVBR1TYK4S	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC48DKGAT14Y7TAB1DK	prodopt_01M3704JBZ4T37X00KMVP5MCRM	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC43GJW2X6QJYGXEYTR	prodopt_01M3704JBZJ8XV0R9P9X7PXKW9	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC4MYQ90SEPQAR7ZNK3	prodopt_01M3704JBZMVJ10BQKVVZC3HVD	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC4A1GWP5J0MGTDW9C0	prodopt_01M3704JBZ7YXMTGNFTW02F0XG	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC44034FXKMPPME5AYY	prodopt_01M3704JBZBXE2AZJZ1NC75V5M	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC4BMY838RZ81MXFN8W	prodopt_01M3704JC0QDCY4TCXP46TE8FJ	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC4ANZXKEA8N20JPCXD	prodopt_01M3704JC08RYQP20NKNJ27C0J	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC44TDFSRH3KJS0E12X	prodopt_01M3704JC022H1EQXR4APMDYQ2	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC59NMQ3XG87PCS45MD	prodopt_01M3704JC057T7EEDCSTB03KMM	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC58EZ1D8STWXPWRTW4	prodopt_01M3704JC0PJYFEQC34QG3CVRD	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC5MRGSKNPZ1JPB7PRK	prodopt_01M3704JC000DT29E9V70H629H	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC5MS63VV3NZZYJD3E6	prodopt_01M3704JC0A7E7RWC261MQYPBF	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC54TM51R17PW0WK73R	prodopt_01M3704JC0XQEHEZHS1D34W89F	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC5TM46S9RB0GR2B1DD	prodopt_01M3704JC095NRQZPAZGQ901PT	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC50T9RQ4THRGEVZ3W7	prodopt_01M3704JC0HB0DEX2KMNZT4H2A	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC553GE7G57NEMNAGRM	prodopt_01M3704JC04TWQF5W2Q9D3E5HT	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC540QDQHYC99H4S6PZ	prodopt_01M3704JC18S35ZZFF536P33CK	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC57N21EWR32620QSW5	prodopt_01M3704JC120TQT9PY83CHKGXP	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC5ERGS1QJE4ENBXNG5	prodopt_01M3704JC1ZAYZK7543PMKCYZN	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC5FGXDK4B3682E4028	prodopt_01M3704JC1W56JMEXMX73Q56F1	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC50RQ47KEPZVDPCRXK	prodopt_01M3704JC1067279HJFWZ958E6	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC5D6V64WWZ7KE9A2R9	prodopt_01M3704JC1M8B30SQYH163Y7H9	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC5B9F7Y9VF217GWZB9	prodopt_01M3704JC1SDZK3T0RPEXKGP7P	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC51ENQV47ZVYW5XVW1	prodopt_01M3704JC1QHJR0CWTMS4JFJ0W	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC5NDT236KKKYK753MW	prodopt_01M3704JC11ENG44YPJWMCKHNE	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC5WP2ZW5JV0QNW9JFT	prodopt_01M3704JC1TF6CJ4J619GVM532	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC5QZZS3D25RN76GBQS	prodopt_01M3704JC1RDF1X9N4T8RJNYZF	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC5EH1FMGWF9D8V6H0J	prodopt_01M3704JC2W3RFKA3B5V5EZ1Q5	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC5H1AFGBTKNNSC75X3	prodopt_01M3704JC2V693DQDHF482ZR66	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC5SGVBCCKS1S4RM3FB	prodopt_01M3704JC2D2AP3KP1QBTKSMNR	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC5KRXZAN1W9WBDY7JG	prodopt_01M3704JC2DXBHFNF4H2W9SGZT	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC59ACKRTW5QGMYB4CK	prodopt_01M3704JC21YABHNMCDW570SHV	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC5J3AWASRKHGPH4EGE	prodopt_01M3704JC2SYW81R8HR6QFTTVF	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC5MT4S6WCJGTF326D1	prodopt_01M3704JC2ASXSP7XSMYTW0SVK	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC5PSEFYAX7AM0764FN	prodopt_01M3704JC2RCPH2F0V0X9E32HP	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC55GFCGTYAM0RDQ383	prodopt_01M3704JC3TXSM8F82AFET3ZRA	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC5W1K62VGRXWTP1RJ7	prodopt_01M3704JC34PW54A0ND6T992MY	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC6K8EKKVB3ST9TYEEZ	prodopt_01M3704JC3SDRTFT0445HCS1X5	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC61Y111K72D4K5XB3E	prodopt_01M3704JC3HTV12WF2QCP5FW6S	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC6HZJ35H741DKDHZ4G	prodopt_01M3704JC38TNAT215AWP04BBP	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC6FMYVEJ0RNCZFW0GS	prodopt_01M3704JC37YJDJQTSCVX1985F	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC6Z2XNX52VC9QVE81J	prodopt_01M3704JC34EK7KMASQC6FTBS8	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC6RPAYP5FYYJFPHREV	prodopt_01M3704JC33KD4G7BXS55HQ9H2	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC6WVXYMKGZ8YYBMDXG	prodopt_01M3704JC35V5KTJMV06BR01CV	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC6Y3P3WDHB6PEYX5J2	prodopt_01M3704JC3BCNNGYZEBPRBGJBZ	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC6D30AWJWXVCXMKYHM	prodopt_01M3704JC34FF8JSMM3ZTAASAR	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC6TXEC7ZNY4FGHEC9V	prodopt_01M3704JC3JD88CSH4E0YKHE2C	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC649FYAKGDG6JMPT1S	prodopt_01M3704JC3W05WVRE3MR7JR4KT	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC6ADNKZDCC7SDWP7BA	prodopt_01M3704JC33GQAMRS3ZRFAFVPV	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC6EVF4DGXPADWSBMDY	prodopt_01M3704JC3C86HE0R3D6MZ8CJ8	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC6ZFFDGBPBR8RMD9MW	prodopt_01M3704JC36KV2N6D2K87Q150B	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC6XPX6QGQM0KAFYVZ3	prodopt_01M3704JC3A9YH5VYVEZX8WDYP	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M3704JC6KPAVTTHCGPRB7C3M	prodopt_01M3704JC3NERJCT2Z7RQEG9XY	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 14:24:11.531+03	2026-09-23 14:24:11.531+03	\N
prodoptval_01M373HQF6T75G85KR6EF6P2H7	prodopt_01M373HQF5D0QZFCTRD5756VJP	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 15:23:48.456+03	2026-09-23 15:23:48.456+03	\N
prodoptval_01M374VN973ZCQJFYWF2JSH83V	prodopt_01M374VN97YQSXVC70XM4WBZFQ	optval_01M3704JAJDYF67DC1KB99BBQ3	2026-09-23 15:46:42.471+03	2026-09-23 15:46:42.471+03	\N
\.


--
-- Data for Name: product_sales_channel; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_sales_channel (product_id, sales_channel_id, id, created_at, updated_at, deleted_at) FROM stdin;
prod_01M3704JBCZ0QP0926CX9BKP16	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JFYBS6NQ8GX3MR84H5G	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBCWEXHNS4YZFR9HJAY	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JFY8819ZY5JQ0JW2RKK	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBCDCPWAV799W5MDB2Q	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JFYRD3ZB3QPJNHQ3GQ0	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBCPV1Q5RTFKHRY4GX1	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JFYTSYWZVV668H1ZX16	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBCJYZMXNJ2CS7S43DB	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JFYVVEMM964VBZBJ7YE	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBCZEA31BTY6SM3N08F	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JFYWCE80YHR3XNHTNN4	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBCBD3VXS7HH1HDG4S9	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JFYK5NK58Z2F3QVXW75	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBC0YEWMERTH5QW3DNK	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JFY4FY6XXT3TGKDAEJQ	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBCDPQX120JDNWVFR6W	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JFZWMDX6RCT0K1EE24W	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBCDH6HRQE2QB4NV2QZ	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JFZ77REDRY27654D69N	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBC53GPRKB7AMPF4Z8W	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JFZCQYHFMG05JCB79RT	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBC9ZWFD2XRVPFF74PA	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JFZ9JCTEZFPST0597R5	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBCKGW9QKMX6ET5A9MW	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JFZ8AFKV7MZNW3C76RG	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBCZW219742T87QVVWC	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JFZ25SQ7AC8QB2NCP0N	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBCH0JEA9V57VGQSY2H	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JFZKE33RYGWDDRCB135	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBCG7P88J5C6V2QN81N	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JFZ5M0R17G8ESH2CYBV	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBCRST6DA5ZZWGCN0KW	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JFZD4FACK02Z0ZDTJF8	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBC3HDVBT8BGS9QSXPE	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JFZWT943Q6H2J0PG6DA	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBCZSBGK4N9DPAEGKK6	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JFZFXRSQDJSCKCGKYQZ	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBCCTJJEB35F869JJ4S	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JFZG5DKR3R88NB2VQS4	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBCFNJER548XVG0FJY2	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JFZHZMSYTG8F552CBD4	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBC7GVJT1NVWQHXACTH	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JFZJ1MDGC4XBEKX6VHH	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBC55PJJQBNQXPZTS6G	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JFZ59YKNG543V7J40T5	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBC39NJ7X4SYRYGEQDR	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JFZGH51GGA9T6KJH4D9	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBCDV7X5ZD399RBPM50	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JFZWDTHP1KDR9ZK1767	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBCBAHRF99HDEMCCPER	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JFZ1D9N9HE3GT1ZTJCS	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBC1SP3M5ZRW05WXB7P	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JFZ2PE3HPDWSWVRHZHP	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBCBCR24HBQVGXA0AZG	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JFZ1536YGZKX8AAJD8K	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBCNXYR2DT3E3TW1SQF	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JFZ5D457MBCRPZGSCPA	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBCV564EK2V1F4R3AQC	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JFZQE2E2NA51HN3RHKB	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBCMQTBNWRZGEC73B0K	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JFZ8SNTQ4FTBPVBK4QJ	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBC1NDGX04H6ZDMP2WD	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JFZA319BDCW460KERMB	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBCXBV13KW3A3MP20DB	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JFZFGKRAXQTK1SMTTM8	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBC46SCQVGHC69CRN5B	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JFZBCQHZXTYY0Z44DKC	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBCQRVN3RCNR0NRMAHV	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JG0CRW1QJ0H1CCWDZG8	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBC20RM7KAAK0W787NZ	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JG01WWGC2296DVZ8NC4	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBCGTS51DVBBH9T7DAA	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JG0TWMADJM92A10DQ1B	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBC48SG8WC48C3DF4FG	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JG0XWSBR3NGH1WVSGMB	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBCG873HZHMK2J79AWB	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JG0TTFVV81GP18AM19Y	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBCVV7WP033B2FAV3EF	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JG00QTRT5CHZG9767GZ	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBC1W321MXAWJ5VH65S	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JG057J9QRSWN72TPTTG	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBDY5T4BNC6R1RR3V8E	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JG0BW5XDF6JYSR2MWAE	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBDHB882SB9JM6H9V3N	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JG07XY3VV88TASE1ZC9	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBD8NS1N27SP4Z0GEX9	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JG0B8YE66828BR4W4CB	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBDV13SJWHGPQB6FTK9	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JG062N891JCV7FS564Y	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBDMYMEN5T7R3ZJGZV4	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JG00GQ3PVFG0Z4G3AWK	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBD2AF9D2XX6AZM5MR0	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JG0CNEY9ZTMHATQDARN	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBDQ9WM8EBJJ8QCCKZ1	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JG0B4DPHWQGWK948EQG	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBDHDCAZAN36GTYS4YY	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JG01PF907J6H8CR0YCX	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBDAVYAFMG8QYT8P3AF	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JG096RFKCX6FARVZKV8	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBDNSH2EKX4026MTGFC	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JG0YJSHGCSE4EHDNJYT	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBD9WQG3QSMZ4Z5H80J	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JG0ZM6KZE7YRZ3V07T3	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBDK4NTGGANMJQV51Y9	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JG19GS9QAX6QX84BESE	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBD714MY8QY02RVEBFE	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JG11JKNN6EATEP49BS1	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBDZBTN971SS3T5QE9B	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JG1AEH8QQAY5WP0JHXT	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBDVQB3Z6K9KCEJ3A04	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JG19EHEB6TT70R1XG4F	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBD3M2D2V9RRKJ6D1X1	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JG1XQJ1ND388N8FTPDT	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBDYP8E9YQ1RV6KX70W	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JG10V33Q3Z3CV31GHHT	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M3704JBD9E0E0PRHYVHS3MZR	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M3704JG1W2E6V3P433793ZFK	2026-09-23 14:24:11.646589+03	2026-09-23 14:24:11.646589+03	\N
prod_01M373HQESHB6TP1M9JWBZ25DX	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M373HQHZ378PM9Z0HGJ4G31S	2026-09-23 15:23:48.543175+03	2026-09-23 15:23:57.845+03	2026-09-23 15:23:57.844+03
prod_01M374VN91HAMJT1T85974N71T	sc_01M3704J236RKB65YSHQCQK2JB	prodsc_01M374VNADE8KN7QK8PG9E5F60	2026-09-23 15:46:42.509358+03	2026-09-23 15:46:42.509358+03	\N
\.


--
-- Data for Name: product_shipping_profile; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_shipping_profile (product_id, shipping_profile_id, id, created_at, updated_at, deleted_at) FROM stdin;
prod_01M3704JBCZ0QP0926CX9BKP16	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGR99RTJBXBGTSCZZ7Y	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBCWEXHNS4YZFR9HJAY	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGRWZF6KEJEMY5BANGX	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBCDCPWAV799W5MDB2Q	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGSQ9CRPHGBYBEZPS8Y	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBCPV1Q5RTFKHRY4GX1	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGSXM55JFH2AHSJZ5M4	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBCJYZMXNJ2CS7S43DB	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGSV99AP1391B4G9WKR	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBCZEA31BTY6SM3N08F	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGSDJQGWF5SCHJYDE68	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBCBD3VXS7HH1HDG4S9	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGSF6WNT3H02GSGCWPA	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBC0YEWMERTH5QW3DNK	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGSCK8QAH0SV49Y7892	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBCDPQX120JDNWVFR6W	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGTWFNVZ928HDGMNPAE	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBCDH6HRQE2QB4NV2QZ	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGTV73WS4A5AWV9WSW1	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBC53GPRKB7AMPF4Z8W	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGTGQFJK9CEYJXGRC9R	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBC9ZWFD2XRVPFF74PA	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGTMZR5MX8FQFZWYXG3	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBCKGW9QKMX6ET5A9MW	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGT8G5TS934D039B5TB	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBCZW219742T87QVVWC	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGTTDW9V76G4J67XSEJ	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBCH0JEA9V57VGQSY2H	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGTCTRY5KN33Y5XEH7K	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBCG7P88J5C6V2QN81N	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGTPX7SNSZJSV466F1Z	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBCRST6DA5ZZWGCN0KW	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGV231RY8G8E8KV0ZBH	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBC3HDVBT8BGS9QSXPE	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGVGJ17PT4TFECT8MP5	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBCZSBGK4N9DPAEGKK6	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGVV2BQQQHRA7MNRJ90	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBCCTJJEB35F869JJ4S	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGVQ1CTZQE4NGV0CY6W	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBCFNJER548XVG0FJY2	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGVF9Y3308ZSTQ1435D	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBC7GVJT1NVWQHXACTH	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGVRQ7QH3Y0TQQ0WZSY	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBC55PJJQBNQXPZTS6G	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGVEYPGP69KRPG3DXAA	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBC39NJ7X4SYRYGEQDR	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGV1AMM751G906BN6FG	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBCDV7X5ZD399RBPM50	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGVZPE02HWPT9BC97GV	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBCBAHRF99HDEMCCPER	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGVA5K5W995K31EVQX2	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBC1SP3M5ZRW05WXB7P	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGWPSXFFZ55Y823CEZF	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBCBCR24HBQVGXA0AZG	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGWE69Q8EMPJRAWPWFX	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBCNXYR2DT3E3TW1SQF	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGWGZFXVVBDG51347NK	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBCV564EK2V1F4R3AQC	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGWS095RNJFWGYDCEAP	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBCMQTBNWRZGEC73B0K	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGWWWH3CGA9B0SAC6DK	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBC1NDGX04H6ZDMP2WD	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGW9Q5XKWA8WM24VN0Z	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBCXBV13KW3A3MP20DB	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGW662QS691WRY32C6W	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBC46SCQVGHC69CRN5B	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGWB2TYRHXE68R9R5EM	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBCQRVN3RCNR0NRMAHV	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGWJ7RMN07R3ZAA3ZXG	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBC20RM7KAAK0W787NZ	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGXZRDENWG312GTKQ4J	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBCGTS51DVBBH9T7DAA	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGXQ619HE8ZF61J81C6	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBC48SG8WC48C3DF4FG	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGXB46M5TRZ19BFZMM7	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBCG873HZHMK2J79AWB	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGXEASSA7MNXS0D9BZE	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBCVV7WP033B2FAV3EF	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGXBNBBJMPDCNZAKWEA	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBC1W321MXAWJ5VH65S	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGX1MYGDGFKY8M7Q9V8	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBDY5T4BNC6R1RR3V8E	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGXQ8HCR9CQ0FMWZHXP	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBDHB882SB9JM6H9V3N	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGXYBQ3BFS3195C1GC9	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBD8NS1N27SP4Z0GEX9	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGXE5GMZ78NG8B3ZQCK	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBDV13SJWHGPQB6FTK9	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGXFSKAW9NDF7TNV2HS	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBDMYMEN5T7R3ZJGZV4	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGXZXJFK1AGJE2A2XMR	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBD2AF9D2XX6AZM5MR0	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGY60JK4E712B84CKVZ	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBDQ9WM8EBJJ8QCCKZ1	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGYSHGWJB2MCCHE1NRV	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBDHDCAZAN36GTYS4YY	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGYQTC1GJG1FPJ1SCG0	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBDAVYAFMG8QYT8P3AF	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGY0GPCWNV26Z5YD4QN	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBDNSH2EKX4026MTGFC	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGY5DJR4X6KMN6T6XZM	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBD9WQG3QSMZ4Z5H80J	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGYS3PJB9W3ZZQK1BY9	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBDK4NTGGANMJQV51Y9	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGYP103EG3D68GT3AVE	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBD714MY8QY02RVEBFE	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGY35MCMSGVF87ECEZH	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBDZBTN971SS3T5QE9B	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGYC26HQDX5ED8PECS3	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBDVQB3Z6K9KCEJ3A04	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGYHP4F98Z2MQS0NGPK	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBD3M2D2V9RRKJ6D1X1	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGYQEZ72EF2B5ZF424J	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBDYP8E9YQ1RV6KX70W	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGY95B735M1D1DX9E0K	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M3704JBD9E0E0PRHYVHS3MZR	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M3704JGYSKJ1PHDN60RY75VZ	2026-09-23 14:24:11.67261+03	2026-09-23 14:24:11.67261+03	\N
prod_01M373HQESHB6TP1M9JWBZ25DX	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M373HQJMXYG97HC7ETT515FT	2026-09-23 15:23:48.564151+03	2026-09-23 15:23:57.848+03	2026-09-23 15:23:57.848+03
prod_01M374VN91HAMJT1T85974N71T	sp_01M3704J0NX5A15ZZG838V3W5G	prodsp_01M374VNAP9PS5VPTGEKPZ00V4	2026-09-23 15:46:42.518212+03	2026-09-23 15:46:42.518212+03	\N
\.


--
-- Data for Name: product_tag; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_tag (id, value, metadata, created_at, updated_at, deleted_at, external_id) FROM stdin;
\.


--
-- Data for Name: product_tags; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_tags (product_id, product_tag_id) FROM stdin;
\.


--
-- Data for Name: product_type; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_type (id, value, metadata, created_at, updated_at, deleted_at, external_id) FROM stdin;
\.


--
-- Data for Name: product_variant; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_variant (id, title, sku, barcode, ean, upc, allow_backorder, manage_inventory, hs_code, origin_country, mid_code, material, weight, length, height, width, metadata, variant_rank, product_id, created_at, updated_at, deleted_at, thumbnail) FROM stdin;
variant_01M3704JHTH9S6TJ16KNECPJ4X	Standart	ORB-1000	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBCZ0QP0926CX9BKP16	2026-09-23 14:24:11.709+03	2026-09-23 14:24:11.709+03	\N	\N
variant_01M3704JHTYHMVR3HNGRW050DA	Standart	ORB-1007	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBCWEXHNS4YZFR9HJAY	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHTXWNBFSSVENCX8G02	Standart	ANT-1014	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBCDCPWAV799W5MDB2Q	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHT548EYMB43GR545GQ	Standart	ANT-1021	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBCPV1Q5RTFKHRY4GX1	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHTHAN90V3P5TEM4MWA	Standart	KUM-1028	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBCJYZMXNJ2CS7S43DB	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHTNG1GDXTZWCJ9BQDT	Standart	KUM-1035	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBCZEA31BTY6SM3N08F	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHT0CQAR8AGKK89N01C	Standart	KUM-1042	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBCBD3VXS7HH1HDG4S9	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHV71G0ER7K0ECBGG7S	Standart	VIZ-1049	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBC0YEWMERTH5QW3DNK	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHV9ER7PTK3N4KR1YE7	Standart	SON-1056	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBCDPQX120JDNWVFR6W	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHVBX20C0ZEH6C4Y3TF	Standart	SON-1063	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBCDH6HRQE2QB4NV2QZ	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHV474EXRGMM2KJQT9E	Standart	SES-1070	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBC53GPRKB7AMPF4Z8W	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHVA5HQ04W6SAZPC5CQ	Standart	SES-1077	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBC9ZWFD2XRVPFF74PA	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHVP5BSB8XGX9MPNCV1	Standart	FOT-1084	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBCKGW9QKMX6ET5A9MW	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHVJ31J0HKW3GDV144C	Standart	FOT-1091	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBCZW219742T87QVVWC	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHVVJ8QN55EJJ9VBG1A	Standart	PRO-1098	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBCH0JEA9V57VGQSY2H	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHV2MS0GDS5T39JKR56	Standart	PRO-1105	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBCG7P88J5C6V2QN81N	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHVA4MR7A4266WE0XZV	Standart	LED-1112	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBCRST6DA5ZZWGCN0KW	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHVEVGC4ZAZFHGQBHX5	Standart	LED-1119	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBC3HDVBT8BGS9QSXPE	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHVE3C8QM1AV55YC24Y	Standart	LUM-1126	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBCZSBGK4N9DPAEGKK6	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHVD56T7MPPSKX960J8	Standart	LUM-1133	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBCCTJJEB35F869JJ4S	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHVSBJN785TDENP388K	Standart	POW-1140	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBCFNJER548XVG0FJY2	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHV3E1W4D7E79S6G22T	Standart	POW-1147	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBC7GVJT1NVWQHXACTH	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHVMWDS3SEEX0ZTTN5K	Standart	BAT-1154	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBC55PJJQBNQXPZTS6G	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHVDK1ED07ZS907J6KF	Standart	BAT-1161	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBC39NJ7X4SYRYGEQDR	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHVKNJ2PNW25EHHRHN1	Standart	VOL-1168	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBCDV7X5ZD399RBPM50	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHVF86BFVMRF40S6CC3	Standart	VOL-1175	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBCBAHRF99HDEMCCPER	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHVPBTJXNRR5JG53QRN	Standart	VOL-1182	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBC1SP3M5ZRW05WXB7P	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHVS3V7VB9EHXNQ0R3R	Standart	SIN-1189	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBCBCR24HBQVGXA0AZG	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHWC6VDES2QT7442FWZ	Standart	NEX-1196	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBCNXYR2DT3E3TW1SQF	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHWT4PXQAH8CNPCB6MX	Standart	NEX-1203	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBCV564EK2V1F4R3AQC	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHWAAHTGXPT04E9WZSF	Standart	DIG-1210	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBCMQTBNWRZGEC73B0K	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHWVXHNXNJ36R78N2AQ	Standart	DIG-1217	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBC1NDGX04H6ZDMP2WD	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHWPT9TTR034TRPJFVT	Standart	MET-1224	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBCXBV13KW3A3MP20DB	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHW264JPWMNGCP53ARR	Standart	MET-1231	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBC46SCQVGHC69CRN5B	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHWCK3RAE5BXYAENZ9Q	Standart	DEV-1238	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBCQRVN3RCNR0NRMAHV	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHWDVCNPTBNP7M1TWR7	Standart	DEV-1245	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBC20RM7KAAK0W787NZ	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHWBX0KS4AKA2XK38XR	Standart	CAB-1252	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBCGTS51DVBBH9T7DAA	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHWRTRE97AMVG2N1E3N	Standart	CAB-1259	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBC48SG8WC48C3DF4FG	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHW3AVJCXG3C84K5CQ5	Standart	KAB-1266	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBCG873HZHMK2J79AWB	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHWBX9J4BPFBYZ23TZ2	Standart	KAB-1273	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBCVV7WP033B2FAV3EF	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHWGX9GZQAYWHDESGG6	Standart	TEK-1287	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBDY5T4BNC6R1RR3V8E	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHWA6DVP4Z3R12TT9DQ	Standart	TEK-1294	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBDHB882SB9JM6H9V3N	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHWYYAYY8ZKG9T4RGQG	Standart	OPT-1301	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBD8NS1N27SP4Z0GEX9	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHW8S3CGY81PZ3DNJWJ	Standart	TAM-1308	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBDV13SJWHGPQB6FTK9	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHWBJRN2RT699K0ZMTP	Standart	TAM-1315	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBDMYMEN5T7R3ZJGZV4	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHWQ1E01GAZ69JPFQV9	Standart	SER-1322	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBD2AF9D2XX6AZM5MR0	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHWHRH1GJTBWMS2NT66	Standart	MEG-1329	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBDQ9WM8EBJJ8QCCKZ1	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHXD9YMGMFDZSX0APEK	Standart	ORB-1336	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBDHDCAZAN36GTYS4YY	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHX2D2WD0RBBX34R0JZ	Standart	ORB-1343	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBDAVYAFMG8QYT8P3AF	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHXFWE5YPP6ZVR4D498	Standart	KUM-1350	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBDNSH2EKX4026MTGFC	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHXBYG70PZHJ3V5BF78	Standart	SON-1357	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBD9WQG3QSMZ4Z5H80J	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHXD7ZQCQRKMFDS8YBM	Standart	SON-1364	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBDK4NTGGANMJQV51Y9	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHXQ5NY7S005S2R6FJE	Standart	PRO-1371	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBD714MY8QY02RVEBFE	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHXSF70W7FBADE803T6	Standart	PRO-1378	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBDZBTN971SS3T5QE9B	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHXVWXTTWGYD0PVJA2J	Standart	LED-1385	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBDVQB3Z6K9KCEJ3A04	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHXZFYJSYHQ740G7Y0W	Standart	LED-1392	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBD3M2D2V9RRKJ6D1X1	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHXXYVDEPQ463226WSB	Standart	VOL-1399	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBDYP8E9YQ1RV6KX70W	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M3704JHXDYC8K9A90N2TE5HR	Standart	TEK-1406	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBD9E0E0PRHYVHS3MZR	2026-09-23 14:24:11.71+03	2026-09-23 14:24:11.71+03	\N	\N
variant_01M373HQKK1R4AGM3D7G5HSC7Z	Standart	ORB-MUE2R268	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M373HQESHB6TP1M9JWBZ25DX	2026-09-23 15:23:48.595+03	2026-09-23 15:23:57.853+03	2026-09-23 15:23:57.842+03	\N
variant_01M374VNB384RW2TJTDAVBM1ZH	Standart	12	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M374VN91HAMJT1T85974N71T	2026-09-23 15:46:42.532+03	2026-09-23 15:46:42.532+03	\N	\N
variant_01M3704JHW4J8TFD4MHZ4FD7ZZ	Standart	TEK-1280	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01M3704JBC1W321MXAWJ5VH65S	2026-09-23 14:24:11.71+03	2026-09-29 15:19:21.601+03	\N	\N
\.


--
-- Data for Name: product_variant_inventory_item; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_variant_inventory_item (variant_id, inventory_item_id, id, required_quantity, created_at, updated_at, deleted_at) FROM stdin;
variant_01M3704JHTH9S6TJ16KNECPJ4X	iitem_01M3704JJP6EXC7PSKAEWVDK1Q	pvitem_01M3704JKD1EERG1FG9CR2QFWG	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHTYHMVR3HNGRW050DA	iitem_01M3704JJPRPE7F48ZWWS7JPS8	pvitem_01M3704JKE44CA5RVF2TA94N4N	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHTXWNBFSSVENCX8G02	iitem_01M3704JJPT58NJ7J678280NPE	pvitem_01M3704JKEAZA71PQ23XN4EK3Z	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHT548EYMB43GR545GQ	iitem_01M3704JJP3CHZFZCYA92XNAXS	pvitem_01M3704JKEDAQDBGE4R0SQKSR3	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHTHAN90V3P5TEM4MWA	iitem_01M3704JJPQNF1103J4XVZ4S2S	pvitem_01M3704JKEFFY52QW44SMGWAVJ	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHTNG1GDXTZWCJ9BQDT	iitem_01M3704JJPDSXVCMEJYJV3FR32	pvitem_01M3704JKEY26F1QZ9TWAGHXEW	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHT0CQAR8AGKK89N01C	iitem_01M3704JJP9JCFAZQX4T2VYXXR	pvitem_01M3704JKEW7Q2GY194DCKXGQN	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHV71G0ER7K0ECBGG7S	iitem_01M3704JJPGJM8Y8KH7DJVT0K1	pvitem_01M3704JKEB9P02MDNHEWK1ES8	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHV9ER7PTK3N4KR1YE7	iitem_01M3704JJPSVG3ZQFDMARNDPVW	pvitem_01M3704JKE5KYHP65RQWSPVBKM	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHVBX20C0ZEH6C4Y3TF	iitem_01M3704JJQYJN4QGTQ943JYKMK	pvitem_01M3704JKEPJ8FHJA51DK3YA4G	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHV474EXRGMM2KJQT9E	iitem_01M3704JJQYNF9S1X349T4569B	pvitem_01M3704JKE5CM1F5JCRAF5HT56	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHVA5HQ04W6SAZPC5CQ	iitem_01M3704JJQ7EA7XTA8AP4X21K0	pvitem_01M3704JKECX55MTN1M92BCSAE	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHVP5BSB8XGX9MPNCV1	iitem_01M3704JJQE6AENA5HG8AE3M0E	pvitem_01M3704JKF747FP2QZB575605Q	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHVJ31J0HKW3GDV144C	iitem_01M3704JJQH6G0DBFV0Y0GXXPG	pvitem_01M3704JKFAY6K3MT0T6ACMXQK	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHVVJ8QN55EJJ9VBG1A	iitem_01M3704JJQHC0C6Q44TJASPR6P	pvitem_01M3704JKFHHHXDJPT29W89WAJ	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHV2MS0GDS5T39JKR56	iitem_01M3704JJQVFPNHK0EX0ZQ9DHA	pvitem_01M3704JKFBN3HE160AM0GG1G4	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHVA4MR7A4266WE0XZV	iitem_01M3704JJQAS1BTXA0EQ1GN8JR	pvitem_01M3704JKF1KK4RWV4JNT6QA1T	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHVEVGC4ZAZFHGQBHX5	iitem_01M3704JJQTXJMDNECYY8TGMSY	pvitem_01M3704JKFANV7CV71K48WRBJ6	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHVE3C8QM1AV55YC24Y	iitem_01M3704JJQXDT9JSCEECH7DS5D	pvitem_01M3704JKFX2A5M4BSB9Z6C5R8	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHVD56T7MPPSKX960J8	iitem_01M3704JJQBBMVRTZ0VP16BARD	pvitem_01M3704JKFR76SDE278C5SXHBC	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHVSBJN785TDENP388K	iitem_01M3704JJQRM6PJMB24181KNNX	pvitem_01M3704JKFPQ2VVMX0MVGJ99ZG	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHV3E1W4D7E79S6G22T	iitem_01M3704JJQMEKAW8EP3H5RAAXA	pvitem_01M3704JKFBVKE2BNTFAM3WNBN	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHVMWDS3SEEX0ZTTN5K	iitem_01M3704JJQCTBBG364TNRX9ZWT	pvitem_01M3704JKF4W19V5JFNZS3XY4Q	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHVDK1ED07ZS907J6KF	iitem_01M3704JJQCJX4EG466SC52B0T	pvitem_01M3704JKF9Z5TB0AX5CYMTECP	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHVKNJ2PNW25EHHRHN1	iitem_01M3704JJQ4B45ZFZVVE26P7MD	pvitem_01M3704JKF9QXF09G6FQ977ET6	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHVF86BFVMRF40S6CC3	iitem_01M3704JJQA13VCTZ8B8WJAJTT	pvitem_01M3704JKF5M83PDX7NNY5Z9AM	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHVPBTJXNRR5JG53QRN	iitem_01M3704JJQH4FYSAGDQRB8SA2D	pvitem_01M3704JKF07G886X880D1FHAP	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHVS3V7VB9EHXNQ0R3R	iitem_01M3704JJQP5WJM11989D2BT2J	pvitem_01M3704JKF5PV2AQ0DH04ENJ8T	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHWC6VDES2QT7442FWZ	iitem_01M3704JJQTDKTRE34CSPHPXQM	pvitem_01M3704JKFEWFZ0PEGK6Z8GJ8A	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHWT4PXQAH8CNPCB6MX	iitem_01M3704JJQ29GK8MW0G9192SQ4	pvitem_01M3704JKFQRJB0NVVNQBTADR7	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHWAAHTGXPT04E9WZSF	iitem_01M3704JJRDHYRCWSV28X20B1P	pvitem_01M3704JKFXJ8EWG28CQV35DC7	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHWVXHNXNJ36R78N2AQ	iitem_01M3704JJRE8A0DDAZPS2F3AH1	pvitem_01M3704JKF55VMK3RZYKQCWFRB	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHWPT9TTR034TRPJFVT	iitem_01M3704JJRWE0P853ZNNHB25GG	pvitem_01M3704JKF49N1TNAV8HJ6EG5N	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHW264JPWMNGCP53ARR	iitem_01M3704JJR6Y8B41E2P2S0JSV0	pvitem_01M3704JKFTZ4FRZ0VTGY51GW1	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHWCK3RAE5BXYAENZ9Q	iitem_01M3704JJRGJ67684WDTP2JPNR	pvitem_01M3704JKGHKN7FJGM7NPZFR9S	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHWDVCNPTBNP7M1TWR7	iitem_01M3704JJR66T75E8EXST5RC9Z	pvitem_01M3704JKG9HJAMBFEF749BC0Z	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHWBX0KS4AKA2XK38XR	iitem_01M3704JJRQ4M2AHCN6QQN0TJ4	pvitem_01M3704JKG80T5BC62YT59925N	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHWRTRE97AMVG2N1E3N	iitem_01M3704JJRR5M60FWQPYGP5YPJ	pvitem_01M3704JKGEQW5M4R9D82Q9HZ7	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHW3AVJCXG3C84K5CQ5	iitem_01M3704JJR8JCXXXBHFFD1GJMM	pvitem_01M3704JKG4AH8WESB2ZNZQZQ3	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHWBX9J4BPFBYZ23TZ2	iitem_01M3704JJRQVDBPH8HT8HQWAZM	pvitem_01M3704JKGNWN6TKP7MQ2ZHMB2	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHW4J8TFD4MHZ4FD7ZZ	iitem_01M3704JJRMX2GR8F145ZN0AY2	pvitem_01M3704JKGDEB6FS3TY9X5FE69	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHWGX9GZQAYWHDESGG6	iitem_01M3704JJR5A02HEBMGA8E1KJH	pvitem_01M3704JKGT27CE692VA0TYDMG	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHWA6DVP4Z3R12TT9DQ	iitem_01M3704JJR9WMHZ4B0YG68PAJ3	pvitem_01M3704JKGTA4PH1T4XV5N6870	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHWYYAYY8ZKG9T4RGQG	iitem_01M3704JJR8V7XJTQX8HJJG2AX	pvitem_01M3704JKGAN4872XYSDCVWPMW	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHW8S3CGY81PZ3DNJWJ	iitem_01M3704JJRJ2RNZ949B8ZJHKAX	pvitem_01M3704JKGKFS9D36J7TJCEDRJ	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHWBJRN2RT699K0ZMTP	iitem_01M3704JJRJF5N5HX31A8MYECZ	pvitem_01M3704JKHRQNWNASFHRJNNM7Q	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHWQ1E01GAZ69JPFQV9	iitem_01M3704JJR8Z310ZD3ZGT29AAJ	pvitem_01M3704JKHMS7Y5ZVBQ7WHNRZN	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHWHRH1GJTBWMS2NT66	iitem_01M3704JJRJMAXG61PGSVHSQTB	pvitem_01M3704JKHXZ978Y61F8X0DGSJ	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHXD9YMGMFDZSX0APEK	iitem_01M3704JJR1J8NRYKJXBRJQ300	pvitem_01M3704JKH6NH3FRR8AKMC4A7R	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHX2D2WD0RBBX34R0JZ	iitem_01M3704JJR1B23BJ8ZVRXTEDTA	pvitem_01M3704JKHXH4JMGJB3A7Z0420	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHXFWE5YPP6ZVR4D498	iitem_01M3704JJRES81M4N0P5QB4GB6	pvitem_01M3704JKHXNBGWPZMR44TCWFH	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHXBYG70PZHJ3V5BF78	iitem_01M3704JJRH7SR44055ECX8KXH	pvitem_01M3704JKH21GH43E3ZJ5GT231	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHXD7ZQCQRKMFDS8YBM	iitem_01M3704JJS0JXERX6XFT3TZE3A	pvitem_01M3704JKH65PD42GS2C5T5VMC	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHXQ5NY7S005S2R6FJE	iitem_01M3704JJSDHBZFB6GMP035ZN2	pvitem_01M3704JKHYJSYMABRBJHJVX7Q	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHXSF70W7FBADE803T6	iitem_01M3704JJSCR03Z8QD92THFBZA	pvitem_01M3704JKHZYZ6TEJZQDZQMSE8	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHXVWXTTWGYD0PVJA2J	iitem_01M3704JJSS737DC863S4JRJ6X	pvitem_01M3704JKHH2T0K3R8R36HVP4T	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHXZFYJSYHQ740G7Y0W	iitem_01M3704JJSGHR3KKFBN8V4XFXD	pvitem_01M3704JKH4BYM6TZEAV66R9TX	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHXXYVDEPQ463226WSB	iitem_01M3704JJSBMPDRTCEXGN1Q3QT	pvitem_01M3704JKH2BRMNNGBV7ZNK12N	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M3704JHXDYC8K9A90N2TE5HR	iitem_01M3704JJSNVT56QEZR7K81GC5	pvitem_01M3704JKHSRPKEAAXDDZH48DF	1	2026-09-23 14:24:11.758501+03	2026-09-23 14:24:11.758501+03	\N
variant_01M373HQKK1R4AGM3D7G5HSC7Z	iitem_01M373HQM8XEA0SC8VS8EKWRQC	pvitem_01M373HQMNGW7AN3Q0FZEF8NQK	1	2026-09-23 15:23:48.629688+03	2026-09-23 15:23:57.831+03	2026-09-23 15:23:57.831+03
variant_01M374VNB384RW2TJTDAVBM1ZH	iitem_01M374VNBEVTJ92XM0MMGT7R22	pvitem_01M374VNBWKR1K9C4KA0WG444V	1	2026-09-23 15:46:42.555951+03	2026-09-23 15:46:42.555951+03	\N
\.


--
-- Data for Name: product_variant_option; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_variant_option (variant_id, option_value_id) FROM stdin;
variant_01M3704JHTH9S6TJ16KNECPJ4X	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHTYHMVR3HNGRW050DA	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHTXWNBFSSVENCX8G02	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHT548EYMB43GR545GQ	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHTHAN90V3P5TEM4MWA	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHTNG1GDXTZWCJ9BQDT	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHT0CQAR8AGKK89N01C	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHV71G0ER7K0ECBGG7S	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHV9ER7PTK3N4KR1YE7	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHVBX20C0ZEH6C4Y3TF	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHV474EXRGMM2KJQT9E	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHVA5HQ04W6SAZPC5CQ	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHVP5BSB8XGX9MPNCV1	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHVJ31J0HKW3GDV144C	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHVVJ8QN55EJJ9VBG1A	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHV2MS0GDS5T39JKR56	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHVA4MR7A4266WE0XZV	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHVEVGC4ZAZFHGQBHX5	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHVE3C8QM1AV55YC24Y	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHVD56T7MPPSKX960J8	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHVSBJN785TDENP388K	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHV3E1W4D7E79S6G22T	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHVMWDS3SEEX0ZTTN5K	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHVDK1ED07ZS907J6KF	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHVKNJ2PNW25EHHRHN1	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHVF86BFVMRF40S6CC3	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHVPBTJXNRR5JG53QRN	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHVS3V7VB9EHXNQ0R3R	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHWC6VDES2QT7442FWZ	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHWT4PXQAH8CNPCB6MX	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHWAAHTGXPT04E9WZSF	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHWVXHNXNJ36R78N2AQ	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHWPT9TTR034TRPJFVT	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHW264JPWMNGCP53ARR	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHWCK3RAE5BXYAENZ9Q	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHWDVCNPTBNP7M1TWR7	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHWBX0KS4AKA2XK38XR	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHWRTRE97AMVG2N1E3N	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHW3AVJCXG3C84K5CQ5	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHWBX9J4BPFBYZ23TZ2	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHW4J8TFD4MHZ4FD7ZZ	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHWGX9GZQAYWHDESGG6	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHWA6DVP4Z3R12TT9DQ	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHWYYAYY8ZKG9T4RGQG	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHW8S3CGY81PZ3DNJWJ	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHWBJRN2RT699K0ZMTP	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHWQ1E01GAZ69JPFQV9	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHWHRH1GJTBWMS2NT66	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHXD9YMGMFDZSX0APEK	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHX2D2WD0RBBX34R0JZ	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHXFWE5YPP6ZVR4D498	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHXBYG70PZHJ3V5BF78	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHXD7ZQCQRKMFDS8YBM	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHXQ5NY7S005S2R6FJE	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHXSF70W7FBADE803T6	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHXVWXTTWGYD0PVJA2J	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHXZFYJSYHQ740G7Y0W	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHXXYVDEPQ463226WSB	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M3704JHXDYC8K9A90N2TE5HR	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M373HQKK1R4AGM3D7G5HSC7Z	optval_01M3704JAJDYF67DC1KB99BBQ3
variant_01M374VNB384RW2TJTDAVBM1ZH	optval_01M3704JAJDYF67DC1KB99BBQ3
\.


--
-- Data for Name: product_variant_price_set; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_variant_price_set (variant_id, price_set_id, id, created_at, updated_at, deleted_at) FROM stdin;
variant_01M3704JHTH9S6TJ16KNECPJ4X	pset_01M3704JKZJXAZEMM2BAMBXA8Z	pvps_01M3704JNDFMGZGMXV004J2EQ0	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHTYHMVR3HNGRW050DA	pset_01M3704JKZXW2N40XTKE5M7XZB	pvps_01M3704JNEJZ4AH192NPMKVYMA	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHTXWNBFSSVENCX8G02	pset_01M3704JKZ8NHDG9EFJJ96KAZ4	pvps_01M3704JNEKRW4R97SYMY98GQ7	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHT548EYMB43GR545GQ	pset_01M3704JKZF64N5VJPP8201A5D	pvps_01M3704JNEE61JPKQC718Q9QA2	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHTHAN90V3P5TEM4MWA	pset_01M3704JKZ2AQGZ03QHVH96JBP	pvps_01M3704JNEWXGDDXPMX7W4SMPZ	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHTNG1GDXTZWCJ9BQDT	pset_01M3704JM0DM9QTJ7W1SDFM0DQ	pvps_01M3704JNEYZNY9QCGM8ZPF8W6	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHT0CQAR8AGKK89N01C	pset_01M3704JM02DQ8RB7YDBCHYWQZ	pvps_01M3704JNE7N8G26Z0YGKE88R0	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHV71G0ER7K0ECBGG7S	pset_01M3704JM0577Q9DQGJ9ATG90C	pvps_01M3704JNESN888413B7XGK1JS	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHV9ER7PTK3N4KR1YE7	pset_01M3704JM08CXRN80R80KJ5AAW	pvps_01M3704JNEG0Y8RS4SMQXG8HJA	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHVBX20C0ZEH6C4Y3TF	pset_01M3704JM066BAR2A28TVTE1E3	pvps_01M3704JNE0NETVPN1QRCVCXTX	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHV474EXRGMM2KJQT9E	pset_01M3704JM07QT347TAAXCQJ3TW	pvps_01M3704JNEP3VKE2A6YDDMKE3T	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHVA5HQ04W6SAZPC5CQ	pset_01M3704JM0BTHFAE9W2R9WM2HD	pvps_01M3704JNEG8J7K7916GBQWW7S	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHVP5BSB8XGX9MPNCV1	pset_01M3704JM0KQ79YPP3Q4B6B23A	pvps_01M3704JNEHSSTGFY5YF1Y6RHK	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHVJ31J0HKW3GDV144C	pset_01M3704JM0A1AZXTX6A44JGJQF	pvps_01M3704JNEC2ZZ4KH0QYN8DMD7	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHVVJ8QN55EJJ9VBG1A	pset_01M3704JM0NN8MSH1Z96WP3294	pvps_01M3704JNEBX00ESTDY0MBS4TQ	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHV2MS0GDS5T39JKR56	pset_01M3704JM0286YRQ2B3CHXN5BH	pvps_01M3704JNE6EC4WAAAZ4TGGESW	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHVA4MR7A4266WE0XZV	pset_01M3704JM09X4QFNB3NPRYZCAY	pvps_01M3704JNF40PFXX7CTSSTPT7T	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHVEVGC4ZAZFHGQBHX5	pset_01M3704JM04TRNSV83QH9Q8SKE	pvps_01M3704JNFS6TKFHXJHM7TCK9H	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHVE3C8QM1AV55YC24Y	pset_01M3704JM1M30ZGYEXQFS6WS5B	pvps_01M3704JNFWB6P74YHWQB50745	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHVD56T7MPPSKX960J8	pset_01M3704JM16SH1K5YC1AJ3R2SQ	pvps_01M3704JNFHBBN3522AGJ2W9EW	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHVSBJN785TDENP388K	pset_01M3704JM1MTNTJ9QPP34MP397	pvps_01M3704JNFR12783KDGD3VHD9P	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHV3E1W4D7E79S6G22T	pset_01M3704JM129NG1V85T6M5CAGK	pvps_01M3704JNF207QV1YZKQBPMCFR	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHVMWDS3SEEX0ZTTN5K	pset_01M3704JM1JTH430C4C2JP3Q7W	pvps_01M3704JNFSGXCHJ5H9EW1TYAQ	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHVDK1ED07ZS907J6KF	pset_01M3704JM1X31CNP4VRBV4GP5X	pvps_01M3704JNFCMSATWXN7M099440	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHVKNJ2PNW25EHHRHN1	pset_01M3704JM1CF5SDHT0X1G0JK9T	pvps_01M3704JNFH39VHSRVEQX5V454	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHVF86BFVMRF40S6CC3	pset_01M3704JM1FE51SC6J7CQ1Z3XC	pvps_01M3704JNF3HVG6Q425MFKRRB3	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHVPBTJXNRR5JG53QRN	pset_01M3704JM10H1N3HJ4NJDJ68B0	pvps_01M3704JNF12R62GCSESY3M1PT	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHVS3V7VB9EHXNQ0R3R	pset_01M3704JM1TDDMS55346VHW0YF	pvps_01M3704JNF26QWPGTNBEB3Q2ZX	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHWC6VDES2QT7442FWZ	pset_01M3704JM1G549K2D1QXPBQVK6	pvps_01M3704JNFFRPESZ9VG8YARQVV	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHWT4PXQAH8CNPCB6MX	pset_01M3704JM1GGR4QRENDH45V1CC	pvps_01M3704JNFN6YM0S15DECWNV5B	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHWAAHTGXPT04E9WZSF	pset_01M3704JM1Q8A8HD1GAH0BM2C4	pvps_01M3704JNFTNB6Y7Q74XZHR5MC	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHWVXHNXNJ36R78N2AQ	pset_01M3704JM1DQ7MP94RKCXDBBX8	pvps_01M3704JNF0Y6TJKM9AP8XF95Q	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHWPT9TTR034TRPJFVT	pset_01M3704JM2QEGVX57S3X4RFQSQ	pvps_01M3704JNFAQXTKJW49TNTM01F	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHW264JPWMNGCP53ARR	pset_01M3704JM2Z696YFCWBGJW5K2R	pvps_01M3704JNF33EC80QGXZADR6PT	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHWCK3RAE5BXYAENZ9Q	pset_01M3704JM2XFRAJVA73RD12ZCC	pvps_01M3704JNFZWMN57YWT467J31F	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHWDVCNPTBNP7M1TWR7	pset_01M3704JM21CXF8G10JNZJDG9H	pvps_01M3704JNFWVG46YAX27KZ6853	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHWBX0KS4AKA2XK38XR	pset_01M3704JM2DVCCYDM3G2AWG9EB	pvps_01M3704JNF8VKPSDESYRNE8VC6	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHWRTRE97AMVG2N1E3N	pset_01M3704JM2JD2W69TE2MRBAY9V	pvps_01M3704JNF452M3Q70468JKMC4	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHW3AVJCXG3C84K5CQ5	pset_01M3704JM22E1SHZRY7EZ4JT6A	pvps_01M3704JNF6Z50JQ0344NMME7B	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHWBX9J4BPFBYZ23TZ2	pset_01M3704JM2F427TYZXX9BKAA8J	pvps_01M3704JNF6S1DHRW2QF475RHB	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHW4J8TFD4MHZ4FD7ZZ	pset_01M3704JM2ZSJ8D4SCS5EV7590	pvps_01M3704JNF1NHTV25WZ2Y410WB	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHWGX9GZQAYWHDESGG6	pset_01M3704JM2PXPDR62PZY4AJ2T4	pvps_01M3704JNFRWECRBW5B8ZTPCM5	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHWA6DVP4Z3R12TT9DQ	pset_01M3704JM2XXSZPANJ2Z2TRWSD	pvps_01M3704JNGKTSCJHQTTWT9KBZA	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHWYYAYY8ZKG9T4RGQG	pset_01M3704JM25FK31FG6RNJC27PH	pvps_01M3704JNGSREV6ZGNJKJHZT2P	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHW8S3CGY81PZ3DNJWJ	pset_01M3704JM2YXQKDQY8EEY275WA	pvps_01M3704JNGE38RQ6AETQDT9V4A	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHWBJRN2RT699K0ZMTP	pset_01M3704JM2N8SWSMSKXBQD8VB3	pvps_01M3704JNGAQ410NNSY9NS0X9H	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHWQ1E01GAZ69JPFQV9	pset_01M3704JM319ZX34A9K4NWHJ00	pvps_01M3704JNGYFVN6PMPM8KJN99Z	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHWHRH1GJTBWMS2NT66	pset_01M3704JM35Z902A0BRK81P1C8	pvps_01M3704JNGXZCW7Q7BFDT2KVKP	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHXD9YMGMFDZSX0APEK	pset_01M3704JM3PCGSV651AENXCMBA	pvps_01M3704JNGDC61K589MB08BNX9	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHX2D2WD0RBBX34R0JZ	pset_01M3704JM33S35063FNF9HB50T	pvps_01M3704JNGR4BZCQB13YBY8CP1	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHXFWE5YPP6ZVR4D498	pset_01M3704JM3PPQVMJ7CZNDYPXJ5	pvps_01M3704JNGDMJFGSD1STGEE44Y	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHXBYG70PZHJ3V5BF78	pset_01M3704JM3TZ4KDTXC9PTX5PN2	pvps_01M3704JNG50RHCYTY84D6J7ZX	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHXD7ZQCQRKMFDS8YBM	pset_01M3704JM310MSHTZ50PW5KXW4	pvps_01M3704JNGXMVERKJTWGPCQEPD	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHXQ5NY7S005S2R6FJE	pset_01M3704JM3TBJ3Z24WBF9TX02N	pvps_01M3704JNGV6054F3W74A9CAD1	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHXSF70W7FBADE803T6	pset_01M3704JM3GFZ0E4493QXBHZG8	pvps_01M3704JNG12PGZAM1DPNW6M3X	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHXVWXTTWGYD0PVJA2J	pset_01M3704JM3CMCGRS5EPD06NHW6	pvps_01M3704JNG57A59867WTM6NVND	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHXZFYJSYHQ740G7Y0W	pset_01M3704JM3MNNP808QXN6QS7CY	pvps_01M3704JNGM0XATMQA1X816TV5	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHXXYVDEPQ463226WSB	pset_01M3704JM3V3Y5354KTXP03B12	pvps_01M3704JNG1MBVF0SQE2FTS0Y8	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M3704JHXDYC8K9A90N2TE5HR	pset_01M3704JM3AD62MZ7M7G2AQDD1	pvps_01M3704JNGH6R5XJVB0T1K936Z	2026-09-23 14:24:11.822207+03	2026-09-23 14:24:11.822207+03	\N
variant_01M373HQKK1R4AGM3D7G5HSC7Z	pset_01M373HQN45EFGN61XKPDMBF1F	pvps_01M373HQP7ZE31Q17G91XZ8GRF	2026-09-23 15:23:48.678964+03	2026-09-23 15:23:57.844+03	2026-09-23 15:23:57.843+03
variant_01M374VNB384RW2TJTDAVBM1ZH	pset_01M374VNC1RXC8RBVPPY5YFRN0	pvps_01M374VNCND5GZN75GTJZRN5XT	2026-09-23 15:46:42.581115+03	2026-09-23 15:46:42.581115+03	\N
\.


--
-- Data for Name: product_variant_product_image; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_variant_product_image (id, variant_id, image_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: promotion; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.promotion (id, code, campaign_id, is_automatic, type, created_at, updated_at, deleted_at, status, is_tax_inclusive, "limit", used, metadata) FROM stdin;
\.


--
-- Data for Name: promotion_application_method; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.promotion_application_method (id, value, raw_value, max_quantity, apply_to_quantity, buy_rules_min_quantity, type, target_type, allocation, promotion_id, created_at, updated_at, deleted_at, currency_code) FROM stdin;
\.


--
-- Data for Name: promotion_campaign; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.promotion_campaign (id, name, description, campaign_identifier, starts_at, ends_at, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: promotion_campaign_budget; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.promotion_campaign_budget (id, type, campaign_id, "limit", raw_limit, used, raw_used, created_at, updated_at, deleted_at, currency_code, attribute) FROM stdin;
\.


--
-- Data for Name: promotion_campaign_budget_usage; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.promotion_campaign_budget_usage (id, attribute_value, used, budget_id, raw_used, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: promotion_promotion_rule; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.promotion_promotion_rule (promotion_id, promotion_rule_id) FROM stdin;
\.


--
-- Data for Name: promotion_rule; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.promotion_rule (id, description, attribute, operator, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: promotion_rule_value; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.promotion_rule_value (id, promotion_rule_id, value, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: property_label; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.property_label (id, entity, property, label, description, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: provider_identity; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.provider_identity (id, entity_id, provider, auth_identity_id, user_metadata, provider_metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: publishable_api_key_sales_channel; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.publishable_api_key_sales_channel (publishable_key_id, sales_channel_id, id, created_at, updated_at, deleted_at) FROM stdin;
apk_01M3704J2C68K29YMKH1JFEQGZ	sc_01M3704J236RKB65YSHQCQK2JB	pksc_01M3704J2TMC622BBN8BVZGGXW	2026-09-23 14:24:11.226821+03	2026-09-23 14:24:11.226821+03	\N
\.


--
-- Data for Name: refund; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.refund (id, amount, raw_amount, payment_id, created_at, updated_at, deleted_at, created_by, metadata, refund_reason_id, note) FROM stdin;
\.


--
-- Data for Name: refund_reason; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.refund_reason (id, label, description, metadata, created_at, updated_at, deleted_at, code) FROM stdin;
refr_01M3704965H8SCCS5HDR0JJ2SJ	Shipping Issue	Refund due to lost, delayed, or misdelivered shipment	\N	2026-09-23 14:24:01.88378+03	2026-09-23 14:24:01.88378+03	\N	shipping_issue
refr_01M3704965YR55RF95SQ8Y9T4G	Customer Care Adjustment	Refund given as goodwill or compensation for inconvenience	\N	2026-09-23 14:24:01.88378+03	2026-09-23 14:24:01.88378+03	\N	customer_care_adjustment
refr_01M3704965WT421T035HFMAXXJ	Pricing Error	Refund to correct an overcharge, missing discount, or incorrect price	\N	2026-09-23 14:24:01.88378+03	2026-09-23 14:24:01.88378+03	\N	pricing_error
\.


--
-- Data for Name: region; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.region (id, name, currency_code, metadata, created_at, updated_at, deleted_at, automatic_taxes) FROM stdin;
reg_01M3704J3SDN42VG9GH3108N5F	Türkiye	try	\N	2026-09-23 14:24:11.263+03	2026-09-23 14:24:11.263+03	\N	t
\.


--
-- Data for Name: region_country; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.region_country (iso_2, iso_3, num_code, name, display_name, region_id, metadata, created_at, updated_at, deleted_at) FROM stdin;
af	afg	004	AFGHANISTAN	Afghanistan	\N	\N	2026-09-23 14:24:07.522+03	2026-09-23 14:24:07.523+03	\N
al	alb	008	ALBANIA	Albania	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
dz	dza	012	ALGERIA	Algeria	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
as	asm	016	AMERICAN SAMOA	American Samoa	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
ad	and	020	ANDORRA	Andorra	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
ao	ago	024	ANGOLA	Angola	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
ai	aia	660	ANGUILLA	Anguilla	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
aq	ata	010	ANTARCTICA	Antarctica	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
ag	atg	028	ANTIGUA AND BARBUDA	Antigua and Barbuda	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
ar	arg	032	ARGENTINA	Argentina	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
am	arm	051	ARMENIA	Armenia	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
aw	abw	533	ARUBA	Aruba	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
au	aus	036	AUSTRALIA	Australia	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
at	aut	040	AUSTRIA	Austria	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
az	aze	031	AZERBAIJAN	Azerbaijan	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
bs	bhs	044	BAHAMAS	Bahamas	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
bh	bhr	048	BAHRAIN	Bahrain	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
bd	bgd	050	BANGLADESH	Bangladesh	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
bb	brb	052	BARBADOS	Barbados	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
by	blr	112	BELARUS	Belarus	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
be	bel	056	BELGIUM	Belgium	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
bz	blz	084	BELIZE	Belize	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
bj	ben	204	BENIN	Benin	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
bm	bmu	060	BERMUDA	Bermuda	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
bt	btn	064	BHUTAN	Bhutan	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
bo	bol	068	BOLIVIA	Bolivia	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
bq	bes	535	BONAIRE, SINT EUSTATIUS AND SABA	Bonaire, Sint Eustatius and Saba	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
ba	bih	070	BOSNIA AND HERZEGOVINA	Bosnia and Herzegovina	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
bw	bwa	072	BOTSWANA	Botswana	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
bv	bvd	074	BOUVET ISLAND	Bouvet Island	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
br	bra	076	BRAZIL	Brazil	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
io	iot	086	BRITISH INDIAN OCEAN TERRITORY	British Indian Ocean Territory	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
bn	brn	096	BRUNEI DARUSSALAM	Brunei Darussalam	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
bg	bgr	100	BULGARIA	Bulgaria	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
bf	bfa	854	BURKINA FASO	Burkina Faso	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
bi	bdi	108	BURUNDI	Burundi	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
kh	khm	116	CAMBODIA	Cambodia	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
cm	cmr	120	CAMEROON	Cameroon	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.523+03	\N
ca	can	124	CANADA	Canada	\N	\N	2026-09-23 14:24:07.523+03	2026-09-23 14:24:07.524+03	\N
cv	cpv	132	CAPE VERDE	Cape Verde	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
ky	cym	136	CAYMAN ISLANDS	Cayman Islands	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
cf	caf	140	CENTRAL AFRICAN REPUBLIC	Central African Republic	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
td	tcd	148	CHAD	Chad	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
cl	chl	152	CHILE	Chile	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
cn	chn	156	CHINA	China	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
cx	cxr	162	CHRISTMAS ISLAND	Christmas Island	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
cc	cck	166	COCOS (KEELING) ISLANDS	Cocos (Keeling) Islands	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
co	col	170	COLOMBIA	Colombia	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
km	com	174	COMOROS	Comoros	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
cg	cog	178	CONGO	Congo	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
cd	cod	180	CONGO, THE DEMOCRATIC REPUBLIC OF THE	Congo, the Democratic Republic of the	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
ck	cok	184	COOK ISLANDS	Cook Islands	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
cr	cri	188	COSTA RICA	Costa Rica	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
ci	civ	384	COTE D'IVOIRE	Cote D'Ivoire	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
hr	hrv	191	CROATIA	Croatia	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
cu	cub	192	CUBA	Cuba	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
cw	cuw	531	CURAÇAO	Curaçao	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
cy	cyp	196	CYPRUS	Cyprus	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
cz	cze	203	CZECH REPUBLIC	Czech Republic	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
dk	dnk	208	DENMARK	Denmark	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
dj	dji	262	DJIBOUTI	Djibouti	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
dm	dma	212	DOMINICA	Dominica	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
do	dom	214	DOMINICAN REPUBLIC	Dominican Republic	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
ec	ecu	218	ECUADOR	Ecuador	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
eg	egy	818	EGYPT	Egypt	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
sv	slv	222	EL SALVADOR	El Salvador	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
gq	gnq	226	EQUATORIAL GUINEA	Equatorial Guinea	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
er	eri	232	ERITREA	Eritrea	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
ee	est	233	ESTONIA	Estonia	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
et	eth	231	ETHIOPIA	Ethiopia	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
fk	flk	238	FALKLAND ISLANDS (MALVINAS)	Falkland Islands (Malvinas)	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
fo	fro	234	FAROE ISLANDS	Faroe Islands	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
fj	fji	242	FIJI	Fiji	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
fi	fin	246	FINLAND	Finland	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
fr	fra	250	FRANCE	France	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
gf	guf	254	FRENCH GUIANA	French Guiana	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
pf	pyf	258	FRENCH POLYNESIA	French Polynesia	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
tf	atf	260	FRENCH SOUTHERN TERRITORIES	French Southern Territories	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
ga	gab	266	GABON	Gabon	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
gm	gmb	270	GAMBIA	Gambia	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
ge	geo	268	GEORGIA	Georgia	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
de	deu	276	GERMANY	Germany	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
gh	gha	288	GHANA	Ghana	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
gi	gib	292	GIBRALTAR	Gibraltar	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
gr	grc	300	GREECE	Greece	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
gl	grl	304	GREENLAND	Greenland	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
gd	grd	308	GRENADA	Grenada	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
gp	glp	312	GUADELOUPE	Guadeloupe	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
gu	gum	316	GUAM	Guam	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
gt	gtm	320	GUATEMALA	Guatemala	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
gg	ggy	831	GUERNSEY	Guernsey	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
gn	gin	324	GUINEA	Guinea	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
gw	gnb	624	GUINEA-BISSAU	Guinea-Bissau	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
gy	guy	328	GUYANA	Guyana	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
ht	hti	332	HAITI	Haiti	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
hm	hmd	334	HEARD ISLAND AND MCDONALD ISLANDS	Heard Island And Mcdonald Islands	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
va	vat	336	HOLY SEE (VATICAN CITY STATE)	Holy See (Vatican City State)	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
hn	hnd	340	HONDURAS	Honduras	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
hk	hkg	344	HONG KONG	Hong Kong	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
hu	hun	348	HUNGARY	Hungary	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
is	isl	352	ICELAND	Iceland	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
in	ind	356	INDIA	India	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
id	idn	360	INDONESIA	Indonesia	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
ir	irn	364	IRAN, ISLAMIC REPUBLIC OF	Iran, Islamic Republic of	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
iq	irq	368	IRAQ	Iraq	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
ie	irl	372	IRELAND	Ireland	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
im	imn	833	ISLE OF MAN	Isle Of Man	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
il	isr	376	ISRAEL	Israel	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
it	ita	380	ITALY	Italy	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
jm	jam	388	JAMAICA	Jamaica	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
jp	jpn	392	JAPAN	Japan	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
je	jey	832	JERSEY	Jersey	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
jo	jor	400	JORDAN	Jordan	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
kz	kaz	398	KAZAKHSTAN	Kazakhstan	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
ke	ken	404	KENYA	Kenya	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
ki	kir	296	KIRIBATI	Kiribati	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
kp	prk	408	KOREA, DEMOCRATIC PEOPLE'S REPUBLIC OF	Korea, Democratic People's Republic of	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
kr	kor	410	KOREA, REPUBLIC OF	Korea, Republic of	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
xk	xkx	900	KOSOVO	Kosovo	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
kw	kwt	414	KUWAIT	Kuwait	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
kg	kgz	417	KYRGYZSTAN	Kyrgyzstan	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
la	lao	418	LAO PEOPLE'S DEMOCRATIC REPUBLIC	Lao People's Democratic Republic	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
lv	lva	428	LATVIA	Latvia	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
lb	lbn	422	LEBANON	Lebanon	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
ls	lso	426	LESOTHO	Lesotho	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
lr	lbr	430	LIBERIA	Liberia	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
ly	lby	434	LIBYA	Libya	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
li	lie	438	LIECHTENSTEIN	Liechtenstein	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
lt	ltu	440	LITHUANIA	Lithuania	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
lu	lux	442	LUXEMBOURG	Luxembourg	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
mo	mac	446	MACAO	Macao	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
mg	mdg	450	MADAGASCAR	Madagascar	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
mw	mwi	454	MALAWI	Malawi	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
my	mys	458	MALAYSIA	Malaysia	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
mv	mdv	462	MALDIVES	Maldives	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
ml	mli	466	MALI	Mali	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
mt	mlt	470	MALTA	Malta	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
mh	mhl	584	MARSHALL ISLANDS	Marshall Islands	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
mq	mtq	474	MARTINIQUE	Martinique	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
mr	mrt	478	MAURITANIA	Mauritania	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
mu	mus	480	MAURITIUS	Mauritius	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
yt	myt	175	MAYOTTE	Mayotte	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
mx	mex	484	MEXICO	Mexico	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
fm	fsm	583	MICRONESIA, FEDERATED STATES OF	Micronesia, Federated States of	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
md	mda	498	MOLDOVA, REPUBLIC OF	Moldova, Republic of	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
mc	mco	492	MONACO	Monaco	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
mn	mng	496	MONGOLIA	Mongolia	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
me	mne	499	MONTENEGRO	Montenegro	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
ms	msr	500	MONTSERRAT	Montserrat	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
ma	mar	504	MOROCCO	Morocco	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
mz	moz	508	MOZAMBIQUE	Mozambique	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
mm	mmr	104	MYANMAR	Myanmar	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
na	nam	516	NAMIBIA	Namibia	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
nr	nru	520	NAURU	Nauru	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
np	npl	524	NEPAL	Nepal	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
nl	nld	528	NETHERLANDS	Netherlands	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
nc	ncl	540	NEW CALEDONIA	New Caledonia	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
nz	nzl	554	NEW ZEALAND	New Zealand	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
ni	nic	558	NICARAGUA	Nicaragua	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
ne	ner	562	NIGER	Niger	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
ng	nga	566	NIGERIA	Nigeria	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
nu	niu	570	NIUE	Niue	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
nf	nfk	574	NORFOLK ISLAND	Norfolk Island	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
mk	mkd	807	NORTH MACEDONIA	North Macedonia	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
mp	mnp	580	NORTHERN MARIANA ISLANDS	Northern Mariana Islands	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
no	nor	578	NORWAY	Norway	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
om	omn	512	OMAN	Oman	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
pk	pak	586	PAKISTAN	Pakistan	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
pw	plw	585	PALAU	Palau	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
ps	pse	275	PALESTINIAN TERRITORY, OCCUPIED	Palestinian Territory, Occupied	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
pa	pan	591	PANAMA	Panama	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
pg	png	598	PAPUA NEW GUINEA	Papua New Guinea	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
py	pry	600	PARAGUAY	Paraguay	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
pe	per	604	PERU	Peru	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
ph	phl	608	PHILIPPINES	Philippines	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
pn	pcn	612	PITCAIRN	Pitcairn	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
pl	pol	616	POLAND	Poland	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
pt	prt	620	PORTUGAL	Portugal	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
pr	pri	630	PUERTO RICO	Puerto Rico	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
qa	qat	634	QATAR	Qatar	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
re	reu	638	REUNION	Reunion	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
ro	rom	642	ROMANIA	Romania	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
ru	rus	643	RUSSIAN FEDERATION	Russian Federation	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
rw	rwa	646	RWANDA	Rwanda	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
bl	blm	652	SAINT BARTHÉLEMY	Saint Barthélemy	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
sh	shn	654	SAINT HELENA	Saint Helena	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
kn	kna	659	SAINT KITTS AND NEVIS	Saint Kitts and Nevis	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
lc	lca	662	SAINT LUCIA	Saint Lucia	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
mf	maf	663	SAINT MARTIN (FRENCH PART)	Saint Martin (French part)	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
pm	spm	666	SAINT PIERRE AND MIQUELON	Saint Pierre and Miquelon	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
vc	vct	670	SAINT VINCENT AND THE GRENADINES	Saint Vincent and the Grenadines	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
ws	wsm	882	SAMOA	Samoa	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
sm	smr	674	SAN MARINO	San Marino	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
st	stp	678	SAO TOME AND PRINCIPE	Sao Tome and Principe	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
sa	sau	682	SAUDI ARABIA	Saudi Arabia	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
sn	sen	686	SENEGAL	Senegal	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
rs	srb	688	SERBIA	Serbia	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
sc	syc	690	SEYCHELLES	Seychelles	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
sl	sle	694	SIERRA LEONE	Sierra Leone	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
sg	sgp	702	SINGAPORE	Singapore	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
sx	sxm	534	SINT MAARTEN	Sint Maarten	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
sk	svk	703	SLOVAKIA	Slovakia	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
si	svn	705	SLOVENIA	Slovenia	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
sb	slb	090	SOLOMON ISLANDS	Solomon Islands	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
so	som	706	SOMALIA	Somalia	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
za	zaf	710	SOUTH AFRICA	South Africa	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
gs	sgs	239	SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS	South Georgia and the South Sandwich Islands	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
ss	ssd	728	SOUTH SUDAN	South Sudan	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
es	esp	724	SPAIN	Spain	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
lk	lka	144	SRI LANKA	Sri Lanka	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
sd	sdn	729	SUDAN	Sudan	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
sr	sur	740	SURINAME	Suriname	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
sj	sjm	744	SVALBARD AND JAN MAYEN	Svalbard and Jan Mayen	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
sz	swz	748	SWAZILAND	Swaziland	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
se	swe	752	SWEDEN	Sweden	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
ch	che	756	SWITZERLAND	Switzerland	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
sy	syr	760	SYRIAN ARAB REPUBLIC	Syrian Arab Republic	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
tw	twn	158	TAIWAN, PROVINCE OF CHINA	Taiwan, Province of China	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
tj	tjk	762	TAJIKISTAN	Tajikistan	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
tz	tza	834	TANZANIA, UNITED REPUBLIC OF	Tanzania, United Republic of	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
th	tha	764	THAILAND	Thailand	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
tl	tls	626	TIMOR LESTE	Timor Leste	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
tg	tgo	768	TOGO	Togo	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
tk	tkl	772	TOKELAU	Tokelau	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
to	ton	776	TONGA	Tonga	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
tt	tto	780	TRINIDAD AND TOBAGO	Trinidad and Tobago	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
tn	tun	788	TUNISIA	Tunisia	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
tm	tkm	795	TURKMENISTAN	Turkmenistan	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
tc	tca	796	TURKS AND CAICOS ISLANDS	Turks and Caicos Islands	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
tv	tuv	798	TUVALU	Tuvalu	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
ug	uga	800	UGANDA	Uganda	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
ua	ukr	804	UKRAINE	Ukraine	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
ae	are	784	UNITED ARAB EMIRATES	United Arab Emirates	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
gb	gbr	826	UNITED KINGDOM	United Kingdom	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
us	usa	840	UNITED STATES	United States	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
um	umi	581	UNITED STATES MINOR OUTLYING ISLANDS	United States Minor Outlying Islands	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
uy	ury	858	URUGUAY	Uruguay	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
uz	uzb	860	UZBEKISTAN	Uzbekistan	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
vu	vut	548	VANUATU	Vanuatu	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
ve	ven	862	VENEZUELA	Venezuela	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
vn	vnm	704	VIET NAM	Viet Nam	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
vg	vgb	092	VIRGIN ISLANDS, BRITISH	Virgin Islands, British	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
vi	vir	850	VIRGIN ISLANDS, U.S.	Virgin Islands, U.S.	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
wf	wlf	876	WALLIS AND FUTUNA	Wallis and Futuna	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
eh	esh	732	WESTERN SAHARA	Western Sahara	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
ye	yem	887	YEMEN	Yemen	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
zm	zmb	894	ZAMBIA	Zambia	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
zw	zwe	716	ZIMBABWE	Zimbabwe	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
ax	ala	248	ÅLAND ISLANDS	Åland Islands	\N	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:07.524+03	\N
tr	tur	792	TURKEY	Turkey	reg_01M3704J3SDN42VG9GH3108N5F	\N	2026-09-23 14:24:07.524+03	2026-09-23 14:24:11.263+03	\N
\.


--
-- Data for Name: region_payment_provider; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.region_payment_provider (region_id, payment_provider_id, id, created_at, updated_at, deleted_at) FROM stdin;
reg_01M3704J3SDN42VG9GH3108N5F	pp_system_default	regpp_01M3704J4ECCBPGJP5RFAH74P0	2026-09-23 14:24:11.278197+03	2026-09-23 14:24:11.278197+03	\N
\.


--
-- Data for Name: reservation_item; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reservation_item (id, created_at, updated_at, deleted_at, line_item_id, location_id, quantity, external_id, description, created_by, metadata, inventory_item_id, allow_backorder, raw_quantity) FROM stdin;
\.


--
-- Data for Name: return; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.return (id, order_id, claim_id, exchange_id, order_version, display_id, status, no_notification, refund_amount, raw_refund_amount, metadata, created_at, updated_at, deleted_at, received_at, canceled_at, location_id, requested_at, created_by) FROM stdin;
\.


--
-- Data for Name: return_fulfillment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.return_fulfillment (return_id, fulfillment_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: return_item; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.return_item (id, return_id, reason_id, item_id, quantity, raw_quantity, received_quantity, raw_received_quantity, note, metadata, created_at, updated_at, deleted_at, damaged_quantity, raw_damaged_quantity) FROM stdin;
\.


--
-- Data for Name: return_reason; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.return_reason (id, value, label, description, metadata, parent_return_reason_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: sales_channel; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sales_channel (id, name, description, is_disabled, metadata, created_at, updated_at, deleted_at) FROM stdin;
sc_01M3704J236RKB65YSHQCQK2JB	SEENERGY Web	seenergy storefront	f	\N	2026-09-23 14:24:11.203+03	2026-09-23 14:24:11.203+03	\N
\.


--
-- Data for Name: sales_channel_stock_location; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sales_channel_stock_location (sales_channel_id, stock_location_id, id, created_at, updated_at, deleted_at) FROM stdin;
sc_01M3704J236RKB65YSHQCQK2JB	sloc_01M3704J5592G9WZNZPBHXKDQR	scloc_01M3704J9DK1B3APA3R5MKM1Q0	2026-09-23 14:24:11.43815+03	2026-09-23 14:24:11.43815+03	\N
\.


--
-- Data for Name: script_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.script_migrations (id, script_name, created_at, finished_at) FROM stdin;
1	migrate-normalize-currency-codes-normalization.js	2026-09-23 14:24:10.324415+03	2026-09-23 14:24:10.374433+03
2	migrate-product-option-link-ids.js	2026-09-23 14:24:10.380651+03	2026-09-23 14:24:10.388024+03
3	migrate-product-shipping-profile.js	2026-09-23 14:24:11.14136+03	2026-09-23 14:24:11.165106+03
4	migrate-tax-region-provider.js	2026-09-23 14:24:11.168318+03	2026-09-23 14:24:11.175753+03
5	reconcile-inventory-reserved-quantity.js	2026-09-23 14:24:11.178325+03	2026-09-23 14:24:11.187601+03
6	initial-data-seed.ts	2026-09-23 14:24:11.200088+03	2026-09-23 14:24:11.905135+03
7	vitrin-seed.ts	2026-09-23 15:05:26.762688+03	2026-09-23 15:05:26.798747+03
8	vitrin-upgrade-campaign-cards.ts	2026-09-26 12:25:24.10454+03	2026-09-26 12:25:24.125658+03
9	security-category-tree.ts	2026-09-29 16:50:53.353034+03	2026-09-29 16:50:53.958348+03
\.


--
-- Data for Name: search_index; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.search_index (id, name, created_at, updated_at, deleted_at, active_version) FROM stdin;
srhidx_01M3704EN2CWAKF1GZWQ1YS635	product	2026-09-23 14:24:07.714+03	2026-09-23 14:25:10.98+03	\N	1
\.


--
-- Data for Name: search_index_sync; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.search_index_sync (id, job_id, status, filters, last_key, documents_synced, started_at, completed_at, error, search_index_version_id, created_at, updated_at, deleted_at, resumable) FROM stdin;
srhsync_01M3706CDHK2CQ63H7NF7RBJZN	e312cf97-becf-4596-a6ab-4b986072f9af	done	\N	\N	0	2026-09-23 14:25:10.96+03	2026-09-23 14:25:10.97+03	\N	srhver_01M3704EN45CWRNJRB4CXMVFVV	2026-09-23 14:25:10.961+03	2026-09-23 14:25:10.972+03	\N	f
srhsync_01M3706A6WK1SBHDRT5DSZPY5R	e312cf97-becf-4596-a6ab-4b986072f9af	done	\N	prod_01M3704JBDZBTN971SS3T5QE9B	59	2026-09-23 14:25:08.697+03	2026-09-23 14:25:10.981+03	\N	srhver_01M3704EN45CWRNJRB4CXMVFVV	2026-09-23 14:25:08.7+03	2026-09-23 14:25:10.983+03	\N	f
\.


--
-- Data for Name: search_index_version; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.search_index_version (id, version, provider, physical_name, definition_hash, status, search_index_id, created_at, updated_at, deleted_at) FROM stdin;
srhver_01M3704EN45CWRNJRB4CXMVFVV	1	search-postgres	product_v1	324ab6ef68362abc058dc1b556ccf9f4	ready	srhidx_01M3704EN2CWAKF1GZWQ1YS635	2026-09-23 14:24:07.716+03	2026-09-23 14:25:10.976+03	\N
\.


--
-- Data for Name: search_pg_product_v1; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.search_pg_product_v1 (id, document, indexed, search_vector, search_text, created_at, updated_at) FROM stdin;
prod_01M3704JBC1SP3M5ZRW05WXB7P	{"id": "prod_01M3704JBC1SP3M5ZRW05WXB7P", "title": "Voltra VT-CAM1 Araç İçi Kayıt Kamerası Full HD", "handle": "voltra-vt-cam1-arac-i-ci-kayit-kamerasi-full-hd", "labels": [], "status": "published", "category": ["Araç Kameraları"], "thumbnail": "http://localhost:3100/mock/products/camera-black.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBC1SP3M5ZRW05WXB7P", "title": "Voltra VT-CAM1 Araç İçi Kayıt Kamerası Full HD", "handle": "voltra-vt-cam1-arac-i-ci-kayit-kamerasi-full-hd", "status": "published", "category": ["Araç Kameraları"], "thumbnail": "http://localhost:3100/mock/products/camera-black.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'arac':5A 'cam1':4A 'full':9A 'hd':10A 'ici':6A 'kamerasi':8A 'kayit':7A 'model':11B 'standart':12B 'voltra':1A 'vt':3A 'vt-cam1':2A	Voltra VT-CAM1 Araç İçi Kayıt Kamerası Full HD Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:17.921352+03
prod_01M3704JBC0YEWMERTH5QW3DNK	{"id": "prod_01M3704JBC0YEWMERTH5QW3DNK", "title": "Vizyontek VT-330 Android TV Box Kumanda Seti", "handle": "vizyontek-vt-330-android-tv-box-kumanda-seti", "labels": [], "status": "published", "category": ["Kumanda Çeşitleri"], "thumbnail": "http://localhost:3100/mock/products/remote-white.svg", "created_at": "2026-09-23T11:24:11.528Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBC0YEWMERTH5QW3DNK", "title": "Vizyontek VT-330 Android TV Box Kumanda Seti", "handle": "vizyontek-vt-330-android-tv-box-kumanda-seti", "status": "published", "category": ["Kumanda Çeşitleri"], "thumbnail": "http://localhost:3100/mock/products/remote-white.svg", "created_at": 1790162651528, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-330':3A 'android':4A 'box':6A 'kumanda':7A 'model':9B 'seti':8A 'standart':10B 'tv':5A 'vizyontek':1A 'vt':2A	Vizyontek VT-330 Android TV Box Kumanda Seti Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.137201+03
prod_01M3704JBC39NJ7X4SYRYGEQDR	{"id": "prod_01M3704JBC39NJ7X4SYRYGEQDR", "title": "Bataryam BT-18650 Şarj Edilebilir Li-ion Pil 6lı Set", "handle": "bataryam-bt-18650-sarj-edilebilir-li-ion-pil-6li-set", "labels": [], "status": "published", "category": ["Adaptör, Akü, Pil"], "thumbnail": "http://localhost:3100/mock/products/battery-white.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBC39NJ7X4SYRYGEQDR", "title": "Bataryam BT-18650 Şarj Edilebilir Li-ion Pil 6lı Set", "handle": "bataryam-bt-18650-sarj-edilebilir-li-ion-pil-6li-set", "status": "published", "category": ["Adaptör, Akü, Pil"], "thumbnail": "http://localhost:3100/mock/products/battery-white.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-18650':3A '6lı':10A 'bataryam':1A 'bt':2A 'edilebilir':5A 'ion':8A 'li':7A 'li-ion':6A 'model':12B 'pil':9A 'sarj':4A 'set':11A 'standart':13B	Bataryam BT-18650 Şarj Edilebilir Li-ion Pil 6lı Set Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.374651+03
prod_01M3704JBC20RM7KAAK0W787NZ	{"id": "prod_01M3704JBC20RM7KAAK0W787NZ", "title": "Devrelab DL-PSU30 Ayarlı Güç Kaynağı 30V 5A", "handle": "devrelab-dl-psu30-ayarli-guc-kaynagi-30v-5a", "labels": [], "status": "published", "category": ["Ölçü Aletleri"], "thumbnail": "http://localhost:3100/mock/products/meter-white.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBC20RM7KAAK0W787NZ", "title": "Devrelab DL-PSU30 Ayarlı Güç Kaynağı 30V 5A", "handle": "devrelab-dl-psu30-ayarli-guc-kaynagi-30v-5a", "status": "published", "category": ["Ölçü Aletleri"], "thumbnail": "http://localhost:3100/mock/products/meter-white.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'30v':8A '5a':9A 'ayar':5A 'devrelab':1A 'dl':3A 'dl-psu30':2A 'guc':6A 'kaynagi':7A 'model':10B 'psu30':4A 'standart':11B	Devrelab DL-PSU30 Ayarlı Güç Kaynağı 30V 5A Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.513151+03
prod_01M3704JBC1NDGX04H6ZDMP2WD	{"id": "prod_01M3704JBC1NDGX04H6ZDMP2WD", "title": "Digiwave DW-EXT Menzil Genişletici Wi-Fi 6", "handle": "digiwave-dw-ext-menzil-genisletici-wi-fi-6", "labels": [], "status": "published", "category": ["Access Point / Router"], "thumbnail": "http://localhost:3100/mock/products/router-silver.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBC1NDGX04H6ZDMP2WD", "title": "Digiwave DW-EXT Menzil Genişletici Wi-Fi 6", "handle": "digiwave-dw-ext-menzil-genisletici-wi-fi-6", "status": "published", "category": ["Access Point / Router"], "thumbnail": "http://localhost:3100/mock/products/router-silver.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'6':10A 'digiwav':1A 'dw':3A 'dw-ext':2A 'ext':4A 'fi':9A 'genisletici':6A 'menzil':5A 'model':11B 'standart':12B 'wi':8A 'wi-fi':7A	Digiwave DW-EXT Menzil Genişletici Wi-Fi 6 Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:20.148731+03
prod_01M3704JBC53GPRKB7AMPF4Z8W	{"id": "prod_01M3704JBC53GPRKB7AMPF4Z8W", "title": "Sesyapı SY-40 Tavan Hoparlörü 6\\" 40W Beyaz", "handle": "sesyapi-sy-40-tavan-hoparloru-6-40w-beyaz", "labels": [], "status": "published", "category": ["Seslendirme Sistemleri"], "thumbnail": "http://localhost:3100/mock/products/speaker-white.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBC53GPRKB7AMPF4Z8W", "title": "Sesyapı SY-40 Tavan Hoparlörü 6\\" 40W Beyaz", "handle": "sesyapi-sy-40-tavan-hoparloru-6-40w-beyaz", "status": "published", "category": ["Seslendirme Sistemleri"], "thumbnail": "http://localhost:3100/mock/products/speaker-white.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-40':3A '40w':7A '6':6A 'beyaz':8A 'hoparloru':5A 'model':9B 'sesyapi':1A 'standart':10B 'sy':2A 'tavan':4A	Sesyapı SY-40 Tavan Hoparlörü 6" 40W Beyaz Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.028404+03
prod_01M3704JBC3HDVBT8BGS9QSXPE	{"id": "prod_01M3704JBC3HDVBT8BGS9QSXPE", "title": "Ledora LD-5540 55\\" Televizyon Led Bar Takımı 4K Panel", "handle": "ledora-ld-5540-55-televizyon-led-bar-takimi-4k-panel", "labels": [], "status": "published", "category": ["Led ve Aydınlatma"], "thumbnail": "http://localhost:3100/mock/products/ledbar-white.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBC3HDVBT8BGS9QSXPE", "title": "Ledora LD-5540 55\\" Televizyon Led Bar Takımı 4K Panel", "handle": "ledora-ld-5540-55-televizyon-led-bar-takimi-4k-panel", "status": "published", "category": ["Led ve Aydınlatma"], "thumbnail": "http://localhost:3100/mock/products/ledbar-white.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-5540':3A '4k':9A '55':4A 'bar':7A 'ld':2A 'led':6A 'ledora':1A 'model':11B 'panel':10A 'standart':12B 'takimi':8A 'televizyon':5A	Ledora LD-5540 55" Televizyon Led Bar Takımı 4K Panel Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.339801+03
prod_01M3704JBC7GVJT1NVWQHXACTH	{"id": "prod_01M3704JBC7GVJT1NVWQHXACTH", "title": "Powerin PW-19653 19V 6.53A Notebook Adaptörü", "handle": "powerin-pw-19653-19v-6-53a-notebook-adaptoru", "labels": [], "status": "published", "category": ["Adaptör, Akü, Pil"], "thumbnail": "http://localhost:3100/mock/products/adapter-graphite.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBC7GVJT1NVWQHXACTH", "title": "Powerin PW-19653 19V 6.53A Notebook Adaptörü", "handle": "powerin-pw-19653-19v-6-53a-notebook-adaptoru", "status": "published", "category": ["Adaptör, Akü, Pil"], "thumbnail": "http://localhost:3100/mock/products/adapter-graphite.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-19653':3A '19v':4A '6.53':5A 'adaptoru':8A 'model':9B 'notebook':7A 'powerin':1A 'pw':2A 'standart':10B	Powerin PW-19653 19V 6.53A Notebook Adaptörü Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.374651+03
prod_01M3704JBC46SCQVGHC69CRN5B	{"id": "prod_01M3704JBC46SCQVGHC69CRN5B", "title": "Metrion MT-330 Pens Ampermetre AC/DC 600A", "handle": "metrion-mt-330-pens-ampermetre-ac-dc-600a", "labels": [], "status": "published", "category": ["Ölçü Aletleri"], "thumbnail": "http://localhost:3100/mock/products/meter-black.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBC46SCQVGHC69CRN5B", "title": "Metrion MT-330 Pens Ampermetre AC/DC 600A", "handle": "metrion-mt-330-pens-ampermetre-ac-dc-600a", "status": "published", "category": ["Ölçü Aletleri"], "thumbnail": "http://localhost:3100/mock/products/meter-black.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-330':3A '600a':7A 'ac/dc':6A 'ampermetr':5A 'metrion':1A 'model':8B 'mt':2A 'pen':4A 'standart':9B	Metrion MT-330 Pens Ampermetre AC/DC 600A Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.513151+03
prod_01M3704JBCDCPWAV799W5MDB2Q	{"id": "prod_01M3704JBCDCPWAV799W5MDB2Q", "title": "Antenix AX-4400 Kaskatlı Uydu Santrali 4 Çıkışlı", "handle": "antenix-ax-4400-kaskatli-uydu-santrali-4-cikisli", "labels": [], "status": "published", "category": ["Uydu Sistemleri"], "thumbnail": "http://localhost:3100/mock/products/receiver-silver.svg", "created_at": "2026-09-23T11:24:11.528Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBCDCPWAV799W5MDB2Q", "title": "Antenix AX-4400 Kaskatlı Uydu Santrali 4 Çıkışlı", "handle": "antenix-ax-4400-kaskatli-uydu-santrali-4-cikisli", "status": "published", "category": ["Uydu Sistemleri"], "thumbnail": "http://localhost:3100/mock/products/receiver-silver.svg", "created_at": 1790162651528, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-4400':3A '4':7A 'antenix':1A 'ax':2A 'cikisli':8A 'kaskat':4A 'model':9B 'santrali':6A 'standart':10B 'uydu':5A	Antenix AX-4400 Kaskatlı Uydu Santrali 4 Çıkışlı Model:Standart	2026-09-23 14:25:10.72712+03	2026-09-23 14:25:10.72712+03
prod_01M3704JBCBD3VXS7HH1HDG4S9	{"id": "prod_01M3704JBCBD3VXS7HH1HDG4S9", "title": "Kumandax KX-210 Klima Kumandası Çok Markalı", "handle": "kumandax-kx-210-klima-kumandasi-cok-markali", "labels": [], "status": "published", "category": ["Kumanda Çeşitleri"], "thumbnail": "http://localhost:3100/mock/products/acremote-white.svg", "created_at": "2026-09-23T11:24:11.528Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBCBD3VXS7HH1HDG4S9", "title": "Kumandax KX-210 Klima Kumandası Çok Markalı", "handle": "kumandax-kx-210-klima-kumandasi-cok-markali", "status": "published", "category": ["Kumanda Çeşitleri"], "thumbnail": "http://localhost:3100/mock/products/acremote-white.svg", "created_at": 1790162651528, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-210':3A 'cok':6A 'klima':4A 'kumandasi':5A 'kumandax':1A 'kx':2A 'markali':7A 'model':8B 'standart':9B	Kumandax KX-210 Klima Kumandası Çok Markalı Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.137201+03
prod_01M3704JBCBAHRF99HDEMCCPER	{"id": "prod_01M3704JBCBAHRF99HDEMCCPER", "title": "Voltra VT-9200 7\\" Dokunmatik Oto Multimedya CarPlay", "handle": "voltra-vt-9200-7-dokunmatik-oto-multimedya-carplay", "labels": [], "status": "published", "category": ["Oto Ses ve Görüntü"], "thumbnail": "http://localhost:3100/mock/products/headunit-graphite.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBCBAHRF99HDEMCCPER", "title": "Voltra VT-9200 7\\" Dokunmatik Oto Multimedya CarPlay", "handle": "voltra-vt-9200-7-dokunmatik-oto-multimedya-carplay", "status": "published", "category": ["Oto Ses ve Görüntü"], "thumbnail": "http://localhost:3100/mock/products/headunit-graphite.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-9200':3A '7':4A 'carplay':8A 'dokunmatik':5A 'model':9B 'multimedya':7A 'oto':6A 'standart':10B 'voltra':1A 'vt':2A	Voltra VT-9200 7" Dokunmatik Oto Multimedya CarPlay Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.25578+03
prod_01M3704JBCCTJJEB35F869JJ4S	{"id": "prod_01M3704JBCCTJJEB35F869JJ4S", "title": "Lumenta LM-P10 P10 Led Panel Kontrol Kartı", "handle": "lumenta-lm-p10-p10-led-panel-kontrol-karti", "labels": [], "status": "published", "category": ["Led ve Aydınlatma"], "thumbnail": "http://localhost:3100/mock/products/ledbar-black.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBCCTJJEB35F869JJ4S", "title": "Lumenta LM-P10 P10 Led Panel Kontrol Kartı", "handle": "lumenta-lm-p10-p10-led-panel-kontrol-karti", "status": "published", "category": ["Led ve Aydınlatma"], "thumbnail": "http://localhost:3100/mock/products/ledbar-black.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'karti':9A 'kontrol':8A 'led':6A 'lm':3A 'lm-p10':2A 'lumenta':1A 'model':10B 'p10':4A,5A 'panel':7A 'standart':11B	Lumenta LM-P10 P10 Led Panel Kontrol Kartı Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.339801+03
prod_01M3704JBCDH6HRQE2QB4NV2QZ	{"id": "prod_01M3704JBCDH6HRQE2QB4NV2QZ", "title": "Sonora SN-820 Bluetooth Taşınabilir Hoparlör 60W", "handle": "sonora-sn-820-bluetooth-tasinabilir-hoparlor-60w", "labels": [], "status": "published", "category": ["Seslendirme Sistemleri"], "thumbnail": "http://localhost:3100/mock/products/speaker-graphite.svg", "created_at": "2026-09-23T11:24:11.528Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBCDH6HRQE2QB4NV2QZ", "title": "Sonora SN-820 Bluetooth Taşınabilir Hoparlör 60W", "handle": "sonora-sn-820-bluetooth-tasinabilir-hoparlor-60w", "status": "published", "category": ["Seslendirme Sistemleri"], "thumbnail": "http://localhost:3100/mock/products/speaker-graphite.svg", "created_at": 1790162651528, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-820':3A '60w':7A 'bluetooth':4A 'hoparlor':6A 'model':8B 'sn':2A 'sonora':1A 'standart':9B 'tasinabilir':5A	Sonora SN-820 Bluetooth Taşınabilir Hoparlör 60W Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.028404+03
prod_01M3704JBCDPQX120JDNWVFR6W	{"id": "prod_01M3704JBCDPQX120JDNWVFR6W", "title": "Sonora SN-1500 15\\" 1000W Aktif Kabin Hoparlör", "handle": "sonora-sn-1500-15-1000w-aktif-kabin-hoparlor", "labels": [], "status": "published", "category": ["Seslendirme Sistemleri"], "thumbnail": "http://localhost:3100/mock/products/speaker-black.svg", "created_at": "2026-09-23T11:24:11.528Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBCDPQX120JDNWVFR6W", "title": "Sonora SN-1500 15\\" 1000W Aktif Kabin Hoparlör", "handle": "sonora-sn-1500-15-1000w-aktif-kabin-hoparlor", "status": "published", "category": ["Seslendirme Sistemleri"], "thumbnail": "http://localhost:3100/mock/products/speaker-black.svg", "created_at": 1790162651528, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-1500':3A '1000w':5A '15':4A 'aktif':6A 'hoparlor':8A 'kabin':7A 'model':9B 'sn':2A 'sonora':1A 'standart':10B	Sonora SN-1500 15" 1000W Aktif Kabin Hoparlör Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.028404+03
prod_01M3704JBCDV7X5ZD399RBPM50	{"id": "prod_01M3704JBCDV7X5ZD399RBPM50", "title": "Voltra VT-7010 Oto Teyp Bluetooth USB 4x60W", "handle": "voltra-vt-7010-oto-teyp-bluetooth-usb-4x60w", "labels": [], "status": "published", "category": ["Oto Ses ve Görüntü"], "thumbnail": "http://localhost:3100/mock/products/headunit-black.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBCDV7X5ZD399RBPM50", "title": "Voltra VT-7010 Oto Teyp Bluetooth USB 4x60W", "handle": "voltra-vt-7010-oto-teyp-bluetooth-usb-4x60w", "status": "published", "category": ["Oto Ses ve Görüntü"], "thumbnail": "http://localhost:3100/mock/products/headunit-black.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-7010':3A '4x60w':8A 'bluetooth':6A 'model':9B 'oto':4A 'standart':10B 'teyp':5A 'usb':7A 'voltra':1A 'vt':2A	Voltra VT-7010 Oto Teyp Bluetooth USB 4x60W Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.25578+03
prod_01M3704JBCG7P88J5C6V2QN81N	{"id": "prod_01M3704JBCG7P88J5C6V2QN81N", "title": "Provista PV-KIT4 4 Kameralı Güvenlik Seti Harddisk Dahil", "handle": "provista-pv-kit4-4-kamerali-guvenlik-seti-harddisk-dahil", "labels": [], "status": "published", "category": ["AHD Sistem"], "thumbnail": "http://localhost:3100/mock/products/camera-silver.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBCG7P88J5C6V2QN81N", "title": "Provista PV-KIT4 4 Kameralı Güvenlik Seti Harddisk Dahil", "handle": "provista-pv-kit4-4-kamerali-guvenlik-seti-harddisk-dahil", "status": "published", "category": ["AHD Sistem"], "thumbnail": "http://localhost:3100/mock/products/camera-silver.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'4':5A 'dahil':10A 'guvenlik':7A 'harddisk':9A 'kamerali':6A 'kit4':4A 'model':11B 'provista':1A 'pv':3A 'pv-kit4':2A 'seti':8A 'standart':12B	Provista PV-KIT4 4 Kameralı Güvenlik Seti Harddisk Dahil Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.869017+03
prod_01M3704JBCGTS51DVBBH9T7DAA	{"id": "prod_01M3704JBCGTS51DVBBH9T7DAA", "title": "Cabletek CT-RG6 RG6 U6 Anten Kablosu 100 Metre", "handle": "cabletek-ct-rg6-rg6-u6-anten-kablosu-100-metre", "labels": [], "status": "published", "category": ["Kablo Çeşitleri"], "thumbnail": "http://localhost:3100/mock/products/cable-black.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBCGTS51DVBBH9T7DAA", "title": "Cabletek CT-RG6 RG6 U6 Anten Kablosu 100 Metre", "handle": "cabletek-ct-rg6-rg6-u6-anten-kablosu-100-metre", "status": "published", "category": ["Kablo Çeşitleri"], "thumbnail": "http://localhost:3100/mock/products/cable-black.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'100':9A 'anten':7A 'cabletek':1A 'ct':3A 'ct-rg6':2A 'kablosu':8A 'metr':10A 'model':11B 'rg6':4A,5A 'standart':12B 'u6':6A	Cabletek CT-RG6 RG6 U6 Anten Kablosu 100 Metre Model:Standart	2026-09-23 14:25:10.72712+03	2026-09-23 14:25:10.72712+03
prod_01M3704JBCJYZMXNJ2CS7S43DB	{"id": "prod_01M3704JBCJYZMXNJ2CS7S43DB", "title": "Kumandax KX-500 Universal Uydu Alıcı Kumandası", "handle": "kumandax-kx-500-universal-uydu-alici-kumandasi", "labels": [], "status": "published", "category": ["Kumanda Çeşitleri"], "thumbnail": "http://localhost:3100/mock/products/remote-black.svg", "created_at": "2026-09-23T11:24:11.528Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBCJYZMXNJ2CS7S43DB", "title": "Kumandax KX-500 Universal Uydu Alıcı Kumandası", "handle": "kumandax-kx-500-universal-uydu-alici-kumandasi", "status": "published", "category": ["Kumanda Çeşitleri"], "thumbnail": "http://localhost:3100/mock/products/remote-black.svg", "created_at": 1790162651528, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-500':3A 'alici':6A 'kumandasi':7A 'kumandax':1A 'kx':2A 'model':8B 'standart':9B 'univers':4A 'uydu':5A	Kumandax KX-500 Universal Uydu Alıcı Kumandası Model:Standart	2026-09-23 14:25:10.72712+03	2026-09-23 14:25:10.72712+03
prod_01M3704JBCKGW9QKMX6ET5A9MW	{"id": "prod_01M3704JBCKGW9QKMX6ET5A9MW", "title": "Fotokam FK-8200 5MP AHD Bullet Güvenlik Kamerası", "handle": "fotokam-fk-8200-5mp-ahd-bullet-guvenlik-kamerasi", "labels": [], "status": "published", "category": ["AHD Sistem"], "thumbnail": "http://localhost:3100/mock/products/camera-white.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBCKGW9QKMX6ET5A9MW", "title": "Fotokam FK-8200 5MP AHD Bullet Güvenlik Kamerası", "handle": "fotokam-fk-8200-5mp-ahd-bullet-guvenlik-kamerasi", "status": "published", "category": ["AHD Sistem"], "thumbnail": "http://localhost:3100/mock/products/camera-white.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-8200':3A '5mp':4A 'ahd':5A 'bullet':6A 'fk':2A 'fotokam':1A 'guvenlik':7A 'kamerasi':8A 'model':9B 'standart':10B	Fotokam FK-8200 5MP AHD Bullet Güvenlik Kamerası Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.869017+03
prod_01M3704JBCMQTBNWRZGEC73B0K	{"id": "prod_01M3704JBCMQTBNWRZGEC73B0K", "title": "Digiwave DW-POE8 8 Port PoE Switch Gigabit", "handle": "digiwave-dw-poe8-8-port-poe-switch-gigabit", "labels": [], "status": "published", "category": ["PoE Switch"], "thumbnail": "http://localhost:3100/mock/products/router-black.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBCMQTBNWRZGEC73B0K", "title": "Digiwave DW-POE8 8 Port PoE Switch Gigabit", "handle": "digiwave-dw-poe8-8-port-poe-switch-gigabit", "status": "published", "category": ["PoE Switch"], "thumbnail": "http://localhost:3100/mock/products/router-black.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'8':5A 'digiwav':1A 'dw':3A 'dw-poe8':2A 'gigabit':9A 'model':10B 'poe':7A 'poe8':4A 'port':6A 'standart':11B 'switch':8A	Digiwave DW-POE8 8 Port PoE Switch Gigabit Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:20.091889+03
prod_01M3704JBCNXYR2DT3E3TW1SQF	{"id": "prod_01M3704JBCNXYR2DT3E3TW1SQF", "title": "Nexora NX-AC1200 Dual Band Access Point Router", "handle": "nexora-nx-ac1200-dual-band-access-point-router", "labels": [], "status": "published", "category": ["Access Point / Router"], "thumbnail": "http://localhost:3100/mock/products/router-white.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBCNXYR2DT3E3TW1SQF", "title": "Nexora NX-AC1200 Dual Band Access Point Router", "handle": "nexora-nx-ac1200-dual-band-access-point-router", "status": "published", "category": ["Access Point / Router"], "thumbnail": "http://localhost:3100/mock/products/router-white.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'ac1200':4A 'access':7A 'band':6A 'dual':5A 'model':10B 'nexora':1A 'nx':3A 'nx-ac1200':2A 'point':8A 'router':9A 'standart':11B	Nexora NX-AC1200 Dual Band Access Point Router Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:20.148731+03
prod_01M3704JBCPV1Q5RTFKHRY4GX1	{"id": "prod_01M3704JBCPV1Q5RTFKHRY4GX1", "title": "Antenix AX-120 Single LNB 0.1dB Gürültü Seviyesi", "handle": "antenix-ax-120-single-lnb-0-1db-gurultu-seviyesi", "labels": [], "status": "published", "category": ["Uydu Sistemleri"], "thumbnail": "http://localhost:3100/mock/products/receiver-white.svg", "created_at": "2026-09-23T11:24:11.528Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBCPV1Q5RTFKHRY4GX1", "title": "Antenix AX-120 Single LNB 0.1dB Gürültü Seviyesi", "handle": "antenix-ax-120-single-lnb-0-1db-gurultu-seviyesi", "status": "published", "category": ["Uydu Sistemleri"], "thumbnail": "http://localhost:3100/mock/products/receiver-white.svg", "created_at": 1790162651528, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-120':3A '0.1':6A 'antenix':1A 'ax':2A 'db':7A 'gurultu':8A 'lnb':5A 'model':10B 'seviyesi':9A 'singl':4A 'standart':11B	Antenix AX-120 Single LNB 0.1dB Gürültü Seviyesi Model:Standart	2026-09-23 14:25:10.72712+03	2026-09-23 14:25:10.72712+03
prod_01M3704JBCRST6DA5ZZWGCN0KW	{"id": "prod_01M3704JBCRST6DA5ZZWGCN0KW", "title": "Ledora LD-3228 32\\" Televizyon Led Bar Takımı", "handle": "ledora-ld-3228-32-televizyon-led-bar-takimi", "labels": [], "status": "published", "category": ["Led ve Aydınlatma"], "thumbnail": "http://localhost:3100/mock/products/ledbar-silver.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBCRST6DA5ZZWGCN0KW", "title": "Ledora LD-3228 32\\" Televizyon Led Bar Takımı", "handle": "ledora-ld-3228-32-televizyon-led-bar-takimi", "status": "published", "category": ["Led ve Aydınlatma"], "thumbnail": "http://localhost:3100/mock/products/ledbar-silver.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-3228':3A '32':4A 'bar':7A 'ld':2A 'led':6A 'ledora':1A 'model':9B 'standart':10B 'takimi':8A 'televizyon':5A	Ledora LD-3228 32" Televizyon Led Bar Takımı Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.339801+03
prod_01M3704JBCQRVN3RCNR0NRMAHV	{"id": "prod_01M3704JBCQRVN3RCNR0NRMAHV", "title": "Devrelab DL-858 Sıcak Hava Havya İstasyonu 700W", "handle": "devrelab-dl-858-sicak-hava-havya-i-stasyonu-700w", "labels": [], "status": "published", "category": ["Ölçü Aletleri"], "thumbnail": "http://localhost:3100/mock/products/meter-silver.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBCQRVN3RCNR0NRMAHV", "title": "Devrelab DL-858 Sıcak Hava Havya İstasyonu 700W", "handle": "devrelab-dl-858-sicak-hava-havya-i-stasyonu-700w", "status": "published", "category": ["Ölçü Aletleri"], "thumbnail": "http://localhost:3100/mock/products/meter-silver.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-858':3A '700w':8A 'devrelab':1A 'dl':2A 'hava':5A 'havya':6A 'istasyonu':7A 'model':9B 'sicak':4A 'standart':10B	Devrelab DL-858 Sıcak Hava Havya İstasyonu 700W Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.513151+03
prod_01M3704JBCV564EK2V1F4R3AQC	{"id": "prod_01M3704JBCV564EK2V1F4R3AQC", "title": "Nexora NX-300 ADSL Modem 4 Port Wi-Fi N300", "handle": "nexora-nx-300-adsl-modem-4-port-wi-fi-n300", "labels": [], "status": "published", "category": ["Access Point / Router"], "thumbnail": "http://localhost:3100/mock/products/router-graphite.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBCV564EK2V1F4R3AQC", "title": "Nexora NX-300 ADSL Modem 4 Port Wi-Fi N300", "handle": "nexora-nx-300-adsl-modem-4-port-wi-fi-n300", "status": "published", "category": ["Access Point / Router"], "thumbnail": "http://localhost:3100/mock/products/router-graphite.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-300':3A '4':6A 'adsl':4A 'fi':10A 'model':12B 'modem':5A 'n300':11A 'nexora':1A 'nx':2A 'port':7A 'standart':13B 'wi':9A 'wi-fi':8A	Nexora NX-300 ADSL Modem 4 Port Wi-Fi N300 Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:20.148731+03
prod_01M3704JBCWEXHNS4YZFR9HJAY	{"id": "prod_01M3704JBCWEXHNS4YZFR9HJAY", "title": "Orbisat OR-7200 Full HD Mini Uydu Alıcısı USB Kayıt", "handle": "orbisat-or-7200-full-hd-mini-uydu-alicisi-usb-kayit", "labels": [], "status": "published", "category": ["Uydu Alıcısı"], "thumbnail": "http://localhost:3100/mock/products/receiver-black.svg", "created_at": "2026-09-23T11:24:11.528Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBCWEXHNS4YZFR9HJAY", "title": "Orbisat OR-7200 Full HD Mini Uydu Alıcısı USB Kayıt", "handle": "orbisat-or-7200-full-hd-mini-uydu-alicisi-usb-kayit", "status": "published", "category": ["Uydu Alıcısı"], "thumbnail": "http://localhost:3100/mock/products/receiver-black.svg", "created_at": 1790162651528, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-7200':3A 'alicisi':8A 'full':4A 'hd':5A 'kayit':10A 'mini':6A 'model':11B 'orbisat':1A 'standart':12B 'usb':9A 'uydu':7A	Orbisat OR-7200 Full HD Mini Uydu Alıcısı USB Kayıt Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:20.193691+03
prod_01M3704JBCZEA31BTY6SM3N08F	{"id": "prod_01M3704JBCZEA31BTY6SM3N08F", "title": "Kumandax KX-780 Akıllı TV Kumandası Sesli Komut", "handle": "kumandax-kx-780-akilli-tv-kumandasi-sesli-komut", "labels": [], "status": "published", "category": ["Kumanda Çeşitleri"], "thumbnail": "http://localhost:3100/mock/products/remote-graphite.svg", "created_at": "2026-09-23T11:24:11.528Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBCZEA31BTY6SM3N08F", "title": "Kumandax KX-780 Akıllı TV Kumandası Sesli Komut", "handle": "kumandax-kx-780-akilli-tv-kumandasi-sesli-komut", "status": "published", "category": ["Kumanda Çeşitleri"], "thumbnail": "http://localhost:3100/mock/products/remote-graphite.svg", "created_at": 1790162651528, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-780':3A 'akilli':4A 'komut':8A 'kumandasi':6A 'kumandax':1A 'kx':2A 'model':9B 'sesli':7A 'standart':10B 'tv':5A	Kumandax KX-780 Akıllı TV Kumandası Sesli Komut Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.137201+03
prod_01M3704JBCZSBGK4N9DPAEGKK6	{"id": "prod_01M3704JBCZSBGK4N9DPAEGKK6", "title": "Lumenta LM-5050 Şerit Led 5 Metre RGB Kumandalı", "handle": "lumenta-lm-5050-serit-led-5-metre-rgb-kumandali", "labels": [], "status": "published", "category": ["Led ve Aydınlatma"], "thumbnail": "http://localhost:3100/mock/products/ledbar-graphite.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBCZSBGK4N9DPAEGKK6", "title": "Lumenta LM-5050 Şerit Led 5 Metre RGB Kumandalı", "handle": "lumenta-lm-5050-serit-led-5-metre-rgb-kumandali", "status": "published", "category": ["Led ve Aydınlatma"], "thumbnail": "http://localhost:3100/mock/products/ledbar-graphite.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-5050':3A '5':6A 'kumandali':9A 'led':5A 'lm':2A 'lumenta':1A 'metr':7A 'model':10B 'rgb':8A 'serit':4A 'standart':11B	Lumenta LM-5050 Şerit Led 5 Metre RGB Kumandalı Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.339801+03
prod_01M3704JBCXBV13KW3A3MP20DB	{"id": "prod_01M3704JBCXBV13KW3A3MP20DB", "title": "Metrion MT-890 Dijital Multimetre True RMS", "handle": "metrion-mt-890-dijital-multimetre-true-rms", "labels": [], "status": "published", "category": ["Ölçü Aletleri"], "thumbnail": "http://localhost:3100/mock/products/meter-graphite.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBCXBV13KW3A3MP20DB", "title": "Metrion MT-890 Dijital Multimetre True RMS", "handle": "metrion-mt-890-dijital-multimetre-true-rms", "status": "published", "category": ["Ölçü Aletleri"], "thumbnail": "http://localhost:3100/mock/products/meter-graphite.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-890':3A 'dijit':4A 'metrion':1A 'model':8B 'mt':2A 'multimetr':5A 'rms':7A 'standart':9B 'true':6A	Metrion MT-890 Dijital Multimetre True RMS Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.513151+03
prod_01M3704JBCZW219742T87QVVWC	{"id": "prod_01M3704JBCZW219742T87QVVWC", "title": "Fotokam FK-360 Wi-Fi İç Mekan Kamera 360° Hareketli", "handle": "fotokam-fk-360-wi-fi-i-c-mekan-kamera-360-hareketli", "labels": [], "status": "published", "category": ["WiFi Kameralar"], "thumbnail": "http://localhost:3100/mock/products/camera-graphite.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBCZW219742T87QVVWC", "title": "Fotokam FK-360 Wi-Fi İç Mekan Kamera 360° Hareketli", "handle": "fotokam-fk-360-wi-fi-i-c-mekan-kamera-360-hareketli", "status": "published", "category": ["WiFi Kameralar"], "thumbnail": "http://localhost:3100/mock/products/camera-graphite.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-360':3A '360':10A 'fi':6A 'fk':2A 'fotokam':1A 'hareket':11A 'ic':7A 'kamera':9A 'mekan':8A 'model':12B 'standart':13B 'wi':5A 'wi-fi':4A	Fotokam FK-360 Wi-Fi İç Mekan Kamera 360° Hareketli Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.969621+03
prod_01M3704JBCZ0QP0926CX9BKP16	{"id": "prod_01M3704JBCZ0QP0926CX9BKP16", "title": "Orbisat OR-9500 4K Ultra HD Uydu Alıcısı Wi-Fi Destekli", "handle": "orbisat-or-9500-4k-ultra-hd-uydu-alicisi-wi-fi-destekli", "labels": [], "status": "published", "category": ["Uydu Alıcısı"], "thumbnail": "http://localhost:3100/mock/products/receiver-graphite.svg", "created_at": "2026-09-23T11:24:11.528Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBCZ0QP0926CX9BKP16", "title": "Orbisat OR-9500 4K Ultra HD Uydu Alıcısı Wi-Fi Destekli", "handle": "orbisat-or-9500-4k-ultra-hd-uydu-alicisi-wi-fi-destekli", "status": "published", "category": ["Uydu Alıcısı"], "thumbnail": "http://localhost:3100/mock/products/receiver-graphite.svg", "created_at": 1790162651528, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-9500':3A '4k':4A 'alicisi':8A 'destek':12A 'fi':11A 'hd':6A 'model':13B 'orbisat':1A 'standart':14B 'ultra':5A 'uydu':7A 'wi':10A 'wi-fi':9A	Orbisat OR-9500 4K Ultra HD Uydu Alıcısı Wi-Fi Destekli Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:20.193691+03
prod_01M3704JBDAVYAFMG8QYT8P3AF	{"id": "prod_01M3704JBDAVYAFMG8QYT8P3AF", "title": "Orbisat OR-90 90cm Ofset Çanak Anten Seti LNB Dahil", "handle": "orbisat-or-90-90cm-ofset-canak-anten-seti-lnb-dahil", "labels": [], "status": "published", "category": ["Uydu Sistemleri"], "thumbnail": "http://localhost:3100/mock/products/dish-white.svg", "created_at": "2026-09-23T11:24:11.530Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBDAVYAFMG8QYT8P3AF", "title": "Orbisat OR-90 90cm Ofset Çanak Anten Seti LNB Dahil", "handle": "orbisat-or-90-90cm-ofset-canak-anten-seti-lnb-dahil", "status": "published", "category": ["Uydu Sistemleri"], "thumbnail": "http://localhost:3100/mock/products/dish-white.svg", "created_at": 1790162651530, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-90':3A '90cm':4A 'anten':7A 'canak':6A 'dahil':10A 'lnb':9A 'model':11B 'ofset':5A 'orbisat':1A 'seti':8A 'standart':12B	Orbisat OR-90 90cm Ofset Çanak Anten Seti LNB Dahil Model:Standart	2026-09-23 14:25:10.72712+03	2026-09-23 14:25:10.72712+03
prod_01M3704JBD9WQG3QSMZ4Z5H80J	{"id": "prod_01M3704JBD9WQG3QSMZ4Z5H80J", "title": "Sonora SN-300 Kolon Hoparlör 120W Çift Yönlü", "handle": "sonora-sn-300-kolon-hoparlor-120w-cift-yonlu", "labels": [], "status": "published", "category": ["Seslendirme Sistemleri"], "thumbnail": "http://localhost:3100/mock/products/column-white.svg", "created_at": "2026-09-23T11:24:11.530Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBD9WQG3QSMZ4Z5H80J", "title": "Sonora SN-300 Kolon Hoparlör 120W Çift Yönlü", "handle": "sonora-sn-300-kolon-hoparlor-120w-cift-yonlu", "status": "published", "category": ["Seslendirme Sistemleri"], "thumbnail": "http://localhost:3100/mock/products/column-white.svg", "created_at": 1790162651530, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-300':3A '120w':6A 'cift':7A 'hoparlor':5A 'kolon':4A 'model':9B 'sn':2A 'sonora':1A 'standart':10B 'yonlu':8A	Sonora SN-300 Kolon Hoparlör 120W Çift Yönlü Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.028404+03
prod_01M3704JBD8NS1N27SP4Z0GEX9	{"id": "prod_01M3704JBD8NS1N27SP4Z0GEX9", "title": "Optivolt OV-32SM 32\\" Smart Led TV HD Wi-Fi", "handle": "optivolt-ov-32sm-32-smart-led-tv-hd-wi-fi", "labels": [], "status": "published", "category": ["Monitör"], "thumbnail": "http://localhost:3100/mock/products/monitor-black.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBD8NS1N27SP4Z0GEX9", "title": "Optivolt OV-32SM 32\\" Smart Led TV HD Wi-Fi", "handle": "optivolt-ov-32sm-32-smart-led-tv-hd-wi-fi", "status": "published", "category": ["Monitör"], "thumbnail": "http://localhost:3100/mock/products/monitor-black.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'32':5A '32sm':4A 'fi':12A 'hd':9A 'led':7A 'model':13B 'optivolt':1A 'ov':3A 'ov-32sm':2A 'smart':6A 'standart':14B 'tv':8A 'wi':11A 'wi-fi':10A	Optivolt OV-32SM 32" Smart Led TV HD Wi-Fi Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.078717+03
prod_01M3704JBD3M2D2V9RRKJ6D1X1	{"id": "prod_01M3704JBD3M2D2V9RRKJ6D1X1", "title": "Ledora LD-TEST Led Bar Test Cihazı 0-300V Dokunmatik", "handle": "ledora-ld-test-led-bar-test-cihazi-0-300v-dokunmatik", "labels": [], "status": "published", "category": ["Led ve Aydınlatma"], "thumbnail": "http://localhost:3100/mock/products/meter-white.svg", "created_at": "2026-09-23T11:24:11.530Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBD3M2D2V9RRKJ6D1X1", "title": "Ledora LD-TEST Led Bar Test Cihazı 0-300V Dokunmatik", "handle": "ledora-ld-test-led-bar-test-cihazi-0-300v-dokunmatik", "status": "published", "category": ["Led ve Aydınlatma"], "thumbnail": "http://localhost:3100/mock/products/meter-white.svg", "created_at": 1790162651530, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-300':10A '0':9A 'bar':6A 'cihazi':8A 'dokunmatik':12A 'ld':3A 'ld-test':2A 'led':5A 'ledora':1A 'model':13B 'standart':14B 'test':4A,7A 'v':11A	Ledora LD-TEST Led Bar Test Cihazı 0-300V Dokunmatik Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.339801+03
prod_01M3704JBD9E0E0PRHYVHS3MZR	{"id": "prod_01M3704JBD9E0E0PRHYVHS3MZR", "title": "Tekniva TK-32AIO 32\\" All In One Bilgisayar i9 32GB 1TB", "handle": "tekniva-tk-32aio-32-all-in-one-bilgisayar-i9-32gb-1tb", "labels": [], "status": "published", "category": ["Bilgisayar ve Monitör"], "thumbnail": "http://localhost:3100/mock/products/aio-black.svg", "created_at": "2026-09-23T11:24:11.530Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBD9E0E0PRHYVHS3MZR", "title": "Tekniva TK-32AIO 32\\" All In One Bilgisayar i9 32GB 1TB", "handle": "tekniva-tk-32aio-32-all-in-one-bilgisayar-i9-32gb-1tb", "status": "published", "category": ["Bilgisayar ve Monitör"], "thumbnail": "http://localhost:3100/mock/products/aio-black.svg", "created_at": 1790162651530, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'1tb':12A '32':5A '32aio':4A '32gb':11A 'bilgisayar':9A 'i9':10A 'model':13B 'one':8A 'standart':14B 'tekniva':1A 'tk':3A 'tk-32aio':2A	Tekniva TK-32AIO 32" All In One Bilgisayar i9 32GB 1TB Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.565475+03
prod_01M3704JBDHB882SB9JM6H9V3N	{"id": "prod_01M3704JBDHB882SB9JM6H9V3N", "title": "Tekniva TK-22MON 22\\" Full HD Monitör IPS 100Hz", "handle": "tekniva-tk-22mon-22-full-hd-monitor-ips-100hz", "labels": [], "status": "published", "category": ["Monitör"], "thumbnail": "http://localhost:3100/mock/products/monitor-graphite.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBDHB882SB9JM6H9V3N", "title": "Tekniva TK-22MON 22\\" Full HD Monitör IPS 100Hz", "handle": "tekniva-tk-22mon-22-full-hd-monitor-ips-100hz", "status": "published", "category": ["Monitör"], "thumbnail": "http://localhost:3100/mock/products/monitor-graphite.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'100hz':10A '22':5A '22mon':4A 'full':6A 'hd':7A 'ip':9A 'model':11B 'monitor':8A 'standart':12B 'tekniva':1A 'tk':3A 'tk-22mon':2A	Tekniva TK-22MON 22" Full HD Monitör IPS 100Hz Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.078717+03
prod_01M3704JBDNSH2EKX4026MTGFC	{"id": "prod_01M3704JBDNSH2EKX4026MTGFC", "title": "Kumandax KX-900 Öğrenmeli Universal Kumanda 8 Cihaz", "handle": "kumandax-kx-900-ogrenmeli-universal-kumanda-8-cihaz", "labels": [], "status": "published", "category": ["Kumanda Çeşitleri"], "thumbnail": "http://localhost:3100/mock/products/remote-white.svg", "created_at": "2026-09-23T11:24:11.530Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBDNSH2EKX4026MTGFC", "title": "Kumandax KX-900 Öğrenmeli Universal Kumanda 8 Cihaz", "handle": "kumandax-kx-900-ogrenmeli-universal-kumanda-8-cihaz", "status": "published", "category": ["Kumanda Çeşitleri"], "thumbnail": "http://localhost:3100/mock/products/remote-white.svg", "created_at": 1790162651530, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-900':3A '8':7A 'cihaz':8A 'kumanda':6A 'kumandax':1A 'kx':2A 'model':9B 'ogrenm':4A 'standart':10B 'univers':5A	Kumandax KX-900 Öğrenmeli Universal Kumanda 8 Cihaz Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.137201+03
prod_01M3704JBDMYMEN5T7R3ZJGZV4	{"id": "prod_01M3704JBDMYMEN5T7R3ZJGZV4", "title": "Tamirix TX-LED Fener ve Işıldak Şarjlı 1200 Lümen", "handle": "tamirix-tx-led-fener-ve-isildak-sarjli-1200-lumen", "labels": [], "status": "published", "category": ["Hırdavat ve Tamir Malzemeleri"], "thumbnail": "http://localhost:3100/mock/products/adapter-silver.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBDMYMEN5T7R3ZJGZV4", "title": "Tamirix TX-LED Fener ve Işıldak Şarjlı 1200 Lümen", "handle": "tamirix-tx-led-fener-ve-isildak-sarjli-1200-lumen", "status": "published", "category": ["Hırdavat ve Tamir Malzemeleri"], "thumbnail": "http://localhost:3100/mock/products/adapter-silver.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'1200':9A 'fener':5A 'isildak':7A 'led':4A 'lumen':10A 'model':11B 'sarjli':8A 'standart':12B 'tamirix':1A 'tx':3A 'tx-led':2A 've':6A	Tamirix TX-LED Fener ve Işıldak Şarjlı 1200 Lümen Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.796774+03
prod_01M3704JBDHDCAZAN36GTYS4YY	{"id": "prod_01M3704JBDHDCAZAN36GTYS4YY", "title": "Orbisat OR-3100 HD Uydu Alıcısı Ethernet Portlu", "handle": "orbisat-or-3100-hd-uydu-alicisi-ethernet-portlu", "labels": [], "status": "published", "category": ["Uydu Alıcısı"], "thumbnail": "http://localhost:3100/mock/products/receiver-silver.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBDHDCAZAN36GTYS4YY", "title": "Orbisat OR-3100 HD Uydu Alıcısı Ethernet Portlu", "handle": "orbisat-or-3100-hd-uydu-alicisi-ethernet-portlu", "status": "published", "category": ["Uydu Alıcısı"], "thumbnail": "http://localhost:3100/mock/products/receiver-silver.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-3100':3A 'alicisi':6A 'ethernet':7A 'hd':4A 'model':9B 'orbisat':1A 'portlu':8A 'standart':10B 'uydu':5A	Orbisat OR-3100 HD Uydu Alıcısı Ethernet Portlu Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:20.193691+03
prod_01M3704JBDYP8E9YQ1RV6KX70W	{"id": "prod_01M3704JBDYP8E9YQ1RV6KX70W", "title": "Voltra VT-6100 Oto Multimedya Ekranı 9\\" Android", "handle": "voltra-vt-6100-oto-multimedya-ekrani-9-android", "labels": [], "status": "published", "category": ["Oto Ses ve Görüntü"], "thumbnail": "http://localhost:3100/mock/products/headunit-white.svg", "created_at": "2026-09-23T11:24:11.530Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBDYP8E9YQ1RV6KX70W", "title": "Voltra VT-6100 Oto Multimedya Ekranı 9\\" Android", "handle": "voltra-vt-6100-oto-multimedya-ekrani-9-android", "status": "published", "category": ["Oto Ses ve Görüntü"], "thumbnail": "http://localhost:3100/mock/products/headunit-white.svg", "created_at": 1790162651530, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-6100':3A '9':7A 'android':8A 'ekrani':6A 'model':9B 'multimedya':5A 'oto':4A 'standart':10B 'voltra':1A 'vt':2A	Voltra VT-6100 Oto Multimedya Ekranı 9" Android Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.25578+03
prod_01M3704JBDVQB3Z6K9KCEJ3A04	{"id": "prod_01M3704JBDVQB3Z6K9KCEJ3A04", "title": "Ledora LD-4332 43\\" Televizyon Led Bar Takımı", "handle": "ledora-ld-4332-43-televizyon-led-bar-takimi", "labels": [], "status": "published", "category": ["Led ve Aydınlatma"], "thumbnail": "http://localhost:3100/mock/products/ledbar-graphite.svg", "created_at": "2026-09-23T11:24:11.530Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBDVQB3Z6K9KCEJ3A04", "title": "Ledora LD-4332 43\\" Televizyon Led Bar Takımı", "handle": "ledora-ld-4332-43-televizyon-led-bar-takimi", "status": "published", "category": ["Led ve Aydınlatma"], "thumbnail": "http://localhost:3100/mock/products/ledbar-graphite.svg", "created_at": 1790162651530, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-4332':3A '43':4A 'bar':7A 'ld':2A 'led':6A 'ledora':1A 'model':9B 'standart':10B 'takimi':8A 'televizyon':5A	Ledora LD-4332 43" Televizyon Led Bar Takımı Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.339801+03
prod_01M3704JBDY5T4BNC6R1RR3V8E	{"id": "prod_01M3704JBDY5T4BNC6R1RR3V8E", "title": "Tekniva TK-24AIO 24\\" All In One Bilgisayar i5 8GB 256GB", "handle": "tekniva-tk-24aio-24-all-in-one-bilgisayar-i5-8gb-256gb", "labels": [], "status": "published", "category": ["Bilgisayar ve Monitör"], "thumbnail": "http://localhost:3100/mock/products/aio-silver.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBDY5T4BNC6R1RR3V8E", "title": "Tekniva TK-24AIO 24\\" All In One Bilgisayar i5 8GB 256GB", "handle": "tekniva-tk-24aio-24-all-in-one-bilgisayar-i5-8gb-256gb", "status": "published", "category": ["Bilgisayar ve Monitör"], "thumbnail": "http://localhost:3100/mock/products/aio-silver.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'24':5A '24aio':4A '256gb':12A '8gb':11A 'bilgisayar':9A 'i5':10A 'model':13B 'one':8A 'standart':14B 'tekniva':1A 'tk':3A 'tk-24aio':2A	Tekniva TK-24AIO 24" All In One Bilgisayar i5 8GB 256GB Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.565475+03
prod_01M3704JBDV13SJWHGPQB6FTK9	{"id": "prod_01M3704JBDV13SJWHGPQB6FTK9", "title": "Tamirix TX-120 Elektronik Tamir Seti 120 Parça", "handle": "tamirix-tx-120-elektronik-tamir-seti-120-parca", "labels": [], "status": "published", "category": ["Hırdavat ve Tamir Malzemeleri"], "thumbnail": "http://localhost:3100/mock/products/meter-graphite.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBDV13SJWHGPQB6FTK9", "title": "Tamirix TX-120 Elektronik Tamir Seti 120 Parça", "handle": "tamirix-tx-120-elektronik-tamir-seti-120-parca", "status": "published", "category": ["Hırdavat ve Tamir Malzemeleri"], "thumbnail": "http://localhost:3100/mock/products/meter-graphite.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-120':3A '120':7A 'elektronik':4A 'model':9B 'parca':8A 'seti':6A 'standart':10B 'tamir':5A 'tamirix':1A 'tx':2A	Tamirix TX-120 Elektronik Tamir Seti 120 Parça Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.796774+03
prod_01M3704JBDZBTN971SS3T5QE9B	{"id": "prod_01M3704JBDZBTN971SS3T5QE9B", "title": "Provista PV-DOME3 3MP IP Dome Kamera Gece Görüşlü", "handle": "provista-pv-dome3-3mp-ip-dome-kamera-gece-goruslu", "labels": [], "status": "published", "category": ["IP Sistem"], "thumbnail": "http://localhost:3100/mock/products/dome-graphite.svg", "created_at": "2026-09-23T11:24:11.530Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBDZBTN971SS3T5QE9B", "title": "Provista PV-DOME3 3MP IP Dome Kamera Gece Görüşlü", "handle": "provista-pv-dome3-3mp-ip-dome-kamera-gece-goruslu", "status": "published", "category": ["IP Sistem"], "thumbnail": "http://localhost:3100/mock/products/dome-graphite.svg", "created_at": 1790162651530, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'3mp':5A 'dome':7A 'dome3':4A 'gece':9A 'goruslu':10A 'ip':6A 'kamera':8A 'model':11B 'provista':1A 'pv':3A 'pv-dome3':2A 'standart':12B	Provista PV-DOME3 3MP IP Dome Kamera Gece Görüşlü Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.965787+03
prod_01M374VN91HAMJT1T85974N71T	{"id": "prod_01M374VN91HAMJT1T85974N71T", "title": "orbisat uydu", "handle": "orbisat-uydu", "labels": [], "status": "published", "category": ["Kumanda Çeşitleri"], "thumbnail": "http://localhost:9000/static/1790167565106-20260508%20DFR%2030mm%20aufgewickelt%20komplett.jpeg", "created_at": "2026-09-23T12:46:42.471Z", "description": "dfdf", "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M374VN91HAMJT1T85974N71T", "title": "orbisat uydu", "handle": "orbisat-uydu", "status": "published", "category": ["Kumanda Çeşitleri"], "thumbnail": "http://localhost:9000/static/1790167565106-20260508%20DFR%2030mm%20aufgewickelt%20komplett.jpeg", "created_at": 1790167602471, "description": "dfdf", "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'dfdf':3 'model':4B 'orbisat':1A 'standart':5B 'uydu':2A	orbisat uydu dfdf Model:Standart	2026-09-23 15:46:42.751459+03	2026-10-01 10:26:19.137201+03
prod_01M3704JBC1W321MXAWJ5VH65S	{"id": "prod_01M3704JBC1W321MXAWJ5VH65S", "title": "Tekniva TK-27AIO 27\\" All In One Bilgisayar i7 16GB 512GB", "handle": "tekniva-tk-27aio-27-all-in-one-bilgisayar-i7-16gb-512gb", "labels": [], "status": "published", "category": ["Bilgisayar ve Monitör"], "thumbnail": "http://localhost:3100/mock/products/aio-white.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBC1W321MXAWJ5VH65S", "title": "Tekniva TK-27AIO 27\\" All In One Bilgisayar i7 16GB 512GB", "handle": "tekniva-tk-27aio-27-all-in-one-bilgisayar-i7-16gb-512gb", "status": "published", "category": ["Bilgisayar ve Monitör"], "thumbnail": "http://localhost:3100/mock/products/aio-white.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'16gb':11A '27':5A '27aio':4A '512gb':12A 'bilgisayar':9A 'i7':10A 'model':13B 'one':8A 'standart':14B 'tekniva':1A 'tk':3A 'tk-27aio':2A	Tekniva TK-27AIO 27" All In One Bilgisayar i7 16GB 512GB Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.565475+03
prod_01M3704JBCH0JEA9V57VGQSY2H	{"id": "prod_01M3704JBCH0JEA9V57VGQSY2H", "title": "Provista PV-16 16 Kanal AHD Kayıt Cihazı 5MP", "handle": "provista-pv-16-16-kanal-ahd-kayit-cihazi-5mp", "labels": [], "status": "published", "category": ["Kayıt ve Depolama"], "thumbnail": "http://localhost:3100/mock/products/nvr-black.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBCH0JEA9V57VGQSY2H", "title": "Provista PV-16 16 Kanal AHD Kayıt Cihazı 5MP", "handle": "provista-pv-16-16-kanal-ahd-kayit-cihazi-5mp", "status": "published", "category": ["Kayıt ve Depolama"], "thumbnail": "http://localhost:3100/mock/products/nvr-black.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-16':3A '16':4A '5mp':9A 'ahd':6A 'cihazi':8A 'kanal':5A 'kayit':7A 'model':10B 'provista':1A 'pv':2A 'standart':11B	Provista PV-16 16 Kanal AHD Kayıt Cihazı 5MP Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:18.01149+03
prod_01M3704JBD714MY8QY02RVEBFE	{"id": "prod_01M3704JBD714MY8QY02RVEBFE", "title": "Provista PV-8 8 Kanal NVR IP Kayıt Cihazı 4K", "handle": "provista-pv-8-8-kanal-nvr-ip-kayit-cihazi-4k", "labels": [], "status": "published", "category": ["Kayıt ve Depolama"], "thumbnail": "http://localhost:3100/mock/products/nvr-white.svg", "created_at": "2026-09-23T11:24:11.530Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBD714MY8QY02RVEBFE", "title": "Provista PV-8 8 Kanal NVR IP Kayıt Cihazı 4K", "handle": "provista-pv-8-8-kanal-nvr-ip-kayit-cihazi-4k", "status": "published", "category": ["Kayıt ve Depolama"], "thumbnail": "http://localhost:3100/mock/products/nvr-white.svg", "created_at": 1790162651530, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-8':3A '4k':10A '8':4A 'cihazi':9A 'ip':7A 'kanal':5A 'kayit':8A 'model':11B 'nvr':6A 'provista':1A 'pv':2A 'standart':12B	Provista PV-8 8 Kanal NVR IP Kayıt Cihazı 4K Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:18.01149+03
prod_01M3704JBC48SG8WC48C3DF4FG	{"id": "prod_01M3704JBC48SG8WC48C3DF4FG", "title": "Cabletek CT-HDMI21 HDMI 2.1 Kablo 8K 3 Metre", "handle": "cabletek-ct-hdmi21-hdmi-2-1-kablo-8k-3-metre", "labels": [], "status": "published", "category": ["Aksesuarlar"], "thumbnail": "http://localhost:3100/mock/products/cable-graphite.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBC48SG8WC48C3DF4FG", "title": "Cabletek CT-HDMI21 HDMI 2.1 Kablo 8K 3 Metre", "handle": "cabletek-ct-hdmi21-hdmi-2-1-kablo-8k-3-metre", "status": "published", "category": ["Aksesuarlar"], "thumbnail": "http://localhost:3100/mock/products/cable-graphite.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'2.1':6A '3':9A '8k':8A 'cabletek':1A 'ct':3A 'ct-hdmi21':2A 'hdmi':5A 'hdmi21':4A 'kablo':7A 'metr':10A 'model':11B 'standart':12B	Cabletek CT-HDMI21 HDMI 2.1 Kablo 8K 3 Metre Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:18.699294+03
prod_01M3704JBC55PJJQBNQXPZTS6G	{"id": "prod_01M3704JBC55PJJQBNQXPZTS6G", "title": "Bataryam BT-100 12V 100Ah Jel Akü Derin Döngü", "handle": "bataryam-bt-100-12v-100ah-jel-aku-derin-dongu", "labels": [], "status": "published", "category": ["Aksesuarlar"], "thumbnail": "http://localhost:3100/mock/products/battery-silver.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBC55PJJQBNQXPZTS6G", "title": "Bataryam BT-100 12V 100Ah Jel Akü Derin Döngü", "handle": "bataryam-bt-100-12v-100ah-jel-aku-derin-dongu", "status": "published", "category": ["Aksesuarlar"], "thumbnail": "http://localhost:3100/mock/products/battery-silver.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-100':3A '100ah':5A '12v':4A 'aku':7A 'bataryam':1A 'bt':2A 'derin':8A 'dongu':9A 'jel':6A 'model':10B 'standart':11B	Bataryam BT-100 12V 100Ah Jel Akü Derin Döngü Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:18.699294+03
prod_01M3704JBCFNJER548XVG0FJY2	{"id": "prod_01M3704JBCFNJER548XVG0FJY2", "title": "Powerin PW-1220 12V 2A Adaptör Fişli Güç Kaynağı", "handle": "powerin-pw-1220-12v-2a-adaptor-fisli-guc-kaynagi", "labels": [], "status": "published", "category": ["Aksesuarlar"], "thumbnail": "http://localhost:3100/mock/products/adapter-black.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBCFNJER548XVG0FJY2", "title": "Powerin PW-1220 12V 2A Adaptör Fişli Güç Kaynağı", "handle": "powerin-pw-1220-12v-2a-adaptor-fisli-guc-kaynagi", "status": "published", "category": ["Aksesuarlar"], "thumbnail": "http://localhost:3100/mock/products/adapter-black.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-1220':3A '12v':4A '2a':5A 'adaptor':6A 'fisli':7A 'guc':8A 'kaynagi':9A 'model':10B 'powerin':1A 'pw':2A 'standart':11B	Powerin PW-1220 12V 2A Adaptör Fişli Güç Kaynağı Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:18.699294+03
prod_01M3704JBCG873HZHMK2J79AWB	{"id": "prod_01M3704JBCG873HZHMK2J79AWB", "title": "Kablonis KB-CAT6 Cat6 UTP Ağ Kablosu 305m Makara", "handle": "kablonis-kb-cat6-cat6-utp-ag-kablosu-305m-makara", "labels": [], "status": "published", "category": ["Aksesuarlar"], "thumbnail": "http://localhost:3100/mock/products/cable-silver.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBCG873HZHMK2J79AWB", "title": "Kablonis KB-CAT6 Cat6 UTP Ağ Kablosu 305m Makara", "handle": "kablonis-kb-cat6-cat6-utp-ag-kablosu-305m-makara", "status": "published", "category": ["Aksesuarlar"], "thumbnail": "http://localhost:3100/mock/products/cable-silver.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'305m':9A 'ag':7A 'cat6':4A,5A 'kabloni':1A 'kablosu':8A 'kb':3A 'kb-cat6':2A 'makara':10A 'model':11B 'standart':12B 'utp':6A	Kablonis KB-CAT6 Cat6 UTP Ağ Kablosu 305m Makara Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:18.699294+03
prod_01M3704JBCVV7WP033B2FAV3EF	{"id": "prod_01M3704JBCVV7WP033B2FAV3EF", "title": "Kablonis KB-ALARM 6x0.22 Alarm Kablosu 100 Metre", "handle": "kablonis-kb-alarm-6x0-22-alarm-kablosu-100-metre", "labels": [], "status": "published", "category": ["Aksesuarlar"], "thumbnail": "http://localhost:3100/mock/products/cable-white.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBCVV7WP033B2FAV3EF", "title": "Kablonis KB-ALARM 6x0.22 Alarm Kablosu 100 Metre", "handle": "kablonis-kb-alarm-6x0-22-alarm-kablosu-100-metre", "status": "published", "category": ["Aksesuarlar"], "thumbnail": "http://localhost:3100/mock/products/cable-white.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'100':8A '6x0.22':5A 'alarm':4A,6A 'kabloni':1A 'kablosu':7A 'kb':3A 'kb-alarm':2A 'metr':9A 'model':10B 'standart':11B	Kablonis KB-ALARM 6x0.22 Alarm Kablosu 100 Metre Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:18.699294+03
prod_01M3704JBD2AF9D2XX6AZM5MR0	{"id": "prod_01M3704JBD2AF9D2XX6AZM5MR0", "title": "Servisan SV-ABS ABS Plastik Kutu Seti 10 Adet", "handle": "servisan-sv-abs-abs-plastik-kutu-seti-10-adet", "labels": [], "status": "published", "category": ["Aksesuarlar"], "thumbnail": "http://localhost:3100/mock/products/adapter-white.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBD2AF9D2XX6AZM5MR0", "title": "Servisan SV-ABS ABS Plastik Kutu Seti 10 Adet", "handle": "servisan-sv-abs-abs-plastik-kutu-seti-10-adet", "status": "published", "category": ["Aksesuarlar"], "thumbnail": "http://localhost:3100/mock/products/adapter-white.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'10':9A 'ab':4A,5A 'adet':10A 'kutu':7A 'model':11B 'plastik':6A 'servisan':1A 'seti':8A 'standart':12B 'sv':3A 'sv-ab':2A	Servisan SV-ABS ABS Plastik Kutu Seti 10 Adet Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:18.699294+03
prod_01M3704JBC9ZWFD2XRVPFF74PA	{"id": "prod_01M3704JBC9ZWFD2XRVPFF74PA", "title": "Sesyapı SY-2400 Anfi ve Mikser 240W 4 Kanal", "handle": "sesyapi-sy-2400-anfi-ve-mikser-240w-4-kanal", "labels": [], "status": "published", "category": ["Seslendirme Sistemleri"], "thumbnail": "http://localhost:3100/mock/products/speaker-silver.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBC9ZWFD2XRVPFF74PA", "title": "Sesyapı SY-2400 Anfi ve Mikser 240W 4 Kanal", "handle": "sesyapi-sy-2400-anfi-ve-mikser-240w-4-kanal", "status": "published", "category": ["Seslendirme Sistemleri"], "thumbnail": "http://localhost:3100/mock/products/speaker-silver.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-2400':3A '240w':7A '4':8A 'anfi':4A 'kanal':9A 'mikser':6A 'model':10B 'sesyapi':1A 'standart':11B 'sy':2A 've':5A	Sesyapı SY-2400 Anfi ve Mikser 240W 4 Kanal Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.028404+03
prod_01M3704JBDK4NTGGANMJQV51Y9	{"id": "prod_01M3704JBDK4NTGGANMJQV51Y9", "title": "Sonora SN-950 Aktif Kabin Hoparlör 12\\" 600W", "handle": "sonora-sn-950-aktif-kabin-hoparlor-12-600w", "labels": [], "status": "published", "category": ["Seslendirme Sistemleri"], "thumbnail": "http://localhost:3100/mock/products/speaker-silver.svg", "created_at": "2026-09-23T11:24:11.530Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBDK4NTGGANMJQV51Y9", "title": "Sonora SN-950 Aktif Kabin Hoparlör 12\\" 600W", "handle": "sonora-sn-950-aktif-kabin-hoparlor-12-600w", "status": "published", "category": ["Seslendirme Sistemleri"], "thumbnail": "http://localhost:3100/mock/products/speaker-silver.svg", "created_at": 1790162651530, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-950':3A '12':7A '600w':8A 'aktif':4A 'hoparlor':6A 'kabin':5A 'model':9B 'sn':2A 'sonora':1A 'standart':10B	Sonora SN-950 Aktif Kabin Hoparlör 12" 600W Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.028404+03
prod_01M3704JBCBCR24HBQVGXA0AZG	{"id": "prod_01M3704JBCBCR24HBQVGXA0AZG", "title": "Sinyalis SG-40 Oto Anfi 4 Kanal 800W", "handle": "sinyalis-sg-40-oto-anfi-4-kanal-800w", "labels": [], "status": "published", "category": ["Oto Ses ve Görüntü"], "thumbnail": "http://localhost:3100/mock/products/headunit-white.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBCBCR24HBQVGXA0AZG", "title": "Sinyalis SG-40 Oto Anfi 4 Kanal 800W", "handle": "sinyalis-sg-40-oto-anfi-4-kanal-800w", "status": "published", "category": ["Oto Ses ve Görüntü"], "thumbnail": "http://localhost:3100/mock/products/headunit-white.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'-40':3A '4':6A '800w':8A 'anfi':5A 'kanal':7A 'model':9B 'oto':4A 'sg':2A 'sinyali':1A 'standart':10B	Sinyalis SG-40 Oto Anfi 4 Kanal 800W Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.25578+03
prod_01M3704JBDQ9WM8EBJJ8QCCKZ1	{"id": "prod_01M3704JBDQ9WM8EBJJ8QCCKZ1", "title": "Megavolt MV-INV2000 İnvertör 12V 2000W Modifiye Sinüs", "handle": "megavolt-mv-inv2000-i-nvertor-12v-2000w-modifiye-sinus", "labels": [], "status": "published", "category": ["Hırdavat ve Tamir Malzemeleri"], "thumbnail": "http://localhost:3100/mock/products/adapter-graphite.svg", "created_at": "2026-09-23T11:24:11.529Z", "description": null, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	{"id": "prod_01M3704JBDQ9WM8EBJJ8QCCKZ1", "title": "Megavolt MV-INV2000 İnvertör 12V 2000W Modifiye Sinüs", "handle": "megavolt-mv-inv2000-i-nvertor-12v-2000w-modifiye-sinus", "status": "published", "category": ["Hırdavat ve Tamir Malzemeleri"], "thumbnail": "http://localhost:3100/mock/products/adapter-graphite.svg", "created_at": 1790162651529, "option_values": ["Model:Standart"], "sales_channel_ids": ["sc_01M3704J236RKB65YSHQCQK2JB"]}	'12v':6A '2000w':7A 'inv2000':4A 'invertor':5A 'megavolt':1A 'model':10B 'modifiy':8A 'mv':3A 'mv-inv2000':2A 'sinus':9A 'standart':11B	Megavolt MV-INV2000 İnvertör 12V 2000W Modifiye Sinüs Model:Standart	2026-09-23 14:25:10.72712+03	2026-10-01 10:26:19.796774+03
\.


--
-- Data for Name: search_postgres_index; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.search_postgres_index (name, table_name, schema_hash, plan, document_count, created_at, updated_at) FROM stdin;
product_v1	search_pg_product_v1	6a867764af1115440210b465fe11db3c1627a9a818c408f9b3c16e778b4b4b40	{"fields": [{"kind": "keyword", "path": "id", "field": {"type": "keyword", "filterable": true, "retrievable": true}, "is_date": false, "is_array": false}, {"kind": "keyword", "path": "status", "field": {"type": "keyword", "filterable": true, "retrievable": false}, "is_date": false, "is_array": false}, {"kind": "keyword", "path": "sales_channel_ids", "field": {"type": "keyword", "array": true, "filterable": true, "retrievable": false}, "is_date": false, "is_array": true}, {"kind": "text", "path": "title", "field": {"type": "text", "sortable": true, "searchable": {"weight": 3}, "retrievable": true}, "is_date": false, "is_array": false}, {"kind": "text", "path": "description", "field": {"type": "text", "searchable": {"weight": 1}}, "is_date": false, "is_array": false}, {"kind": "keyword", "path": "handle", "field": {"type": "keyword", "retrievable": true}, "is_date": false, "is_array": false}, {"kind": "keyword", "path": "thumbnail", "field": {"type": "keyword", "retrievable": true}, "is_date": false, "is_array": false}, {"kind": "number", "path": "created_at", "field": {"type": "date", "sortable": true, "retrievable": true}, "is_date": true, "is_array": false}, {"kind": "keyword", "path": "category", "field": {"type": "keyword", "array": true, "facetable": true, "filterable": true, "retrievable": true}, "is_date": false, "is_array": true}, {"kind": "keyword", "path": "labels", "field": {"type": "keyword", "array": true, "facetable": true, "filterable": true, "retrievable": true}, "is_date": false, "is_array": true}, {"kind": "keyword", "path": "option_values", "field": {"type": "keyword", "array": true, "facetable": true, "filterable": true, "searchable": {"weight": 2}, "retrievable": true}, "is_date": false, "is_array": true}, {"kind": "number", "path": "min_price_eur", "field": {"type": "float", "sortable": true, "facetable": {"types": ["stats"]}, "filterable": true, "retrievable": true}, "is_date": false, "is_array": false}, {"kind": "number", "path": "max_price_eur", "field": {"type": "float", "sortable": true, "facetable": {"types": ["stats"]}, "filterable": true, "retrievable": true}, "is_date": false, "is_array": false}, {"kind": "number", "path": "original_price_eur", "field": {"type": "float", "retrievable": true}, "is_date": false, "is_array": false}, {"kind": "boolean", "path": "on_sale_eur", "field": {"type": "boolean", "facetable": true, "filterable": true, "retrievable": true}, "is_date": false, "is_array": false}, {"kind": "number", "path": "min_price_usd", "field": {"type": "float", "sortable": true, "facetable": {"types": ["stats"]}, "filterable": true, "retrievable": true}, "is_date": false, "is_array": false}, {"kind": "number", "path": "max_price_usd", "field": {"type": "float", "sortable": true, "facetable": {"types": ["stats"]}, "filterable": true, "retrievable": true}, "is_date": false, "is_array": false}, {"kind": "number", "path": "original_price_usd", "field": {"type": "float", "retrievable": true}, "is_date": false, "is_array": false}, {"kind": "boolean", "path": "on_sale_usd", "field": {"type": "boolean", "facetable": true, "filterable": true, "retrievable": true}, "is_date": false, "is_array": false}], "vectors": [], "searchable": ["title", "description", "option_values"], "primary_key": "id", "schema_hash": "6a867764af1115440210b465fe11db3c1627a9a818c408f9b3c16e778b4b4b40"}	60	2026-09-23 14:24:07.703175+03	2026-09-23 15:46:42.751459+03
\.


--
-- Data for Name: service_zone; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.service_zone (id, name, metadata, fulfillment_set_id, created_at, updated_at, deleted_at) FROM stdin;
serzo_01M3704J5Q3EE2WPDHDTAXGNRA	Türkiye	\N	fuset_01M3704J5Q0HN6F4TG1SCR4RZ1	2026-09-23 14:24:11.319+03	2026-09-23 14:24:11.319+03	\N
\.


--
-- Data for Name: shipping_option; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.shipping_option (id, name, price_type, service_zone_id, shipping_profile_id, provider_id, data, metadata, shipping_option_type_id, created_at, updated_at, deleted_at) FROM stdin;
so_01M3704J7HEB568C2Y12PYS53H	Standart Kargo	flat	serzo_01M3704J5Q3EE2WPDHDTAXGNRA	sp_01M3704J0NX5A15ZZG838V3W5G	manual_manual	\N	\N	sotype_01M3704J7H5S25QA3MFE8M72PW	2026-09-23 14:24:11.378+03	2026-09-23 14:24:11.378+03	\N
so_01M3704J7J8NBM77F04NM3N75C	Hızlı Kargo	flat	serzo_01M3704J5Q3EE2WPDHDTAXGNRA	sp_01M3704J0NX5A15ZZG838V3W5G	manual_manual	\N	\N	sotype_01M3704J7JZY06ZNK23DZNWPQ2	2026-09-23 14:24:11.379+03	2026-09-23 14:24:11.379+03	\N
\.


--
-- Data for Name: shipping_option_price_set; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.shipping_option_price_set (shipping_option_id, price_set_id, id, created_at, updated_at, deleted_at) FROM stdin;
so_01M3704J7HEB568C2Y12PYS53H	pset_01M3704J82C06PH5B4YE6MM695	sops_01M3704J90XKT4B0A3HAXNYMBM	2026-09-23 14:24:11.424927+03	2026-09-23 14:24:11.424927+03	\N
so_01M3704J7J8NBM77F04NM3N75C	pset_01M3704J82V8NE16ERFSR0MB2Z	sops_01M3704J90ZR8WTY87B2J1WGKJ	2026-09-23 14:24:11.424927+03	2026-09-23 14:24:11.424927+03	\N
\.


--
-- Data for Name: shipping_option_rule; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.shipping_option_rule (id, attribute, operator, value, shipping_option_id, created_at, updated_at, deleted_at) FROM stdin;
sorul_01M3704J7HFRHB32FJEXQCQ7VY	enabled_in_store	eq	"true"	so_01M3704J7HEB568C2Y12PYS53H	2026-09-23 14:24:11.379+03	2026-09-23 14:24:11.379+03	\N
sorul_01M3704J7HAFEFXA70QBWW9K8Z	is_return	eq	"false"	so_01M3704J7HEB568C2Y12PYS53H	2026-09-23 14:24:11.379+03	2026-09-23 14:24:11.379+03	\N
sorul_01M3704J7JB4Y081XHPD5M6T7M	enabled_in_store	eq	"true"	so_01M3704J7J8NBM77F04NM3N75C	2026-09-23 14:24:11.379+03	2026-09-23 14:24:11.379+03	\N
sorul_01M3704J7J7QZQJN8MP2HEW6X7	is_return	eq	"false"	so_01M3704J7J8NBM77F04NM3N75C	2026-09-23 14:24:11.379+03	2026-09-23 14:24:11.379+03	\N
\.


--
-- Data for Name: shipping_option_type; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.shipping_option_type (id, label, description, code, created_at, updated_at, deleted_at) FROM stdin;
sotype_01M3704J7H5S25QA3MFE8M72PW	Standart	1-3 iş gününde kargoda. 1.000 TL üzeri ücretsiz.	standart	2026-09-23 14:24:11.378+03	2026-09-23 14:24:11.378+03	\N
sotype_01M3704J7JZY06ZNK23DZNWPQ2	Hızlı	Saat 15:00'e kadar verilen siparişler aynı gün kargoda.	hizli	2026-09-23 14:24:11.379+03	2026-09-23 14:24:11.379+03	\N
\.


--
-- Data for Name: shipping_profile; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.shipping_profile (id, name, type, metadata, created_at, updated_at, deleted_at) FROM stdin;
sp_01M3704J0NX5A15ZZG838V3W5G	Default Shipping Profile	default	\N	2026-09-23 14:24:11.157+03	2026-09-23 14:24:11.157+03	\N
\.


--
-- Data for Name: stock_location; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.stock_location (id, created_at, updated_at, deleted_at, name, address_id, metadata) FROM stdin;
sloc_01M3704J5592G9WZNZPBHXKDQR	2026-09-23 14:24:11.301+03	2026-09-23 14:24:11.301+03	\N	Merkez Depo	laddr_01M3704J5455SEYBANE9DJ3TC7	\N
\.


--
-- Data for Name: stock_location_address; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.stock_location_address (id, created_at, updated_at, deleted_at, address_1, address_2, company, city, country_code, phone, province, postal_code, metadata) FROM stdin;
laddr_01M3704J5455SEYBANE9DJ3TC7	2026-09-23 14:24:11.301+03	2026-09-23 14:24:11.301+03	\N		\N	\N	İstanbul	TR	\N	\N	\N	\N
\.


--
-- Data for Name: store; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.store (id, name, default_sales_channel_id, default_region_id, default_location_id, metadata, created_at, updated_at, deleted_at) FROM stdin;
store_01M3704J34ABM1MS21EWM7J0W9	SEENERGY	sc_01M3704J236RKB65YSHQCQK2JB	\N	\N	\N	2026-09-23 14:24:11.23669+03	2026-09-23 14:24:11.23669+03	\N
\.


--
-- Data for Name: store_currency; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.store_currency (id, currency_code, is_default, store_id, created_at, updated_at, deleted_at) FROM stdin;
stocur_01M3704J38ZVXK8VTPXCVS0P3N	try	t	store_01M3704J34ABM1MS21EWM7J0W9	2026-09-23 14:24:11.23669+03	2026-09-23 14:24:11.23669+03	\N
\.


--
-- Data for Name: store_locale; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.store_locale (id, locale_code, store_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: tax_provider; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tax_provider (id, is_enabled, created_at, updated_at, deleted_at) FROM stdin;
tp_system	t	2026-09-23 14:24:07.557+03	2026-09-23 14:24:07.557+03	\N
\.


--
-- Data for Name: tax_rate; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tax_rate (id, rate, code, name, is_default, is_combinable, tax_region_id, metadata, created_at, updated_at, created_by, deleted_at) FROM stdin;
txr_01M3704J4VVRHZGRR8C3WWBJRK	20	KDV	KDV %20	t	f	txreg_01M3704J4M5RBCH5K2E72Y4GNH	\N	2026-09-23 14:24:11.291+03	2026-09-23 14:24:11.291+03	\N	\N
\.


--
-- Data for Name: tax_rate_rule; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tax_rate_rule (id, tax_rate_id, reference_id, reference, metadata, created_at, updated_at, created_by, deleted_at) FROM stdin;
\.


--
-- Data for Name: tax_region; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tax_region (id, provider_id, country_code, province_code, parent_id, metadata, created_at, updated_at, created_by, deleted_at) FROM stdin;
txreg_01M3704J4M5RBCH5K2E72Y4GNH	tp_system	tr	\N	\N	\N	2026-09-23 14:24:11.284+03	2026-09-23 14:24:11.284+03	\N	\N
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."user" (id, first_name, last_name, email, avatar_url, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: user_preference; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_preference (id, user_id, key, value, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: user_rbac_role; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_rbac_role (user_id, rbac_role_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: view_configuration; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.view_configuration (id, entity, name, user_id, is_system_default, configuration, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: vitrin_block; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.vitrin_block (id, "group", key, rank, is_active, data, created_at, updated_at, deleted_at) FROM stdin;
vblk_01M372G3M5H72NVB8SE01HFHAS	announcement	\N	0	t	{"text": "1000 TL ÜZERİ ÜCRETSİZ KARGO"}	2026-09-23 15:05:26.79+03	2026-09-23 15:05:26.79+03	\N
vblk_01M372G3M6D71QD73ZQ29M3VRA	brand-band	\N	4	t	{"logo": "/mock/brands/ledora.svg", "tagline": "Televizyon led bar ve panel yedek parçaları", "product_ids": [], "brand_handle": "ledora"}	2026-09-23 15:05:26.791+03	2026-09-23 15:05:26.791+03	\N
vblk_01M372G3M6WJFHJ6W2EFDSMCM8	brand-band	\N	5	t	{"logo": "/mock/brands/voltra.svg", "tagline": "Oto ses, multimedya ve görüntü sistemleri", "product_ids": [], "brand_handle": "voltra"}	2026-09-23 15:05:26.791+03	2026-09-23 15:05:26.791+03	\N
vblk_01M372G3M6X612VD4NG94VE0SF	brand-band	\N	6	t	{"logo": "/mock/brands/kumandax.svg", "tagline": "Televizyon, uydu ve klima kumandaları", "product_ids": [], "brand_handle": "kumandax"}	2026-09-23 15:05:26.791+03	2026-09-23 15:05:26.791+03	\N
vblk_01M372G3M64MZJ7NEG73CBWBNM	trust	\N	0	t	{"icon": "truck", "title": "Ücretsiz Kargo", "subtitle": "1000 TL ve Üzeri Alışverişlerde"}	2026-09-23 15:05:26.791+03	2026-09-23 15:05:26.791+03	\N
vblk_01M372G3M6B9R44VXBJRA7TRBZ	trust	\N	1	t	{"icon": "badge", "title": "Faturalı Ürün", "subtitle": "Garanti Kapsamında"}	2026-09-23 15:05:26.791+03	2026-09-23 15:05:26.791+03	\N
vblk_01M372G3M600MEZCXR4QKQXFAE	trust	\N	2	t	{"icon": "lock", "title": "Güvenli Alışveriş", "subtitle": "256Bit SSL Koruması"}	2026-09-23 15:05:26.791+03	2026-09-23 15:05:26.791+03	\N
vblk_01M372G3M604GQASBW7JHQXG05	trust	\N	3	t	{"icon": "refresh", "title": "Kolay İade", "subtitle": "14 İş Günü İçinde"}	2026-09-23 15:05:26.791+03	2026-09-23 15:05:26.791+03	\N
vblk_01M372G3M5HK4C7KME0W6RR3H4	hero-slide	\N	1	t	{"cta": "Ürünleri İncele", "href": "/kategori/seslendirme-sistemleri", "chips": ["Anfi ve mikser", "Tavan ve kolon hoparlör", "Toptan fiyat"], "image": "http://localhost:9000/static/1790171598733-PRO_PHO_MAI_vce26-h-mc.jpg", "title": "Profesyonel Ses", "eyebrow": "Seslendirme sistemleri", "description": "Sahne ve mekân seslendirmesinde toptan fiyat avantajı."}	2026-09-23 15:05:26.791+03	2026-09-23 16:53:56.859+03	\N
vblk_01M372G3M68JB47CZ92D0DT8XJ	brand-band	\N	0	t	{"logo": "/mock/brands/tekniva.svg", "banner": "/brand-banners/dahua.jpg", "tagline": "All in one bilgisayarlar ve monitörler", "product_ids": [], "brand_handle": "tekniva"}	2026-09-23 15:05:26.791+03	2026-09-28 22:46:39.738867+03	\N
vblk_01M372G3M6E45EZ2BFADSD1E9A	hero-side	hero-side-1	0	t	{"href": "/kampanyalar", "tone": "mor", "image": "", "title": "Süper Fırsat Ürünleri", "eyebrow": "Kampanya", "product_image": "/mock/products/cutout/speaker-white.svg"}	2026-09-23 15:05:26.791+03	2026-09-26 12:25:24.115+03	\N
vblk_01M372G3M6ZP14JVXKX7251XMP	hero-side	hero-side-2	1	t	{"href": "/toptan-satis", "tone": "turkuaz", "image": "", "title": "Toptan alım ve bayilik", "eyebrow": "Kurumsal", "product_image": "/mock/products/cutout/nvr-white.svg"}	2026-09-23 15:05:26.791+03	2026-09-26 12:25:24.115+03	\N
vblk_01M372G3M6CX9MGDXY0DZG2SYB	brand-band	\N	1	t	{"logo": "/mock/brands/orbisat.svg", "banner": "/brand-banners/hikvision.jpg", "tagline": "Uydu alıcıları ve santral sistemleri", "product_ids": [], "brand_handle": "orbisat"}	2026-09-23 15:05:26.791+03	2026-09-28 22:55:26.508985+03	\N
vblk_01M372G3M6HNKWY8WZN9F9W6FD	brand-band	\N	2	t	{"logo": "/mock/brands/sonora.svg", "banner": "/brand-banners/neutron.jpg", "tagline": "Profesyonel ses ve sahne sistemleri", "product_ids": [], "brand_handle": "sonora"}	2026-09-23 15:05:26.791+03	2026-09-28 22:55:26.508985+03	\N
vblk_01M372G3M69F21P7KHH2Q4M26F	brand-band	\N	3	t	{"logo": "/mock/brands/provista.svg", "banner": "/brand-banners/unv.jpg", "tagline": "Güvenlik kameraları ve kayıt cihazları", "product_ids": [], "brand_handle": "provista"}	2026-09-23 15:05:26.791+03	2026-09-28 22:55:26.508985+03	\N
vblk_01M372G3M55R5ZZMVAA6654RHW	hero-slide	\N	0	t	{"cta": "Kategorileri Gör", "fit": "contain", "href": "/kategori", "chips": ["CCTV ve kayıt", "Network ve PoE", "Alarm ve geçiş kontrol"], "image": "/brand/seenergy-logo-hero.webp", "title": "Güvenlik Teknolojileri", "eyebrow": "SEENERGY Güvenlik Teknolojileri", "description": "CCTV, kayıt, network, alarm ve geçiş kontrol ürünleri tek çatıda."}	2026-09-23 15:05:26.791+03	2026-10-01 10:22:11.465+03	\N
vblk_01M372G3M5Y855A5JKX09CVWB0	hero-slide	\N	2	t	{"cta": "Ürünleri İncele", "fit": "contain", "href": "/kategori/network-urunleri", "chips": ["PoE Switch", "Ethernet Switch", "Access Point / Router"], "image": "/mock/products/cutout/router-white.svg", "title": "Network ve PoE Çözümleri", "eyebrow": "Network ürünleri", "description": "IP kamera sistemleri için PoE switch, ethernet switch, access point ve router."}	2026-09-23 15:05:26.791+03	2026-10-01 10:22:11.466+03	\N
vblk_01M372G3M61Z496AC9M49YSRA3	banner	wide	0	t	{"href": "/kategori/cctv-guvenlik-sistemleri", "tone": "koyu", "image": "", "title": "AHD ve IP kamera sistemleri", "eyebrow": "CCTV güvenlik sistemleri", "subtitle": "Kamera, kayıt cihazı ve aksesuarlar; projeler için kurumsal teklif.", "product_image": "/mock/products/cutout/dome-white.svg"}	2026-09-23 15:05:26.791+03	2026-10-01 10:22:11.466+03	\N
vblk_01M372G3M6WGZ98CZD1ARNN43P	banner	dual-1	1	t	{"href": "/markalar", "tone": "acik", "image": "", "title": "Tescilli Markalarımız", "eyebrow": "Kendi markalarımız", "product_image": "/mock/products/cutout/receiver-white.svg"}	2026-09-23 15:05:26.791+03	2026-09-26 12:25:24.115+03	\N
vblk_01M372G3M6NG175NZHQK9R8AGH	banner	dual-2	2	t	{"href": "/markalar", "tone": "turkuaz", "image": "", "title": "Resmi Yetkili Satıcısı Olduğumuz Markalar", "eyebrow": "Yetkili satıcılık", "product_image": "/mock/products/cutout/camera-white.svg"}	2026-09-23 15:05:26.791+03	2026-09-26 12:25:24.115+03	\N
vblk_01M372G3M6KF45G5RSMVFBB8QS	banner	super-firsat-promo	3	t	{"href": "/kampanyalar", "tone": "mor", "image": "", "title": "Süper Fırsat", "subtitle": "Ürünleri", "product_image": "/mock/products/cutout/dish-white.svg"}	2026-09-23 15:05:26.791+03	2026-09-26 12:25:24.115+03	\N
vblk_01M372G3M6F1G0D2NC1X9ACAVQ	tech-band	\N	0	t	{"stats": [{"label": "Katalogdaki ürün çeşidi", "value": "12.000+"}, {"label": "Yetkili satıcısı olduğumuz marka", "value": "45+"}, {"label": "Aynı gün kargo için son saat", "value": "16:00"}, {"label": "Garanti kapsamındaki ürünler", "value": "24 ay"}], "title": "Güvenlik altyapısında tedarik, tek adresten", "eyebrow": "Neden SEENERGY", "cta_href": "/toptan-satis", "cta_label": "Kurumsal alım ve bayilik", "description": "CCTV ve kayıt sistemlerinden network, alarm, yangın algılama ve geçiş kontrolüne, uydu ve seslendirme sistemlerine kadar güvenlik altyapısının ürünleri; hem son kullanıcıya hem kurumsal alıcıya aynı stok derinliğiyle."}	2026-09-23 15:05:26.791+03	2026-10-01 10:22:11.466+03	\N
\.


--
-- Data for Name: vitrin_list; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.vitrin_list (id, key, title, description, product_ids, created_at, updated_at, deleted_at) FROM stdin;
vlist_01M372G3KY155RW2ZG35MHAHC4	haftanin	Haftanın Ürünleri	Ana sayfadaki 'Haftanın Ürünleri' rafı (ilk 8) ve sekmesi (ilk 12).	{prod_01M374VN91HAMJT1T85974N71T,prod_01M3704JBCDCPWAV799W5MDB2Q,prod_01M3704JBC0YEWMERTH5QW3DNK,prod_01M3704JBCKGW9QKMX6ET5A9MW,prod_01M3704JBC3HDVBT8BGS9QSXPE,prod_01M3704JBC55PJJQBNQXPZTS6G,prod_01M3704JBCBCR24HBQVGXA0AZG,prod_01M3704JBCXBV13KW3A3MP20DB,prod_01M3704JBC48SG8WC48C3DF4FG,prod_01M3704JBDHB882SB9JM6H9V3N,prod_01M3704JBDQ9WM8EBJJ8QCCKZ1,prod_01M3704JBDK4NTGGANMJQV51Y9,prod_01M3704JBDYP8E9YQ1RV6KX70W}	2026-09-23 15:05:26.783+03	2026-09-23 15:46:42.805+03	\N
vlist_01M372G3KY7MCX9DAREFRV6WM0	yeni	Yeni Gelenler	'Yeni Gelenler' rafı (ilk 8) ve 'Yeni Ürünler' sekmesi (ilk 12).	{prod_01M374VN91HAMJT1T85974N71T,prod_01M3704JBC9ZWFD2XRVPFF74PA,prod_01M3704JBCRST6DA5ZZWGCN0KW,prod_01M3704JBC7GVJT1NVWQHXACTH,prod_01M3704JBC1SP3M5ZRW05WXB7P,prod_01M3704JBC1NDGX04H6ZDMP2WD,prod_01M3704JBCGTS51DVBBH9T7DAA,prod_01M3704JBDY5T4BNC6R1RR3V8E,prod_01M3704JBD2AF9D2XX6AZM5MR0,prod_01M3704JBD9WQG3QSMZ4Z5H80J,prod_01M3704JBD3M2D2V9RRKJ6D1X1,prod_01M3704JBCDCPWAV799W5MDB2Q,prod_01M3704JBC0YEWMERTH5QW3DNK}	2026-09-23 15:05:26.783+03	2026-09-23 15:46:42.805+03	\N
vlist_01M372G3KYK8Y30DD32TMZGJ1A	cok-satan	Çok Satanlar	Sekmeli bloktaki 'Çok Satanlar' (ilk 12).	{prod_01M374VN91HAMJT1T85974N71T,prod_01M3704JBC39NJ7X4SYRYGEQDR,prod_01M3704JBCNXYR2DT3E3TW1SQF,prod_01M3704JBC46SCQVGHC69CRN5B,prod_01M3704JBCG873HZHMK2J79AWB,prod_01M3704JBD8NS1N27SP4Z0GEX9,prod_01M3704JBDHDCAZAN36GTYS4YY,prod_01M3704JBD714MY8QY02RVEBFE,prod_01M3704JBD9E0E0PRHYVHS3MZR,prod_01M3704JBCJYZMXNJ2CS7S43DB,prod_01M3704JBCDH6HRQE2QB4NV2QZ,prod_01M3704JBCH0JEA9V57VGQSY2H,prod_01M3704JBCCTJJEB35F869JJ4S}	2026-09-23 15:05:26.783+03	2026-09-23 15:46:42.805+03	\N
vlist_01M372G3KYKJ817KRS6TJ7H2AM	super-firsat	Süper Fırsat Ürünleri	Mor fırsat kartının yanındaki 4 ürün.	{prod_01M374VN91HAMJT1T85974N71T,prod_01M3704JBCZ0QP0926CX9BKP16,prod_01M3704JBCZEA31BTY6SM3N08F,prod_01M3704JBC53GPRKB7AMPF4Z8W,prod_01M3704JBCG7P88J5C6V2QN81N}	2026-09-23 15:05:26.783+03	2026-09-23 15:46:42.805+03	\N
\.


--
-- Data for Name: workflow_execution; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.workflow_execution (id, workflow_id, transaction_id, execution, context, state, created_at, updated_at, deleted_at, retention_time, run_id) FROM stdin;
\.


--
-- Name: link_module_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.link_module_migrations_id_seq', 80, true);


--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 183, true);


--
-- Name: order_change_action_ordering_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.order_change_action_ordering_seq', 1, false);


--
-- Name: order_claim_display_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.order_claim_display_id_seq', 1, false);


--
-- Name: order_display_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.order_display_id_seq', 4, true);


--
-- Name: order_exchange_display_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.order_exchange_display_id_seq', 1, false);


--
-- Name: return_display_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.return_display_id_seq', 1, false);


--
-- Name: script_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.script_migrations_id_seq', 9, true);


--
-- Name: account_holder account_holder_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_holder
    ADD CONSTRAINT account_holder_pkey PRIMARY KEY (id);


--
-- Name: api_key api_key_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_key
    ADD CONSTRAINT api_key_pkey PRIMARY KEY (id);


--
-- Name: application_method_buy_rules application_method_buy_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.application_method_buy_rules
    ADD CONSTRAINT application_method_buy_rules_pkey PRIMARY KEY (application_method_id, promotion_rule_id);


--
-- Name: application_method_target_rules application_method_target_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.application_method_target_rules
    ADD CONSTRAINT application_method_target_rules_pkey PRIMARY KEY (application_method_id, promotion_rule_id);


--
-- Name: auth_identity auth_identity_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_identity
    ADD CONSTRAINT auth_identity_pkey PRIMARY KEY (id);


--
-- Name: auth_mfa_factor auth_mfa_factor_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_mfa_factor
    ADD CONSTRAINT auth_mfa_factor_pkey PRIMARY KEY (id);


--
-- Name: auth_mfa_recovery_code auth_mfa_recovery_code_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_mfa_recovery_code
    ADD CONSTRAINT auth_mfa_recovery_code_pkey PRIMARY KEY (id);


--
-- Name: auth_password_reset_token auth_password_reset_token_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_password_reset_token
    ADD CONSTRAINT auth_password_reset_token_pkey PRIMARY KEY (id);


--
-- Name: auth_verification auth_verification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_verification
    ADD CONSTRAINT auth_verification_pkey PRIMARY KEY (id);


--
-- Name: capture capture_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.capture
    ADD CONSTRAINT capture_pkey PRIMARY KEY (id);


--
-- Name: cart_address cart_address_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_address
    ADD CONSTRAINT cart_address_pkey PRIMARY KEY (id);


--
-- Name: cart_line_item_adjustment cart_line_item_adjustment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_line_item_adjustment
    ADD CONSTRAINT cart_line_item_adjustment_pkey PRIMARY KEY (id);


--
-- Name: cart_line_item cart_line_item_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_line_item
    ADD CONSTRAINT cart_line_item_pkey PRIMARY KEY (id);


--
-- Name: cart_line_item_tax_line cart_line_item_tax_line_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_line_item_tax_line
    ADD CONSTRAINT cart_line_item_tax_line_pkey PRIMARY KEY (id);


--
-- Name: cart_payment_collection cart_payment_collection_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_payment_collection
    ADD CONSTRAINT cart_payment_collection_pkey PRIMARY KEY (cart_id, payment_collection_id);


--
-- Name: cart cart_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (id);


--
-- Name: cart_promotion cart_promotion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_promotion
    ADD CONSTRAINT cart_promotion_pkey PRIMARY KEY (cart_id, promotion_id);


--
-- Name: cart_shipping_method_adjustment cart_shipping_method_adjustment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_shipping_method_adjustment
    ADD CONSTRAINT cart_shipping_method_adjustment_pkey PRIMARY KEY (id);


--
-- Name: cart_shipping_method cart_shipping_method_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_shipping_method
    ADD CONSTRAINT cart_shipping_method_pkey PRIMARY KEY (id);


--
-- Name: cart_shipping_method_tax_line cart_shipping_method_tax_line_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_shipping_method_tax_line
    ADD CONSTRAINT cart_shipping_method_tax_line_pkey PRIMARY KEY (id);


--
-- Name: credit_line credit_line_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credit_line
    ADD CONSTRAINT credit_line_pkey PRIMARY KEY (id);


--
-- Name: currency currency_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.currency
    ADD CONSTRAINT currency_pkey PRIMARY KEY (code);


--
-- Name: customer_account_holder customer_account_holder_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_account_holder
    ADD CONSTRAINT customer_account_holder_pkey PRIMARY KEY (customer_id, account_holder_id);


--
-- Name: customer_address customer_address_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_address
    ADD CONSTRAINT customer_address_pkey PRIMARY KEY (id);


--
-- Name: customer_group_customer customer_group_customer_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_group_customer
    ADD CONSTRAINT customer_group_customer_pkey PRIMARY KEY (id);


--
-- Name: customer_group customer_group_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_group
    ADD CONSTRAINT customer_group_pkey PRIMARY KEY (id);


--
-- Name: customer customer_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_pkey PRIMARY KEY (id);


--
-- Name: fulfillment_address fulfillment_address_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fulfillment_address
    ADD CONSTRAINT fulfillment_address_pkey PRIMARY KEY (id);


--
-- Name: fulfillment_item fulfillment_item_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fulfillment_item
    ADD CONSTRAINT fulfillment_item_pkey PRIMARY KEY (id);


--
-- Name: fulfillment_label fulfillment_label_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fulfillment_label
    ADD CONSTRAINT fulfillment_label_pkey PRIMARY KEY (id);


--
-- Name: fulfillment fulfillment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fulfillment
    ADD CONSTRAINT fulfillment_pkey PRIMARY KEY (id);


--
-- Name: fulfillment_provider fulfillment_provider_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fulfillment_provider
    ADD CONSTRAINT fulfillment_provider_pkey PRIMARY KEY (id);


--
-- Name: fulfillment_set fulfillment_set_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fulfillment_set
    ADD CONSTRAINT fulfillment_set_pkey PRIMARY KEY (id);


--
-- Name: geo_zone geo_zone_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.geo_zone
    ADD CONSTRAINT geo_zone_pkey PRIMARY KEY (id);


--
-- Name: image image_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.image
    ADD CONSTRAINT image_pkey PRIMARY KEY (id);


--
-- Name: inventory_item inventory_item_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory_item
    ADD CONSTRAINT inventory_item_pkey PRIMARY KEY (id);


--
-- Name: inventory_level inventory_level_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory_level
    ADD CONSTRAINT inventory_level_pkey PRIMARY KEY (id);


--
-- Name: invite invite_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invite
    ADD CONSTRAINT invite_pkey PRIMARY KEY (id);


--
-- Name: invite_rbac_role invite_rbac_role_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invite_rbac_role
    ADD CONSTRAINT invite_rbac_role_pkey PRIMARY KEY (invite_id, rbac_role_id);


--
-- Name: layout_configuration layout_configuration_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.layout_configuration
    ADD CONSTRAINT layout_configuration_pkey PRIMARY KEY (id);


--
-- Name: link_module_migrations link_module_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.link_module_migrations
    ADD CONSTRAINT link_module_migrations_pkey PRIMARY KEY (id);


--
-- Name: link_module_migrations link_module_migrations_table_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.link_module_migrations
    ADD CONSTRAINT link_module_migrations_table_name_key UNIQUE (table_name);


--
-- Name: location_fulfillment_provider location_fulfillment_provider_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.location_fulfillment_provider
    ADD CONSTRAINT location_fulfillment_provider_pkey PRIMARY KEY (stock_location_id, fulfillment_provider_id);


--
-- Name: location_fulfillment_set location_fulfillment_set_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.location_fulfillment_set
    ADD CONSTRAINT location_fulfillment_set_pkey PRIMARY KEY (stock_location_id, fulfillment_set_id);


--
-- Name: mikro_orm_migrations mikro_orm_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mikro_orm_migrations
    ADD CONSTRAINT mikro_orm_migrations_pkey PRIMARY KEY (id);


--
-- Name: notification notification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (id);


--
-- Name: notification_provider notification_provider_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_provider
    ADD CONSTRAINT notification_provider_pkey PRIMARY KEY (id);


--
-- Name: order_address order_address_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_address
    ADD CONSTRAINT order_address_pkey PRIMARY KEY (id);


--
-- Name: order_cart order_cart_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_cart
    ADD CONSTRAINT order_cart_pkey PRIMARY KEY (order_id, cart_id);


--
-- Name: order_change_action order_change_action_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_change_action
    ADD CONSTRAINT order_change_action_pkey PRIMARY KEY (id);


--
-- Name: order_change order_change_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_change
    ADD CONSTRAINT order_change_pkey PRIMARY KEY (id);


--
-- Name: order_claim_item_image order_claim_item_image_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_claim_item_image
    ADD CONSTRAINT order_claim_item_image_pkey PRIMARY KEY (id);


--
-- Name: order_claim_item order_claim_item_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_claim_item
    ADD CONSTRAINT order_claim_item_pkey PRIMARY KEY (id);


--
-- Name: order_claim order_claim_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_claim
    ADD CONSTRAINT order_claim_pkey PRIMARY KEY (id);


--
-- Name: order_credit_line order_credit_line_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_credit_line
    ADD CONSTRAINT order_credit_line_pkey PRIMARY KEY (id);


--
-- Name: order_exchange_item order_exchange_item_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_exchange_item
    ADD CONSTRAINT order_exchange_item_pkey PRIMARY KEY (id);


--
-- Name: order_exchange order_exchange_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_exchange
    ADD CONSTRAINT order_exchange_pkey PRIMARY KEY (id);


--
-- Name: order_fulfillment order_fulfillment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_fulfillment
    ADD CONSTRAINT order_fulfillment_pkey PRIMARY KEY (order_id, fulfillment_id);


--
-- Name: order_item order_item_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT order_item_pkey PRIMARY KEY (id);


--
-- Name: order_line_item_adjustment order_line_item_adjustment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_line_item_adjustment
    ADD CONSTRAINT order_line_item_adjustment_pkey PRIMARY KEY (id);


--
-- Name: order_line_item order_line_item_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_line_item
    ADD CONSTRAINT order_line_item_pkey PRIMARY KEY (id);


--
-- Name: order_line_item_tax_line order_line_item_tax_line_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_line_item_tax_line
    ADD CONSTRAINT order_line_item_tax_line_pkey PRIMARY KEY (id);


--
-- Name: order_payment_collection order_payment_collection_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_payment_collection
    ADD CONSTRAINT order_payment_collection_pkey PRIMARY KEY (order_id, payment_collection_id);


--
-- Name: order order_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_pkey PRIMARY KEY (id);


--
-- Name: order_promotion order_promotion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_promotion
    ADD CONSTRAINT order_promotion_pkey PRIMARY KEY (order_id, promotion_id);


--
-- Name: order_shipping_method_adjustment order_shipping_method_adjustment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_shipping_method_adjustment
    ADD CONSTRAINT order_shipping_method_adjustment_pkey PRIMARY KEY (id);


--
-- Name: order_shipping_method order_shipping_method_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_shipping_method
    ADD CONSTRAINT order_shipping_method_pkey PRIMARY KEY (id);


--
-- Name: order_shipping_method_tax_line order_shipping_method_tax_line_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_shipping_method_tax_line
    ADD CONSTRAINT order_shipping_method_tax_line_pkey PRIMARY KEY (id);


--
-- Name: order_shipping order_shipping_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_shipping
    ADD CONSTRAINT order_shipping_pkey PRIMARY KEY (id);


--
-- Name: order_summary order_summary_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_summary
    ADD CONSTRAINT order_summary_pkey PRIMARY KEY (id);


--
-- Name: order_transaction order_transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_transaction
    ADD CONSTRAINT order_transaction_pkey PRIMARY KEY (id);


--
-- Name: payment_collection_payment_providers payment_collection_payment_providers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_collection_payment_providers
    ADD CONSTRAINT payment_collection_payment_providers_pkey PRIMARY KEY (payment_collection_id, payment_provider_id);


--
-- Name: payment_collection payment_collection_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_collection
    ADD CONSTRAINT payment_collection_pkey PRIMARY KEY (id);


--
-- Name: payment payment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_pkey PRIMARY KEY (id);


--
-- Name: payment_provider payment_provider_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_provider
    ADD CONSTRAINT payment_provider_pkey PRIMARY KEY (id);


--
-- Name: payment_session payment_session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_session
    ADD CONSTRAINT payment_session_pkey PRIMARY KEY (id);


--
-- Name: price_list price_list_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.price_list
    ADD CONSTRAINT price_list_pkey PRIMARY KEY (id);


--
-- Name: price_list_rule price_list_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.price_list_rule
    ADD CONSTRAINT price_list_rule_pkey PRIMARY KEY (id);


--
-- Name: price price_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.price
    ADD CONSTRAINT price_pkey PRIMARY KEY (id);


--
-- Name: price_preference price_preference_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.price_preference
    ADD CONSTRAINT price_preference_pkey PRIMARY KEY (id);


--
-- Name: price_rule price_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.price_rule
    ADD CONSTRAINT price_rule_pkey PRIMARY KEY (id);


--
-- Name: price_set price_set_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.price_set
    ADD CONSTRAINT price_set_pkey PRIMARY KEY (id);


--
-- Name: product_category product_category_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT product_category_pkey PRIMARY KEY (id);


--
-- Name: product_category_product product_category_product_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_category_product
    ADD CONSTRAINT product_category_product_pkey PRIMARY KEY (product_id, product_category_id);


--
-- Name: product_collection product_collection_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_collection
    ADD CONSTRAINT product_collection_pkey PRIMARY KEY (id);


--
-- Name: product_option product_option_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_option
    ADD CONSTRAINT product_option_pkey PRIMARY KEY (id);


--
-- Name: product_option_value product_option_value_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_option_value
    ADD CONSTRAINT product_option_value_pkey PRIMARY KEY (id);


--
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);


--
-- Name: product_product_option product_product_option_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_product_option
    ADD CONSTRAINT product_product_option_pkey PRIMARY KEY (id);


--
-- Name: product_product_option_value product_product_option_value_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_product_option_value
    ADD CONSTRAINT product_product_option_value_pkey PRIMARY KEY (id);


--
-- Name: product_sales_channel product_sales_channel_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_sales_channel
    ADD CONSTRAINT product_sales_channel_pkey PRIMARY KEY (product_id, sales_channel_id);


--
-- Name: product_shipping_profile product_shipping_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_shipping_profile
    ADD CONSTRAINT product_shipping_profile_pkey PRIMARY KEY (product_id, shipping_profile_id);


--
-- Name: product_tag product_tag_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_tag
    ADD CONSTRAINT product_tag_pkey PRIMARY KEY (id);


--
-- Name: product_tags product_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_tags
    ADD CONSTRAINT product_tags_pkey PRIMARY KEY (product_id, product_tag_id);


--
-- Name: product_type product_type_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_type
    ADD CONSTRAINT product_type_pkey PRIMARY KEY (id);


--
-- Name: product_variant_inventory_item product_variant_inventory_item_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variant_inventory_item
    ADD CONSTRAINT product_variant_inventory_item_pkey PRIMARY KEY (variant_id, inventory_item_id);


--
-- Name: product_variant_option product_variant_option_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variant_option
    ADD CONSTRAINT product_variant_option_pkey PRIMARY KEY (variant_id, option_value_id);


--
-- Name: product_variant product_variant_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variant
    ADD CONSTRAINT product_variant_pkey PRIMARY KEY (id);


--
-- Name: product_variant_price_set product_variant_price_set_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variant_price_set
    ADD CONSTRAINT product_variant_price_set_pkey PRIMARY KEY (variant_id, price_set_id);


--
-- Name: product_variant_product_image product_variant_product_image_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variant_product_image
    ADD CONSTRAINT product_variant_product_image_pkey PRIMARY KEY (id);


--
-- Name: promotion_application_method promotion_application_method_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promotion_application_method
    ADD CONSTRAINT promotion_application_method_pkey PRIMARY KEY (id);


--
-- Name: promotion_campaign_budget promotion_campaign_budget_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promotion_campaign_budget
    ADD CONSTRAINT promotion_campaign_budget_pkey PRIMARY KEY (id);


--
-- Name: promotion_campaign_budget_usage promotion_campaign_budget_usage_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promotion_campaign_budget_usage
    ADD CONSTRAINT promotion_campaign_budget_usage_pkey PRIMARY KEY (id);


--
-- Name: promotion_campaign promotion_campaign_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promotion_campaign
    ADD CONSTRAINT promotion_campaign_pkey PRIMARY KEY (id);


--
-- Name: promotion promotion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promotion
    ADD CONSTRAINT promotion_pkey PRIMARY KEY (id);


--
-- Name: promotion_promotion_rule promotion_promotion_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promotion_promotion_rule
    ADD CONSTRAINT promotion_promotion_rule_pkey PRIMARY KEY (promotion_id, promotion_rule_id);


--
-- Name: promotion_rule promotion_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promotion_rule
    ADD CONSTRAINT promotion_rule_pkey PRIMARY KEY (id);


--
-- Name: promotion_rule_value promotion_rule_value_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promotion_rule_value
    ADD CONSTRAINT promotion_rule_value_pkey PRIMARY KEY (id);


--
-- Name: property_label property_label_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.property_label
    ADD CONSTRAINT property_label_pkey PRIMARY KEY (id);


--
-- Name: provider_identity provider_identity_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provider_identity
    ADD CONSTRAINT provider_identity_pkey PRIMARY KEY (id);


--
-- Name: publishable_api_key_sales_channel publishable_api_key_sales_channel_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publishable_api_key_sales_channel
    ADD CONSTRAINT publishable_api_key_sales_channel_pkey PRIMARY KEY (publishable_key_id, sales_channel_id);


--
-- Name: refund refund_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refund
    ADD CONSTRAINT refund_pkey PRIMARY KEY (id);


--
-- Name: refund_reason refund_reason_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refund_reason
    ADD CONSTRAINT refund_reason_pkey PRIMARY KEY (id);


--
-- Name: region_country region_country_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.region_country
    ADD CONSTRAINT region_country_pkey PRIMARY KEY (iso_2);


--
-- Name: region_payment_provider region_payment_provider_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.region_payment_provider
    ADD CONSTRAINT region_payment_provider_pkey PRIMARY KEY (region_id, payment_provider_id);


--
-- Name: region region_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.region
    ADD CONSTRAINT region_pkey PRIMARY KEY (id);


--
-- Name: reservation_item reservation_item_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservation_item
    ADD CONSTRAINT reservation_item_pkey PRIMARY KEY (id);


--
-- Name: return_fulfillment return_fulfillment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.return_fulfillment
    ADD CONSTRAINT return_fulfillment_pkey PRIMARY KEY (return_id, fulfillment_id);


--
-- Name: return_item return_item_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.return_item
    ADD CONSTRAINT return_item_pkey PRIMARY KEY (id);


--
-- Name: return return_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.return
    ADD CONSTRAINT return_pkey PRIMARY KEY (id);


--
-- Name: return_reason return_reason_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.return_reason
    ADD CONSTRAINT return_reason_pkey PRIMARY KEY (id);


--
-- Name: sales_channel sales_channel_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_channel
    ADD CONSTRAINT sales_channel_pkey PRIMARY KEY (id);


--
-- Name: sales_channel_stock_location sales_channel_stock_location_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_channel_stock_location
    ADD CONSTRAINT sales_channel_stock_location_pkey PRIMARY KEY (sales_channel_id, stock_location_id);


--
-- Name: script_migrations script_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.script_migrations
    ADD CONSTRAINT script_migrations_pkey PRIMARY KEY (id);


--
-- Name: search_index search_index_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.search_index
    ADD CONSTRAINT search_index_pkey PRIMARY KEY (id);


--
-- Name: search_index_sync search_index_sync_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.search_index_sync
    ADD CONSTRAINT search_index_sync_pkey PRIMARY KEY (id);


--
-- Name: search_index_version search_index_version_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.search_index_version
    ADD CONSTRAINT search_index_version_pkey PRIMARY KEY (id);


--
-- Name: search_pg_product_v1 search_pg_product_v1_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.search_pg_product_v1
    ADD CONSTRAINT search_pg_product_v1_pkey PRIMARY KEY (id);


--
-- Name: search_postgres_index search_postgres_index_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.search_postgres_index
    ADD CONSTRAINT search_postgres_index_pkey PRIMARY KEY (name);


--
-- Name: service_zone service_zone_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_zone
    ADD CONSTRAINT service_zone_pkey PRIMARY KEY (id);


--
-- Name: shipping_option shipping_option_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_option
    ADD CONSTRAINT shipping_option_pkey PRIMARY KEY (id);


--
-- Name: shipping_option_price_set shipping_option_price_set_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_option_price_set
    ADD CONSTRAINT shipping_option_price_set_pkey PRIMARY KEY (shipping_option_id, price_set_id);


--
-- Name: shipping_option_rule shipping_option_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_option_rule
    ADD CONSTRAINT shipping_option_rule_pkey PRIMARY KEY (id);


--
-- Name: shipping_option_type shipping_option_type_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_option_type
    ADD CONSTRAINT shipping_option_type_pkey PRIMARY KEY (id);


--
-- Name: shipping_profile shipping_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_profile
    ADD CONSTRAINT shipping_profile_pkey PRIMARY KEY (id);


--
-- Name: stock_location_address stock_location_address_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_location_address
    ADD CONSTRAINT stock_location_address_pkey PRIMARY KEY (id);


--
-- Name: stock_location stock_location_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_location
    ADD CONSTRAINT stock_location_pkey PRIMARY KEY (id);


--
-- Name: store_currency store_currency_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_currency
    ADD CONSTRAINT store_currency_pkey PRIMARY KEY (id);


--
-- Name: store_locale store_locale_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_locale
    ADD CONSTRAINT store_locale_pkey PRIMARY KEY (id);


--
-- Name: store store_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store
    ADD CONSTRAINT store_pkey PRIMARY KEY (id);


--
-- Name: tax_provider tax_provider_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tax_provider
    ADD CONSTRAINT tax_provider_pkey PRIMARY KEY (id);


--
-- Name: tax_rate tax_rate_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tax_rate
    ADD CONSTRAINT tax_rate_pkey PRIMARY KEY (id);


--
-- Name: tax_rate_rule tax_rate_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tax_rate_rule
    ADD CONSTRAINT tax_rate_rule_pkey PRIMARY KEY (id);


--
-- Name: tax_region tax_region_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tax_region
    ADD CONSTRAINT tax_region_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: user_preference user_preference_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_preference
    ADD CONSTRAINT user_preference_pkey PRIMARY KEY (id);


--
-- Name: user_rbac_role user_rbac_role_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_rbac_role
    ADD CONSTRAINT user_rbac_role_pkey PRIMARY KEY (user_id, rbac_role_id);


--
-- Name: view_configuration view_configuration_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.view_configuration
    ADD CONSTRAINT view_configuration_pkey PRIMARY KEY (id);


--
-- Name: vitrin_block vitrin_block_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vitrin_block
    ADD CONSTRAINT vitrin_block_pkey PRIMARY KEY (id);


--
-- Name: vitrin_list vitrin_list_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vitrin_list
    ADD CONSTRAINT vitrin_list_pkey PRIMARY KEY (id);


--
-- Name: workflow_execution workflow_execution_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workflow_execution
    ADD CONSTRAINT workflow_execution_pkey PRIMARY KEY (workflow_id, transaction_id, run_id);


--
-- Name: IDX_account_holder_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_account_holder_deleted_at" ON public.account_holder USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_account_holder_id_5cb3a0c0; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_account_holder_id_5cb3a0c0" ON public.customer_account_holder USING btree (account_holder_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_account_holder_provider_id_external_id_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_account_holder_provider_id_external_id_unique" ON public.account_holder USING btree (provider_id, external_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_api_key_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_api_key_deleted_at" ON public.api_key USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_api_key_redacted; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_api_key_redacted" ON public.api_key USING btree (redacted) WHERE (deleted_at IS NULL);


--
-- Name: IDX_api_key_revoked_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_api_key_revoked_at" ON public.api_key USING btree (revoked_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_api_key_token_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_api_key_token_unique" ON public.api_key USING btree (token);


--
-- Name: IDX_api_key_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_api_key_type" ON public.api_key USING btree (type);


--
-- Name: IDX_application_method_allocation; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_application_method_allocation" ON public.promotion_application_method USING btree (allocation);


--
-- Name: IDX_application_method_target_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_application_method_target_type" ON public.promotion_application_method USING btree (target_type);


--
-- Name: IDX_application_method_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_application_method_type" ON public.promotion_application_method USING btree (type);


--
-- Name: IDX_auth_identity_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_auth_identity_deleted_at" ON public.auth_identity USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_auth_mfa_factor_auth_identity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_auth_mfa_factor_auth_identity_id" ON public.auth_mfa_factor USING btree (auth_identity_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_auth_mfa_factor_auth_identity_provider_active; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_auth_mfa_factor_auth_identity_provider_active" ON public.auth_mfa_factor USING btree (auth_identity_id, provider) WHERE ((deleted_at IS NULL) AND (status = ANY (ARRAY['pending'::text, 'enabled'::text])));


--
-- Name: IDX_auth_mfa_factor_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_auth_mfa_factor_deleted_at" ON public.auth_mfa_factor USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_auth_mfa_recovery_code_auth_identity_code_hash; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_auth_mfa_recovery_code_auth_identity_code_hash" ON public.auth_mfa_recovery_code USING btree (auth_identity_id, code_hash) WHERE (deleted_at IS NULL);


--
-- Name: IDX_auth_mfa_recovery_code_auth_identity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_auth_mfa_recovery_code_auth_identity_id" ON public.auth_mfa_recovery_code USING btree (auth_identity_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_auth_mfa_recovery_code_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_auth_mfa_recovery_code_deleted_at" ON public.auth_mfa_recovery_code USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_auth_password_reset_token_auth_identity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_auth_password_reset_token_auth_identity_id" ON public.auth_password_reset_token USING btree (auth_identity_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_auth_password_reset_token_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_auth_password_reset_token_deleted_at" ON public.auth_password_reset_token USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_auth_password_reset_token_expires_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_auth_password_reset_token_expires_at" ON public.auth_password_reset_token USING btree (expires_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_auth_password_reset_token_provider_identity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_auth_password_reset_token_provider_identity_id" ON public.auth_password_reset_token USING btree (provider_identity_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_auth_password_reset_token_token_hash; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_auth_password_reset_token_token_hash" ON public.auth_password_reset_token USING btree (token_hash) WHERE (deleted_at IS NULL);


--
-- Name: IDX_auth_verification_auth_identity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_auth_verification_auth_identity_id" ON public.auth_verification USING btree (auth_identity_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_auth_verification_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_auth_verification_deleted_at" ON public.auth_verification USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_auth_verification_unique_auth_identity_entity_id_entity_typ; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_auth_verification_unique_auth_identity_entity_id_entity_typ" ON public.auth_verification USING btree (auth_identity_id, entity_id, entity_type) WHERE (deleted_at IS NULL);


--
-- Name: IDX_campaign_budget_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_campaign_budget_type" ON public.promotion_campaign_budget USING btree (type);


--
-- Name: IDX_capture_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_capture_deleted_at" ON public.capture USING btree (deleted_at);


--
-- Name: IDX_capture_payment_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_capture_payment_id" ON public.capture USING btree (payment_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_address_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_cart_address_deleted_at" ON public.cart_address USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_billing_address_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_cart_billing_address_id" ON public.cart USING btree (billing_address_id) WHERE ((deleted_at IS NULL) AND (billing_address_id IS NOT NULL));


--
-- Name: IDX_cart_credit_line_reference_reference_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_cart_credit_line_reference_reference_id" ON public.credit_line USING btree (reference, reference_id) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_currency_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_cart_currency_code" ON public.cart USING btree (currency_code);


--
-- Name: IDX_cart_customer_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_cart_customer_id" ON public.cart USING btree (customer_id) WHERE ((deleted_at IS NULL) AND (customer_id IS NOT NULL));


--
-- Name: IDX_cart_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_cart_deleted_at" ON public.cart USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_id_-4a39f6c9; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_cart_id_-4a39f6c9" ON public.cart_payment_collection USING btree (cart_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_id_-71069c16; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_cart_id_-71069c16" ON public.order_cart USING btree (cart_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_id_-a9d4a70b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_cart_id_-a9d4a70b" ON public.cart_promotion USING btree (cart_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_line_item_adjustment_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_cart_line_item_adjustment_deleted_at" ON public.cart_line_item_adjustment USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_line_item_adjustment_item_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_cart_line_item_adjustment_item_id" ON public.cart_line_item_adjustment USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_line_item_cart_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_cart_line_item_cart_id" ON public.cart_line_item USING btree (cart_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_line_item_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_cart_line_item_deleted_at" ON public.cart_line_item USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_line_item_tax_line_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_cart_line_item_tax_line_deleted_at" ON public.cart_line_item_tax_line USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_line_item_tax_line_item_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_cart_line_item_tax_line_item_id" ON public.cart_line_item_tax_line USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_region_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_cart_region_id" ON public.cart USING btree (region_id) WHERE ((deleted_at IS NULL) AND (region_id IS NOT NULL));


--
-- Name: IDX_cart_sales_channel_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_cart_sales_channel_id" ON public.cart USING btree (sales_channel_id) WHERE ((deleted_at IS NULL) AND (sales_channel_id IS NOT NULL));


--
-- Name: IDX_cart_shipping_address_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_cart_shipping_address_id" ON public.cart USING btree (shipping_address_id) WHERE ((deleted_at IS NULL) AND (shipping_address_id IS NOT NULL));


--
-- Name: IDX_cart_shipping_method_adjustment_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_cart_shipping_method_adjustment_deleted_at" ON public.cart_shipping_method_adjustment USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_shipping_method_adjustment_shipping_method_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_cart_shipping_method_adjustment_shipping_method_id" ON public.cart_shipping_method_adjustment USING btree (shipping_method_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_shipping_method_cart_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_cart_shipping_method_cart_id" ON public.cart_shipping_method USING btree (cart_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_shipping_method_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_cart_shipping_method_deleted_at" ON public.cart_shipping_method USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_shipping_method_tax_line_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_cart_shipping_method_tax_line_deleted_at" ON public.cart_shipping_method_tax_line USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_shipping_method_tax_line_shipping_method_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_cart_shipping_method_tax_line_shipping_method_id" ON public.cart_shipping_method_tax_line USING btree (shipping_method_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_category_handle_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_category_handle_unique" ON public.product_category USING btree (handle) WHERE (deleted_at IS NULL);


--
-- Name: IDX_collection_handle_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_collection_handle_unique" ON public.product_collection USING btree (handle) WHERE (deleted_at IS NULL);


--
-- Name: IDX_credit_line_cart_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_credit_line_cart_id" ON public.credit_line USING btree (cart_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_credit_line_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_credit_line_deleted_at" ON public.credit_line USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_address_customer_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_customer_address_customer_id" ON public.customer_address USING btree (customer_id);


--
-- Name: IDX_customer_address_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_customer_address_deleted_at" ON public.customer_address USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_address_unique_customer_billing; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_customer_address_unique_customer_billing" ON public.customer_address USING btree (customer_id) WHERE (is_default_billing = true);


--
-- Name: IDX_customer_address_unique_customer_shipping; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_customer_address_unique_customer_shipping" ON public.customer_address USING btree (customer_id) WHERE (is_default_shipping = true);


--
-- Name: IDX_customer_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_customer_deleted_at" ON public.customer USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_email_has_account_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_customer_email_has_account_unique" ON public.customer USING btree (email, has_account) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_group_customer_customer_group_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_customer_group_customer_customer_group_id" ON public.customer_group_customer USING btree (customer_group_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_group_customer_customer_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_customer_group_customer_customer_id" ON public.customer_group_customer USING btree (customer_id);


--
-- Name: IDX_customer_group_customer_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_customer_group_customer_deleted_at" ON public.customer_group_customer USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_group_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_customer_group_deleted_at" ON public.customer_group USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_group_name_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_customer_group_name_unique" ON public.customer_group USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_id_5cb3a0c0; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_customer_id_5cb3a0c0" ON public.customer_account_holder USING btree (customer_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_deleted_at_-1d67bae40; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_deleted_at_-1d67bae40" ON public.publishable_api_key_sales_channel USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-1e5992737; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_deleted_at_-1e5992737" ON public.location_fulfillment_provider USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-31ea43a; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_deleted_at_-31ea43a" ON public.return_fulfillment USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-4a39f6c9; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_deleted_at_-4a39f6c9" ON public.cart_payment_collection USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-71069c16; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_deleted_at_-71069c16" ON public.order_cart USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-71518339; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_deleted_at_-71518339" ON public.order_promotion USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-85069d44; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_deleted_at_-85069d44" ON public.invite_rbac_role USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-a9d4a70b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_deleted_at_-a9d4a70b" ON public.cart_promotion USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-e88adb96; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_deleted_at_-e88adb96" ON public.location_fulfillment_set USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-e8d2543e; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_deleted_at_-e8d2543e" ON public.order_fulfillment USING btree (deleted_at);


--
-- Name: IDX_deleted_at_17a262437; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_deleted_at_17a262437" ON public.product_shipping_profile USING btree (deleted_at);


--
-- Name: IDX_deleted_at_17b4c4e35; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_deleted_at_17b4c4e35" ON public.product_variant_inventory_item USING btree (deleted_at);


--
-- Name: IDX_deleted_at_1c934dab0; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_deleted_at_1c934dab0" ON public.region_payment_provider USING btree (deleted_at);


--
-- Name: IDX_deleted_at_20b454295; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_deleted_at_20b454295" ON public.product_sales_channel USING btree (deleted_at);


--
-- Name: IDX_deleted_at_26d06f470; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_deleted_at_26d06f470" ON public.sales_channel_stock_location USING btree (deleted_at);


--
-- Name: IDX_deleted_at_52b23597; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_deleted_at_52b23597" ON public.product_variant_price_set USING btree (deleted_at);


--
-- Name: IDX_deleted_at_5cb3a0c0; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_deleted_at_5cb3a0c0" ON public.customer_account_holder USING btree (deleted_at);


--
-- Name: IDX_deleted_at_64ff0c4c; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_deleted_at_64ff0c4c" ON public.user_rbac_role USING btree (deleted_at);


--
-- Name: IDX_deleted_at_ba32fa9c; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_deleted_at_ba32fa9c" ON public.shipping_option_price_set USING btree (deleted_at);


--
-- Name: IDX_deleted_at_f42b9949; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_deleted_at_f42b9949" ON public.order_payment_collection USING btree (deleted_at);


--
-- Name: IDX_fulfillment_address_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_fulfillment_address_deleted_at" ON public.fulfillment_address USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_fulfillment_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_fulfillment_deleted_at" ON public.fulfillment USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_fulfillment_id_-31ea43a; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_fulfillment_id_-31ea43a" ON public.return_fulfillment USING btree (fulfillment_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_id_-e8d2543e; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_fulfillment_id_-e8d2543e" ON public.order_fulfillment USING btree (fulfillment_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_item_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_fulfillment_item_deleted_at" ON public.fulfillment_item USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_fulfillment_item_fulfillment_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_fulfillment_item_fulfillment_id" ON public.fulfillment_item USING btree (fulfillment_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_item_inventory_item_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_fulfillment_item_inventory_item_id" ON public.fulfillment_item USING btree (inventory_item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_item_line_item_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_fulfillment_item_line_item_id" ON public.fulfillment_item USING btree (line_item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_label_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_fulfillment_label_deleted_at" ON public.fulfillment_label USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_fulfillment_label_fulfillment_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_fulfillment_label_fulfillment_id" ON public.fulfillment_label USING btree (fulfillment_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_location_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_fulfillment_location_id" ON public.fulfillment USING btree (location_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_provider_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_fulfillment_provider_deleted_at" ON public.fulfillment_provider USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_provider_id_-1e5992737; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_fulfillment_provider_id_-1e5992737" ON public.location_fulfillment_provider USING btree (fulfillment_provider_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_set_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_fulfillment_set_deleted_at" ON public.fulfillment_set USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_fulfillment_set_id_-e88adb96; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_fulfillment_set_id_-e88adb96" ON public.location_fulfillment_set USING btree (fulfillment_set_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_set_name_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_fulfillment_set_name_unique" ON public.fulfillment_set USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_shipping_option_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_fulfillment_shipping_option_id" ON public.fulfillment USING btree (shipping_option_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_geo_zone_city; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_geo_zone_city" ON public.geo_zone USING btree (city) WHERE ((deleted_at IS NULL) AND (city IS NOT NULL));


--
-- Name: IDX_geo_zone_country_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_geo_zone_country_code" ON public.geo_zone USING btree (country_code) WHERE (deleted_at IS NULL);


--
-- Name: IDX_geo_zone_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_geo_zone_deleted_at" ON public.geo_zone USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_geo_zone_province_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_geo_zone_province_code" ON public.geo_zone USING btree (province_code) WHERE ((deleted_at IS NULL) AND (province_code IS NOT NULL));


--
-- Name: IDX_geo_zone_service_zone_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_geo_zone_service_zone_id" ON public.geo_zone USING btree (service_zone_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_id_-1d67bae40; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_id_-1d67bae40" ON public.publishable_api_key_sales_channel USING btree (id);


--
-- Name: IDX_id_-1e5992737; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_id_-1e5992737" ON public.location_fulfillment_provider USING btree (id);


--
-- Name: IDX_id_-31ea43a; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_id_-31ea43a" ON public.return_fulfillment USING btree (id);


--
-- Name: IDX_id_-4a39f6c9; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_id_-4a39f6c9" ON public.cart_payment_collection USING btree (id);


--
-- Name: IDX_id_-71069c16; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_id_-71069c16" ON public.order_cart USING btree (id);


--
-- Name: IDX_id_-71518339; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_id_-71518339" ON public.order_promotion USING btree (id);


--
-- Name: IDX_id_-85069d44; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_id_-85069d44" ON public.invite_rbac_role USING btree (id);


--
-- Name: IDX_id_-a9d4a70b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_id_-a9d4a70b" ON public.cart_promotion USING btree (id);


--
-- Name: IDX_id_-e88adb96; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_id_-e88adb96" ON public.location_fulfillment_set USING btree (id);


--
-- Name: IDX_id_-e8d2543e; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_id_-e8d2543e" ON public.order_fulfillment USING btree (id);


--
-- Name: IDX_id_17a262437; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_id_17a262437" ON public.product_shipping_profile USING btree (id);


--
-- Name: IDX_id_17b4c4e35; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_id_17b4c4e35" ON public.product_variant_inventory_item USING btree (id);


--
-- Name: IDX_id_1c934dab0; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_id_1c934dab0" ON public.region_payment_provider USING btree (id);


--
-- Name: IDX_id_20b454295; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_id_20b454295" ON public.product_sales_channel USING btree (id);


--
-- Name: IDX_id_26d06f470; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_id_26d06f470" ON public.sales_channel_stock_location USING btree (id);


--
-- Name: IDX_id_52b23597; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_id_52b23597" ON public.product_variant_price_set USING btree (id);


--
-- Name: IDX_id_5cb3a0c0; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_id_5cb3a0c0" ON public.customer_account_holder USING btree (id);


--
-- Name: IDX_id_64ff0c4c; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_id_64ff0c4c" ON public.user_rbac_role USING btree (id);


--
-- Name: IDX_id_ba32fa9c; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_id_ba32fa9c" ON public.shipping_option_price_set USING btree (id);


--
-- Name: IDX_id_f42b9949; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_id_f42b9949" ON public.order_payment_collection USING btree (id);


--
-- Name: IDX_image_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_image_deleted_at" ON public.image USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_image_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_image_product_id" ON public.image USING btree (product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_inventory_item_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_inventory_item_deleted_at" ON public.inventory_item USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_inventory_item_id_17b4c4e35; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_inventory_item_id_17b4c4e35" ON public.product_variant_inventory_item USING btree (inventory_item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_inventory_item_sku; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_inventory_item_sku" ON public.inventory_item USING btree (sku) WHERE (deleted_at IS NULL);


--
-- Name: IDX_inventory_level_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_inventory_level_deleted_at" ON public.inventory_level USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_inventory_level_inventory_item_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_inventory_level_inventory_item_id" ON public.inventory_level USING btree (inventory_item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_inventory_level_location_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_inventory_level_location_id" ON public.inventory_level USING btree (location_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_inventory_level_location_id_inventory_item_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_inventory_level_location_id_inventory_item_id" ON public.inventory_level USING btree (inventory_item_id, location_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_invite_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_invite_deleted_at" ON public.invite USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_invite_email_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_invite_email_unique" ON public.invite USING btree (email) WHERE (deleted_at IS NULL);


--
-- Name: IDX_invite_id_-85069d44; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_invite_id_-85069d44" ON public.invite_rbac_role USING btree (invite_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_invite_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_invite_token" ON public.invite USING btree (token) WHERE (deleted_at IS NULL);


--
-- Name: IDX_layout_configuration_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_layout_configuration_deleted_at" ON public.layout_configuration USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_layout_configuration_zone_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_layout_configuration_zone_unique" ON public.layout_configuration USING btree (zone) WHERE ((is_system_default = true) AND (deleted_at IS NULL));


--
-- Name: IDX_layout_configuration_zone_user_id_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_layout_configuration_zone_user_id_unique" ON public.layout_configuration USING btree (zone, user_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_line_item_adjustment_promotion_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_line_item_adjustment_promotion_id" ON public.cart_line_item_adjustment USING btree (promotion_id) WHERE ((deleted_at IS NULL) AND (promotion_id IS NOT NULL));


--
-- Name: IDX_line_item_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_line_item_product_id" ON public.cart_line_item USING btree (product_id) WHERE ((deleted_at IS NULL) AND (product_id IS NOT NULL));


--
-- Name: IDX_line_item_product_type_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_line_item_product_type_id" ON public.order_line_item USING btree (product_type_id) WHERE ((deleted_at IS NULL) AND (product_type_id IS NOT NULL));


--
-- Name: IDX_line_item_tax_line_tax_rate_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_line_item_tax_line_tax_rate_id" ON public.cart_line_item_tax_line USING btree (tax_rate_id) WHERE ((deleted_at IS NULL) AND (tax_rate_id IS NOT NULL));


--
-- Name: IDX_line_item_variant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_line_item_variant_id" ON public.cart_line_item USING btree (variant_id) WHERE ((deleted_at IS NULL) AND (variant_id IS NOT NULL));


--
-- Name: IDX_notification_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_notification_deleted_at" ON public.notification USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_notification_idempotency_key_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_notification_idempotency_key_unique" ON public.notification USING btree (idempotency_key) WHERE (deleted_at IS NULL);


--
-- Name: IDX_notification_provider_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_notification_provider_deleted_at" ON public.notification_provider USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_notification_provider_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_notification_provider_id" ON public.notification USING btree (provider_id);


--
-- Name: IDX_notification_receiver_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_notification_receiver_id" ON public.notification USING btree (receiver_id);


--
-- Name: IDX_option_value_option_id_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_option_value_option_id_unique" ON public.product_option_value USING btree (option_id, value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_address_customer_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_address_customer_id" ON public.order_address USING btree (customer_id);


--
-- Name: IDX_order_address_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_address_deleted_at" ON public.order_address USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_billing_address_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_billing_address_id" ON public."order" USING btree (billing_address_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_change_action_claim_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_change_action_claim_id" ON public.order_change_action USING btree (claim_id) WHERE ((claim_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_change_action_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_change_action_deleted_at" ON public.order_change_action USING btree (deleted_at);


--
-- Name: IDX_order_change_action_exchange_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_change_action_exchange_id" ON public.order_change_action USING btree (exchange_id) WHERE ((exchange_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_change_action_order_change_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_change_action_order_change_id" ON public.order_change_action USING btree (order_change_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_change_action_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_change_action_order_id" ON public.order_change_action USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_change_action_ordering; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_change_action_ordering" ON public.order_change_action USING btree (ordering) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_change_action_return_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_change_action_return_id" ON public.order_change_action USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_change_change_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_change_change_type" ON public.order_change USING btree (change_type);


--
-- Name: IDX_order_change_claim_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_change_claim_id" ON public.order_change USING btree (claim_id) WHERE ((claim_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_change_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_change_deleted_at" ON public.order_change USING btree (deleted_at);


--
-- Name: IDX_order_change_exchange_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_change_exchange_id" ON public.order_change USING btree (exchange_id) WHERE ((exchange_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_change_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_change_order_id" ON public.order_change USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_change_order_id_version; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_change_order_id_version" ON public.order_change USING btree (order_id, version);


--
-- Name: IDX_order_change_return_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_change_return_id" ON public.order_change USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_change_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_change_status" ON public.order_change USING btree (status) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_change_version; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_change_version" ON public.order_change USING btree (order_id, version) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_claim_deleted_at" ON public.order_claim USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_display_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_claim_display_id" ON public.order_claim USING btree (display_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_item_claim_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_claim_item_claim_id" ON public.order_claim_item USING btree (claim_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_item_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_claim_item_deleted_at" ON public.order_claim_item USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_item_image_claim_item_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_claim_item_image_claim_item_id" ON public.order_claim_item_image USING btree (claim_item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_item_image_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_claim_item_image_deleted_at" ON public.order_claim_item_image USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_order_claim_item_item_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_claim_item_item_id" ON public.order_claim_item USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_claim_order_id" ON public.order_claim USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_return_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_claim_return_id" ON public.order_claim USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_credit_line_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_credit_line_deleted_at" ON public.order_credit_line USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_order_credit_line_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_credit_line_order_id" ON public.order_credit_line USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_credit_line_order_id_version; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_credit_line_order_id_version" ON public.order_credit_line USING btree (order_id, version) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_currency_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_currency_code" ON public."order" USING btree (currency_code) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_custom_display_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_order_custom_display_id" ON public."order" USING btree (custom_display_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_customer_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_customer_id" ON public."order" USING btree (customer_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_deleted_at" ON public."order" USING btree (deleted_at);


--
-- Name: IDX_order_display_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_display_id" ON public."order" USING btree (display_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_exchange_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_exchange_deleted_at" ON public.order_exchange USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_exchange_display_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_exchange_display_id" ON public.order_exchange USING btree (display_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_exchange_item_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_exchange_item_deleted_at" ON public.order_exchange_item USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_exchange_item_exchange_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_exchange_item_exchange_id" ON public.order_exchange_item USING btree (exchange_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_exchange_item_item_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_exchange_item_item_id" ON public.order_exchange_item USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_exchange_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_exchange_order_id" ON public.order_exchange USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_exchange_return_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_exchange_return_id" ON public.order_exchange USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_id_-71069c16; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_id_-71069c16" ON public.order_cart USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_id_-71518339; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_id_-71518339" ON public.order_promotion USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_id_-e8d2543e; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_id_-e8d2543e" ON public.order_fulfillment USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_id_f42b9949; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_id_f42b9949" ON public.order_payment_collection USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_is_draft_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_is_draft_order" ON public."order" USING btree (is_draft_order) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_item_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_item_deleted_at" ON public.order_item USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_order_item_item_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_item_item_id" ON public.order_item USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_item_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_item_order_id" ON public.order_item USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_item_order_id_version; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_item_order_id_version" ON public.order_item USING btree (order_id, version) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_line_item_adjustment_item_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_line_item_adjustment_item_id" ON public.order_line_item_adjustment USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_line_item_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_line_item_product_id" ON public.order_line_item USING btree (product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_line_item_tax_line_item_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_line_item_tax_line_item_id" ON public.order_line_item_tax_line USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_line_item_variant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_line_item_variant_id" ON public.order_line_item USING btree (variant_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_region_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_region_id" ON public."order" USING btree (region_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_sales_channel_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_sales_channel_id" ON public."order" USING btree (sales_channel_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_address_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_shipping_address_id" ON public."order" USING btree (shipping_address_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_claim_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_shipping_claim_id" ON public.order_shipping USING btree (claim_id) WHERE ((claim_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_shipping_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_shipping_deleted_at" ON public.order_shipping USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_order_shipping_exchange_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_shipping_exchange_id" ON public.order_shipping USING btree (exchange_id) WHERE ((exchange_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_shipping_item_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_shipping_item_id" ON public.order_shipping USING btree (shipping_method_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_method_adjustment_shipping_method_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_shipping_method_adjustment_shipping_method_id" ON public.order_shipping_method_adjustment USING btree (shipping_method_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_method_adjustment_version_shipping_method; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_order_shipping_method_adjustment_version_shipping_method" ON public.order_shipping_method_adjustment USING btree (version, shipping_method_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_method_shipping_option_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_shipping_method_shipping_option_id" ON public.order_shipping_method USING btree (shipping_option_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_method_tax_line_shipping_method_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_shipping_method_tax_line_shipping_method_id" ON public.order_shipping_method_tax_line USING btree (shipping_method_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_shipping_order_id" ON public.order_shipping USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_order_id_version; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_shipping_order_id_version" ON public.order_shipping USING btree (order_id, version) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_return_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_shipping_return_id" ON public.order_shipping USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_shipping_shipping_method_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_shipping_shipping_method_id" ON public.order_shipping USING btree (shipping_method_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_summary_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_summary_deleted_at" ON public.order_summary USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_order_summary_order_id_version; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_summary_order_id_version" ON public.order_summary USING btree (order_id, version) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_transaction_claim_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_transaction_claim_id" ON public.order_transaction USING btree (claim_id) WHERE ((claim_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_transaction_currency_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_transaction_currency_code" ON public.order_transaction USING btree (currency_code) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_transaction_exchange_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_transaction_exchange_id" ON public.order_transaction USING btree (exchange_id) WHERE ((exchange_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_transaction_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_transaction_order_id" ON public.order_transaction USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_transaction_order_id_version; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_transaction_order_id_version" ON public.order_transaction USING btree (order_id, version) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_transaction_reference_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_transaction_reference_id" ON public.order_transaction USING btree (reference_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_transaction_return_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_order_transaction_return_id" ON public.order_transaction USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_payment_collection_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_payment_collection_deleted_at" ON public.payment_collection USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_payment_collection_id_-4a39f6c9; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_payment_collection_id_-4a39f6c9" ON public.cart_payment_collection USING btree (payment_collection_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_payment_collection_id_f42b9949; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_payment_collection_id_f42b9949" ON public.order_payment_collection USING btree (payment_collection_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_payment_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_payment_deleted_at" ON public.payment USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_payment_payment_collection_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_payment_payment_collection_id" ON public.payment USING btree (payment_collection_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_payment_payment_session_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_payment_payment_session_id" ON public.payment USING btree (payment_session_id);


--
-- Name: IDX_payment_payment_session_id_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_payment_payment_session_id_unique" ON public.payment USING btree (payment_session_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_payment_provider_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_payment_provider_deleted_at" ON public.payment_provider USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_payment_provider_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_payment_provider_id" ON public.payment USING btree (provider_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_payment_provider_id_1c934dab0; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_payment_provider_id_1c934dab0" ON public.region_payment_provider USING btree (payment_provider_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_payment_session_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_payment_session_deleted_at" ON public.payment_session USING btree (deleted_at);


--
-- Name: IDX_payment_session_payment_collection_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_payment_session_payment_collection_id" ON public.payment_session USING btree (payment_collection_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_currency_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_price_currency_code" ON public.price USING btree (currency_code) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_price_deleted_at" ON public.price USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_price_list_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_price_list_deleted_at" ON public.price_list USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_price_list_id_status_starts_at_ends_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_price_list_id_status_starts_at_ends_at" ON public.price_list USING btree (id, status, starts_at, ends_at) WHERE ((deleted_at IS NULL) AND (status = 'active'::text));


--
-- Name: IDX_price_list_rule_attribute; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_price_list_rule_attribute" ON public.price_list_rule USING btree (attribute) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_list_rule_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_price_list_rule_deleted_at" ON public.price_list_rule USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_price_list_rule_price_list_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_price_list_rule_price_list_id" ON public.price_list_rule USING btree (price_list_id) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_price_list_rule_value; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_price_list_rule_value" ON public.price_list_rule USING gin (value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_preference_attribute_value; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_price_preference_attribute_value" ON public.price_preference USING btree (attribute, value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_preference_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_price_preference_deleted_at" ON public.price_preference USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_price_price_list_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_price_price_list_id" ON public.price USING btree (price_list_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_price_set_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_price_price_set_id" ON public.price USING btree (price_set_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_rule_attribute; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_price_rule_attribute" ON public.price_rule USING btree (attribute) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_rule_attribute_value; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_price_rule_attribute_value" ON public.price_rule USING btree (attribute, value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_rule_attribute_value_price_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_price_rule_attribute_value_price_id" ON public.price_rule USING btree (attribute, value, price_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_rule_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_price_rule_deleted_at" ON public.price_rule USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_price_rule_operator; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_price_rule_operator" ON public.price_rule USING btree (operator);


--
-- Name: IDX_price_rule_operator_value; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_price_rule_operator_value" ON public.price_rule USING btree (operator, value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_rule_price_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_price_rule_price_id" ON public.price_rule USING btree (price_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_rule_price_id_attribute_operator_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_price_rule_price_id_attribute_operator_unique" ON public.price_rule USING btree (price_id, attribute, operator) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_set_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_price_set_deleted_at" ON public.price_set USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_price_set_id_52b23597; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_price_set_id_52b23597" ON public.product_variant_price_set USING btree (price_set_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_set_id_ba32fa9c; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_price_set_id_ba32fa9c" ON public.shipping_option_price_set USING btree (price_set_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_category_parent_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_product_category_parent_category_id" ON public.product_category USING btree (parent_category_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_category_path; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_product_category_path" ON public.product_category USING btree (mpath) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_collection_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_product_collection_deleted_at" ON public.product_collection USING btree (deleted_at);


--
-- Name: IDX_product_collection_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_product_collection_id" ON public.product USING btree (collection_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_product_deleted_at" ON public.product USING btree (deleted_at);


--
-- Name: IDX_product_handle_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_product_handle_unique" ON public.product USING btree (handle) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_id_17a262437; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_product_id_17a262437" ON public.product_shipping_profile USING btree (product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_id_20b454295; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_product_id_20b454295" ON public.product_sales_channel USING btree (product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_image_rank; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_product_image_rank" ON public.image USING btree (rank) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_image_rank_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_product_image_rank_product_id" ON public.image USING btree (rank, product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_image_url; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_product_image_url" ON public.image USING btree (url) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_image_url_rank_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_product_image_url_rank_product_id" ON public.image USING btree (url, rank, product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_option_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_product_option_deleted_at" ON public.product_option USING btree (deleted_at);


--
-- Name: IDX_product_option_global_title_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_product_option_global_title_unique" ON public.product_option USING btree (title) WHERE ((deleted_at IS NULL) AND (is_exclusive = false));


--
-- Name: IDX_product_option_value_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_product_option_value_deleted_at" ON public.product_option_value USING btree (deleted_at);


--
-- Name: IDX_product_option_value_option_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_product_option_value_option_id" ON public.product_option_value USING btree (option_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_product_option_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_product_product_option_deleted_at" ON public.product_product_option USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_product_option_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_product_product_option_product_id" ON public.product_product_option USING btree (product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_product_option_product_option_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_product_product_option_product_option_id" ON public.product_product_option USING btree (product_option_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_product_option_value_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_product_product_option_value_deleted_at" ON public.product_product_option_value USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_product_option_value_product_option_value_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_product_product_option_value_product_option_value_id" ON public.product_product_option_value USING btree (product_option_value_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_product_option_value_product_product_option_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_product_product_option_value_product_product_option_id" ON public.product_product_option_value USING btree (product_product_option_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_product_option_value_product_product_option_id_fk; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_product_product_option_value_product_product_option_id_fk" ON public.product_product_option_value USING btree (product_product_option_id);


--
-- Name: IDX_product_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_product_status" ON public.product USING btree (status) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_tag_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_product_tag_deleted_at" ON public.product_tag USING btree (deleted_at);


--
-- Name: IDX_product_type_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_product_type_deleted_at" ON public.product_type USING btree (deleted_at);


--
-- Name: IDX_product_type_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_product_type_id" ON public.product USING btree (type_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_barcode_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_product_variant_barcode_unique" ON public.product_variant USING btree (barcode) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_product_variant_deleted_at" ON public.product_variant USING btree (deleted_at);


--
-- Name: IDX_product_variant_ean_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_product_variant_ean_unique" ON public.product_variant USING btree (ean) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_id_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_product_variant_id_product_id" ON public.product_variant USING btree (id, product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_product_variant_product_id" ON public.product_variant USING btree (product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_product_image_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_product_variant_product_image_deleted_at" ON public.product_variant_product_image USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_product_image_image_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_product_variant_product_image_image_id" ON public.product_variant_product_image USING btree (image_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_product_image_variant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_product_variant_product_image_variant_id" ON public.product_variant_product_image USING btree (variant_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_sku_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_product_variant_sku_unique" ON public.product_variant USING btree (sku) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_upc_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_product_variant_upc_unique" ON public.product_variant USING btree (upc) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_application_method_currency_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_promotion_application_method_currency_code" ON public.promotion_application_method USING btree (currency_code) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_promotion_application_method_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_promotion_application_method_deleted_at" ON public.promotion_application_method USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_application_method_promotion_id_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_promotion_application_method_promotion_id_unique" ON public.promotion_application_method USING btree (promotion_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_budget_campaign_id_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_promotion_campaign_budget_campaign_id_unique" ON public.promotion_campaign_budget USING btree (campaign_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_budget_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_promotion_campaign_budget_deleted_at" ON public.promotion_campaign_budget USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_budget_usage_attribute_value_budget_id_u; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_promotion_campaign_budget_usage_attribute_value_budget_id_u" ON public.promotion_campaign_budget_usage USING btree (attribute_value, budget_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_budget_usage_budget_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_promotion_campaign_budget_usage_budget_id" ON public.promotion_campaign_budget_usage USING btree (budget_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_budget_usage_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_promotion_campaign_budget_usage_deleted_at" ON public.promotion_campaign_budget_usage USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_campaign_identifier_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_promotion_campaign_campaign_identifier_unique" ON public.promotion_campaign USING btree (campaign_identifier) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_promotion_campaign_deleted_at" ON public.promotion_campaign USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_promotion_campaign_id" ON public.promotion USING btree (campaign_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_promotion_deleted_at" ON public.promotion USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_id_-71518339; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_promotion_id_-71518339" ON public.order_promotion USING btree (promotion_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_id_-a9d4a70b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_promotion_id_-a9d4a70b" ON public.cart_promotion USING btree (promotion_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_is_automatic; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_promotion_is_automatic" ON public.promotion USING btree (is_automatic) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_rule_attribute; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_promotion_rule_attribute" ON public.promotion_rule USING btree (attribute);


--
-- Name: IDX_promotion_rule_attribute_operator; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_promotion_rule_attribute_operator" ON public.promotion_rule USING btree (attribute, operator) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_rule_attribute_operator_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_promotion_rule_attribute_operator_id" ON public.promotion_rule USING btree (operator, attribute, id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_rule_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_promotion_rule_deleted_at" ON public.promotion_rule USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_rule_operator; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_promotion_rule_operator" ON public.promotion_rule USING btree (operator);


--
-- Name: IDX_promotion_rule_value_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_promotion_rule_value_deleted_at" ON public.promotion_rule_value USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_rule_value_promotion_rule_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_promotion_rule_value_promotion_rule_id" ON public.promotion_rule_value USING btree (promotion_rule_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_rule_value_rule_id_value; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_promotion_rule_value_rule_id_value" ON public.promotion_rule_value USING btree (promotion_rule_id, value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_rule_value_value; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_promotion_rule_value_value" ON public.promotion_rule_value USING btree (value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_promotion_status" ON public.promotion USING btree (status) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_promotion_type" ON public.promotion USING btree (type);


--
-- Name: IDX_property_label_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_property_label_deleted_at" ON public.property_label USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_property_label_entity; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_property_label_entity" ON public.property_label USING btree (entity) WHERE (deleted_at IS NULL);


--
-- Name: IDX_property_label_entity_property_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_property_label_entity_property_unique" ON public.property_label USING btree (entity, property) WHERE (deleted_at IS NULL);


--
-- Name: IDX_provider_identity_auth_identity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_provider_identity_auth_identity_id" ON public.provider_identity USING btree (auth_identity_id);


--
-- Name: IDX_provider_identity_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_provider_identity_deleted_at" ON public.provider_identity USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_provider_identity_provider_entity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_provider_identity_provider_entity_id" ON public.provider_identity USING btree (entity_id, provider);


--
-- Name: IDX_publishable_key_id_-1d67bae40; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_publishable_key_id_-1d67bae40" ON public.publishable_api_key_sales_channel USING btree (publishable_key_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_rbac_role_id_-85069d44; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_rbac_role_id_-85069d44" ON public.invite_rbac_role USING btree (rbac_role_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_rbac_role_id_64ff0c4c; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_rbac_role_id_64ff0c4c" ON public.user_rbac_role USING btree (rbac_role_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_refund_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_refund_deleted_at" ON public.refund USING btree (deleted_at);


--
-- Name: IDX_refund_payment_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_refund_payment_id" ON public.refund USING btree (payment_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_refund_reason_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_refund_reason_deleted_at" ON public.refund_reason USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_refund_refund_reason_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_refund_refund_reason_id" ON public.refund USING btree (refund_reason_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_region_country_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_region_country_deleted_at" ON public.region_country USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_region_country_region_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_region_country_region_id" ON public.region_country USING btree (region_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_region_country_region_id_iso_2_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_region_country_region_id_iso_2_unique" ON public.region_country USING btree (region_id, iso_2);


--
-- Name: IDX_region_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_region_deleted_at" ON public.region USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_region_id_1c934dab0; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_region_id_1c934dab0" ON public.region_payment_provider USING btree (region_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_reservation_item_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_reservation_item_deleted_at" ON public.reservation_item USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_reservation_item_inventory_item_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_reservation_item_inventory_item_id" ON public.reservation_item USING btree (inventory_item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_reservation_item_line_item_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_reservation_item_line_item_id" ON public.reservation_item USING btree (line_item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_reservation_item_location_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_reservation_item_location_id" ON public.reservation_item USING btree (location_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_claim_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_return_claim_id" ON public.return USING btree (claim_id) WHERE ((claim_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_return_display_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_return_display_id" ON public.return USING btree (display_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_exchange_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_return_exchange_id" ON public.return USING btree (exchange_id) WHERE ((exchange_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_return_id_-31ea43a; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_return_id_-31ea43a" ON public.return_fulfillment USING btree (return_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_item_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_return_item_deleted_at" ON public.return_item USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_item_item_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_return_item_item_id" ON public.return_item USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_item_reason_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_return_item_reason_id" ON public.return_item USING btree (reason_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_item_return_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_return_item_return_id" ON public.return_item USING btree (return_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_return_order_id" ON public.return USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_reason_parent_return_reason_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_return_reason_parent_return_reason_id" ON public.return_reason USING btree (parent_return_reason_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_reason_value; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_return_reason_value" ON public.return_reason USING btree (value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_sales_channel_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_sales_channel_deleted_at" ON public.sales_channel USING btree (deleted_at);


--
-- Name: IDX_sales_channel_id_-1d67bae40; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_sales_channel_id_-1d67bae40" ON public.publishable_api_key_sales_channel USING btree (sales_channel_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_sales_channel_id_20b454295; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_sales_channel_id_20b454295" ON public.product_sales_channel USING btree (sales_channel_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_sales_channel_id_26d06f470; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_sales_channel_id_26d06f470" ON public.sales_channel_stock_location USING btree (sales_channel_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_search_index_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_search_index_deleted_at" ON public.search_index USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_search_index_name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_search_index_name" ON public.search_index USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: IDX_search_index_sync_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_search_index_sync_deleted_at" ON public.search_index_sync USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_search_index_sync_job_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_search_index_sync_job_id" ON public.search_index_sync USING btree (job_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_search_index_sync_search_index_version_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_search_index_sync_search_index_version_id" ON public.search_index_sync USING btree (search_index_version_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_search_index_version_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_search_index_version_deleted_at" ON public.search_index_version USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_search_index_version_search_index_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_search_index_version_search_index_id" ON public.search_index_version USING btree (search_index_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_search_index_version_search_index_id_version; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_search_index_version_search_index_id_version" ON public.search_index_version USING btree (search_index_id, version) WHERE (deleted_at IS NULL);


--
-- Name: IDX_service_zone_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_service_zone_deleted_at" ON public.service_zone USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_service_zone_fulfillment_set_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_service_zone_fulfillment_set_id" ON public.service_zone USING btree (fulfillment_set_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_service_zone_name_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_service_zone_name_unique" ON public.service_zone USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_method_adjustment_promotion_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_shipping_method_adjustment_promotion_id" ON public.cart_shipping_method_adjustment USING btree (promotion_id) WHERE ((deleted_at IS NULL) AND (promotion_id IS NOT NULL));


--
-- Name: IDX_shipping_method_option_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_shipping_method_option_id" ON public.cart_shipping_method USING btree (shipping_option_id) WHERE ((deleted_at IS NULL) AND (shipping_option_id IS NOT NULL));


--
-- Name: IDX_shipping_method_tax_line_tax_rate_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_shipping_method_tax_line_tax_rate_id" ON public.cart_shipping_method_tax_line USING btree (tax_rate_id) WHERE ((deleted_at IS NULL) AND (tax_rate_id IS NOT NULL));


--
-- Name: IDX_shipping_option_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_shipping_option_deleted_at" ON public.shipping_option USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_shipping_option_id_ba32fa9c; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_shipping_option_id_ba32fa9c" ON public.shipping_option_price_set USING btree (shipping_option_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_option_provider_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_shipping_option_provider_id" ON public.shipping_option USING btree (provider_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_option_rule_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_shipping_option_rule_deleted_at" ON public.shipping_option_rule USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_shipping_option_rule_shipping_option_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_shipping_option_rule_shipping_option_id" ON public.shipping_option_rule USING btree (shipping_option_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_option_service_zone_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_shipping_option_service_zone_id" ON public.shipping_option USING btree (service_zone_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_option_shipping_option_type_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_shipping_option_shipping_option_type_id" ON public.shipping_option USING btree (shipping_option_type_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_option_shipping_profile_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_shipping_option_shipping_profile_id" ON public.shipping_option USING btree (shipping_profile_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_option_type_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_shipping_option_type_deleted_at" ON public.shipping_option_type USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_shipping_profile_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_shipping_profile_deleted_at" ON public.shipping_profile USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_shipping_profile_id_17a262437; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_shipping_profile_id_17a262437" ON public.product_shipping_profile USING btree (shipping_profile_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_profile_name_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_shipping_profile_name_unique" ON public.shipping_profile USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: IDX_single_default_region; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_single_default_region" ON public.tax_rate USING btree (tax_region_id) WHERE ((is_default = true) AND (deleted_at IS NULL));


--
-- Name: IDX_stock_location_address_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_stock_location_address_deleted_at" ON public.stock_location_address USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_stock_location_address_id_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_stock_location_address_id_unique" ON public.stock_location USING btree (address_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_stock_location_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_stock_location_deleted_at" ON public.stock_location USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_stock_location_id_-1e5992737; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_stock_location_id_-1e5992737" ON public.location_fulfillment_provider USING btree (stock_location_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_stock_location_id_-e88adb96; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_stock_location_id_-e88adb96" ON public.location_fulfillment_set USING btree (stock_location_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_stock_location_id_26d06f470; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_stock_location_id_26d06f470" ON public.sales_channel_stock_location USING btree (stock_location_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_store_currency_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_store_currency_deleted_at" ON public.store_currency USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_store_currency_store_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_store_currency_store_id" ON public.store_currency USING btree (store_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_store_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_store_deleted_at" ON public.store USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_store_locale_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_store_locale_deleted_at" ON public.store_locale USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_store_locale_store_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_store_locale_store_id" ON public.store_locale USING btree (store_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tag_value_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_tag_value_unique" ON public.product_tag USING btree (value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tax_provider_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_tax_provider_deleted_at" ON public.tax_provider USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tax_rate_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_tax_rate_deleted_at" ON public.tax_rate USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_tax_rate_rule_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_tax_rate_rule_deleted_at" ON public.tax_rate_rule USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_tax_rate_rule_reference_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_tax_rate_rule_reference_id" ON public.tax_rate_rule USING btree (reference_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tax_rate_rule_tax_rate_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_tax_rate_rule_tax_rate_id" ON public.tax_rate_rule USING btree (tax_rate_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tax_rate_rule_unique_rate_reference; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_tax_rate_rule_unique_rate_reference" ON public.tax_rate_rule USING btree (tax_rate_id, reference_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tax_rate_tax_region_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_tax_rate_tax_region_id" ON public.tax_rate USING btree (tax_region_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tax_region_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_tax_region_deleted_at" ON public.tax_region USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_tax_region_parent_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_tax_region_parent_id" ON public.tax_region USING btree (parent_id);


--
-- Name: IDX_tax_region_provider_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_tax_region_provider_id" ON public.tax_region USING btree (provider_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tax_region_unique_country_nullable_province; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_tax_region_unique_country_nullable_province" ON public.tax_region USING btree (country_code) WHERE ((province_code IS NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_tax_region_unique_country_province; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_tax_region_unique_country_province" ON public.tax_region USING btree (country_code, province_code) WHERE (deleted_at IS NULL);


--
-- Name: IDX_type_value_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_type_value_unique" ON public.product_type USING btree (value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_unique_promotion_code; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_unique_promotion_code" ON public.promotion USING btree (code) WHERE (deleted_at IS NULL);


--
-- Name: IDX_user_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_user_deleted_at" ON public."user" USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_user_email_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_user_email_unique" ON public."user" USING btree (email) WHERE (deleted_at IS NULL);


--
-- Name: IDX_user_id_64ff0c4c; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_user_id_64ff0c4c" ON public.user_rbac_role USING btree (user_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_user_preference_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_user_preference_deleted_at" ON public.user_preference USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_user_preference_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_user_preference_user_id" ON public.user_preference USING btree (user_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_user_preference_user_id_key_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_user_preference_user_id_key_unique" ON public.user_preference USING btree (user_id, key) WHERE (deleted_at IS NULL);


--
-- Name: IDX_variant_id_17b4c4e35; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_variant_id_17b4c4e35" ON public.product_variant_inventory_item USING btree (variant_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_variant_id_52b23597; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_variant_id_52b23597" ON public.product_variant_price_set USING btree (variant_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_view_configuration_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_view_configuration_deleted_at" ON public.view_configuration USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_view_configuration_entity_is_system_default; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_view_configuration_entity_is_system_default" ON public.view_configuration USING btree (entity, is_system_default) WHERE (deleted_at IS NULL);


--
-- Name: IDX_view_configuration_entity_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_view_configuration_entity_user_id" ON public.view_configuration USING btree (entity, user_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_view_configuration_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_view_configuration_user_id" ON public.view_configuration USING btree (user_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_vitrin_block_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_vitrin_block_deleted_at" ON public.vitrin_block USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_vitrin_block_group; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_vitrin_block_group" ON public.vitrin_block USING btree ("group") WHERE (deleted_at IS NULL);


--
-- Name: IDX_vitrin_list_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_vitrin_list_deleted_at" ON public.vitrin_list USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_vitrin_list_key_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_vitrin_list_key_unique" ON public.vitrin_list USING btree (key) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_workflow_execution_deleted_at" ON public.workflow_execution USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_workflow_execution_id" ON public.workflow_execution USING btree (id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_retention_time_updated_at_state; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_workflow_execution_retention_time_updated_at_state" ON public.workflow_execution USING btree (retention_time, updated_at, state) WHERE ((deleted_at IS NULL) AND (retention_time IS NOT NULL));


--
-- Name: IDX_workflow_execution_run_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_workflow_execution_run_id" ON public.workflow_execution USING btree (run_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_state; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_workflow_execution_state" ON public.workflow_execution USING btree (state) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_state_updated_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_workflow_execution_state_updated_at" ON public.workflow_execution USING btree (state, updated_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_transaction_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_workflow_execution_transaction_id" ON public.workflow_execution USING btree (transaction_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_updated_at_retention_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_workflow_execution_updated_at_retention_time" ON public.workflow_execution USING btree (updated_at, retention_time) WHERE ((deleted_at IS NULL) AND (retention_time IS NOT NULL) AND ((state)::text = ANY (ARRAY[('done'::character varying)::text, ('failed'::character varying)::text, ('reverted'::character varying)::text])));


--
-- Name: IDX_workflow_execution_workflow_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_workflow_execution_workflow_id" ON public.workflow_execution USING btree (workflow_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_workflow_id_transaction_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_workflow_execution_workflow_id_transaction_id" ON public.workflow_execution USING btree (workflow_id, transaction_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_workflow_id_transaction_id_run_id_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_workflow_execution_workflow_id_transaction_id_run_id_unique" ON public.workflow_execution USING btree (workflow_id, transaction_id, run_id) WHERE (deleted_at IS NULL);


--
-- Name: idx_script_name_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_script_name_unique ON public.script_migrations USING btree (script_name);


--
-- Name: search_pg_product_v1_fts_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX search_pg_product_v1_fts_idx ON public.search_pg_product_v1 USING gin (search_vector);


--
-- Name: search_pg_product_v1_indexed_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX search_pg_product_v1_indexed_idx ON public.search_pg_product_v1 USING gin (indexed jsonb_path_ops);


--
-- Name: search_pg_product_v1_trgm_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX search_pg_product_v1_trgm_idx ON public.search_pg_product_v1 USING gin (search_text public.gin_trgm_ops);


--
-- Name: tax_rate_rule FK_tax_rate_rule_tax_rate_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tax_rate_rule
    ADD CONSTRAINT "FK_tax_rate_rule_tax_rate_id" FOREIGN KEY (tax_rate_id) REFERENCES public.tax_rate(id) ON DELETE CASCADE;


--
-- Name: tax_rate FK_tax_rate_tax_region_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tax_rate
    ADD CONSTRAINT "FK_tax_rate_tax_region_id" FOREIGN KEY (tax_region_id) REFERENCES public.tax_region(id) ON DELETE CASCADE;


--
-- Name: tax_region FK_tax_region_parent_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tax_region
    ADD CONSTRAINT "FK_tax_region_parent_id" FOREIGN KEY (parent_id) REFERENCES public.tax_region(id) ON DELETE CASCADE;


--
-- Name: tax_region FK_tax_region_provider_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tax_region
    ADD CONSTRAINT "FK_tax_region_provider_id" FOREIGN KEY (provider_id) REFERENCES public.tax_provider(id) ON DELETE SET NULL;


--
-- Name: application_method_buy_rules application_method_buy_rules_application_method_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.application_method_buy_rules
    ADD CONSTRAINT application_method_buy_rules_application_method_id_foreign FOREIGN KEY (application_method_id) REFERENCES public.promotion_application_method(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: application_method_buy_rules application_method_buy_rules_promotion_rule_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.application_method_buy_rules
    ADD CONSTRAINT application_method_buy_rules_promotion_rule_id_foreign FOREIGN KEY (promotion_rule_id) REFERENCES public.promotion_rule(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: application_method_target_rules application_method_target_rules_application_method_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.application_method_target_rules
    ADD CONSTRAINT application_method_target_rules_application_method_id_foreign FOREIGN KEY (application_method_id) REFERENCES public.promotion_application_method(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: application_method_target_rules application_method_target_rules_promotion_rule_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.application_method_target_rules
    ADD CONSTRAINT application_method_target_rules_promotion_rule_id_foreign FOREIGN KEY (promotion_rule_id) REFERENCES public.promotion_rule(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: auth_mfa_factor auth_mfa_factor_auth_identity_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_mfa_factor
    ADD CONSTRAINT auth_mfa_factor_auth_identity_id_foreign FOREIGN KEY (auth_identity_id) REFERENCES public.auth_identity(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: auth_mfa_recovery_code auth_mfa_recovery_code_auth_identity_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_mfa_recovery_code
    ADD CONSTRAINT auth_mfa_recovery_code_auth_identity_id_foreign FOREIGN KEY (auth_identity_id) REFERENCES public.auth_identity(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: auth_password_reset_token auth_password_reset_token_auth_identity_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_password_reset_token
    ADD CONSTRAINT auth_password_reset_token_auth_identity_id_foreign FOREIGN KEY (auth_identity_id) REFERENCES public.auth_identity(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: auth_password_reset_token auth_password_reset_token_provider_identity_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_password_reset_token
    ADD CONSTRAINT auth_password_reset_token_provider_identity_id_foreign FOREIGN KEY (provider_identity_id) REFERENCES public.provider_identity(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: auth_verification auth_verification_auth_identity_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_verification
    ADD CONSTRAINT auth_verification_auth_identity_id_foreign FOREIGN KEY (auth_identity_id) REFERENCES public.auth_identity(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: capture capture_payment_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.capture
    ADD CONSTRAINT capture_payment_id_foreign FOREIGN KEY (payment_id) REFERENCES public.payment(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart cart_billing_address_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_billing_address_id_foreign FOREIGN KEY (billing_address_id) REFERENCES public.cart_address(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: cart_line_item_adjustment cart_line_item_adjustment_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_line_item_adjustment
    ADD CONSTRAINT cart_line_item_adjustment_item_id_foreign FOREIGN KEY (item_id) REFERENCES public.cart_line_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart_line_item cart_line_item_cart_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_line_item
    ADD CONSTRAINT cart_line_item_cart_id_foreign FOREIGN KEY (cart_id) REFERENCES public.cart(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart_line_item_tax_line cart_line_item_tax_line_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_line_item_tax_line
    ADD CONSTRAINT cart_line_item_tax_line_item_id_foreign FOREIGN KEY (item_id) REFERENCES public.cart_line_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart cart_shipping_address_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_shipping_address_id_foreign FOREIGN KEY (shipping_address_id) REFERENCES public.cart_address(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: cart_shipping_method_adjustment cart_shipping_method_adjustment_shipping_method_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_shipping_method_adjustment
    ADD CONSTRAINT cart_shipping_method_adjustment_shipping_method_id_foreign FOREIGN KEY (shipping_method_id) REFERENCES public.cart_shipping_method(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart_shipping_method cart_shipping_method_cart_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_shipping_method
    ADD CONSTRAINT cart_shipping_method_cart_id_foreign FOREIGN KEY (cart_id) REFERENCES public.cart(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart_shipping_method_tax_line cart_shipping_method_tax_line_shipping_method_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_shipping_method_tax_line
    ADD CONSTRAINT cart_shipping_method_tax_line_shipping_method_id_foreign FOREIGN KEY (shipping_method_id) REFERENCES public.cart_shipping_method(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: credit_line credit_line_cart_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credit_line
    ADD CONSTRAINT credit_line_cart_id_foreign FOREIGN KEY (cart_id) REFERENCES public.cart(id) ON UPDATE CASCADE;


--
-- Name: customer_address customer_address_customer_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_address
    ADD CONSTRAINT customer_address_customer_id_foreign FOREIGN KEY (customer_id) REFERENCES public.customer(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: customer_group_customer customer_group_customer_customer_group_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_group_customer
    ADD CONSTRAINT customer_group_customer_customer_group_id_foreign FOREIGN KEY (customer_group_id) REFERENCES public.customer_group(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: customer_group_customer customer_group_customer_customer_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_group_customer
    ADD CONSTRAINT customer_group_customer_customer_id_foreign FOREIGN KEY (customer_id) REFERENCES public.customer(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fulfillment fulfillment_delivery_address_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fulfillment
    ADD CONSTRAINT fulfillment_delivery_address_id_foreign FOREIGN KEY (delivery_address_id) REFERENCES public.fulfillment_address(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: fulfillment_item fulfillment_item_fulfillment_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fulfillment_item
    ADD CONSTRAINT fulfillment_item_fulfillment_id_foreign FOREIGN KEY (fulfillment_id) REFERENCES public.fulfillment(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fulfillment_label fulfillment_label_fulfillment_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fulfillment_label
    ADD CONSTRAINT fulfillment_label_fulfillment_id_foreign FOREIGN KEY (fulfillment_id) REFERENCES public.fulfillment(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fulfillment fulfillment_provider_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fulfillment
    ADD CONSTRAINT fulfillment_provider_id_foreign FOREIGN KEY (provider_id) REFERENCES public.fulfillment_provider(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: fulfillment fulfillment_shipping_option_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fulfillment
    ADD CONSTRAINT fulfillment_shipping_option_id_foreign FOREIGN KEY (shipping_option_id) REFERENCES public.shipping_option(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: geo_zone geo_zone_service_zone_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.geo_zone
    ADD CONSTRAINT geo_zone_service_zone_id_foreign FOREIGN KEY (service_zone_id) REFERENCES public.service_zone(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: image image_product_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.image
    ADD CONSTRAINT image_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.product(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: inventory_level inventory_level_inventory_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory_level
    ADD CONSTRAINT inventory_level_inventory_item_id_foreign FOREIGN KEY (inventory_item_id) REFERENCES public.inventory_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notification notification_provider_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_provider_id_foreign FOREIGN KEY (provider_id) REFERENCES public.notification_provider(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: order order_billing_address_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_billing_address_id_foreign FOREIGN KEY (billing_address_id) REFERENCES public.order_address(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: order_change_action order_change_action_order_change_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_change_action
    ADD CONSTRAINT order_change_action_order_change_id_foreign FOREIGN KEY (order_change_id) REFERENCES public.order_change(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_change order_change_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_change
    ADD CONSTRAINT order_change_order_id_foreign FOREIGN KEY (order_id) REFERENCES public."order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_credit_line order_credit_line_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_credit_line
    ADD CONSTRAINT order_credit_line_order_id_foreign FOREIGN KEY (order_id) REFERENCES public."order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_item order_item_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT order_item_item_id_foreign FOREIGN KEY (item_id) REFERENCES public.order_line_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_item order_item_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT order_item_order_id_foreign FOREIGN KEY (order_id) REFERENCES public."order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_line_item_adjustment order_line_item_adjustment_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_line_item_adjustment
    ADD CONSTRAINT order_line_item_adjustment_item_id_foreign FOREIGN KEY (item_id) REFERENCES public.order_line_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_line_item_tax_line order_line_item_tax_line_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_line_item_tax_line
    ADD CONSTRAINT order_line_item_tax_line_item_id_foreign FOREIGN KEY (item_id) REFERENCES public.order_line_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_line_item order_line_item_totals_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_line_item
    ADD CONSTRAINT order_line_item_totals_id_foreign FOREIGN KEY (totals_id) REFERENCES public.order_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order order_shipping_address_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_shipping_address_id_foreign FOREIGN KEY (shipping_address_id) REFERENCES public.order_address(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: order_shipping_method_adjustment order_shipping_method_adjustment_shipping_method_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_shipping_method_adjustment
    ADD CONSTRAINT order_shipping_method_adjustment_shipping_method_id_foreign FOREIGN KEY (shipping_method_id) REFERENCES public.order_shipping_method(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_shipping_method_tax_line order_shipping_method_tax_line_shipping_method_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_shipping_method_tax_line
    ADD CONSTRAINT order_shipping_method_tax_line_shipping_method_id_foreign FOREIGN KEY (shipping_method_id) REFERENCES public.order_shipping_method(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_shipping order_shipping_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_shipping
    ADD CONSTRAINT order_shipping_order_id_foreign FOREIGN KEY (order_id) REFERENCES public."order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_summary order_summary_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_summary
    ADD CONSTRAINT order_summary_order_id_foreign FOREIGN KEY (order_id) REFERENCES public."order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_transaction order_transaction_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_transaction
    ADD CONSTRAINT order_transaction_order_id_foreign FOREIGN KEY (order_id) REFERENCES public."order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payment_collection_payment_providers payment_collection_payment_providers_payment_col_aa276_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_collection_payment_providers
    ADD CONSTRAINT payment_collection_payment_providers_payment_col_aa276_foreign FOREIGN KEY (payment_collection_id) REFERENCES public.payment_collection(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payment_collection_payment_providers payment_collection_payment_providers_payment_pro_2d555_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_collection_payment_providers
    ADD CONSTRAINT payment_collection_payment_providers_payment_pro_2d555_foreign FOREIGN KEY (payment_provider_id) REFERENCES public.payment_provider(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payment payment_payment_collection_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_payment_collection_id_foreign FOREIGN KEY (payment_collection_id) REFERENCES public.payment_collection(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payment_session payment_session_payment_collection_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_session
    ADD CONSTRAINT payment_session_payment_collection_id_foreign FOREIGN KEY (payment_collection_id) REFERENCES public.payment_collection(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: price_list_rule price_list_rule_price_list_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.price_list_rule
    ADD CONSTRAINT price_list_rule_price_list_id_foreign FOREIGN KEY (price_list_id) REFERENCES public.price_list(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: price price_price_list_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.price
    ADD CONSTRAINT price_price_list_id_foreign FOREIGN KEY (price_list_id) REFERENCES public.price_list(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: price price_price_set_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.price
    ADD CONSTRAINT price_price_set_id_foreign FOREIGN KEY (price_set_id) REFERENCES public.price_set(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: price_rule price_rule_price_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.price_rule
    ADD CONSTRAINT price_rule_price_id_foreign FOREIGN KEY (price_id) REFERENCES public.price(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_category product_category_parent_category_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT product_category_parent_category_id_foreign FOREIGN KEY (parent_category_id) REFERENCES public.product_category(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_category_product product_category_product_product_category_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_category_product
    ADD CONSTRAINT product_category_product_product_category_id_foreign FOREIGN KEY (product_category_id) REFERENCES public.product_category(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_category_product product_category_product_product_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_category_product
    ADD CONSTRAINT product_category_product_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.product(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product product_collection_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_collection_id_foreign FOREIGN KEY (collection_id) REFERENCES public.product_collection(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: product_option_value product_option_value_option_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_option_value
    ADD CONSTRAINT product_option_value_option_id_foreign FOREIGN KEY (option_id) REFERENCES public.product_option(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_product_option product_product_option_product_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_product_option
    ADD CONSTRAINT product_product_option_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.product(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_product_option product_product_option_product_option_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_product_option
    ADD CONSTRAINT product_product_option_product_option_id_foreign FOREIGN KEY (product_option_id) REFERENCES public.product_option(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_product_option_value product_product_option_value_product_option_value_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_product_option_value
    ADD CONSTRAINT product_product_option_value_product_option_value_id_foreign FOREIGN KEY (product_option_value_id) REFERENCES public.product_option_value(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_product_option_value product_product_option_value_product_product_option_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_product_option_value
    ADD CONSTRAINT product_product_option_value_product_product_option_id_foreign FOREIGN KEY (product_product_option_id) REFERENCES public.product_product_option(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_tags product_tags_product_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_tags
    ADD CONSTRAINT product_tags_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.product(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_tags product_tags_product_tag_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_tags
    ADD CONSTRAINT product_tags_product_tag_id_foreign FOREIGN KEY (product_tag_id) REFERENCES public.product_tag(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product product_type_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_type_id_foreign FOREIGN KEY (type_id) REFERENCES public.product_type(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: product_variant_option product_variant_option_option_value_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variant_option
    ADD CONSTRAINT product_variant_option_option_value_id_foreign FOREIGN KEY (option_value_id) REFERENCES public.product_option_value(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_variant_option product_variant_option_variant_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variant_option
    ADD CONSTRAINT product_variant_option_variant_id_foreign FOREIGN KEY (variant_id) REFERENCES public.product_variant(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_variant product_variant_product_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variant
    ADD CONSTRAINT product_variant_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.product(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_variant_product_image product_variant_product_image_image_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variant_product_image
    ADD CONSTRAINT product_variant_product_image_image_id_foreign FOREIGN KEY (image_id) REFERENCES public.image(id) ON DELETE CASCADE;


--
-- Name: promotion_application_method promotion_application_method_promotion_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promotion_application_method
    ADD CONSTRAINT promotion_application_method_promotion_id_foreign FOREIGN KEY (promotion_id) REFERENCES public.promotion(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: promotion_campaign_budget promotion_campaign_budget_campaign_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promotion_campaign_budget
    ADD CONSTRAINT promotion_campaign_budget_campaign_id_foreign FOREIGN KEY (campaign_id) REFERENCES public.promotion_campaign(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: promotion_campaign_budget_usage promotion_campaign_budget_usage_budget_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promotion_campaign_budget_usage
    ADD CONSTRAINT promotion_campaign_budget_usage_budget_id_foreign FOREIGN KEY (budget_id) REFERENCES public.promotion_campaign_budget(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: promotion promotion_campaign_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promotion
    ADD CONSTRAINT promotion_campaign_id_foreign FOREIGN KEY (campaign_id) REFERENCES public.promotion_campaign(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: promotion_promotion_rule promotion_promotion_rule_promotion_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promotion_promotion_rule
    ADD CONSTRAINT promotion_promotion_rule_promotion_id_foreign FOREIGN KEY (promotion_id) REFERENCES public.promotion(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: promotion_promotion_rule promotion_promotion_rule_promotion_rule_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promotion_promotion_rule
    ADD CONSTRAINT promotion_promotion_rule_promotion_rule_id_foreign FOREIGN KEY (promotion_rule_id) REFERENCES public.promotion_rule(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: promotion_rule_value promotion_rule_value_promotion_rule_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promotion_rule_value
    ADD CONSTRAINT promotion_rule_value_promotion_rule_id_foreign FOREIGN KEY (promotion_rule_id) REFERENCES public.promotion_rule(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: provider_identity provider_identity_auth_identity_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provider_identity
    ADD CONSTRAINT provider_identity_auth_identity_id_foreign FOREIGN KEY (auth_identity_id) REFERENCES public.auth_identity(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: refund refund_payment_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refund
    ADD CONSTRAINT refund_payment_id_foreign FOREIGN KEY (payment_id) REFERENCES public.payment(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: region_country region_country_region_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.region_country
    ADD CONSTRAINT region_country_region_id_foreign FOREIGN KEY (region_id) REFERENCES public.region(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: reservation_item reservation_item_inventory_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservation_item
    ADD CONSTRAINT reservation_item_inventory_item_id_foreign FOREIGN KEY (inventory_item_id) REFERENCES public.inventory_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: return_reason return_reason_parent_return_reason_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.return_reason
    ADD CONSTRAINT return_reason_parent_return_reason_id_foreign FOREIGN KEY (parent_return_reason_id) REFERENCES public.return_reason(id);


--
-- Name: search_index_sync search_index_sync_search_index_version_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.search_index_sync
    ADD CONSTRAINT search_index_sync_search_index_version_id_foreign FOREIGN KEY (search_index_version_id) REFERENCES public.search_index_version(id) ON UPDATE CASCADE;


--
-- Name: search_index_version search_index_version_search_index_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.search_index_version
    ADD CONSTRAINT search_index_version_search_index_id_foreign FOREIGN KEY (search_index_id) REFERENCES public.search_index(id) ON UPDATE CASCADE;


--
-- Name: service_zone service_zone_fulfillment_set_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_zone
    ADD CONSTRAINT service_zone_fulfillment_set_id_foreign FOREIGN KEY (fulfillment_set_id) REFERENCES public.fulfillment_set(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: shipping_option shipping_option_provider_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_option
    ADD CONSTRAINT shipping_option_provider_id_foreign FOREIGN KEY (provider_id) REFERENCES public.fulfillment_provider(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: shipping_option_rule shipping_option_rule_shipping_option_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_option_rule
    ADD CONSTRAINT shipping_option_rule_shipping_option_id_foreign FOREIGN KEY (shipping_option_id) REFERENCES public.shipping_option(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: shipping_option shipping_option_service_zone_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_option
    ADD CONSTRAINT shipping_option_service_zone_id_foreign FOREIGN KEY (service_zone_id) REFERENCES public.service_zone(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: shipping_option shipping_option_shipping_option_type_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_option
    ADD CONSTRAINT shipping_option_shipping_option_type_id_foreign FOREIGN KEY (shipping_option_type_id) REFERENCES public.shipping_option_type(id) ON UPDATE CASCADE;


--
-- Name: shipping_option shipping_option_shipping_profile_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_option
    ADD CONSTRAINT shipping_option_shipping_profile_id_foreign FOREIGN KEY (shipping_profile_id) REFERENCES public.shipping_profile(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: stock_location stock_location_address_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_location
    ADD CONSTRAINT stock_location_address_id_foreign FOREIGN KEY (address_id) REFERENCES public.stock_location_address(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: store_currency store_currency_store_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_currency
    ADD CONSTRAINT store_currency_store_id_foreign FOREIGN KEY (store_id) REFERENCES public.store(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: store_locale store_locale_store_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_locale
    ADD CONSTRAINT store_locale_store_id_foreign FOREIGN KEY (store_id) REFERENCES public.store(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict m7gIReFQMB1ifjiGOdeZG1pSH0ajfJYSYktejyO5UtzX9TrqGTtZErI2nd3tVWu

