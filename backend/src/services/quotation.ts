import { FlagRouter } from "../utils/flag-router"

import { MedusaError } from "medusa-core-utils"
import {EntityManager} from "typeorm"
import { ProductVariantService, SearchService } from "."
import { TransactionBaseService } from "../interfaces"
import {QuotationLine, Quotation,
} from "../models"
import { ImageRepository } from "../repositories/image"
import {
  ProductRepository,
} from "../repositories/product"
import { ProductOptionRepository } from "../repositories/product-option"
import { ProductTagRepository } from "../repositories/product-tag"
import { ProductTypeRepository } from "../repositories/product-type"
import { ProductVariantRepository } from "../repositories/product-variant"
import { Selector } from "../types/common"
import { buildQuery } from "../utils"
import { formatException } from "../utils/exception-formatter"
import EventBusService from "./event-bus"
import {ProductPriceRepository} from "../repositories/product-price";
import {QoutationRepository, QuotationFindWithoutRelationsOptions} from "../repositories/quotation";
import {CreateQuotationInput, FilterableQuotationProps, FindQuotationConfig} from "../types/quotation";

type InjectedDependencies = {
  manager: EntityManager
  productOptionRepository: typeof ProductOptionRepository
  productRepository: typeof ProductRepository
  productVariantRepository: typeof ProductVariantRepository
  productTypeRepository: typeof ProductTypeRepository
  productTagRepository: typeof ProductTagRepository
  imageRepository: typeof ImageRepository
  productVariantService: ProductVariantService
  searchService: SearchService
  eventBusService: EventBusService
  featureFlagRouter: FlagRouter
  productPriceRepository: typeof ProductPriceRepository
  quotationRepository: typeof QoutationRepository
}

class QuotationService extends TransactionBaseService {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly productOptionRepository_: typeof ProductOptionRepository
  protected readonly productRepository_: typeof ProductRepository
  protected readonly productPriceRepository_: typeof ProductPriceRepository
  protected readonly imageRepository_: typeof ImageRepository
  protected readonly quotationRepository_: typeof QoutationRepository

  constructor({
    manager,
    productOptionRepository,
    productRepository,
    productPriceRepository,
    imageRepository,
    searchService,
    featureFlagRouter,
      quotationRepository,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.manager_ = manager
    this.productOptionRepository_ = productOptionRepository
    this.productRepository_ = productRepository
    this.productPriceRepository_ = ProductPriceRepository
    this.imageRepository_ = imageRepository
    this.quotationRepository_ = quotationRepository
  }

  async list(
    selector: FilterableQuotationProps | Selector<Quotation> = {},
    config: FindQuotationConfig = {
      relations: [],
      skip: 0,
      take: 20,
    }
  ): Promise<Quotation[]> {
    const manager = this.manager_
    const quotationRepo = manager.getCustomRepository(this.quotationRepository_)

    const { q, query, relations } = this.prepareListQuery_(selector, config)
    if (q) {
      const [products] = await quotationRepo.getFreeTextSearchResultsAndCount(
        q,
        query,
        relations
      )
      return products
    }

    return await quotationRepo.findWithRelations(relations, query)
  }

  async listAndCount(
    selector: FilterableQuotationProps | Selector<Quotation>,
    config: FindQuotationConfig = {
      relations: [],
      skip: 0,
      take: 20,
    },
    region_Id = ''
  ): Promise<[Quotation[], number]> {
    const manager = this.manager_
    const quotationRepo = manager.getCustomRepository(this.quotationRepository_)

    const { q, query, relations } = this.prepareListQuery_(selector, config)
    // @ts-ignore
    region_Id && (query.where = {...query.where, region_id: region_Id})

    if (q) {
      return await quotationRepo.getFreeTextSearchResultsAndCount(
        q,
        query,
        relations
      )
    }
    return await quotationRepo.findWithRelationsAndCount(relations, query)
  }

  async count(selector: Selector<Quotation> = {}): Promise<number> {
    const manager = this.manager_
    const productRepo = manager.getCustomRepository(this.productRepository_)
    const query = buildQuery(selector)
    return await productRepo.count(query)
  }


  async retrieve(
      quotationId: string,
    config: FindQuotationConfig
  ): Promise<Quotation> {
    return await this.retrieve_({ id: quotationId }, config)
  }

  // /**
  //  * Gets a product by handle.
  //  * Throws in case of DB Error and if product was not found.
  //  * @param productHandle - handle of the product to get.
  //  * @param config - details about what to get from the product
  //  * @return the result of the find one operation.
  //  */
  // async retrieveByHandle(
  //   productHandle: string,
  //   config: FindQuotationConfig = {}
  // ): Promise<Product> {
  //   return await this.retrieve_({ handle: productHandle }, config)
  // }

  /**
   * Gets a product by external id.
   * Throws in case of DB Error and if product was not found.
   * @param externalId - handle of the product to get.
   * @param config - details about what to get from the product
   * @return the result of the find one operation.
   */
  // async retrieveByExternalId(
  //   externalId: string,
  //   config: FindQuotationConfig = {}
  // ): Promise<Product> {
  //   return await this.retrieve_({ external_id: externalId }, config)
  // }

  /**
   * Gets a product by selector.
   * Throws in case of DB Error and if product was not found.
   * @param selector - selector object
   * @param config - object that defines what should be included in the
   *   query response
   * @return the result of the find one operation.
   */
  async retrieve_(
    selector: Selector<Quotation>,
    config: FindQuotationConfig = {}
  ): Promise<Quotation> {
    const manager = this.manager_
    const quotationRepo = manager.getCustomRepository(this.quotationRepository_)

    const { relations, ...query } = buildQuery(selector, config)

    const quotation = await quotationRepo.findOneWithRelations(
      relations,
      query as QuotationFindWithoutRelationsOptions
    )

    if (!quotation) {
      const selectorConstraints = Object.entries(selector)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ")

      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Quotation with ${selectorConstraints} was not found`
      )
    }

    return quotation
  }

  /**
   * Creates a product.
   * @param createQuotationObject - the product to create
   * @return resolves to the creation result.
   */
  async create(createQuotationObject: CreateQuotationInput): Promise<Quotation> {
    return await this.atomicPhase_(async (manager) => {
      const quotationRepo = manager.getCustomRepository(this.quotationRepository_)
      const productPriceRepo = manager.getCustomRepository(this.productPriceRepository_)

      const {
        quotation_lines,
        ...rest
      } = createQuotationObject
      let quotationLines = []

      try {
        if(quotation_lines?.length) {
          await Promise.all(quotation_lines.map(async (item) => {
            const newLine = new QuotationLine()
            const childLine = []

            const price = await productPriceRepo.findOne({
              where: {
                product_id: item.product_id,
                region_id: createQuotationObject.region_id
              }
            })

            if(price){
              newLine.unit_price = price.price
              newLine.product_id = item.product_id
              newLine.volume = item.volume
              newLine.game = item.game
              if (item.child_product?.length) {
                await Promise.all(item.child_product.map(async (i) => {
                  if (item.product_id !== i.product_id) {
                    const newChildLine = new QuotationLine()
                    const price = await productPriceRepo.findOne({
                      where: {
                        product_id: i.product_id,
                        region_id: createQuotationObject.region_id
                      }
                    })
                    if(price) {
                      newLine.unit_price = price.price
                      newChildLine.volume = i.volume
                      newChildLine.unit_price = price.price
                      newChildLine.product_id = i.product_id
                      childLine.push(newChildLine)
                    }
                  }
                }))
                newLine.child_product = childLine
              }
              quotationLines.push(newLine)
            }
          }))
        }


        let quotation = quotationRepo.create({...rest, quotation_lines: quotationLines})
        quotation = await quotationRepo.save(quotation)


        const result = await this.retrieve(quotation.id, {
          // relations: ["customer", "user", "quotation_line"],
        })
        return result
      } catch (error) {
        throw formatException(error)
      }
    })
  }
  //
  // /**
  //  * Updates a product. Product variant updates should use dedicated methods,
  //  * e.g. `addVariant`, etc. The function will throw errors if metadata or
  //  * product variant updates are attempted.
  //  * @param {string} productId - the id of the product. Must be a string that
  //  *   can be casted to an ObjectId
  //  * @param {object} update - an object with the update values.
  //  * @return {Promise} resolves to the update result.
  //  */
  // async update(
  //   productId: string,
  //   update: UpdateProductInput
  // ): Promise<Product> {
  //   return await this.atomicPhase_(async (manager) => {
  //     const productRepo = manager.getCustomRepository(this.productRepository_)
  //     const productVariantRepo = manager.getCustomRepository(
  //       this.productVariantRepository_
  //     )
  //     const productTagRepo = manager.getCustomRepository(
  //       this.productTagRepository_
  //     )
  //     const productTypeRepo = manager.getCustomRepository(
  //       this.productTypeRepository_
  //     )
  //     const imageRepo = manager.getCustomRepository(this.imageRepository_)
  //
  //     const relations = ["variants", "tags", "images"]
  //
  //     if (
  //       this.featureFlagRouter_.isFeatureEnabled(SalesChannelFeatureFlag.key)
  //     ) {
  //       if (isDefined(update.sales_channels)) {
  //         relations.push("sales_channels")
  //       }
  //     } else {
  //       if (isDefined(update.sales_channels)) {
  //         throw new MedusaError(
  //           MedusaError.Types.INVALID_DATA,
  //           "the property sales_channels should no appears as part of the payload"
  //         )
  //       }
  //     }
  //
  //     const product = await this.retrieve(productId, {
  //       relations,
  //     })
  //
  //     const {
  //       variants,
  //       metadata,
  //       images,
  //       tags,
  //       type,
  //       sales_channels: salesChannels,
  //       ...rest
  //     } = update
  //
  //     if (!product.thumbnail && !update.thumbnail && images?.length) {
  //       product.thumbnail = images[0]
  //     }
  //
  //     if (images) {
  //       product.images = await imageRepo.upsertImages(images)
  //     }
  //
  //     if (metadata) {
  //       product.metadata = setMetadata(product, metadata)
  //     }
  //
  //     if (typeof type !== `undefined`) {
  //       product.type_id = (await productTypeRepo.upsertType(type))?.id || null
  //     }
  //
  //     if (tags) {
  //       product.tags = await productTagRepo.upsertTags(tags)
  //     }
  //
  //     if (
  //       this.featureFlagRouter_.isFeatureEnabled(SalesChannelFeatureFlag.key)
  //     ) {
  //       if (isDefined(salesChannels)) {
  //         product.sales_channels = []
  //         if (salesChannels?.length) {
  //           const salesChannelIds = salesChannels?.map((sc) => sc.id)
  //           product.sales_channels = salesChannelIds?.map(
  //             (id) => ({ id } as SalesChannel)
  //           )
  //         }
  //       }
  //     }
  //
  //     if (variants) {
  //       // Iterate product variants and update their properties accordingly
  //       for (const variant of product.variants) {
  //         const exists = variants.find((v) => v.id && variant.id === v.id)
  //         if (!exists) {
  //           await productVariantRepo.remove(variant)
  //         }
  //       }
  //
  //       const newVariants: ProductVariant[] = []
  //       for (const [i, newVariant] of variants.entries()) {
  //         const variant_rank = i
  //
  //         if (newVariant.id) {
  //           const variant = product.variants.find((v) => v.id === newVariant.id)
  //
  //           if (!variant) {
  //             throw new MedusaError(
  //               MedusaError.Types.NOT_FOUND,
  //               `Variant with id: ${newVariant.id} is not associated with this product`
  //             )
  //           }
  //
  //           const saved = await this.productVariantService_
  //             .withTransaction(manager)
  //             .update(variant, {
  //               ...newVariant,
  //               variant_rank,
  //               product_id: variant.product_id,
  //             })
  //
  //           newVariants.push(saved)
  //         } else {
  //           // If the provided variant does not have an id, we assume that it
  //           // should be created
  //           const created = await this.productVariantService_
  //             .withTransaction(manager)
  //             .create(product.id, {
  //               ...newVariant,
  //               variant_rank,
  //               options: newVariant.options || [],
  //               prices: newVariant.prices || [],
  //             })
  //
  //           newVariants.push(created)
  //         }
  //       }
  //
  //       product.variants = newVariants
  //     }
  //
  //     for (const [key, value] of Object.entries(rest)) {
  //       if (typeof value !== `undefined`) {
  //         product[key] = value
  //       }
  //     }
  //
  //     const result = await productRepo.save(product)
  //
  //     await this.eventBus_
  //       .withTransaction(manager)
  //       .emit(ProductService.Events.UPDATED, {
  //         id: result.id,
  //         fields: Object.keys(update),
  //       })
  //     return result
  //   })
  // }
  //
  /**
   * Deletes a product from a given product id. The product's associated
   * variants will also be deleted.
   * @param productId - the id of the product to delete. Must be
   *   castable as an ObjectId
   * @return empty promise
   */
  async delete(productId: string): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const quotationRepo = manager.getCustomRepository(this.quotationRepository_)

      // Should not fail, if product does not exist, since delete is idempotent
      const quotation = await quotationRepo.findOne(
        { id: productId },
          // @ts-ignore
        { relations: ["quotation_lines"] }
      )

      if (!quotation) {
        return
      }

      await quotationRepo.softRemove(quotation)

      return Promise.resolve()
    })
  }
  //
  // /**
  //  * Adds an option to a product. Options can, for example, be "Size", "Color",
  //  * etc. Will update all the products variants with a dummy value for the newly
  //  * created option. The same option cannot be added more than once.
  //  * @param productId - the product to apply the new option to
  //  * @param optionTitle - the display title of the option, e.g. "Size"
  //  * @return the result of the model update operation
  //  */
  // async addOption(productId: string, optionTitle: string): Promise<Product> {
  //   return await this.atomicPhase_(async (manager) => {
  //     const productOptionRepo = manager.getCustomRepository(
  //       this.productOptionRepository_
  //     )
  //
  //     const product = await this.retrieve(productId, {
  //       relations: ["options", "variants"],
  //     })
  //
  //     if (product.options.find((o) => o.title === optionTitle)) {
  //       throw new MedusaError(
  //         MedusaError.Types.DUPLICATE_ERROR,
  //         `An option with the title: ${optionTitle} already exists`
  //       )
  //     }
  //
  //     const option = await productOptionRepo.create({
  //       title: optionTitle,
  //       product_id: productId,
  //     })
  //
  //     await productOptionRepo.save(option)
  //
  //     const productVariantServiceTx =
  //       this.productVariantService_.withTransaction(manager)
  //     for (const variant of product.variants) {
  //       await productVariantServiceTx.addOptionValue(
  //         variant.id,
  //         option.id,
  //         "Default Value"
  //       )
  //     }
  //
  //     const result = await this.retrieve(productId)
  //
  //     await this.eventBus_
  //       .withTransaction(manager)
  //       .emit(ProductService.Events.UPDATED, result)
  //     return result
  //   })
  // }
  //
  // async reorderVariants(
  //   productId: string,
  //   variantOrder: string[]
  // ): Promise<Product> {
  //   return await this.atomicPhase_(async (manager) => {
  //     const productRepo = manager.getCustomRepository(this.productRepository_)
  //
  //     const product = await this.retrieve(productId, {
  //       relations: ["variants"],
  //     })
  //
  //     if (product.variants.length !== variantOrder.length) {
  //       throw new MedusaError(
  //         MedusaError.Types.INVALID_DATA,
  //         `Product variants and new variant order differ in length.`
  //       )
  //     }
  //
  //     product.variants = variantOrder.map((vId) => {
  //       const variant = product.variants.find((v) => v.id === vId)
  //       if (!variant) {
  //         throw new MedusaError(
  //           MedusaError.Types.INVALID_DATA,
  //           `Product has no variant with id: ${vId}`
  //         )
  //       }
  //
  //       return variant
  //     })
  //
  //     const result = productRepo.save(product)
  //     await this.eventBus_
  //       .withTransaction(manager)
  //       .emit(ProductService.Events.UPDATED, result)
  //     return result
  //   })
  // }
  //
  // /**
  //  * Updates a product's option. Throws if the call tries to update an option
  //  * not associated with the product. Throws if the updated title already exists.
  //  * @param productId - the product whose option we are updating
  //  * @param optionId - the id of the option we are updating
  //  * @param data - the data to update the option with
  //  * @return the updated product
  //  */
  // async updateOption(
  //   productId: string,
  //   optionId: string,
  //   data: ProductOptionInput
  // ): Promise<Product> {
  //   return await this.atomicPhase_(async (manager) => {
  //     const productOptionRepo = manager.getCustomRepository(
  //       this.productOptionRepository_
  //     )
  //
  //     const product = await this.retrieve(productId, { relations: ["options"] })
  //
  //     const { title, values } = data
  //
  //     const optionExists = product.options.some(
  //       (o) =>
  //         o.title.toUpperCase() === title.toUpperCase() && o.id !== optionId
  //     )
  //     if (optionExists) {
  //       throw new MedusaError(
  //         MedusaError.Types.NOT_FOUND,
  //         `An option with title ${title} already exists`
  //       )
  //     }
  //
  //     const productOption = await productOptionRepo.findOne({
  //       where: { id: optionId },
  //     })
  //
  //     if (!productOption) {
  //       throw new MedusaError(
  //         MedusaError.Types.NOT_FOUND,
  //         `Option with id: ${optionId} does not exist`
  //       )
  //     }
  //
  //     productOption.title = title
  //     if (values) {
  //       productOption.values = values
  //     }
  //
  //     await productOptionRepo.save(productOption)
  //
  //     await this.eventBus_
  //       .withTransaction(manager)
  //       .emit(ProductService.Events.UPDATED, product)
  //     return product
  //   })
  // }
  //
  // /**
  //  * Retrieve product's option by title.
  //  *
  //  * @param title - title of the option
  //  * @param productId - id of a product
  //  * @return product option
  //  */
  // async retrieveOptionByTitle(
  //   title: string,
  //   productId: string
  // ): Promise<ProductOption | undefined> {
  //   const productOptionRepo = this.manager_.getCustomRepository(
  //     this.productOptionRepository_
  //   )
  //   // @ts-ignore
  //   return productOptionRepo.findOne({
  //     where: { title, product_id: productId },
  //   })
  // }
  //
  // /**
  //  * Delete an option from a product.
  //  * @param productId - the product to delete an option from
  //  * @param optionId - the option to delete
  //  * @return the updated product
  //  */
  // async deleteOption(
  //   productId: string,
  //   optionId: string
  // ): Promise<Product | void> {
  //   return await this.atomicPhase_(async (manager) => {
  //     const productOptionRepo = manager.getCustomRepository(
  //       this.productOptionRepository_
  //     )
  //
  //     const product = await this.retrieve(productId, {
  //       relations: ["variants", "variants.options"],
  //     })
  //
  //     const productOption = await productOptionRepo.findOne({
  //       where: { id: optionId, product_id: productId },
  //     })
  //
  //     if (!productOption) {
  //       return Promise.resolve()
  //     }
  //
  //     // In case the product does not contain variants, we can safely delete the option
  //     // If it does contain variants, we need to make sure no variant exist for the
  //     // product option to delete
  //     if (product?.variants?.length) {
  //       // For the option we want to delete, make sure that all variants have the
  //       // same option values. The reason for doing is, that we want to avoid
  //       // duplicate variants. For example, if we have a product with size and
  //       // color options, that has four variants: (black, 1), (black, 2),
  //       // (blue, 1), (blue, 2) and we delete the size option from the product,
  //       // we would end up with four variants: (black), (black), (blue), (blue).
  //       // We now have two duplicate variants. To ensure that this does not
  //       // happen, we will force the user to select which variants to keep.
  //       const firstVariant = product.variants[0]
  //
  //       const valueToMatch = firstVariant.options.find(
  //         (o) => o.option_id === optionId
  //       )?.value
  //
  //       const equalsFirst = await Promise.all(
  //         product.variants.map(async (v) => {
  //           const option = v.options.find((o) => o.option_id === optionId)
  //           return option?.value === valueToMatch
  //         })
  //       )
  //
  //       if (!equalsFirst.every((v) => v)) {
  //         throw new MedusaError(
  //           MedusaError.Types.INVALID_DATA,
  //           `To delete an option, first delete all variants, such that when an option is deleted, no duplicate variants will exist.`
  //         )
  //       }
  //     }
  //
  //     // If we reach this point, we can safely delete the product option
  //     await productOptionRepo.softRemove(productOption)
  //
  //     await this.eventBus_
  //       .withTransaction(manager)
  //       .emit(ProductService.Events.UPDATED, product)
  //     return product
  //   })
  // }

  /**
   * Creates a query object to be used for list queries.
   * @param selector - the selector to create the query from
   * @param config - the config to use for the query
   * @return an object containing the query, relations and free-text
   *   search param.
   */
  protected prepareListQuery_(
    selector: FilterableQuotationProps | Selector<Quotation>,
    config: FindQuotationConfig
  ): {
    q: string
    relations: (keyof Quotation)[]
    query: QuotationFindWithoutRelationsOptions
  } {
    let q
    if ("q" in selector) {
      q = selector.q
      delete selector.q
    }

    const query = buildQuery(selector, config)

    if (config.relations && config.relations.length > 0) {
      query.relations = config.relations
    }

    if (config.select && config.select.length > 0) {
      query.select = config.select
    }

    const rels = query.relations
    delete query.relations

    return {
      query: query as QuotationFindWithoutRelationsOptions,
      relations: rels as (keyof Quotation)[],
      q,
    }
  }
}

export default QuotationService
