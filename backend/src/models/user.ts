import {BeforeInsert, Column, Entity, Index, JoinTable, ManyToMany} from "typeorm"

import { DbAwareColumn } from "../utils/db-aware-column"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { generateEntityId } from "../utils/generate-entity-id"
import {UserRoles} from "../common/configurations";
import {Region} from "./region";
import {Product} from "./product";

@Entity()
export class User extends SoftDeletableEntity {
  @DbAwareColumn({
    type: "enum",
    enum: UserRoles,
    nullable: true,
    default: UserRoles.SALEMAN,
  })
  role: UserRoles

  @Index({ unique: true, where: "deleted_at IS NULL" })
  @Column()
  email: string

  @Column({ nullable: true })
  name: string

  @Column({ nullable: true })
  phone: string

  @Column({ nullable: true, select: false })
  password_hash: string

  @Column({ nullable: true })
  api_token: string

  @ManyToMany(() => Region, {
    eager: true,
    cascade: ["insert", "update"],
  })
  @JoinTable({
    name: "user_region",
    joinColumn: {
      name: "user_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "region_id",
      referencedColumnName: "id",
    },
  })
  regions: Region[]

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "usr")
  }
}

/**
 * @schema user
 * title: "User"
 * description: "Represents a User who can manage store settings."
 * x-resourceId: user
 * required:
 *   - email
 * properties:
 *   id:
 *     type: string
 *     description: The user's ID
 *     example: usr_01G1G5V26F5TB3GPAPNJ8X1S3V
 *   email:
 *     description: "The email of the User"
 *     type: string
 *     format: email
 *   first_name:
 *     description: "The first name of the User"
 *     type: string
 *     example: Levi
 *   last_name:
 *     description: "The last name of the User"
 *     type: string
 *     example: Bogan
 *   api_token:
 *     description: An API token associated with the user.
 *     type: string
 *     example: null
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
