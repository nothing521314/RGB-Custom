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
  //
  // route.post(
  //   "/:id",
  //   validateSalesChannelsExist((req) => req.body?.sales_channels),
  //   middlewares.wrap(require("./update-quotation").default)
  // )
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
  "user",
  "region",
  "quotation_lines"
]

export const defaultAdminQuotationFields: (keyof Quotation)[] = [
  "id",
  "sale_persion",
  "code",
  "date",
  "customer",
  "region_id",
  "quotation_lines",
  "heading",
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

export const defaultAdminGetProductsVariantsFields = ["id", "product_id"]

export const allowedAdminQuotationFields = [
  "id",
  "sale_persion_id",
  "code",
  "date",
  "customer_id",
  "region_id",
  "quotation_lines",
  "heading",
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

export const allowedAdminProductRelations = [
  "variants",
  "variants.prices",
  "images",
  "options",
  "tags",
  "type",
  "collection",
  "sales_channels",
]

export type AdminProductsDeleteOptionRes = {
  option_id: string
  object: "option"
  deleted: boolean
  product: Product
}

export type AdminOuotationListRes = PaginatedResponse & {
  products: (PricedProduct | Product)[]
}

export type AdminProductsListTypesRes = {
  types: ProductType[]
}

export type AdminProductsListTagsRes = {
  tags: ProductTag[]
}

export type AdminProductsRes = {
  product: Product
}

export * from "./create-quotation"
// export * from "./delete-quotation"
export * from "./get-quotation"
export * from "./list-quotation"
// export * from "./update-quotation"