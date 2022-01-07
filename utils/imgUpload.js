import {mimeTypes} from "./util";
import fs from "fs";

export const imageUpload = (file) => {
    const imgName = `${file.fieldname}-${Date.now()}${mimeTypes[file.mimetype]}`
    const folder = `public/images`
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, {recursive: true})
    }
    const fileName = folder + '/' + imgName
    fs.writeFileSync(fileName, file.buffer)

    return fileName
}