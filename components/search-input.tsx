"use client";

import {Search} from "lucide-react";
import {Input} from "./ui/input";
import qs from "query-string";
import {useEffect, useState} from "react";
import {useDebounce} from "@/hooks/use-debounce";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

function SearchInput() {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, 500);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: currentCategoryId,
          title: debouncedValue,
        },
      },
      {skipEmptyString: true, skipNull: true}
    );
    router.push(url);
  }, [debouncedValue, currentCategoryId, router, pathname]);
  return (
    <div className="relative ">
      <Search className="w-4 h-4 absolute top-3 left-3 text-slate-300" />
      <Input
        className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200 "
        placeholder="Search for a course"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}

export default SearchInput;
