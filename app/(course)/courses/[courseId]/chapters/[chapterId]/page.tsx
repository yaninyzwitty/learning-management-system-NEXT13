import {getChapter} from "@/actions/get-chapter";
import Banner from "@/components/banner";
import Preview from "@/components/preview";
import {Separator} from "@/components/ui/separator";
import {auth} from "@clerk/nextjs";
import {File} from "lucide-react";
import {redirect} from "next/navigation";
import CourseEnrollButton from "./_components/course-enroll-button";
import VideoPlayer from "./_components/video-player";
import {CourseProgress} from "@/components/course-progress";
import CourseProgressButton from "./_components/course-progress-button";

async function ChapterIdPage({
  params: {courseId, chapterId},
}: {
  params: {courseId: string; chapterId: string};
}) {
  const {userId} = auth();
  if (!userId) return redirect("/");

  const {
    chapter,
    course,
    muxData,
    attachements,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId,
    courseId,
    chapterId,
  });

  if (!chapter || !course) return redirect(`/`);

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;
  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner label="You already completed this chapter" variant={"sucess"} />
      )}
      {isLocked && (
        <Banner
          label="You need to purchase this course to watch this chapter"
          variant={"warning"}
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={chapterId}
            title={chapter.title}
            courseId={courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
            {purchase ? (
              // todo add course progrss buttin
              <CourseProgressButton
                chapterId={chapterId}
                courseId={courseId}
                nextChapterId={nextChapter?.id!}
                isCompleted={userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton courseId={courseId} price={course.price!} />
            )}
          </div>
          <Separator />
          <div>
            <Preview value={chapter.description!} />
          </div>
          {!!attachements && (
            <>
              <Separator />
              <div className="p-4">
                {!!attachements.length && (
                  <>
                    <Separator />
                    <div className="p-4">
                      {attachements.map((attachment) => (
                        <a
                          href={attachment.url}
                          target="_blank"
                          key={attachment.id}
                          className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                        >
                          <File />
                          <p className="line-clamp-1">{attachment.name}</p>
                        </a>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChapterIdPage;
