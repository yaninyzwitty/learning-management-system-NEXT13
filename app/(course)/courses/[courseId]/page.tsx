import {db} from "@/db";
import {redirect} from "next/navigation";
import React from "react";

type Props = {
  params: {
    courseId: string;
  };
};

async function CoursePage({params: {courseId}}: Props) {
  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });
  if (!course) return redirect("/");

  return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`);
}

export default CoursePage;
