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

const GET = async(_: NextRequest) => {
    try {
        const data = await prisma.skuConfig.findMany({});
        return Response.json({msg: "success", data});
    }
    catch (error) {
        console.error(error);
        return new Response(JSON.stringify(error), {
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
                ...parseResult.data
            }
        })
        await prisma.commodity.update({
            where: {
                id: String(commodityId),
            },
            data: {
                skuConfigs: {
                    connect: {
                        id: data.id,
                    }
                }
            }
        })

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