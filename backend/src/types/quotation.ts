import {Type} from "class-transformer"
import {
    IsArray,
    IsOptional,
    IsString,
    ValidateNested,
} from "class-validator"
import {Quotation} from "../models"
import {IsType} from "../utils/validators/is-type"
import {
    DateComparisonOperator,
    FindConfig,
} from "./common"

/**
 * API Level DTOs + Validation rules
 */
export class FilterableQuotationProps {
    @IsOptional()
    @IsType([String, [String]])
    id?: string | string[]

    @IsString()
    @IsOptional()
    q?: string

    @IsArray()
    @IsOptional()
    quotation_line?: string[]

    @IsString()
    @IsOptional()
    sale_persion?: string

    @IsString()
    @IsOptional()
    customer?: string

    @IsString()
    @IsOptional()
    title?: string

    @IsString()
    @IsOptional()
    code?: string

    @IsOptional()
    @ValidateNested()
    @Type(() => DateComparisonOperator)
    created_at?: DateComparisonOperator

    @IsOptional()
    @ValidateNested()
    @Type(() => DateComparisonOperator)
    updated_at?: DateComparisonOperator

    @ValidateNested()
    @IsOptional()
    @Type(() => DateComparisonOperator)
    deleted_at?: DateComparisonOperator
}

export type CreateQuotationInput = {
    sale_persion_id: string
    title: string
    code: string
    date: Date
    quotation_lines: CreateQuotationLineInput[]
    customer_id: string
    region_id: string
    heading: string
    header: string
    condition: string
    payment_term: string
    delivery_lead_time: string
    install_support: string
    appendix_a: string
    appendix_b: string
    warranty: string
    metadata?: Record<string, unknown>
}

export type CreateQuotationLineInput = {
    product_id: string
    volume: number
    child_product?: CreateQuotationLineChildInput[]
}

export type CreateQuotationLineChildInput = {
    product_id: string
    volume: number
    game: string
}

export type FindQuotationConfig = FindConfig<Quotation>