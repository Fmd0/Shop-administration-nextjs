import cloudinary from "@/utils/cloudinary";
import {v4 as uuidV4} from "uuid";
import {writeFileSync} from "node:fs";


const uploadImage = async (imagePath: string) => {
    const uploadResult =
        await cloudinary.uploader.upload(imagePath);
    return uploadResult.secure_url;
}

const saveImageLocal = async (iconFile: File) => {
    const suffix = iconFile.name.split('.')[iconFile.name.split('.').length - 1];
    const arrayBuffer = await iconFile.arrayBuffer();
    const imagePath = "./upload/market/" + uuidV4() + "." + suffix;
    writeFileSync(imagePath, new DataView(arrayBuffer), {
        flag: "w"
    });
    return imagePath;
}


export {
    uploadImage,
    saveImageLocal
}