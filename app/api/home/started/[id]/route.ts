import prisma from "@/utils/prisma";
import {UpdateHomeShopStartedSchema} from "@/app/api/home/started/route";


const DELETE = async (_: Request, {params: {id}}: {params: {id: string}}) => {
    try {
        const data = await prisma.homeShopStarted.delete({
            where: {
                id
            }
        })
        return Response.json({msg: "success", data});
    }
    catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ msg: "DELETE home shop started error" }), {
            status: 500,
        })
    }
}


const PUT = async (req: Request, {params: {id}}: {params: {id: string}}) => {
    try {
        const formData = await req.formData();
        const parseResult = UpdateHomeShopStartedSchema.safeParse(Object.fromEntries(formData));
        if (!parseResult.success) {
            console.log(parseResult.error.flatten().fieldErrors);
            return new Response(JSON.stringify(parseResult.error.flatten().fieldErrors), {
                status: 500,
            })
        }

        const data = await prisma.homeShopStarted.update({
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
        return new Response(JSON.stringify({ msg: "PUT home shop started error" }), {
            status: 500,
        })
    }
}

export {
    PUT,
    DELETE,
}