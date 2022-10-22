import { User } from "../models/user"
import {UserRoles} from "../common/configurations";
import { PartialPick } from "./common"
import {Region} from "../models";

export interface CreateUserInput {
  id?: string
  email: string
  name?: string
  phone?: string
  api_token?: string
  role?: UserRoles
  regions?: string[]
  password?: string,
  metadata?: Record<string, unknown>
}

export interface UpdateUserInput {
  readonly email?: string
  name?: string
  password?: string
  phone?: string
  readonly password_hash?: string
  api_token?: string
  regions?: string[]
  role?: UserRoles
  metadata?: Record<string, unknown>
}

export enum UserRole {
  ADMIN = "admin",
  SALEMAN = "sale_man",
}

export type FilterableUserProps = PartialPick<
  User,
  | "email"
  | "name"
  | "phone"
  | "regions"
  | "created_at"
  | "updated_at"
  | "deleted_at"
>
