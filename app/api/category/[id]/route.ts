import prisma from "@/utils/prisma";
import {UpdateCategorySchema} from "@/app/api/category/route";


const DELETE = async (_: Request, {params: {id}}: {params: {id: string}}) => {
    try {
        const data = await prisma.category.delete({
            where: {
                id
            }
        })

        return Response.json({msg: "Success", data})
    }
    catch (error) {
        console.error(error);
        return Response.json({msg: "DELETE category error"}, {
            status: 500,
        });
    }
}

const PUT = async (req: Request, {params: {id}}: {params: {id: string}}) => {
    try {
        const formData = await req.formData();
        const parseResult = UpdateCategorySchema.safeParse(Object.fromEntries(formData));
        if (!parseResult.success) {
            console.log(parseResult.error.flatten().fieldErrors);
            return Response.json(parseResult.error.flatten().fieldErrors, {
                status: 500,
            })
        }


        const childrenIds = formData.getAll("childrenId").filter(d => d!=="");

        await prisma.category.update({
            where: {
                id
            },
            data: {
                children: {
                    set: [],
                }
            }
        })

        const data = await prisma.category.update({
            where: {
                id
            },
            data: {
                ...parseResult.data,
                children: {
                    connect: childrenIds.map(c => ({id: String(c)}))
                }
            }
        })

        return Response.json({msg: "Success", data})
    }
    catch (error) {
        console.error(error);
        return Response.json({msg: "PUT category error"}, {
            status: 500,
        })
    }
}

export {
    DELETE,
    PUT,
}