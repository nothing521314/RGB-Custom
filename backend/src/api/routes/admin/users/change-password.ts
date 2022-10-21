import {IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString} from "class-validator"

import AuthService from "../../../../services/auth"
import { EntityManager } from "typeorm";
import { MedusaError } from "medusa-core-utils"
import _ from "lodash"
import jwt from "jsonwebtoken"
import { validator } from "../../../../utils/validator"
import {AdminCreateUserRequest} from "./create-user";
import {UserRoles} from "../../../../common/configurations";

/**
 * @oas [post] /auth
 * operationId: "PostAuth"
 * summary: "User Login"
 * x-authenticated: false
 * description: "Logs a User in and authorizes them to manage Store settings."
 * parameters:
 *   - (body) email=* {string} The User's email.
 *   - (body) password=* {string} The User's password.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - email
 *           - password
 *         properties:
 *           email:
 *             type: string
 *             description: The User's email.
 *             format: email
 *           password:
 *             type: string
 *             description: The User's password.
 *             format: password
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.admin.auth.createSession({
 *         email: 'user@example.com',
 *         password: 'supersecret'
 *       }).then((({ user }) => {
 *         console.log(user.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/auth' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *         "email": "user@example.com",
 *         "password": "supersecret"
 *       }'
 * tags:
 *   - Auth
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            user:
 *              $ref: "#/components/schemas/user"
 *  "400":
 *    $ref: "#/components/responses/400_error"
 *  "401":
 *    $ref: "#/components/responses/incorrect_credentials"
 *  "404":
 *    $ref: "#/components/responses/not_found_error"
 *  "409":
 *    $ref: "#/components/responses/invalid_state_error"
 *  "422":
 *    $ref: "#/components/responses/invalid_request_error"
 *  "500":
 *    $ref: "#/components/responses/500_error"
 */
export default async (req, res) => {
  const { userId } = req.user

  const validated = await validator(UserChangePasswordRequest, req.body)

  const authService: AuthService = req.scope.resolve("authService")

  const user = await authService.changePassword(userId, validated.oldPassword, validated.newPassword)

  res.status(200).json({ user: _.omit(user, ["password_hash"]) })
}

export class UserChangePasswordRequest {
  @IsString()
  @IsNotEmpty()
  oldPassword: string

  @IsString()
  @IsNotEmpty()
  newPassword: string
}
