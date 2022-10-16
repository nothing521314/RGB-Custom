import { IsNumber, IsOptional, IsString } from "class-validator"
import { PricingService, ProductService } from "../../../../services"

import { FilterableProductProps } from "../../../../types/product"
import { Type } from "class-transformer"

export default async (req, res) => {
  const productService: ProductService = req.scope.resolve("productService")



  const [products, count] = await productService.listBrandAndCount()

  res.json({
    products,
    count,
  })
}

export class AdminGetProductsParams extends FilterableProductProps {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 50

  @IsString()
  @IsOptional()
  expand?: string

  @IsString()
  @IsOptional()
  fields?: string
}
