import { Router } from "express"
import "reflect-metadata"
import { Product, ProductTag, ProductType } from "../../../.."
import { EmptyQueryParams, PaginatedResponse } from "../../../../types/common"
import { PricedProduct } from "../../../../types/pricing"
import { FlagRouter } from "../../../../utils/flag-router"
import middlewares, { transformQuery } from "../../../middlewares"
import { validateSalesChannelsExist } from "../../../middlewares/validators/sales-channel-existence"
// import { AdminGetProductsParams } from "./list-quotation"
import {Quotation} from "../../../../models";
import {AdminGetQuotationParams} from "./list-quotation";

const route = Router()

export default (app, featureFlagRouter: FlagRouter) => {
  app.use("/quotations", route)

  if (featureFlagRouter.isFeatureEnabled("sales_channels")) {
    defaultAdminQuotationRelations.push("sales_channels")
  }

  route.post(
    "/",
    validateSalesChannelsExist((req) => req.body?.sales_channels),
    middlewares.wrap(require("./create-quotation").default)
  )

  route.delete(
    "/:id",
    validateSalesChannelsExist((req) => req.body?.sales_channels),
    middlewares.wrap(require("./delete-quotation").default)
  )
  //
  // route.post(
  //   "/:id/metadata",
  //   middlewares.wrap(require("./set-metadata").default)
  // )
  //
  route.get(
    "/:id",
    transformQuery(EmptyQueryParams, {
      defaultRelations: defaultAdminQuotationRelations,
      defaultFields: defaultAdminQuotationFields,
      allowedFields: allowedAdminQuotationFields,
      isList: false,
    }),
    middlewares.wrap(require("./get-quotation").default)
  )

  route.get(
    "/",
    transformQuery(AdminGetQuotationParams, {
      defaultRelations: defaultAdminQuotationRelations,
      defaultFields: defaultAdminQuotationFields,
      allowedFields: allowedAdminQuotationFields,
      isList: true,
    }),
    middlewares.wrap(require("./list-quotation").default)
  )

  return app
}

export const defaultAdminQuotationRelations = [
  "customer",
  "sale_persion",
  "region",
  "quotation_lines",
  "quotation_lines.child_product"
]

export const defaultAdminQuotationFields: (keyof Quotation)[] = [
  "id",
  "code",
  "date",
  "heading",
    "header",
  "condition",
  "payment_term",
  "delivery_lead_time",
  "warranty",
  "install_support",
  "appendix_a",
  "appendix_b",
  "created_at",
  "updated_at",
  "deleted_at",
]

export const allowedAdminQuotationFields = [
  "id",
  "sale_persion_id",
  "code",
  "date",
  "customer_id",
  "region_id",
  "heading",
    "header",
  "condition",
  "payment_term",
  "delivery_lead_time",
  "warranty",
  "install_support",
  "appendix_a",
  "appendix_b",
  "created_at",
  "updated_at",
  "deleted_at",
]

export * from "./create-quotation"
// export * from "./delete-quotation"
export * from "./get-quotation"
export * from "./list-quotation"
// export * from "./update-quotation"