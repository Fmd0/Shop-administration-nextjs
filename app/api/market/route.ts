import {NextRequest} from "next/server";
import {writeFileSync} from "node:fs";
import { v4 as uuidV4 } from 'uuid';
import prisma from "@/utils/prisma";
import z from "zod";
import {uploadImage} from "@/utils/image";

export const FormSchema = z.object({
    id: z.string(),
    name: z.union([z.string().min(3), z.literal('')]),
    icon: z.union([z.string().url(), z.literal('')]),
    rating: z.union([z.string(), z.literal('')]),
    ratingAmount: z.union([z.string(), z.literal('')]),
    description: z.union([z.string(), z.literal('')]),
    website: z.union([z.string().url(), z.literal('')]),
    email: z.union([z.string().email(), z.literal('')]),
    telephone: z.union([z.string(), z.literal('')]),
    facebook: z.union([z.string().url(), z.literal('')]),
    ins: z.union([z.string().url(), z.literal('')]),
    youtube: z.union([z.string().url(), z.literal('')]),
    address: z.union([z.string(), z.literal('')]),
    privacyPolicy: z.union([z.string().url(), z.literal('')]),
    refundPolicy: z.union([z.string().url(), z.literal('')]),
    shippingPolicy: z.union([z.string().url(), z.literal('')]),
})

export const createFormSchema = FormSchema.omit({
    id: true,
    icon: true,
}).partial({
    rating: true,
    ratingAmount: true,
    description: true,
    website: true,
    email: true,
    telephone: true,
    facebook: true,
    ins: true,
    youtube: true,
    address: true,
    privacyPolicy: true,
    refundPolicy: true,
    shippingPolicy: true,
})

export const updateFormSchema = FormSchema.omit({
    id: true,
    icon: true,
}).partial({
    name: true,
    rating: true,
    ratingAmount: true,
    description: true,
    website: true,
    email: true,
    telephone: true,
    facebook: true,
    ins: true,
    youtube: true,
    address: true,
    privacyPolicy: true,
    refundPolicy: true,
    shippingPolicy: true,
})


const GET = async () => {
    try {
        const data = await prisma.market.findMany({});
        return Response.json({
            msg: "Success",
            data
        });
    }
    catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ msg: "GET market error" }), {
            status: 500,
        });
    }
}


const POST = async (req: NextRequest) => {


    try {
        // 上传图片前 先用zod做一次解析
        const formData = await req.formData();


        let parseResult =
            createFormSchema.safeParse(Object.fromEntries(formData.entries()));
        if (!parseResult.success) {
            console.log(parseResult.error.flatten().fieldErrors);
            return new Response(JSON.stringify(parseResult.error.flatten().fieldErrors), {
                status: 500,
            })
        }

        // name检测是否唯一 如果不是 那么后续操作都不用做 因为涉及到图床 所以先额外做一步检测
        const isExist = await prisma.market.findUnique({
            where: {
                name: parseResult.data.name
            }
        });
        if(isExist) {
            return new Response(JSON.stringify({msg: "Name already exists"}), {
                status: 500,
            })
        }

        let dataObj = {
            ...parseResult.data,
            icon: "",
        };

        // 文件保存到本地
        const iconFile = formData.get("icon");
        if (!(iconFile instanceof File)) {
            return new Response(JSON.stringify({msg: "Icon not valid"}), {
                status: 500,
            })
        }
        const suffix = iconFile.name.split('.')[iconFile.name.split('.').length - 1];
        const arrayBuffer = await iconFile.arrayBuffer();
        const imagePath = "./upload/market/" + uuidV4() + "." + suffix;
        writeFileSync(imagePath, new DataView(arrayBuffer), {
            flag: "w"
        });

        // 文件上传到cloudinary 并且存储https链接
        dataObj.icon = await uploadImage(imagePath);

        // 数据库新增操作
        const data = await prisma.market.create({
            data: {
                ...dataObj
            }
        })
        return Response.json({msg: "Success",data})
    }
    catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ msg: "Create market error" }), {
            status: 500,
        })
    }
}



export {
    POST,
    GET
}