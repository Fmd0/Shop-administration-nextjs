import prisma from "@/utils/prisma";
import {UpdateHomeBannerSchema} from "@/app/api/home/banner/route";


const DELETE = async (_: Request, {params: {id}}: {params: {id: string}}) => {
    try {
        const data = await prisma.homeBanner.delete({
            where: {
                id
            }
        })
        return Response.json({msg: "success", data});
    }
    catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ msg: "DELETE home banner error" }), {
            status: 500,
        })
    }
}


const PUT = async (req: Request, {params: {id}}: {params: {id: string}}) => {
    try {
        const formData = await req.formData();
        const parseResult = UpdateHomeBannerSchema.safeParse(Object.fromEntries(formData));
        if (!parseResult.success) {
            console.log(parseResult.error.flatten().fieldErrors);
            return new Response(JSON.stringify(parseResult.error.flatten().fieldErrors), {
                status: 500,
            })
        }

        const data = await prisma.homeBanner.update({
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
        return new Response(JSON.stringify({ msg: "PUT home banner error" }), {
            status: 500,
        })
    }
}

export {
    PUT,
    DELETE,
}