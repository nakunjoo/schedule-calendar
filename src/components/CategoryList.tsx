import React, { useState, useEffect } from "react";
import { CategoryData } from "@/stores/slices/category-slices";

export default function CategoryList({
  categoryList,
}: {
  categoryList: CategoryData[];
}) {
  return (
    <div className="p-4 absolute top-10 right-0 bg-white border border-black border-solid rounded z-20">
      <ul>
        {categoryList.map((category, index) => {
          return (
            <li key={index} className="flex justify-start items-center">
              <div
                className="w-4 h-4 rounded-full mr-2 my-1"
                style={{ backgroundColor: category.color }}
              ></div>
              <span>{category.name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
