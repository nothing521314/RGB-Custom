import {
  EntityRepository,
  Repository,
} from "typeorm"
import { ProductPrice,
} from "../models"

@EntityRepository(ProductPrice)
export class ProductPriceRepository extends Repository<ProductPrice> {

}
