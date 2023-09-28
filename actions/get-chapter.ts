import { db } from "@/db";
import { Attachment, Chapter } from "@prisma/client";

type Props = {
    userId: string;
    courseId: string;
    chapterId: string;
}

export const getChapter = async ({ userId, courseId, chapterId }: Props) => {
    try {
        const purchase = await db.purchase.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId
            }
        }
    });

    const course = await db.course.findUnique({
        where: {
            isPublished: true,
            id: courseId,
        },
        select: {
            price: true,

        }
    });
    const chapter = await db.chapter.findUnique({
        where: {
            id: chapterId,
            isPublished: true
        }
    });

    if(!chapter || !course) {
        throw new Error('chapter or course not found');
    };

    let muxData = null;
    let attachements:Attachment[] = [];
    let nextChapter:Chapter | null = null;
    if(purchase) {
        attachements = await db.attachment.findMany({
            where: {
              courseId: courseId
            }
          });
    }
    if(chapter.isFree || purchase) {
        muxData = await db.muxData.findUnique({
            where: {
                chapterId,

            }
        });
        nextChapter = await db.chapter.findFirst({
            where: {
                courseId,
                isPublished: true,
                position: {
                    gt: chapter?.position
                }
            },
            orderBy: {
                position: "asc"
            }
        })
    };

    const userProgress = await db.userProgress.findUnique({
        where: {
            userId_chapterId: {
                userId,
                chapterId
            }
        }
    });

    return {
        chapter,
        course,
        muxData,
        attachements, 
        nextChapter,
        userProgress,
        purchase
    }



        
    } catch (error) {
        console.log('[GET_CHAPTER]', error);
        return {
            chapter: null,
            course: null,
            muxData: null,
            attachments: [],
            nextChapter: null,
            userProgress: null,
            purchase: null
        }
        
    }
}