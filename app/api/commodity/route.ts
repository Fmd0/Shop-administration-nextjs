import { NextRequest } from "next/server";
import prisma from "@/utils/prisma";
import z from "zod";


const CommoditySchema = z.object({
    id: z.string(),
    name: z.string(),
    price: z.coerce.number(),
    promotingPrice: z.coerce.number(),
    images: z.array(z.string()),
    rating: z.coerce.number(),
    ratingAmount: z.string(),
    description: z.string(),
    stock: z.coerce.number(),
    selling: z.coerce.number(),
    officialLink: z.string(),
    tags: z.array(z.string()),
})


const CreateCommoditySchema = CommoditySchema.omit({
    id: true,
}).partial({
    promotingPrice: true,
    images: true,
    rating: true,
    ratingAmount: true,
    description: true,
    stock: true,
    selling: true,
    officialLink: true,
    tags: true,
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
    stock: true,
    selling: true,
    officialLink: true,
    tags: true,
})


const GET = async (req: NextRequest) => {
    try {

        const url = new URL(req.url);
        const searchParams = new URLSearchParams(url.search);

        let page = Number(searchParams.get("page") || 1);
        if(isNaN(page) || page<1) { page = 1; }
        let pageSize = Number(searchParams.get("pageSize") || 6)
        if (isNaN(pageSize) || pageSize<0) { pageSize = 6; }
        const query = searchParams.get("query") || "";
        const startPrice = Number(searchParams.get("startPrice")||0);
        const endPrice = Number(searchParams.get("endPrice")||2000)*100;

        const sortByParam = searchParams.get("sortBy");
        let orderBy = "createdAt";
        let order = "desc";
        if(sortByParam === "bestSelling") {
            orderBy = "selling";
            order = "desc";
        }
        else if(sortByParam === "priceDesc") {
            orderBy = "price";
            order = "desc";
        }
        else if(sortByParam === "priceAsc") {
            orderBy = "price";
            order = "asc";
        }

        const onSale = searchParams.get("onSale");
        let promotingPrice: {gt?: number} = {};
        if(onSale !== null) {
            promotingPrice.gt = 0;
        }

        const inStock = searchParams.get("inStock");
        let stock: {gt?: number} = {};
        if(inStock !== null) {
            stock.gt = 0;
        }

        const tag = searchParams.get("tag");
        let tags = {}
        if(tag !== null) {
            tags = {
                tags: {
                    has: tag,
                }
            }
        }

        const marketIdParam = searchParams.get("marketId");
        let marketId = {};
        if(marketIdParam !== null && marketIdParam !== "") {
            marketId = {
                marketId: marketIdParam
            }
        }


        const {_count} = await prisma.commodity.aggregate({
            _count: true,
            where: {
                name: {
                    contains: query,
                    mode: "insensitive",
                },
                price: {
                    gte: startPrice,
                    lte: endPrice,
                },
                ...marketId,
                ...tags,
                promotingPrice,
                stock,
            },
        })
        const totalPages = Math.ceil(_count/pageSize);

        const data = await prisma.commodity.findMany({
            where: {
                name: {
                  contains: query,
                  mode: "insensitive",
                },
                price: {
                    gte: startPrice,
                    lte: endPrice,
                },
                promotingPrice,
                stock,
                ...tags,
                ...marketId,
            },
            select: {
                id: true,
                name: true,
                price: true,
                promotingPrice: true,
                images: true,
                rating: true,
                ratingAmount: true,
                description: true,
                stock: true,
                selling: true,
                officialLink: true,
                tags: true,
                marketId: true,
                market: {
                    select: {
                        id: true,
                        name: true,
                        marketTag: {
                            select: {
                                tags: true,
                            }
                        }
                    }
                }
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: {
                [orderBy]: order,
            }
        });
        return Response.json({msg: "Success", totalPages, totalAmount: _count, data});
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
        // @ts-ignore
        formDataObj.tags = formData.getAll("tag").filter(i => i!=="");

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