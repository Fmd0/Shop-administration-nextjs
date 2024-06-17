import prisma from "@/utils/prisma";
import { NextRequest } from "next/server";


const GET = async (req: NextRequest) => {
    try {

        const searchParams = new URLSearchParams((new URL(req.url)).search);

        let page = Number(searchParams.get("page") || 1);
        if(isNaN(page) || page<1) { page = 1; }
        let pageSize = Number(searchParams.get("pageSize") || 6)
        if (isNaN(pageSize) || pageSize<0) { pageSize = 6; }
        const query = searchParams.get("query") || "";
        const startPrice = Number(searchParams.get("startPrice")||0);
        const endPrice = Number(searchParams.get("endPrice")||2000)*100;

        const sortByParam = searchParams.get("sortBy");
        let orderBy = "createdAt";
        let order = "asc";
        if(sortByParam === "bestSelling") {
            orderBy = "selling";
            order = "desc";
        }
        else if(sortByParam === "newest") {
            order = "desc"
        }
        else if(sortByParam === "priceDesc") {
            orderBy = "price";
            order = "desc";
        }
        else if(sortByParam === "priceAsc") {
            orderBy = "price";
            order = "asc";
        }

        const onSaleParam = searchParams.get("onSale");
        let promotingPrice: {gt?: number} = {};
        if(onSaleParam !== null && onSaleParam !== "") {
            promotingPrice.gt = 0;
        }

        const inStockParam = searchParams.get("inStock");
        let stock: {gt?: number} = {};
        if(inStockParam !== null && inStockParam !== "") {
            stock.gt = 0;
        }

        const tagParam = searchParams.get("tag");
        let tags = {}
        if(tagParam !== null && tagParam !== "" && tagParam !== "All") {
            tags = {
                tags: {
                    has: tagParam,
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


        console.log(JSON.stringify({
            skip: (page - 1) * pageSize,
            take: pageSize
        }))

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
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: {
                [orderBy]: order,
            }
        });
        const hasMore = _count > page*(pageSize);
        return Response.json({msg: "Success", totalAmount: _count, hasMore, data}, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Method": "GET",
            }
        });
    }
    catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ msg: "GET commodity error" }), {
            status: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Method": "GET",
            }
        })
    }
}


export {
    GET,
}