import prisma from "@/utils/prisma";
import z from "zod";

const HomeShopStartedSchema = z.object({
    id: z.string(),
    name: z.string(),
    logo: z.string(),
    imageLeft: z.string(),
    imageRight: z.string(),
    rating: z.string(),
    ratingAmount: z.string(),
    relativeId: z.string(),
})

const CreateHomeShopStartedSchema = HomeShopStartedSchema.omit({
    id: true,
}).partial({
    imageLeft: true,
    imageRight: true,
    rating: true,
    ratingAmount: true,
})

export const UpdateHomeShopStartedSchema = HomeShopStartedSchema.omit({
    id: true,
    relativeId: true,
}).partial({
    imageLeft: true,
    imageRight: true,
    rating: true,
    ratingAmount: true,
})

const GET = async() => {
    try {
        const data = await prisma.homeShopStarted.findMany({
            orderBy: {
                createdAt: "asc"
            }
        });
        return Response.json({msg: "success", data}, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Method": "GET",
            }
        });
    }
    catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ msg: "GET home shop started error" }), {
            status: 500,
        })
    }
}


const POST = async(req: Request) => {
    try {
        const formData = await req.formData();
        const parseResult =
            CreateHomeShopStartedSchema.safeParse(Object.fromEntries(formData));

        if (!parseResult.success) {
            console.log(parseResult.error.flatten().fieldErrors);
            return new Response(JSON.stringify(parseResult.error.flatten().fieldErrors), {
                status: 500,
            })
        }

        const relativeData = await prisma.market.findUnique({
            where: {
                id: parseResult.data.relativeId,
            }
        })
        if (relativeData === null) {
            return new Response(JSON.stringify({ msg: "Relative id not valid" }), {
                status: 500,
            })
        }

        const data = await prisma.homeShopStarted.create({
            data: {
                ...parseResult.data,
            }
        })
        return Response.json({msg: "Success", data});
    }
    catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ msg: "POST home shop started error" }), {
            status: 500,
        })
    }
}

export {
    GET,
    POST
}


