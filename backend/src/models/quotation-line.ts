import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm"

import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { generateEntityId } from "../utils/generate-entity-id"
import {Product} from "./product";
import {Quotation} from "./quotation";

@Entity()
export class QuotationLine extends SoftDeletableEntity {
  @Index()
  @Column({nullable: true})
  product_id: string

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id" })
  product: Product

  @Index()
  @Column({nullable: true})
  quotation_id: string

  @ManyToOne(() => Quotation, quotation => quotation.quotation_lines)
  @JoinColumn({ name: "quotation_id" })
  quotation: Quotation

  @Column({ type: "int", nullable: false })
  volume: number

  @Column({ type: "int", nullable: false })
  unit_price: number

  @Column("text", {array: true, nullable: true})
  game: string[]


  @OneToMany(() => QuotationLine, (i) => i.parent_product, { cascade: true, nullable: true})
  child_product: QuotationLine[]

  @Index()
  @Column({nullable: true})
  parent_product_id: string

  @ManyToOne(() => QuotationLine)
  @JoinColumn({ name: "parent_product_id" })
  parent_product: QuotationLine

  @BeforeInsert()
  private beforeInsert(): void {
    if (this.id) return

    this.id = generateEntityId(this.id, "quot_line")
  }
}

/**
 * @schema product
 * title: "Product"
 * description: "Products are a grouping of Product Variants that have common properties such as images and descriptions. Products can have multiple options which define the properties that Product Variants differ by."
 * x-resourceId: product
 * required:
 *   - title
 *   - profile_id
 * properties:
 *   id:
 *     type: string
 *     description: The product's ID
 *     example: prod_01G1G5V2MBA328390B5AXJ610F
 *   title:
 *     description: "A title that can be displayed for easy identification of the Product."
 *     type: string
 *     example: Medusa Coffee Mug
 *   subtitle:
 *     description: "An optional subtitle that can be used to further specify the Product."
 *     type: string
 *   description:
 *     description: "A short description of the Product."
 *     type: string
 *     example: Every programmer's best friend.
 *   handle:
 *     description: "A unique identifier for the Product (e.g. for slug structure)."
 *     type: string
 *     example: coffee-mug
 *   is_giftcard:
 *     description: "Whether the Product represents a Gift Card. Products that represent Gift Cards will automatically generate a redeemable Gift Card code once they are purchased."
 *     type: boolean
 *     default: false
 *   status:
 *     description: The status of the product
 *     type: string
 *     enum:
 *       - draft
 *       - proposed
 *       - published
 *       - rejected
 *     default: draft
 *   images:
 *     description: Images of the Product. Available if the relation `images` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/image"
 *   thumbnail:
 *     description: "A URL to an image file that can be used to identify the Product."
 *     type: string
 *     format: uri
 *   options:
 *     description: The Product Options that are defined for the Product. Product Variants of the Product will have a unique combination of Product Option Values. Available if the relation `options` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/product_option"
 *   variants:
 *     description: The Product Variants that belong to the Product. Each will have a unique combination of Product Option Values. Available if the relation `variants` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/product_variant"
 *   profile_id:
 *     description: "The ID of the Shipping Profile that the Product belongs to. Shipping Profiles have a set of defined Shipping Options that can be used to Fulfill a given set of Products."
 *     type: string
 *     example: sp_01G1G5V239ENSZ5MV4JAR737BM
 *   profile:
 *     description: Available if the relation `profile` is expanded.
 *     $ref: "#/components/schemas/shipping_profile"
 *   weight:
 *     description: "The weight of the Product Variant. May be used in shipping rate calculations."
 *     type: number
 *     example: null
 *   height:
 *     description: "The height of the Product Variant. May be used in shipping rate calculations."
 *     type: number
 *     example: null
 *   width:
 *     description: "The width of the Product Variant. May be used in shipping rate calculations."
 *     type: number
 *     example: null
 *   length:
 *     description: "The length of the Product Variant. May be used in shipping rate calculations."
 *     type: number
 *     example: null
 *   hs_code:
 *     description: "The Harmonized System code of the Product Variant. May be used by Fulfillment Providers to pass customs information to shipping carriers."
 *     type: string
 *     example: null
 *   origin_country:
 *     description: "The country in which the Product Variant was produced. May be used by Fulfillment Providers to pass customs information to shipping carriers."
 *     type: string
 *     example: null
 *   mid_code:
 *     description: "The Manufacturers Identification code that identifies the manufacturer of the Product Variant. May be used by Fulfillment Providers to pass customs information to shipping carriers."
 *     type: string
 *     example: null
 *   material:
 *     description: "The material and composition that the Product Variant is made of, May be used by Fulfillment Providers to pass customs information to shipping carriers."
 *     type: string
 *     example: null
 *   collection_id:
 *     type: string
 *     description: The Product Collection that the Product belongs to
 *     example: pcol_01F0YESBFAZ0DV6V831JXWH0BG
 *   collection:
 *     description: A product collection object. Available if the relation `collection` is expanded.
 *     type: object
 *   type_id:
 *     type: string
 *     description: The Product type that the Product belongs to
 *     example: ptyp_01G8X9A7ESKAJXG2H0E6F1MW7A
 *   type:
 *     description: Available if the relation `type` is expanded.
 *     $ref: "#/components/schemas/product_type"
 *   tags:
 *     description: The Product Tags assigned to the Product. Available if the relation `tags` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/product_tag"
 *   discountable:
 *     description: "Whether the Product can be discounted. Discounts will not apply to Line Items of this Product when this flag is set to `false`."
 *     type: boolean
 *     default: true
 *   external_id:
 *     description: The external ID of the product
 *     type: string
 *     example: null
 *   sales_channels:
 *     description: The sales channels the product is associated with. Available if the relation `sales_channels` is expanded.
 *     type: array
 *     items:
 *       type: object
 *       description: A sales channel object.
 *   created_at:
 *     type: string
 *     description: "The date with timezone at which the resource was created."
 *     format: date-time
 *   updated_at:
 *     type: string
 *     description: "The date with timezone at which the resource was updated."
 *     format: date-time
 *   deleted_at:
 *     type: string
 *     description: "The date with timezone at which the resource was deleted."
 *     format: date-time
 *   metadata:
 *     type: object
 *     description: An optional key-value map with additional details
 *     example: {car: "white"}
 */
