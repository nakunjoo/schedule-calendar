"use client";
import React, { useState, useEffect } from "react";
import { OptionState } from "@/stores/slices/option-slices";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/stores/index";
import { addCategory, updateCategory, CategoryData } from "@/stores/slices/category-slices";

import { addCategoryDBData, updateCategoryDBData } from "@/lib/db";

export default function CategoryModal({
  categoryOpen,
  setCategoryOpen,
  userOptions,
}: {
  categoryOpen: string;
  setCategoryOpen: React.Dispatch<React.SetStateAction<string>>;
  userOptions: OptionState;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const categoryList = useSelector((state: RootState) => state.categoryReducer);

  const [colorPickerOpen, setColorPickerOpen] = useState<boolean>(false);
  const [categoryColor, setCategoryColor] = useState<string>("#3B82F6");
  const [categoryName, setCategoryName] = useState<string>("");
  
  const isEditMode = categoryOpen.startsWith('edit:');
  const editingCategoryId = isEditMode ? categoryOpen.replace('edit:', '') : null;
  const editingCategory = editingCategoryId ? categoryList.find(cat => cat.id === editingCategoryId) : null;

  // 카테고리 색상 팔레트
  const categoryColorPalettes = {
    basic: {
      name: '기본',
      colors: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']
    },
    soft: {
      name: '소프트',
      colors: ['#93C5FD', '#FCA5A5', '#6EE7B7', '#FCD34D', '#C4B5FD', '#F9A8D4', '#67E8F9', '#BEF264']
    },
    dark: {
      name: '다크',
      colors: ['#1E40AF', '#DC2626', '#059669', '#D97706', '#7C3AED', '#BE185D', '#0891B2', '#65A30D']
    },
    warm: {
      name: '따뜻한',
      colors: ['#F97316', '#DC2626', '#EAB308', '#16A34A', '#0EA5E9', '#8B5CF6', '#EC4899', '#84CC16']
    }
  };

  const [colorTab, setColorTab] = useState<string>('basic');

  // 편집 모드일 때 기존 카테고리 정보 로드
  useEffect(() => {
    if (isEditMode && editingCategory) {
      setCategoryName(editingCategory.name);
      setCategoryColor(editingCategory.color);
    } else {
      setCategoryName('');
      setCategoryColor('#3B82F6');
    }
  }, [isEditMode, editingCategory]);

  return (
    <div>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] transition-opacity duration-300"
        onClick={() => setCategoryOpen("")}
      />
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-visible">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: userOptions.themeColor }}
              >
                <Icon
                  icon="material-symbols:category-outline"
                  className="w-5 h-5 text-white"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                카테고리 {isEditMode ? "수정" : "추가"}
              </h3>
            </div>
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setCategoryOpen("")}
            >
              <Icon
                icon="heroicons:x-mark"
                className="w-5 h-5 text-gray-500"
              />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Category Name */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Icon icon="heroicons:tag" className="w-4 h-4" />
                카테고리 이름
              </label>
              <input
                type="text"
                placeholder="카테고리명을 입력해주세요"
                maxLength={50}
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-700"
              />
            </div>

            {/* Color Selection */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Icon icon="heroicons:swatch" className="w-4 h-4" />
                색상 선택
              </label>
              
              <div className="relative">
                <button
                  className="w-full h-12 rounded-xl border-2 border-gray-200 hover:border-gray-300 cursor-pointer transition-all duration-200 flex items-center px-4 gap-3"
                  onClick={() => setColorPickerOpen(!colorPickerOpen)}
                >
                  <div
                    className="w-6 h-6 rounded-full shadow-sm"
                    style={{ backgroundColor: categoryColor }}
                  />
                  <span className="text-gray-700 font-medium">{categoryColor}</span>
                  <Icon 
                    icon={colorPickerOpen ? "heroicons:chevron-up" : "heroicons:chevron-down"} 
                    className="w-4 h-4 text-gray-400 ml-auto" 
                  />
                </button>

                {colorPickerOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-[100]"
                      onClick={() => setColorPickerOpen(false)}
                    />
                    <div className="absolute top-14 left-0 right-0 z-[110] bg-white border border-gray-200 rounded-xl shadow-2xl p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">색상 팔레트</h4>
                      
                      {/* Color Tabs */}
                      <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1">
                        {Object.entries(categoryColorPalettes).map(([key, palette]) => (
                          <button
                            key={key}
                            className={`flex-1 py-2 px-2 text-xs font-medium rounded-md transition-all duration-200 ${
                              colorTab === key 
                                ? 'bg-white text-gray-800 shadow-sm' 
                                : 'text-gray-600 hover:text-gray-800'
                            }`}
                            onClick={() => setColorTab(key)}
                          >
                            {palette.name}
                          </button>
                        ))}
                      </div>
                      
                      {/* Color Grid */}
                      <div className="grid grid-cols-4 gap-2">
                        {categoryColorPalettes[colorTab as keyof typeof categoryColorPalettes].colors.map((color) => (
                          <button
                            key={color}
                            className={`w-10 h-10 rounded-lg border-2 hover:scale-110 transition-all duration-200 ${
                              categoryColor === color ? 'border-gray-400 scale-110' : 'border-gray-200 hover:border-gray-300'
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => {
                              setCategoryColor(color);
                              setColorPickerOpen(false);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-100 rounded-b-2xl">
              <button
                className="flex-1 px-4 py-3 text-gray-600 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setCategoryOpen("")}
              >
                취소
              </button>
              <button
                className="flex-1 px-4 py-3 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2"
                style={{ backgroundColor: userOptions.themeColor }}
                onClick={async () => {
                  if (!categoryName.trim()) {
                    alert("카테고리명을 입력해주세요.");
                    return;
                  }

                  if (isEditMode && editingCategory) {
                    // 편집 모드
                    const updatedCategory = {
                      ...editingCategory,
                      name: categoryName.trim(),
                      color: categoryColor,
                    };
                    
                    await updateCategoryDBData(editingCategory.id, updatedCategory);
                    dispatch(updateCategory(updatedCategory));
                  } else {
                    // 추가 모드
                    const randomStr = Math.random().toString(36).substring(2, 12);
                    const data = {
                      id: randomStr,
                      color: categoryColor,
                      name: categoryName.trim(),
                    };
                    
                    await addCategoryDBData(data);
                    dispatch(addCategory(data));
                  }
                  
                  setCategoryOpen("");
                  setCategoryName("");
                  setCategoryColor("#3B82F6");
                }}
              >
                <Icon icon={isEditMode ? "heroicons:pencil" : "heroicons:plus"} className="w-4 h-4" />
                {isEditMode ? "수정" : "추가"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
