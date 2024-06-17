import z from 'zod'
import prisma from "@/utils/prisma";


const SkuItemSchema = z.object({
    id: z.string(),
    sku: z.record(z.string(), z.string()),
    price: z.coerce.number(),
    promotingPrice: z.coerce.number(),
    image: z.string(),
    stock: z.coerce.number(),
})



const CreateSkuItemSchema = SkuItemSchema.omit({
    id: true,
}).partial({
    image: true,
})

export const UpdateSkuItemSchema = SkuItemSchema.omit({
    id: true,
}).partial({
    sku: true,
    price: true,
    promotingPrice: true,
    image: true,
    stock: true,
})


const GET = async (req: Request) => {
    try {

        const searchParams = new URLSearchParams((new URL(req.url)).search);
        const page = Number(searchParams.get("page") || 1);
        const pageSize = Number(searchParams.get("pageSize") || 6);

        const commodityIdParam = searchParams.get("commodityId") || "";
        let commodityId = {};
        if(commodityIdParam!==null && commodityIdParam!== "") {
            commodityId = {
                commodityId: commodityIdParam,
            }
        }

        const {_count: totalAmount} = await prisma.skuItem.aggregate({
            _count: true,
            where: {
                ...commodityId,
            }
        })
        const totalPages = Math.ceil(totalAmount / pageSize)


        const data = await prisma.skuItem.findMany({
            where: {
                ...commodityId,
            },
            select: {
                id: true,
                sku: true,
                price: true,
                promotingPrice: true,
                image: true,
                stock: true,
                commodityId: true,
                commodity: {
                    select: {
                        name: true,
                        market: {
                            select: {
                                name: true,
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        return Response.json({msg: "Success", totalAmount, totalPages, data});
    }
    catch (error) {
        console.log(error);
        return new Response(JSON.stringify({msg: "GET skuItem error" }), {
            status: 500,
        })
    }
}

const POST = async (req: Request) => {
    try {
        const formData = await req.formData();
        const formDataObj = Object.fromEntries(formData);

        // @ts-ignore
        formDataObj.sku={}
        const keys = formData.getAll("key").filter(i => i!=="");
        const values = formData.getAll("value").filter(i => i!=="");
        const minLength = values.length<keys.length?values.length:keys.length;
        for (let i = 0; i < minLength; i++) {
            // @ts-ignore
            formDataObj.sku[keys[i]] = values[i];
        }

        const parseResult = CreateSkuItemSchema.safeParse(formDataObj);
        if (!parseResult.success) {
            console.log(parseResult.error.flatten().fieldErrors);
            return new Response(JSON.stringify(parseResult.error.flatten().fieldErrors), {
                status: 500,
            })
        }
        // console.log(parseResult.data);

        const commodityId = formData.get("commodityId");
        if (commodityId === null) {
            console.log("commodityId not found.");
            return new Response(JSON.stringify({msg: "commodityId not found."}), {
                status: 500,
            })
        }
        const commodityIdData = await prisma.commodity.findUnique({
            where: {
                id: String(commodityId)
            }
        });
        if(commodityIdData === null) {
            console.log("commodityId not valid.");
            return new Response(JSON.stringify({msg: "commodityId not valid."}), {
                status: 500,
            })
        }

        const data = await prisma.skuItem.create({
            data: {
                ...parseResult.data,
                commodityId: String(commodityId)
            }
        })

        return Response.json({msg: "Success", data});
    }
    catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ msg: "POST skuItem error" }), {
            status: 500,
        })
    }
}



export {
    GET,
    POST,
}

