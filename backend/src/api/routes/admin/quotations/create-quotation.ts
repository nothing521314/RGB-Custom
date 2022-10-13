
import {
  ArrayMinSize,
  IsArray,
  IsBoolean, IsDate,
  IsEnum, IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString, Min,
  ValidateNested,
} from "class-validator"
import {
  PricingService, QuotationService,
} from "../../../../services"
import {
  ProductAdditionalHardwareReq, ProductPriceReq,
  ProductSalesChannelReq,
  ProductTagReq,
  ProductTypeReq,
} from "../../../../types/product"
import { defaultAdminQuotationFields, defaultAdminQuotationRelations } from "."

import { EntityManager } from "typeorm"
import { Type } from "class-transformer"
import { validator } from "../../../../utils/validator"
export default async (req, res) => {
  const validated = await validator(AdminPostQuotationReq, req.body)

  const quotationService: QuotationService = req.scope.resolve("quotationService")

  const entityManager: EntityManager = req.scope.resolve("manager")

  const newQuotation = await entityManager.transaction(async (manager) => {
    const quotation = await quotationService
      .withTransaction(manager)
      .create({ ...validated })

    return quotation
  })

  const quotation = await quotationService.retrieve(newQuotation.id, {
    select: defaultAdminQuotationFields,
    relations: defaultAdminQuotationRelations,
  })

  res.json({ quotation })
}

export class AdminPostQuotationReq {
  @IsNotEmpty()
  @IsString()
  sale_persion_id: string

  @IsNotEmpty()
  @IsString()
  customer_id: string

  @IsNotEmpty()
  @IsString()
  region_id: string

  @IsNotEmpty()
  @IsString()
  code: string

  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsString()
  heading: string

  @IsNotEmpty()
  @IsString()
  condition: string

  @IsNotEmpty()
  @IsString()
  payment_term: string

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  delivery_lead_time: Date

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  date: Date

  @IsNotEmpty()
  @IsString()
  warranty: string

  @IsNotEmpty()
  @IsString()
  install_support: string

  @IsNotEmpty()
  @IsString()
  appendix_a: string

  @IsNotEmpty()
  @IsString()
  appendix_b: string

  @IsOptional()
  @Type(() => AdminPostQuotationLineReq)
  @ValidateNested({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  quotation_lines: AdminPostQuotationLineReq[]

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}

export class AdminPostQuotationLineReq {
  @IsNotEmpty()
  @IsString()
  product_id: string

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  volume: number

  @IsOptional()
  @Type(() => AdminPostQuotationLineReq)
  @ValidateNested({ each: true })
  @IsArray()
  child_product?: AdminPostQuotationLineReq[]
}