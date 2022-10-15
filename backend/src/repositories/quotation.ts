import {flatten, groupBy, map, merge} from "lodash"
import {
    Brackets,
    EntityRepository,
    FindOperator,
    In,
    Repository,
} from "typeorm"
import {
    Customer,
    QuotationLine, Quotation, User,
} from "../models"
import {
    ExtendedFindConfig,
    Selector,
    WithRequiredProperty,
} from "../types/common"

export type ProductSelector = Omit<Selector<Quotation>, "quotation_lines"> & {
    tags: FindOperator<string[]>
}

export type DefaultWithoutRelations = Omit<ExtendedFindConfig<Quotation, ProductSelector>,
    "relations">

export type QuotationFindWithoutRelationsOptions = DefaultWithoutRelations & {
    where: DefaultWithoutRelations["where"] & {
        quotation_lines?: FindOperator<QuotationLine>
        customer_id?: FindOperator<Customer>
        sale_persion_id?: FindOperator<User>
    }
}

@EntityRepository(Quotation)
export class QoutationRepository extends Repository<Quotation> {
    private mergeEntitiesWithRelations(
        entitiesAndRelations: Array<Partial<Quotation>>
    ): Quotation[] {
        const entitiesAndRelationsById = groupBy(entitiesAndRelations, "id")
        return map(entitiesAndRelationsById, (entityAndRelations) =>
            merge({}, ...entityAndRelations)
        )
    }

    private async queryQoutation(
        optionsWithoutRelations: QuotationFindWithoutRelationsOptions,
        shouldCount = false
    ): Promise<[Quotation[], number]> {
        const qb = this.createQueryBuilder("quotation")
            .select(["quotation.id"])
            .skip(optionsWithoutRelations.skip)
            .take(optionsWithoutRelations.take)

        if (optionsWithoutRelations.where) {
            qb.where(optionsWithoutRelations.where)
        }

        if (optionsWithoutRelations.order) {
            const toSelect: string[] = []
            const parsed = Object.entries(optionsWithoutRelations.order).reduce(
                (acc, [k, v]) => {
                    const key = `quotation.${k}`
                    toSelect.push(key)
                    acc[key] = v
                    return acc
                },
                {}
            )
            qb.addSelect(toSelect)
            qb.orderBy(parsed)
        }

        if (optionsWithoutRelations.withDeleted) {
            qb.withDeleted()
        }

        let entities: Quotation[]
        let count = 0
        if (shouldCount) {
            const result = await qb.getManyAndCount()
            entities = result[0]
            count = result[1]
        } else {
            entities = await qb.getMany()
        }

        return [entities, count]
    }

    private getGroupedRelations(relations: string[]): {
        [toplevel: string]: string[]
    } {
        const groupedRelations: { [toplevel: string]: string[] } = {}
        for (const rel of relations) {
            const [topLevel] = rel.split(".")
            if (groupedRelations[topLevel]) {
                groupedRelations[topLevel].push(rel)
            } else {
                groupedRelations[topLevel] = [rel]
            }
        }

        return groupedRelations
    }

    private async queryQuotationWithIds(
        entityIds: string[],
        groupedRelations: { [toplevel: string]: string[] },
        withDeleted = false,
        select: (keyof Quotation)[] = []
    ): Promise<Quotation[]> {
        const entitiesIdsWithRelations = await Promise.all(
            Object.entries(groupedRelations).map(([toplevel, rels]) => {
                let querybuilder = this.createQueryBuilder("quotations")

                if (select && select.length) {
                    querybuilder.select(select.map((f) => `quotations.${f}`))
                }

                querybuilder = querybuilder.leftJoinAndSelect(
                    `quotations.${toplevel}`,
                    toplevel
                )

                for (const rel of rels) {
                    const [_, rest] = rel.split(".")
                    if (!rest) {
                        continue
                    }
                    // Regex matches all '.' except the rightmost
                    querybuilder = querybuilder.leftJoinAndSelect(
                        rel.replace(/\.(?=[^.]*\.)/g, "__"),
                        rel.replace(".", "__")
                    )
                }

                if (withDeleted) {
                    querybuilder = querybuilder
                        .where("quotations.id IN (:...entitiesIds)", {
                            entitiesIds: entityIds,
                        })
                        .withDeleted()
                } else {
                    querybuilder = querybuilder.where(
                        "quotations.deleted_at IS NULL AND quotations.id IN (:...entitiesIds)",
                        {
                            entitiesIds: entityIds,
                        }
                    )
                }

                return querybuilder.getMany()
            })
        ).then(flatten)

        return entitiesIdsWithRelations
    }

    public async findWithRelationsAndCount(
        relations: string[] = [],
        idsOrOptionsWithoutRelations: QuotationFindWithoutRelationsOptions = {where: {}}
    ): Promise<[Quotation[], number]> {
        let count: number
        let entities: Quotation[]
        if (Array.isArray(idsOrOptionsWithoutRelations)) {
            // @ts-ignore
            entities = await this.findByIds(idsOrOptionsWithoutRelations, {
                withDeleted: idsOrOptionsWithoutRelations.withDeleted ?? false,
            })
            count = entities.length
        } else {
            const result = await this.queryQoutation(
                idsOrOptionsWithoutRelations,
                true
            )
            entities = result[0]
            count = result[1]
        }
        const entitiesIds = entities.map(({id}) => id)

        if (entitiesIds.length === 0) {
            // no need to continue
            return [[], count]
        }

        if (relations.length === 0) {
            // @ts-ignore
            const toReturn = await this.findByIds(
                entitiesIds,          // @ts-ignore
                idsOrOptionsWithoutRelations
            )
            return [toReturn, toReturn.length]
        }

        const groupedRelations = this.getGroupedRelations(relations)
        const entitiesIdsWithRelations = await this.queryQuotationWithIds(
            entitiesIds,
            groupedRelations,
            idsOrOptionsWithoutRelations.withDeleted,
            idsOrOptionsWithoutRelations.select
        )

        const entitiesAndRelations = entitiesIdsWithRelations.concat(entities)
        const entitiesToReturn =
            this.mergeEntitiesWithRelations(entitiesAndRelations)

        return [entitiesToReturn, count]
    }

    public async findWithRelations(
        relations: string[] = [],
        idsOrOptionsWithoutRelations: QuotationFindWithoutRelationsOptions | string[] = {
            where: {},
        },
        withDeleted = false
    ): Promise<Quotation[]> {
        let entities: Quotation[]
        if (Array.isArray(idsOrOptionsWithoutRelations)) {
            // @ts-ignore
            entities = await this.findByIds(idsOrOptionsWithoutRelations, {
                withDeleted,
            })
        } else {
            const result = await this.queryQoutation(
                idsOrOptionsWithoutRelations,
                false
            )
            entities = result[0]
        }
        const entitiesIds = entities.map(({id}) => id)

        if (entitiesIds.length === 0) {
            // no need to continue
            return []
        }

        if (
            relations.length === 0 &&
            !Array.isArray(idsOrOptionsWithoutRelations)
        ) {
            // @ts-ignore
            return await this.findByIds(entitiesIds, idsOrOptionsWithoutRelations)
        }

        const groupedRelations = this.getGroupedRelations(relations)
        const entitiesIdsWithRelations = await this.queryQuotationWithIds(
            entitiesIds,
            groupedRelations,
            withDeleted
        )

        const entitiesAndRelations = entitiesIdsWithRelations.concat(entities)
        const entitiesToReturn =
            this.mergeEntitiesWithRelations(entitiesAndRelations)

        return entitiesToReturn
    }

    public async findOneWithRelations(
        relations: string[] = [],
        optionsWithoutRelations: QuotationFindWithoutRelationsOptions = {where: {}}
    ): Promise<Quotation> {
        // Limit 1
        optionsWithoutRelations.take = 1

        const result = await this.findWithRelations(
            relations,
            optionsWithoutRelations
        )
        return result[0]
    }

    // public async bulkAddToCollection(
    //   productIds: string[],
    //   collectionId: string
    // ): Promise<Quotation[]> {
    //   await this.createQueryBuilder()
    //     .update(Quotation)
    //     .set({ collection_id: collectionId })
    //     .where({ id: In(productIds) })
    //     .execute()
    //
    //   return this.findByIds(productIds)
    // }
    //
    // public async bulkRemoveFromCollection(
    //   productIds: string[],
    //   collectionId: string
    // ): Promise<Product[]> {
    //   await this.createQueryBuilder()
    //     .update(Product)
    //     .set({ collection_id: null })
    //     .where({ id: In(productIds), collection_id: collectionId })
    //     .execute()
    //
    //   return this.findByIds(productIds)
    // }

    public async getFreeTextSearchResultsAndCount(
        q: string,
        options: QuotationFindWithoutRelationsOptions = {where: {}},
        relations: string[] = []
    ): Promise<[Quotation[], number]> {
        const cleanedOptions = this._cleanOptions(options)

        let qb = this.createQueryBuilder("quotation")
            .leftJoinAndSelect("quotation.sale_persion", "sale_persion")
            .leftJoinAndSelect("quotation.customer", "customer")
            .leftJoinAndSelect("quotation.quotation_lines", "quotation_lines")
            .select(["quotation.id"])
            .where(cleanedOptions.where)
            .andWhere(
                new Brackets((qb) => {
                    qb.where(`quotation.code ILIKE :q`, {q: `%${q}%`})
                        .orWhere(`quotation.title ILIKE :q`, {q: `%${q}%`})
                })
            )
            .skip(cleanedOptions.skip)
            .take(cleanedOptions.take)

        if (cleanedOptions.withDeleted) {
            qb = qb.withDeleted()
        }

        const [results, count] = await qb.getManyAndCount()

        const quotations = await this.findWithRelations(
            relations,
            results.map((r) => r.id),
            cleanedOptions.withDeleted
        )

        return [quotations, count]
    }

    private _cleanOptions(
        options: QuotationFindWithoutRelationsOptions
    ): WithRequiredProperty<QuotationFindWithoutRelationsOptions, "where"> {
        const where = options.where ?? {}
        if ("code" in where) {
            delete where.code
        }
        if ("title" in where) {
            delete where.title
        }

        if ("quotation_line" in where) {
            delete where?.quotation_line
        }

        return {
            ...options,
            where,
        }
    }
}
