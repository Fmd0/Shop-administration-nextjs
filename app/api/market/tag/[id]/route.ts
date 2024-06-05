import prisma from "@/utils/prisma";
import {UpdateMarketTagSchema} from "@/app/api/market/tag/route";


const DELETE = async (_: Request, {params: {id}}: {params: {id: string}}) => {
    try {
        const data = await prisma.marketTag.delete({
            where: {
                id
            }
        })
        return Response.json({msg: "Success",data})
    }
    catch (error) {
        console.error(error)
        return new Response(JSON.stringify({msg: "Delete market tag error" }), {
            status: 500,
        })
    }
}

const PUT = async (req: Request, {params: {id}}: {params: {id: string}}) => {
    try {
        const formData = await req.formData();
        const formDataObj = Object.fromEntries(formData);
        // @ts-ignore
        formDataObj.tags = formData.getAll("tag").filter(i => i!=="");

        const parseResult = UpdateMarketTagSchema.safeParse(formDataObj);
        if(!parseResult.success) {
            return new Response(JSON.stringify(parseResult.error.flatten().fieldErrors), {
                status: 500,
            })
        }

        const data = await prisma.marketTag.update({
            where: {
                id
            },
            data: parseResult.data,
        })
        return Response.json({msg: "Success",data})
    }
    catch (error) {
        console.error(error)
        return new Response(JSON.stringify({msg: "Update market tag error" }), {
            status: 500,
        })
    }
}

export {
    DELETE,
    PUT
}