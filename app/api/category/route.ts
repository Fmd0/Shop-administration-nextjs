import prisma from "@/utils/prisma";
import z from "zod";

const CategorySchema = z.object({
    id: z.string(),
    categoryId: z.coerce.number(),
    name: z.string(),
    parentId: z.string(),
})


const CreateCategorySchema = CategorySchema.omit({
    id: true,
    parentId: true,
})

export const UpdateCategorySchema = CategorySchema.omit({
    id: true,
    parentId: true,
}).partial({
    name: true,
    categoryId: true,
})

const GET = async(req: Request) => {
    try {
        const searchParams = new URLSearchParams(new URL(req.url).search);
        const page = Number(searchParams.get('page')) || 1;
        const pageSize = Number(searchParams.get('pageSize')) || 6;

        const query = searchParams.get("query") || "";

        const {_count: totalAmount} = await prisma.category.aggregate({
            where: {
                name: {
                    contains: query,
                }
            },
            _count: true,
        })

        const totalPages = Math.ceil(totalAmount/pageSize);

        const data = await prisma.category.findMany({
            where: {
                name: {
                    contains: query,
                }
            },
            select: {
                id: true,
                name: true,
                categoryId: true,
                parentId: true,
                children: {
                    select: {
                        id: true,
                        name: true,
                        categoryId: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
        })

        return Response.json({msg: "success",totalAmount, totalPages, data});
    }
    catch (error) {
        console.log(error);
        return Response.json({msg: "GET category error"}, {
            status: 500,
        });
    }
}


const POST = async(req: Request) => {
    try {
        const formData = await req.formData();
        const parseResult = CreateCategorySchema.safeParse(Object.fromEntries(formData));

        if (!parseResult.success) {
            console.log(parseResult.error.flatten().fieldErrors);
            return Response.json({msg: parseResult.error.flatten().fieldErrors}, {
                status: 500,
            })
        }

        const data = await prisma.category.create({
            data: parseResult.data,
        })

        return Response.json({msg: "Success", data});
    }
    catch (error) {
        console.error(error);
        return Response.json({msg: "POST category error"}, {
            status: 500,
        });
    }
}


export {
    GET,
    POST,
}