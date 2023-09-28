"use client";
import {Button} from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {cn} from "@/lib/utils";
import {zodResolver} from "@hookform/resolvers/zod";
import {Course} from "@prisma/client";
import axios from "axios";
import {PencilIcon} from "lucide-react";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {useForm} from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
type Props = {
  initialData: Course;
  courseId: string;
};
const formSchema = z.object({
  description: z.string().min(2, {
    message: "Description is required",
  }),
});

function DescriptionForm({initialData: {description}, courseId}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const toggleEdit = () => setIsEditing((prev) => !prev);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: description || "",
    },
  });

  const {isSubmitting, isValid} = form.formState;
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      form.reset();
      toast.success("Course description updated successfully");
      toggleEdit();
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="mt-6 bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course description
        <Button variant={"ghost"} onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <PencilIcon className="text-sm mt-2" />
              Edit description
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            `text-sm mt-2 `,
            !description && "text-slate-500 italic"
          )}
        >
          {description || "No Description"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-8"
          >
            <FormField
              control={form.control}
              name="description"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="e.g 'this course is about...'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="fle items-center gap-x-2">
              <Button disabled={isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}

export default DescriptionForm;
