import prisma from "@/utils/prisma";
import {UpdateCommentSchema} from "@/app/api/comment/route";

const DELETE = async (_: Request, {params: {id}}:{params: {id: string}}) => {
    try {
        const data = await prisma.comment.delete({
            where: {
                id
            }
        })
        return Response.json({msg: "Success", data});
    }
    catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ msg: "Delete comment error" }), {
            status: 500,
        })
    }
}

const PUT = async (req: Request, {params: {id}}:{params: {id: string}}) => {
    try {
        const formData = await req.formData();
        const formDataObj = Object.fromEntries(formData);
        const parseResult = UpdateCommentSchema.safeParse(formDataObj);

        if (!parseResult.success) {
            console.log(parseResult.error.flatten().fieldErrors);
            return new Response(JSON.stringify(parseResult.error.flatten().fieldErrors), {
                status: 500,
            })
        }

        const data = await prisma.comment.update({
            where: {
                id
            },
            data: parseResult.data,
        })

        return Response.json({msg: "Success", data});
    }
    catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ msg: "Update comment error" }), {
            status: 500,
        })
    }
}

export {
    DELETE,
    PUT,
}