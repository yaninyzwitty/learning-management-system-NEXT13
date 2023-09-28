import { db } from "@/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PUT(request:Request, { params: { courseId, chapterId }}: { params: { chapterId: string, courseId: string}}) {
    try {
        const { userId } = auth();
        const { isCompleted } = await request.json();
        if(!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        
        };

        const userProgress = await db.userProgress.upsert({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId
                }
            },
            update: {
                isCompleted,
            },
            create: {
                userId,
                chapterId,
                isCompleted
            }
        });

        return NextResponse.json(userProgress);

        
        
    } catch (error) {
        console.log('[CHAPTER ID PROGRESS ]', error);
        return new NextResponse('iNTERNAL ERROR', { status: 500})
        
    }
}