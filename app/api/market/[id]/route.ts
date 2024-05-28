import {NextRequest} from "next/server";
import prisma from "@/utils/prisma";
import {updateFormSchema} from "@/app/api/market/route";
import {saveImageLocal, uploadImage} from "@/utils/image";


const GET = async (_: NextRequest, {params: {id}}: {params: {id: string}}) => {
    try {
        const data = await prisma.market.findUnique({
            where: {
                id
            },
        });
        return Response.json({msg: "Success",data})
    }
    catch (error) {
        console.log(error);
        return new Response(JSON.stringify({msg: "Delete market error" }), {
            status: 500,
        })
    }
}

const PUT = async (req: NextRequest, {params: {id}}: {params: {id: string}}) => {

    try {
        const formData = await req.formData();

        // 上传图片前 先用zod做一次解析
        let parseResult =
            updateFormSchema.safeParse(Object.fromEntries(formData.entries()));
        if (!parseResult.success) {
            console.log(parseResult.error.flatten().fieldErrors);
            return new Response(JSON.stringify(parseResult.error.flatten().fieldErrors), {
                status: 500,
            })
        }

        // 手动进行查重 因为使用了图床
        const isExist = await prisma.market.findUnique({
            where: {
                name: parseResult.data.name
            }
        });
        if(isExist && isExist.id !== id) {
            return new Response(JSON.stringify({msg: "Name already exists"}), {
                status: 500,
            })
        }

        let dataObj: typeof parseResult.data & {icon ?: string} = parseResult.data;

        // 文件保存到本地 因为是更新操作如果不存在字段 就不操作
        const iconFile = formData.get("icon");
        if(iconFile) {
            if (!(iconFile instanceof File)) {
                return new Response(JSON.stringify({msg: "Icon not valid"}), {
                    status: 500,
                })
            }
            if(iconFile.size !== 0) {
                const imagePath = await saveImageLocal(iconFile);
                // 文件上传到cloudinary 并且存储https链接
                dataObj.icon = await uploadImage(imagePath);
            }
        }
        // 数据库新增操作
        const data = await prisma.market.update({
            where: {
                id,
            },
            data: {
                ...dataObj
            }
        })

        return Response.json({msg: "Success",data})
    }
    catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ msg: "Update market error" }), {
            status: 500,
        })
    }
}


const DELETE = async (_: NextRequest, {params: {id}}: {params: {id: string}}) => {
    try {
        const data = await prisma.market.delete({
            where: {
                id
            }
        });
        return Response.json({msg: "Success",data})
    }
    catch (error) {
        console.log(error);
        return new Response(JSON.stringify({msg: "Delete market error" }), {
            status: 500,
        })
    }
}

export {
    GET,
    PUT,
    DELETE,
}