import {db} from "@/db";
export const getProgress = async (
  userId: string,
  courseId: string
): Promise<number> => {
  try {
    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });
    // select the id only form there
    const publishedChapterIds = publishedChapters.map(({id}) => id);
    const validCompletedChapters = await db.userProgress.count({
      where: {
        userId,
        chapterId: {in: publishedChapterIds},
        isCompleted: true,
      },
      // loading chapter ids from this list of chapters
    });
    const progressPercentage =
      (validCompletedChapters / publishedChapterIds.length) * 100;
    return progressPercentage;
  } catch (error) {
    console.log("[GET_PROGRESS]", error);
    return 0;
  }
};
