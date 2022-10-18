import path from "path"
import fs from "fs"
import express from "express"
import { createConnection } from "typeorm"
import { sync as existsSync } from "fs-exists-cached"
import { getConfigFile } from "medusa-core-utils"
import { track } from "medusa-telemetry"

import Logger from "../loaders/logger"
import loaders from "../loaders"

import featureFlagLoader from "../loaders/feature-flags"

import getMigrations from "./utils/get-migrations"

const t = async function ({ directory, migrate, seedFile }) {
  track("CLI_SEED")
  let resolvedPath = seedFile

  // If we are already given an absolute path we can skip resolution step
  if (!existsSync(resolvedPath)) {
    resolvedPath = path.resolve(path.join(directory, seedFile))

    if (!existsSync(resolvedPath)) {
      console.error(`Could not find a seed file at: ${seedFile}`)
      console.error(`Resolved path: ${resolvedPath}`)

      process.exit(1)
    }
  }

  const { configModule } = getConfigFile(directory, `medusa-config`)

  const featureFlagRouter = featureFlagLoader(configModule)

  console.log(directory)

  const dbType = configModule.projectConfig.database_type
  if (migrate && dbType !== "sqlite") {
    const migrationDirs = await getMigrations(directory, featureFlagRouter)
    const connection = await createConnection({
      type: configModule.projectConfig.database_type,
      database: configModule.projectConfig.database_database,
      url: configModule.projectConfig.database_url,
      extra: configModule.projectConfig.database_extra || {},
      migrations: migrationDirs,
      logging: true,
    })

    await connection.runMigrations()
    await connection.close()
    Logger.info("Migrations completed.")
  }

  const app = express()
  const { container } = await loaders({
    directory,
    expressApp: app,
  })

  const manager = container.resolve("manager")


  const storeService = container.resolve("storeService")
  const userService = container.resolve("userService")
  const regionService = container.resolve("regionService")
  const collectionService = container.resolve("productCollectionService")

  await manager.transaction(async (tx) => {
    const { store, users, regions, productCollections } = JSON.parse(
      fs.readFileSync(resolvedPath, `utf-8`)
    )

    if (store) {
      await storeService.withTransaction(tx).update(store)
    }

    for (const u of users) {
      const pass = u.password
      if (pass) {
        delete u.password
      }
      await userService.withTransaction(tx).create(u, pass)
    }

    for(const c of productCollections){
      await collectionService.withTransaction(tx).create(c);
    }

    const regionIds = {}
    for (const r of regions) {
      let dummyId
      if (!r.id || !r.id.startsWith("reg_")) {
        dummyId = r.id
        delete r.id
      }

      const reg = await regionService.withTransaction(tx).create(r)

      if (dummyId) {
        regionIds[dummyId] = reg.id
      }
    }
  })

  track("CLI_SEED_COMPLETED")
}

export default t
