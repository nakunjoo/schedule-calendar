import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { CategoryData } from "@/stores/slices/category-slices";
import { OptionState } from "@/stores/slices/option-slices";

export default function CategoryList({
  categoryList,
  setCategoryModalOpen,
  userOptions,
  onClose,
}: {
  categoryList: CategoryData[];
  setCategoryModalOpen: React.Dispatch<React.SetStateAction<string>>;
  userOptions: OptionState;
  onClose?: () => void;
}) {
  return (
    <div className="absolute sm:top-12 top-8 left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-2xl z-30 overflow-hidden">
      <div className="sm:p-6 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon 
              icon="material-symbols:category-outline" 
              className="w-5 h-5 text-gray-600" 
            />
            <h3 className="text-lg font-semibold text-gray-800">카테고리 목록</h3>
          </div>
          <button
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={onClose}
          >
            <Icon
              icon="material-symbols:close"
              className="w-5 h-5 text-gray-500"
            />
          </button>
        </div>
        
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {categoryList.map((category, index) => (
            <div
              key={index}
              className="flex items-center gap-3 sm:p-3 p-2 rounded-xl hover:bg-gray-50 transition-colors duration-200 group cursor-pointer border border-transparent hover:border-gray-200"
              onClick={() => setCategoryModalOpen(`edit:${category.id}`)}
            >
              <div
                className="w-4 h-4 rounded-full shadow-sm group-hover:shadow-md transition-shadow duration-200"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-200">
                {category.name}
              </span>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Icon 
                  icon="heroicons:chevron-right" 
                  className="w-4 h-4 text-gray-400" 
                />
              </div>
            </div>
          ))}
          
          {categoryList.length === 0 && (
            <div className="text-center py-8">
              <Icon 
                icon="material-symbols:category-outline" 
                className="w-12 h-12 text-gray-300 mx-auto mb-3" 
              />
              <p className="text-gray-500 font-medium">등록된 카테고리가 없습니다</p>
              <p className="text-gray-400 text-sm mt-1">새로운 카테고리를 추가해보세요</p>
            </div>
          )}
        </div>
        
        <div className="sm:mt-4 mt-2 sm:pt-4 pt-2 border-t border-gray-100">
          <button 
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:opacity-90"
            style={{ backgroundColor: userOptions.themeColor }}
            onClick={() => setCategoryModalOpen("add")}
          >
            <Icon icon="heroicons:plus" className="w-4 h-4" />
            <span>새 카테고리 추가</span>
          </button>
        </div>
      </div>
    </div>
  );
}
