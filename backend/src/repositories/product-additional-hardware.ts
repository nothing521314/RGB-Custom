import {
  EntityRepository,
  Repository,
} from "typeorm"
import { ProductPrice,
} from "../models"
import {ProductAdditionalHardware} from "../models/product-additional-hardware";

@EntityRepository(ProductAdditionalHardware)
export class ProductAdditionalRepository extends Repository<ProductAdditionalHardware> {

}
