"use client";
import Image from "next/image";
import { categoryItems } from "../lib/categoryItems";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";

export function MapFilterItems() {
  const searchParams = useSearchParams();
  const search = searchParams.get("filter");
  const pathname = usePathname();
  //   console.log("Search", search);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );
  return (
    <div className="flex gap-x-10 mt-5 w-full overflow-x-scroll no-scrollbar">
      {categoryItems.map((category) => (
        <Link
          href={pathname + "?" + createQueryString("filter", category.name)}
          key={category.id}
          className={cn(
            search === category.name
              ? "border-b-2 border-black pb-2 flex-shrink-0"
              : "opacity-70 flex-shrink-0",
            "flex flex-col gap-y-3 items-center"
          )}
        >
          <div className="relative w-6 h-6">
            <Image
              src={category.imageUrl}
              alt={category.name}
              className="w-6 h-6"
              width={24}
              height={24}
            />
          </div>
          <p className="text-xs font-medium">{category.title}</p>
        </Link>
      ))}
    </div>
  );
}
