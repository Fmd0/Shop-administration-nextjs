import prisma from "@/utils/prisma";
import {UpdateSkuItemSchema} from "@/app/api/sku/item/route";


const DELETE = async (_: Request, {params:{id}}: {params: {id: string}}) => {
    try {
        const data = await prisma.skuItem.delete({
            where: {
                id
            }
        })
        return Response.json({msg: "Success", data});
    }
    catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ msg: "DELETE skuItem error" }), {
            status: 500,
        })
    }
}

const PUT = async (req: Request, {params:{id}}: {params: {id: string}}) => {
    try {
        const formData = await req.formData();
        const formDataObj = Object.fromEntries(formData);

        // @ts-ignore
        formDataObj.sku={}
        const keys = formData.getAll("key").filter(i => i!=="");
        const values = formData.getAll("value").filter(i => i!=="");
        const minLength = values.length<keys.length?values.length:keys.length;
        for (let i = 0; i < minLength; i++) {
            // @ts-ignore
            formDataObj.sku[keys[i]] = values[i];
        }

        const parseResult = UpdateSkuItemSchema.safeParse(formDataObj);
        if (!parseResult.success) {
            console.log(parseResult.error.flatten().fieldErrors);
            return new Response(JSON.stringify(parseResult.error.flatten().fieldErrors), {
                status: 500,
            })
        }

        const data = await prisma.skuItem.update({
            where: {
                id
            },
            data: {
                ...parseResult.data,
            }
        })
        return Response.json({msg: "Success", data});
    }
    catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ msg: "PUT skuItem error" }), {
            status: 500,
        })
    }
}

export {
    DELETE,
    PUT
}