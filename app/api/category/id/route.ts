import prisma from "@/utils/prisma";

const GET = async (_: Request) => {
    try {
        const data = await prisma.category.findMany({
            select: {
                id: true,
                name: true,
            }
        })

        return Response.json({msg: "Success", data})
    }
    catch (error) {
        console.error(error)
        return Response.json({msg: "GET category id error"}, {
            status: 500,
        })
    }
}

export {
    GET,
}