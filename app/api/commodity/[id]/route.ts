import { NextRequest } from "next/server";
import prisma from "@/utils/prisma";
import {UpdateCommoditySchema} from "@/app/api/commodity/route";


const GET = async (_: NextRequest, {params: {id}}: { params: {id: string} }) => {
    try {
        const data = await prisma.commodity.findUnique({
            where: {
                id
            }
        })
        return Response.json({msg: "Success", data});
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
            data: {
                ...parseResult.data,
            }
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
}