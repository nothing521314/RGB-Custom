import jwt from "jsonwebtoken"
import {MedusaError} from "medusa-core-utils"
import Scrypt from "scrypt-kdf"
import {DeepPartial, EntityManager, Like} from "typeorm"
import {TransactionBaseService} from "../interfaces"
import {Product, ProductPrice, User} from "../models"
import {UserRepository} from "../repositories/user"
import {FindConfig, Selector} from "../types/common"
import {
    CreateUserInput,
    FilterableUserProps,
    UpdateUserInput,
} from "../types/user"
import {buildQuery, setMetadata} from "../utils"
import {validateEmail} from "../utils/is-email"
import EventBusService from "./event-bus"
import {RegionRepository} from "../repositories/region";
import { createTransport } from "nodemailer"
import configuration from "./../loaders/medusa-config"

type UserServiceProps = {
    userRepository: typeof UserRepository
    regionRepository: typeof RegionRepository
    eventBusService: EventBusService
    manager: EntityManager
}

/**
 * Provides layer to manipulate users.
 * @extends BaseService
 */
class UserService extends TransactionBaseService {
    static Events = {
        PASSWORD_RESET: "user.password_reset",
        CREATED: "user.created",
        UPDATED: "user.updated",
        DELETED: "user.deleted",
    }

    protected manager_: EntityManager
    protected transactionManager_: EntityManager
    protected readonly userRepository_: typeof UserRepository
    protected readonly regionRepository_: typeof RegionRepository
    protected readonly eventBus_: EventBusService

    constructor({userRepository, regionRepository, eventBusService, manager}: UserServiceProps) {
        super({userRepository, regionRepository, eventBusService, manager})

        this.userRepository_ = userRepository
        this.regionRepository_ = regionRepository
        this.eventBus_ = eventBusService
        this.manager_ = manager
    }

    /**
     * @param {FilterableUserProps} selector - the query object for find
     * @param {Object} config - the configuration object for the query
     * @return {Promise} the result of the find operation
     */
    async list(selector: FilterableUserProps, config = {}): Promise<User[]> {
        const manager = this.manager_
        const userRepo = manager.getCustomRepository(this.userRepository_)
        return await userRepo.find(buildQuery(selector, config))
    }

    async filter(query: string): Promise<User[]> {
        const manager = this.manager_
        const userRepo = manager.getCustomRepository(this.userRepository_)
        return await userRepo.find({
            where: [
                {
                    name: Like(`%${query}%`),
                }, {
                    email: Like(`%${query}%`)
                }
            ]
        })
    }

    /**
     * Gets a user by id.
     * Throws in case of DB Error and if user was not found.
     * @param {string} userId - the id of the user to get.
     * @param {FindConfig} config - query configs
     * @return {Promise<User>} the user document.
     */
    async retrieve(userId: string, config: FindConfig<User> = {}): Promise<User> {
        const manager = this.manager_
        const userRepo = manager.getCustomRepository(this.userRepository_)
        const query = buildQuery({id: userId}, config)

        const user = await userRepo.findOne(query)

        if (!user) {
            throw new MedusaError(
                MedusaError.Types.NOT_FOUND,
                `User with id: ${userId} was not found`
            )
        }

        return user
    }

    /**
     * Gets a user by api token.
     * Throws in case of DB Error and if user was not found.
     * @param {string} apiToken - the token of the user to get.
     * @param {string[]} relations - relations to include with the user
     * @return {Promise<User>} the user document.
     */
    async retrieveByApiToken(
        apiToken: string,
        relations: string[] = []
    ): Promise<User> {
        const manager = this.manager_
        const userRepo = manager.getCustomRepository(this.userRepository_)

        const user = await userRepo.findOne({
            where: {api_token: apiToken},
            relations,
        })

        if (!user) {
            throw new MedusaError(
                MedusaError.Types.NOT_FOUND,
                `User with api token: ${apiToken} was not found`
            )
        }

        return user
    }

    /**
     * Gets a user by email.
     * Throws in case of DB Error and if user was not found.
     * @param {string} email - the email of the user to get.
     * @param {FindConfig} config - query config
     * @return {Promise<User>} the user document.
     */
    async retrieveByEmail(
        email: string,
        config: FindConfig<User> = {}
    ): Promise<User> {
        const manager = this.manager_
        const userRepo = manager.getCustomRepository(this.userRepository_)
        const query = buildQuery({email: email.toLowerCase()}, config)
        const user = await userRepo.findOne(query)

        if (!user) {
            throw new MedusaError(
                MedusaError.Types.NOT_FOUND,
                `User with email: ${email} was not found`
            )
        }

        return user
    }

    /**
     * Hashes a password
     * @param {string} password - the value to hash
     * @return {string} hashed password
     */
    async hashPassword_(password: string): Promise<string> {
        const buf = await Scrypt.kdf(password, {logN: 1, r: 1, p: 1})
        return buf.toString("base64")
    }

    /**
     * Creates a user with username being validated.
     * Fails if email is not a valid format.
     * @param {object} user - the user to create
     * @param {string} password - user's password to hash
     * @return {Promise} the result of create
     */
    async create(user: CreateUserInput, password: string): Promise<User> {
        return await this.atomicPhase_(async (manager: EntityManager) => {
            const userRepo = manager.getCustomRepository(this.userRepository_)
            const regionRepo = manager.getCustomRepository(this.regionRepository_)

            const createData = {...user} as CreateUserInput & {
                password_hash: string
            }

            const validatedEmail = validateEmail(user.email)
            if (password) {
                const hashedPassword = await this.hashPassword_(password)
                createData.password_hash = hashedPassword
            }

            const validateRegions = await regionRepo.findByIds(user.regions || [])

            if (validateRegions.length === 0 && user.regions !== undefined) {
                throw new MedusaError(
                    MedusaError.Types.INVALID_DATA,
                    "Regions invalid"
                )
            }

            createData.email = validatedEmail

            try{
                const created = userRepo.create({...createData, regions: validateRegions})
                const newUser = await userRepo.save(created)
                return newUser
            } catch (err) {
                throw new MedusaError(MedusaError.Types.DUPLICATE_ERROR, "Duplicate email and name")
            }
        })
    }

    /**
     * Updates a user.
     * @param {object} userId - id of the user to update
     * @param {object} update - the values to be updated on the user
     * @return {Promise} the result of create
     */
    async update(userId: string, update: UpdateUserInput): Promise<User> {
        return await this.atomicPhase_(async (manager: EntityManager) => {
            const userRepo = manager.getCustomRepository(this.userRepository_)
            const regionRepo = manager.getCustomRepository(this.regionRepository_)

            let user = await this.retrieve(userId)

            const { password, metadata, regions, ...rest} = update

            if(password){
                await this.setPassword_(userId, password)
                user = await this.retrieve(userId)
            }

            const validateRegions = await regionRepo.findByIds(regions)

            // if(validateRegions.length === 0 && user.regions !== undefined){
            //   throw new MedusaError(
            //       MedusaError.Types.INVALID_DATA,
            //       "Regions invalid"
            //   )
            // }

            if (validateRegions.length > 0)
                user.regions = validateRegions

            if (metadata) {
                user.metadata = setMetadata(user, metadata)
            }

            for (const [key, value] of Object.entries(rest)) {
                // @ts-ignore
                user[key as keyof User] = value
            }

            const updatedUser = await userRepo.save(user)

            await this.eventBus_
                .withTransaction(manager)
                .emit(UserService.Events.UPDATED, {id: updatedUser.id})

            return updatedUser
        })
    }

    /**
     * Deletes a user from a given user id.
     * @param {string} userId - the id of the user to delete. Must be
     *   castable as an ObjectId
     * @return {Promise} the result of the delete operation.
     */
    async delete(userId: string): Promise<void> {
        return await this.atomicPhase_(async (manager: EntityManager) => {
            const userRepo = manager.getCustomRepository(this.userRepository_)

            // Should not fail, if user does not exist, since delete is idempotent
            const user = await userRepo.findOne({where: {id: userId}})

            if (!user) {
                return Promise.resolve()
            }

            await userRepo.softRemove(user)

            await this.eventBus_.emit(UserService.Events.DELETED, {id: user.id})

            return Promise.resolve()
        })
    }

    /**
     * Sets a password for a user
     * Fails if no user exists with userId and if the hashing of the new
     * password does not work.
     * @param {string} userId - the userId to set password for
     * @param {string} password - the old password to set
     * @return {Promise} the result of the update operation
     */
    async setPassword_(userId: string, password: string): Promise<User> {
        return await this.atomicPhase_(async (manager: EntityManager) => {
            const userRepo = manager.getCustomRepository(this.userRepository_)

            const user = await this.retrieve(userId)

            const hashedPassword = await this.hashPassword_(password)
            if (!hashedPassword) {
                throw new MedusaError(
                    MedusaError.Types.DB_ERROR,
                    `An error occured while hashing password`
                )
            }

            user.password_hash = hashedPassword

            return await userRepo.save(user)
        })
    }

    /**
     * Generate a JSON Web token, that will be sent to a user, that wishes to
     * reset password.
     * The token will be signed with the users current password hash as a secret
     * a long side a payload with userId and the expiry time for the token, which
     * is always 15 minutes.
     * @param {string} userId - the id of the user to reset password for
     * @return {string} the generated JSON web token
     */
    async generateResetPasswordToken(userId: string): Promise<string> {
        return await this.atomicPhase_(async (transactionManager) => {
            const user = await this.retrieve(userId, {
                select: ["id", "email", "password_hash"],
            })
            const secret = user.password_hash
            const expiry = Math.floor(Date.now() / 1000) + 60 * 15
            const payload = {user_id: user.id, email: user.email, exp: expiry}
            const token = jwt.sign(payload, secret)

            return token
        })
    }

    async sendEmailResetPassword(userId: string): Promise<void>{
        const {reset_password_url, email_admin, password_email_admin} = configuration.projectConfig
        const token = await this.generateResetPasswordToken(userId)

        const user = await this.retrieve(userId, {
            select: ["id", "email", "password_hash"],
        })

        const transporter =  createTransport({
            service: 'Gmail',
            host: 'smtp.gmail.com',
            secure: true,
            auth: {
                user: email_admin,
                pass: password_email_admin
            }
        });

        const mainOptions = {
            from: 'RGB Quotation Admin',
            to: user.email,
            subject: 'Reset Password',
            text: 'You recieved message from ' + user.email,
            html: `<p>We received the request to reset the password for account. To reset your account, please on <a href="${reset_password_url + token}">this link</a> and set up a new one.</p>`
        }

       transporter.sendMail(mainOptions)
    }
}

export default UserService
