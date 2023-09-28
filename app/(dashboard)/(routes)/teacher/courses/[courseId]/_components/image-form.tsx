"use client";

import * as z from "zod";
import axios from "axios";
import {Pencil, PlusCircle, ImageIcon} from "lucide-react";
import {useState} from "react";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import {Course} from "@prisma/client";
import Image from "next/image";

import {Button} from "@/components/ui/button";
import {CldUploadButton} from "next-cloudinary";

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

export const ImageForm = ({initialData, courseId}: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Course updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course image
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add an image
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit image
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="Upload"
              fill
              className="object-cover rounded-md"
              src={initialData.imageUrl}
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <CldUploadButton
            options={{maxFiles: 1}}
            // @ts-ignore
            onUpload={(result) => onSubmit({imageUrl: result.info?.secure_url})}
            className="flex items-center gap-2 p-2 shadow-md shadow-gray-400"
            uploadPreset="ww1dyjv5"
          >
            <ImageIcon size={30} className="text-sky-500" />
            <h2 className="text-sm text-muted-foreground">Upload Image</h2>
          </CldUploadButton>
          <div className="text-xs text-muted-foreground mt-4">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
};
