import { Module } from "@medusajs/framework/utils"

import InquiryModuleService from "./service"

/** SEENERGY Talepler — requests left on the storefront's forms. */
export const INQUIRY_MODULE = "inquiry"

export default Module(INQUIRY_MODULE, {
  service: InquiryModuleService,
})
