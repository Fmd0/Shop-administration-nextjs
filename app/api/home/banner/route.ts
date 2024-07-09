import prisma from "@/utils/prisma";
import z from "zod"

const HomeBannerSchema = z.object({
    id: z.string(),
    image: z.string(),
    logo: z.string(),
    isCommodity: z.coerce.boolean(),
    row: z.enum(["ROW0", "ROW1", "ROW2"]),
    relativeId: z.string(),
})

const CreateHomeBannerSchema = HomeBannerSchema.omit({
    id: true,
}).partial({
    image: true,
    logo: true,
})


export const UpdateHomeBannerSchema = HomeBannerSchema.omit({
    id: true,
    relativeId: true,
}).partial({
    image: true,
    logo: true,
})

const GetHomeBannerSchema = z.object({
    row: z.enum(["ALL", "ROW0", "ROW1", "ROW2"])
})


const GET = async(req: Request) => {
    try {
        const pageSize = 6;
        const urlParams = new URLSearchParams(new URL(req.url).search);
        const page = Number(urlParams.get("page") || 1);

        let skip = {};
        let take = {};
        const getAll = urlParams.get("getAll") || "";
        if(getAll === "") {
            skip = {skip : (page-1)*pageSize};
            take = {take: pageSize}
        }

        let filterObj = {};
        const parseResult =
            GetHomeBannerSchema.safeParse({
                row: urlParams.get("row") || ""
            });
        if (parseResult.success) {
            if(parseResult.data.row !== "ALL") {
                filterObj = parseResult.data;
            }
        }

        // console.log(filterObj);

        const {_count: count} = await prisma.homeBanner.aggregate({
            _count: true,
            where: {
                ...filterObj
            }
        })
        const totalPages = Math.ceil(count / pageSize);

        const data = await prisma.homeBanner.findMany({
            ...skip,
            ...take,
            orderBy: {
                createdAt: "asc"
            },
            where: {
                ...filterObj
            },
            select: {
                id: true,
                relativeId: true,
                image: true,
                logo: true,
                isCommodity: true,
                row: true,
            }
        });

        return Response.json({msg: "success", totalPages, data}, {
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        });
    }
    catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ msg: "GET home banner error" }), {
            status: 500,
        })
    }
}


const POST = async(req: Request) => {
    try {
        const formData = await req.formData();
        // console.log(Object.fromEntries(formData));
        const parseResult =
            CreateHomeBannerSchema.safeParse(Object.fromEntries(formData));

        if (!parseResult.success) {
            console.log(parseResult.error.flatten().fieldErrors);
            return new Response(JSON.stringify(parseResult.error.flatten().fieldErrors), {
                status: 500,
            })
        }

        // console.log(parseResult.data);

        let relativeData;
        if(parseResult.data.isCommodity) {
            relativeData = await prisma.commodity.findUnique({
                where: {
                    id: parseResult.data.relativeId,
                }
            })
        }
        else {
            relativeData = await prisma.market.findUnique({
                where: {
                    id: parseResult.data.relativeId,
                }
            })
        }
        if(relativeData === null) {
            return new Response(JSON.stringify({msg: "Relative id not valid"}), {
                status: 500,
            })
        }

        const data = await prisma.homeBanner.create({
            data: {
                ...parseResult.data,
            }
        })
        return Response.json({msg: "Success", data});
    }
    catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ msg: "POST home banner error" }), {
            status: 500,
        })
    }
}

export {
    GET,
    POST
}