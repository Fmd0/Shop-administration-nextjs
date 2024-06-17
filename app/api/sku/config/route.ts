import { NextRequest } from "next/server";
import prisma from "@/utils/prisma";
import z from "zod";

const SkuConfigSchema = z.object({
    id: z.string(),
    key: z.string(),
    value: z.array(z.string()),
    defaultValue: z.string(),
})

const createSkuConfigSchema = SkuConfigSchema.omit({
    id: true,
})

export const updateSkuConfigSchema = SkuConfigSchema.omit({
    id: true,
}).partial({
    key: true,
    value: true,
    defaultValue: true,
})

const GET = async(req: NextRequest) => {
    try {

        const searchParam = new URLSearchParams((new URL(req.url)).search);
        const page = Number(searchParam.get("page") || 1);
        const pageSize = Number(searchParam.get("pageSize") || 6);


        const commodityIdParam = searchParam.get("commodityId") || "";
        let commodityId = {};
        if(commodityIdParam!==null && commodityIdParam !== "") {
            commodityId = {
                commodityId: commodityIdParam,
            }
        }


        const {_count: totalAmount} = await prisma.skuConfig.aggregate({
            _count: true,
            where: {
                ...commodityId
            }
        })
        const totalPages = Math.ceil(totalAmount / pageSize);


        const data = await prisma.skuConfig.findMany({
            where: {
                ...commodityId,
            },
            select: {
                id: true,
                key: true,
                value: true,
                defaultValue: true,
                commodity: {
                    select: {
                        name: true,
                        market: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                commodityId: true,
            },
            orderBy: {
                createdAt: "asc",
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        return Response.json({msg: "success", totalPages, totalAmount, data});
    }
    catch (error) {
        console.error(error);
        return new Response(JSON.stringify({msg: "GET skuConfig error"}), {
            status: 500,
        })
    }
}


const POST = async (req: NextRequest) => {
    try {
        const formData = await req.formData();
        const formDataObj = Object.fromEntries(formData);

        // @ts-ignore
        formDataObj.value = formData.getAll("value").filter(v => v !== "");
        const parseResult = createSkuConfigSchema.safeParse(formDataObj);
        if (!parseResult.success) {
            console.log(parseResult.error.flatten().fieldErrors);
            return new Response(JSON.stringify(parseResult.error.flatten().fieldErrors), {
                status: 500,
            })
        }

        const commodityId = formData.get("commodityId");
        if (commodityId === null) {
            console.log("commodityId not found.");
            return new Response(JSON.stringify({msg: "commodityId not found."}), {
                status: 500,
            })
        }
        const commodity = await prisma.commodity.findUnique({
            where: {
                id: String(commodityId),
            }
        })
        if(commodity === null) {
            console.log("commodityId not valid.");
            return new Response(JSON.stringify({msg: "commodityId not valid."}), {
                status: 500,
            })
        }

        const data = await prisma.skuConfig.create({
            data: {
                ...parseResult.data,
                commodityId: String(commodityId),
            }
        })
        // await prisma.commodity.update({
        //     where: {
        //         id: String(commodityId),
        //     },
        //     data: {
        //         skuConfigs: {
        //             connect: {
        //                 id: data.id,
        //             }
        //         }
        //     }
        // })

        return Response.json({msg: "success", data});

    }
    catch(error) {
        console.error(error);
        return new Response(JSON.stringify({ msg: "Create commodity error" }), {
            status: 500,
        })
    }
}


export {
    GET,
    POST,
}