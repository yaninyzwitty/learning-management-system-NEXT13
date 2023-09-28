"use client";
import {useConfettiStore} from "@/hooks/use-confetti-store";
import {cn} from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import axios from "axios";
import {Loader2, Lock} from "lucide-react";
import {useRouter} from "next/navigation";
import {useState} from "react";
import toast from "react-hot-toast";

type Props = {
  playbackId: string;
  courseId: string;
  title: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
};
function VideoPlayer({
  playbackId,
  courseId,
  chapterId,
  nextChapterId,
  title,
  isLocked,
  completeOnEnd,
}: Props) {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapterId}/progress`,
          {
            isCompleted: true,
          }
        );
      }

      if (!nextChapterId) {
        confetti.onOpen();
        toast.success("Progress updated");

        router.refresh();
      }
      if (nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="relative aspect-video">
      {!isLocked && !isReady && (
        <div className="absolute inset-0 flex justify-center bg-slate-800 items-center">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center bg-slate-800 justify-center flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      {!isLocked && (
        <MuxPlayer
          title={title}
          className={cn(!isReady && "hidden")}
          onCanPlay={() => setIsReady(true)}
          onEnded={onEnd}
          autoPlay
          playbackId={playbackId}
        />
      )}
    </div>
  );
}

export default VideoPlayer;
