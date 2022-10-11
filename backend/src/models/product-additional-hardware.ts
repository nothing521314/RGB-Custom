import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany, OneToOne,
} from "typeorm"

import { DbAwareColumn } from "../utils/db-aware-column"
import { FeatureFlagDecorators } from "../utils/feature-flag-decorators"
import { Image } from "./image"
import { ProductCollection } from "./product-collection"
import { ProductOption } from "./product-option"
import { ProductTag } from "./product-tag"
import { ProductType } from "./product-type"
import { ProductVariant } from "./product-variant"
import { SalesChannel } from "./sales-channel"
import { ShippingProfile } from "./shipping-profile"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import _ from "lodash"
import { generateEntityId } from "../utils/generate-entity-id"
import {FulfillmentItem} from "./fulfillment-item";
import {Address} from "./address";
import {Region} from "./region";
import {Product} from "./product";
import {Cart} from "./cart";

@Entity()
export class ProductAdditionalHardware extends SoftDeletableEntity {
  @Column({ nullable: false })
  product_parent_id: string | null

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_parent_id" })
  product_parent: Product

  @Column({ nullable: false })
  product_additions_id: string | null

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_additions_id" })
  product_addition: Product

  @BeforeInsert()
  private beforeInsert(): void {
    if (this.id) return

    this.id = generateEntityId(this.id, "prod_additions")
  }
}
