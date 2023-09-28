import { db } from "@/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params: { courseId, chapterId}}: { params: { courseId: string, chapterId: string}}) {
    try {
        const { userId } = auth();
        if(!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        
        };
        const ownCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        });
        if(!ownCourse) {
            return new NextResponse('Unauthorized', { status: 401 })
        
        };

    

        const unpublishedChapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId,
            }, 
            data: {
                isPublished: false 
            }
        });
        
        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId,
                isPublished: true,
            }
        });
        if(!publishedChaptersInCourse) {
            await db.course.update({
                where: {
                    id: courseId,

                },
                data: {
                    isPublished: false
                }
            })
        }



        return NextResponse.json(unpublishedChapter);


        
    } catch (error) {
        console.log('[CHAPTER_UnPuBLISH]', error);
        return new NextResponse('Internal error', { status: 500})
        
    }
}