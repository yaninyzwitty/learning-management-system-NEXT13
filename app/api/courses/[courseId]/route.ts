import { db } from "@/db";
import { auth } from "@clerk/nextjs";
import Mux from "@mux/mux-node"
import { NextResponse } from "next/server";
const { Video } = new Mux(
    process.env.MUX_TOKEN_ID!,
    process.env.MUX_TOKEN_SECRET!,
);



export async function DELETE (req: Request, { params: { courseId }}: { params: { courseId: string}}) {
    try {
        const { userId } = auth();
        if(!userId) {
            return new Response('Unauthorized', { status: 401 });
        };

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            },
            include: {
                chapters: {
                    include: {
                        muxData: true
                    }
                }
            }
        });
        if(!course) {
            return new NextResponse('Not found', { status: 404 })
        };

        for (const chapter of course.chapters) {
            if(chapter.muxData?.assetId) {
                await Video.Assets.del(chapter.muxData.assetId);
            }
        };
        const deletedCourse = await db.course.delete({
            where: {
                id: courseId,
            }
        });

        return NextResponse.json(deletedCourse);




        
    } catch (error) {
        console.log('[COURSE_IDELETE]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
        
    
}

export async function PATCH (req: Request, { params: { courseId }}: { params: { courseId: string}}) {
    try {
        const { userId } = auth();
        const values = await req.json();
        
        if(!userId) {
            return new Response('Unauthorized', { status: 401 });
        }
        if(!values) {
            return new NextResponse("Values required", { status: 400 });
        }
        const course = await db.course.update({
            where: {
                id: courseId,
                userId
            },
            data: {
                ...values,
            }
        });

        return NextResponse.json(course);




    }
        
     catch (error) {
        console.log(error);
        return new NextResponse('Internal Error', { status: 500 });
    }
    

}