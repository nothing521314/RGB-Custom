import {MedusaError} from "medusa-core-utils"
import {EntityManager} from "typeorm"
import {
    AbstractFileService,
    FileServiceGetUploadStreamResult,
    FileServiceUploadResult,
    GetUploadedFileType,
    UploadStreamDescriptorType,
} from "../interfaces"
import fs from "fs";
import { join } from 'path';
import * as uuid from 'uuid';
const assetsFolder = 'public';

class DefaultFileService extends AbstractFileService {
    // @ts-ignore

    async upload(fileData: Express.Multer.File): Promise<FileServiceUploadResult> {
        console.log(fileData)
        console.log(fileData.buffer)

        await this.uploadImageToDisk(fileData, "img")
    }

    async uploadImageToDisk(file: any, pathSave) {
        this.createFolderFromPath(join(assetsFolder, pathSave));

        const fileExt = file.originalname.split('.').pop();
        const fileName = `${uuid.v4()}.${fileExt}`;
        const uploadPath = `${pathSave}/${fileName}`;

        try {
            await fs.writeFileSync(
                join(assetsFolder, pathSave, fileName),
                Buffer.from(file.buffer),
            );
        } catch (error) {
            console.log(error);
            throw new MedusaError(
                MedusaError.Types.UNEXPECTED_STATE,
                "'An error occurred during the operation, please contact the administrator."
            )
        }

        return uploadPath;
    }

    async createFolderFromPath (path ){
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }
    }

    delete(fileData: Record<string, any>): Promise<void> {
        throw new MedusaError(
            MedusaError.Types.UNEXPECTED_STATE,
            "Please add a file service plugin in order to manipulate files in Medusa"
        )
    }

    getUploadStreamDescriptor(
        fileData: UploadStreamDescriptorType
    ): Promise<FileServiceGetUploadStreamResult> {
        throw new MedusaError(
            MedusaError.Types.UNEXPECTED_STATE,
            "Please add a file service plugin in order to manipulate files in Medusa"
        )
    }

    getDownloadStream(
        fileData: GetUploadedFileType
    ): Promise<NodeJS.ReadableStream> {
        throw new MedusaError(
            MedusaError.Types.UNEXPECTED_STATE,
            "Please add a file service plugin in order to manipulate files in Medusa"
        )
    }

    getPresignedDownloadUrl(fileData: GetUploadedFileType): Promise<string> {
        throw new MedusaError(
            MedusaError.Types.UNEXPECTED_STATE,
            "Please add a file service plugin in order to manipulate files in Medusa"
        )
    }

    protected manager_: EntityManager
    protected transactionManager_: EntityManager | undefined

}

export default DefaultFileService
