import {isTeacher} from "@/lib/teacher";
import {auth} from "@clerk/nextjs";
import {redirect} from "next/navigation";
import React from "react";

async function TeacherLayout({children}: {children: React.ReactNode}) {
  const {userId} = auth();
  if (!isTeacher(userId)) {
    return redirect("/");
  }
  return <>{children}</>;
}

export default TeacherLayout;
