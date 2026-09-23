import { MedusaService } from "@medusajs/framework/utils"

import VitrinBlock from "./models/vitrin-block"
import VitrinList from "./models/vitrin-list"

/**
 * CRUD for vitrin lists and blocks comes from MedusaService
 * (listVitrinLists, updateVitrinBlocks, …); nothing custom is needed yet.
 */
class VitrinModuleService extends MedusaService({
  VitrinList,
  VitrinBlock,
}) {}

export default VitrinModuleService
