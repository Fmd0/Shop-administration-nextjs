import { NextRequest } from "next/server";
import prisma from "@/utils/prisma";
import {updateSkuConfigSchema} from "@/app/api/sku/config/route";



const DELETE = async (req: NextRequest, {params:{id}}: {params: {id: string}}) => {
    try {
        const data = await prisma.skuConfig.delete({
            where: {
                id
            }
        })
        return Response.json({msg: "Success", data});
    }
    catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ msg: "DELETE skuConfig error" }), {
            status: 500,
        })
    }
}


const PUT = async (req: NextRequest, {params:{id}}: {params: {id: string}}) => {
    try {
        const formData = await req.formData();
        const formDataObj = Object.fromEntries(formData);

        // @ts-ignore
        formDataObj.value = formData.getAll("value").filter(v => v !== "");
        const parseResult = updateSkuConfigSchema.safeParse(formDataObj);
        if (!parseResult.success) {
            console.log(parseResult.error.flatten().fieldErrors);
            return new Response(JSON.stringify(parseResult.error.flatten().fieldErrors), {
                status: 500,
            })
        }

        const data = await prisma.skuConfig.update({
            where: {
                id
            },
            data: {
                ...parseResult.data
            }
        })

        return Response.json({msg: "Success", data});
    }
    catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ msg: "Update skuConfig error" }), {
            status: 500,
        })
    }
}

export {
    DELETE,
    PUT,
}