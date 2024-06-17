import prisma from "@/utils/prisma";
import z from "zod"

const CommentSchema = z.object({
    id: z.string(),
    rating: z.coerce.number(),
    comment: z.string(),
    userName: z.string(),
    marketId: z.string(),
    commodityId: z.string(),
})

const CreateCommentSchema = CommentSchema.omit({
    id: true,
    marketId: true,
})

export const UpdateCommentSchema = CommentSchema.omit({
    id: true,
    marketId: true,
    commodityId: true,
}).partial({
    rating: true,
    comment: true,
    userName: true,
})

const GET = async (req: Request) => {
    try {

        const searchParams = new URLSearchParams((new URL(req.url)).search);
        const page = Number(searchParams.get("page") || 1);
        const pageSize = Number(searchParams.get("pageSize") || 6);

        const commodityIdParam = searchParams.get("commodityId");
        let commodityId = {};
        if(commodityIdParam !== null && commodityIdParam !== "") {
            commodityId = {
                commodityId: commodityIdParam,
            }
        }

        const marketIdParam = searchParams.get("marketId");
        let marketId = {};
        if(marketIdParam !== null && marketIdParam !== "") {
            marketId = {
                marketId: marketIdParam,
            }
        }

        const {_count: totalAmount} = await prisma.comment.aggregate({
            where: {
                ...commodityId,
                ...marketId,
            },
            _count: true
        })
        const totalPages = Math.ceil(totalAmount / pageSize)
        const hasMore = totalAmount > page*pageSize;

        let groupRating = []
        if(page === 1) {
            groupRating = await prisma.comment.groupBy({
                by: ['rating'],
                _count: true,
            })
        }

        const data = await prisma.comment.findMany({
            where: {
                ...commodityId,
                ...marketId
            },
            select: {
                id: true,
                rating: true,
                comment: true,
                userName: true,
                marketId: true,
                commodityId: true,
                createdAt: true,
                market: {
                    select: {
                        name: true,
                    }
                },
                commodity: {
                    select: {
                        name: true,
                    }
                }
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: {
                createdAt: "desc"
            }
        });
        return Response.json({msg: "Success", totalAmount, totalPages, groupRating, hasMore, data}, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Method": "GET",
            }
        });
    }
    catch (error) {
        console.log(error);
        return new Response(JSON.stringify({msg: "GET comment error" }), {
            status: 500,
        })
    }
}

const POST = async (req: Request) => {
    try {
        const formData = await req.formData();
        const formDataObj = Object.fromEntries(formData);

        const parseResult = CreateCommentSchema.safeParse(formDataObj);
        if (!parseResult.success) {
            console.log(parseResult.error.flatten().fieldErrors);
            return new Response(JSON.stringify(parseResult.error.flatten().fieldErrors), {
                status: 500,
            })
        }
        const commodityId = parseResult.data.commodityId;
        const commodity = await prisma.commodity.findUnique({
            where: {
                id: commodityId,
            },
        })

        const marketId = commodity?.marketId||"";

        const data = await prisma.comment.create({
            data: {
                ...parseResult.data,
                marketId
            }
        })

        return Response.json({msg: "Success", data});
    }
    catch (error) {
        console.error(error);
        return new Response(JSON.stringify({msg: "POST comment error" }), {
            status: 500,
        })
    }
}

export {
    GET,
    POST
}