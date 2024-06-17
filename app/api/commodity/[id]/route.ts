import { NextRequest } from "next/server";
import prisma from "@/utils/prisma";
import {UpdateCommoditySchema} from "@/app/api/commodity/route";


const GET = async (_: NextRequest, {params: {id}}: { params: {id: string} }) => {
    try {
        const commodity = await prisma.commodity.findUnique({
            where: {
                id
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
                officialLink: true,
                market: {
                    select: {
                        id: true,
                        name: true,
                        icon: true,
                        rating: true,
                        ratingAmount: true,
                        website: true,
                        email: true,
                        telephone: true,
                        facebook: true,
                        twitter: true,
                        ins: true,
                        youtube: true,
                        address: true,
                        shippingPolicy: true,
                        refundPolicy: true,
                    }
                },
                skuConfigs: {
                    select: {
                        key: true,
                        value: true,
                        defaultValue: true,
                    }
                },
                skuItems: {
                    select: {
                        sku: true,
                        price: true,
                        promotingPrice: true,
                        image: true,
                        stock: true
                    }
                }
            },
        })

        const marketId = commodity?.market?.id||"";
        let bestSellingCommodities = await prisma.commodity.findMany({
            where: {
                marketId,
            },
            orderBy: {
                selling: "desc",
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
            take: 6
        })
        bestSellingCommodities = bestSellingCommodities.map(b => {
            b.images = [b.images[0]]
            return b;
        });

        return Response.json({msg: "Success", data: {commodity, bestSellingCommodities}}, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Method": "GET",
            }
        });
    }
    catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ msg: "GET commodity error" }), {
            status: 500,
        })
    }
}

const DELETE = async (_: NextRequest, {params: {id}}: { params: {id: string} }) => {
    try {
        const data = await prisma.commodity.delete({
            where: {
                id
            }
        })
        return Response.json({msg: "Success", data});
    }
    catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ msg: "DELETE commodity error" }), {
            status: 500,
        })
    }
}

const PUT = async (req: NextRequest, {params: {id}}: {
    params: {id: string}
}) => {
    try {
        const formData = await req.formData();
        const formDataObj = Object.fromEntries(formData);
        // @ts-ignore
        formDataObj.images = formData.getAll("images").filter(i => i!=="");
        // @ts-ignore
        formDataObj.tags = formData.getAll("tag").filter(i => i!=="");


        const parseResult = UpdateCommoditySchema.safeParse(formDataObj);
        if (!parseResult.success) {
            console.log(parseResult.error.flatten().fieldErrors);
            return new Response(JSON.stringify(parseResult.error.flatten().fieldErrors), {
                status: 500,
            })
        }

        const data = await prisma.commodity.update({
            where: {
                id
            },
            data: parseResult.data,
        })
        return Response.json({msg: "Success", data});
    }
    catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ msg: "Update commodity error" }), {
            status: 500,
        })
    }
}

export {
    DELETE,
    PUT,
    GET
}