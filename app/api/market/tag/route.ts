import prisma from "@/utils/prisma";
import z from "zod";

const MarketTagSchema = z.object({
    id: z.string(),
    tags: z.array(z.string()),
    marketId: z.string(),
})

const CreateMarketTagSchema = MarketTagSchema.omit({
    id: true,
}).partial({
    tags: true,
})

export const UpdateMarketTagSchema = MarketTagSchema.omit({
    id: true,
    marketId: true,
}).partial({
    tags: true,
})

const GET = async () => {
    try {
        const data = await prisma.marketTag.findMany({
            select: {
                id: true,
                tags: true,
                market: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });
        return Response.json({msg: "Success", data});
    }
    catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ msg: "Get market tag error" }), {
            status: 500,
        })
    }
}

const POST = async (req: Request) => {
    try {
        const formData = await req.formData();
        const formDataObj = Object.fromEntries(formData);
        // @ts-ignore
        formDataObj.tags = formData.getAll("tag").filter(i => i!=="");

        const parseResult = CreateMarketTagSchema.safeParse(formDataObj);
        if(!parseResult.success) {
            return new Response(JSON.stringify(parseResult.error.flatten().fieldErrors), {
                status: 500,
            })
        }

        const marketData = await prisma.market.findUnique({
            where: {
                id: parseResult.data.marketId,
            }
        })
        if(marketData === null) {
            return new Response(JSON.stringify({msg: "MarketId not valid"}), {
                status: 500,
            })
        }

        const data = await prisma.marketTag.create({
            data: parseResult.data,
        })

        return Response.json({msg: "Success", data});
    }
    catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ msg: "Post market tag error" }), {
            status: 500,
        })
    }
}

export {
    GET,
    POST
}