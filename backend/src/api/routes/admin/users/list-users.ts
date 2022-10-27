import UserService from "../../../../services/user"
import {User} from "../../../../models";

/**
 * @oas [get] /users
 * operationId: "GetUsers"
 * summary: "List Users"
 * description: "Retrieves all users."
 * x-authenticated: true
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.users.list()
 *       .then(({ users }) => {
 *         console.log(users.length);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/users' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - User
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             users:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/user"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
export default async (req, res) => {
  const {q} = req.query
  const userService: UserService = req.scope.resolve("userService")

  const limit = +req?.query?.limit || 20
  const offset = +req?.query?.offset || 0

  let users: User[]
  let number: number

  if(q)
    [users, number] = await userService.filter(q, offset, limit)
  else
    [users, number] = await userService.list(offset, limit)

  res.status(200).json({
    users,
    count: number,
    offset: offset,
    limit: limit
  })
}
