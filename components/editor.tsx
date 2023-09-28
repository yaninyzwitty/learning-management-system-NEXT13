"use client";
import dynamic from "next/dynamic";
import React, {useMemo} from "react";
import "react-quill/dist/quill.snow.css";

type Props = {
  onChange: (value: string) => void;
  value: string;
};

function Editor({onChange, value}: Props) {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), {ssr: false}),
    []
  );
  return (
    <div className="bg-white">
      <ReactQuill theme="snow" value={value} onChange={onChange} />
    </div>
  );
}

export default Editor;
