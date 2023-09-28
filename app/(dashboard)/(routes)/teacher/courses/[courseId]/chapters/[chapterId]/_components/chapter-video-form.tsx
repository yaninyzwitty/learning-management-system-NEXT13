"use client";

import {Chapter, MuxData} from "@prisma/client";
import axios from "axios";
import {Pencil, PlusCircle, VideoIcon} from "lucide-react";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {useState} from "react";
import toast from "react-hot-toast";
import * as z from "zod";

import {Button} from "@/components/ui/button";
import {CldUploadButton} from "next-cloudinary";
import MuxPlayer from "@mux/mux-player-react";

interface ChapterVideoFormProps {
  initialData: Chapter & {muxData?: MuxData | null};
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success("Chapter updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <VideoIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <MuxPlayer playbackId={initialData.muxData?.playbackId || ""} />
          </div>
        ))}
      {isEditing && (
        <div>
          <CldUploadButton
            options={{maxFiles: 1}}
            // @ts-ignore
            onUpload={(result) => onSubmit({videoUrl: result.info?.secure_url})}
            className="flex items-center gap-2 p-2 shadow-md shadow-gray-400"
            uploadPreset="ww1dyjv5"
          >
            <VideoIcon size={30} className="text-sky-500" />
            <h2 className="text-sm text-muted-foreground">Upload video</h2>
          </CldUploadButton>
          <div className="text-xs text-muted-foreground mt-4">
            Upload this chapters video
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Video can take a few minutes to process. Refresh the page if video
          doesnt appear
        </div>
      )}
    </div>
  );
};
