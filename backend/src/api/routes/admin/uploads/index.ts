import express, { Router } from "express"
import multer from "multer"
import { DeleteResponse } from "../../../../types/common"

import middlewares, { transformBody } from "../../../middlewares"
import { AdminDeleteUploadsReq } from "./delete-upload"
import { AdminPostUploadsDownloadUrlReq } from "./get-download-url"
import path from "path";

const route = Router()
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname + '../../../../../../public/img'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + ".jpg")
  }
})
const upload = multer({ storage: storage })

export default (app) => {
  app.use("/uploads", route)
  route.post(
    "/",
    upload.array("files"),
    middlewares.wrap(require("./create-upload").default)
  )

  route.delete(
    "/",
    transformBody(AdminDeleteUploadsReq),
    middlewares.wrap(require("./delete-upload").default)
  )

  route.post(
    "/download-url",
    transformBody(AdminPostUploadsDownloadUrlReq),
    middlewares.wrap(require("./get-download-url").default)
  )

  return app
}

export type AdminUploadsRes = {
  uploads: { url: string }[]
}

export type AdminDeleteUploadsRes = DeleteResponse

export type AdminUploadsDownloadUrlRes = {
  download_url: string
}

export * from "./create-upload"
export * from "./delete-upload"
export * from "./get-download-url"
