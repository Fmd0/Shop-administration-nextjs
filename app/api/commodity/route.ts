import { NextRequest } from "next/server";
import prisma from "@/utils/prisma";
import z from "zod";


const CommoditySchema = z.object({
    id: z.string(),
    name: z.string(),
    price: z.string(),
    promotingPrice: z.string(),
    images: z.array(z.string()),
    rating: z.string(),
    ratingAmount: z.string(),
    description: z.string(),
})


const CreateCommoditySchema = CommoditySchema.omit({
    id: true,
}).partial({
    promotingPrice: true,
    images: true,
    rating: true,
    ratingAmount: true,
    description: true,
})

export const UpdateCommoditySchema = CommoditySchema.omit({
    id: true,
}).partial({
    name: true,
    price: true,
    promotingPrice: true,
    images: true,
    rating: true,
    ratingAmount: true,
    description: true,
})


const GET = async (_: NextRequest) => {
    try {
        const data = await prisma.commodity.findMany({
            select: {
                id: true,
                name: true,
                price: true,
                promotingPrice: true,
                images: true,
                rating: true,
                ratingAmount: true,
                description: true,
                marketId: true,
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
        return new Response(JSON.stringify({ msg: "GET commodity error" }), {
            status: 500,
        })
    }
}


const POST = async (req: NextRequest) => {

    try {
        const formData = await req.formData();
        const formDataObj = Object.fromEntries(formData);
        // @ts-ignore
        formDataObj.images = formData.getAll("images").filter(i => i!=="");

        const parseResult = CreateCommoditySchema.safeParse(formDataObj)
        if(!parseResult.success) {
            console.log(parseResult.error.flatten().fieldErrors);
            return new Response(JSON.stringify(parseResult.error.flatten().fieldErrors), {
                status: 500,
            })
        }

        const marketId = formData.get("marketId");
        if(marketId === null) {
            console.log("Market not exist");
            return new Response(JSON.stringify({msg: "Market not exist"}), {
                status: 500,
            })
        }
        const marketData = await prisma.market.findUnique({
            where: {
                id: String(marketId)
            }
        })

        if(marketData === null) {
            return new Response(JSON.stringify({msg: "Market not exist"}), {
                status: 500,
            })
        }



        const data = await prisma.commodity.create({
            data: {
                ...parseResult.data,
                marketId: String(marketId),
            }
        })

        // await prisma.market.update({
        //     where: {
        //         id: String(marketId),
        //     },
        //     data: {
        //         commodities: {
        //             connect: {
        //                 id: data.id,
        //             }
        //         }
        //     }
        // })
        return Response.json({msg: "Success",data});
    }
    catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ msg: "Create commodity error" }), {
            status: 500,
        })
    }
}

export {
    GET,
    POST,
}