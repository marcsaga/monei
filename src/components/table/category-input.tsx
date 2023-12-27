/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, type JSX, useEffect, useCallback } from "react";
import { type CellContext } from "@tanstack/react-table";
import { TagComponent } from "../tag";
import { useClickOutside } from "~/hooks/use-click-outside";
import {
  type CategoryColor,
  type Category,
  type CategoryType,
  colors,
} from "~/utils/interfaces";
import { CrossIcon } from "../icon";
import {
  useDeleteExpenseCategory,
  useListExpenseCategories,
  useListInvestmentCategories,
} from "~/hooks/api/categories";
import { useMonthlyFilters } from "~/hooks/use-monthly-filters";

function useListCategories(type: CategoryType) {
  return type === "investment"
    ? useListInvestmentCategories()
    : useListExpenseCategories();
}

export type CategoryInputUpdateData =
  | { type: "update"; id: string | null }
  | { type: "create"; color: CategoryColor; name: string };

export function getCategoryInputCell<T extends object>(
  { getValue, row: { index }, column: { id }, table }: CellContext<T, unknown>,
  type: CategoryType,
): JSX.Element {
  const selectedCategory = getValue() as Category | undefined;
  const [activeCategory, setActiveCategory] = useState(selectedCategory);
  const [newCategory, setNewCategory] = useState("");
  const [showSelector, setShowSelector] = useState(false);

  const dropdownRootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const { filters } = useMonthlyFilters();
  const { data } = useListCategories(type);
  const deleteCategory = useDeleteExpenseCategory(type, filters);
  const generateTagColor = useGenerateTagColor(type);

  const canCreateNewCategory = !!data && data.length < colors.length;

  useClickOutside(dropdownRootRef, () => setShowSelector(false));

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewCategory(e.target.value);
  }

  function onCloseCategory() {
    table.options.meta?.updateData(index, id, { type: "update", id: null });
    setActiveCategory(undefined);
  }

  function onSelectCategory(tagId: string) {
    const category = data?.find((c) => c.id === tagId);
    setActiveCategory(category);
    table.options.meta?.updateData(index, id, { type: "update", id: tagId });
    setShowSelector(false);
  }

  function handleOnDeleteCategory(event: React.BaseSyntheticEvent, id: string) {
    event.stopPropagation();
    deleteCategory.mutate({ id });
  }

  useEffect(() => {
    setActiveCategory(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    function onEnter(e: KeyboardEvent) {
      if (inputRef.current?.contains(e.target as Node) && e.key === "Enter") {
        e.preventDefault();
        const newCategoryValue = newCategory.trim();
        if (newCategoryValue) {
          const category = {
            name: newCategoryValue,
            color: generateTagColor(),
          };
          table.options.meta?.updateData(index, id, {
            type: "create",
            ...category,
          });
          setActiveCategory({ ...category, id: "tmp-id" });
        }
        setNewCategory("");
        setShowSelector(false);
      }
    }

    addEventListener("keydown", onEnter);
    return () => {
      removeEventListener("keydown", onEnter);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputRef, newCategory]);

  return (
    <div className="relative w-40">
      <div
        className="cursor-pointer"
        onClick={() => setShowSelector(true)}
        tabIndex={0}
        onKeyDown={(e) =>
          e.key === "Enter" ? setShowSelector(true) : undefined
        }
      >
        {activeCategory ? (
          <TagComponent {...activeCategory} />
        ) : (
          <span className="text-gray-300">Select a category</span>
        )}
      </div>
      {showSelector && (
        <div
          ref={dropdownRootRef}
          className="absolute left-0 top-0 z-10 flex w-64 flex-col border-gray-100 bg-white shadow outline-none"
        >
          <div className="flex h-10 items-center border-b border-gray-100 bg-gray-200 px-4">
            {activeCategory ? (
              <TagComponent {...activeCategory} onClose={onCloseCategory} />
            ) : (
              canCreateNewCategory && (
                <input
                  ref={inputRef}
                  className="h-full w-full bg-gray-200 outline-none"
                  onChange={handleOnChange}
                  value={newCategory}
                />
              )
            )}
          </div>
          <span className="px-4 py-2 text-xs text-gray-500">
            {canCreateNewCategory
              ? "Select an option or create one"
              : "Select an option"}
          </span>
          <ul className="max-h-[154px] overflow-auto pb-2">
            {data?.map((tag) => (
              <li
                tabIndex={0}
                key={tag.id}
                className="flex cursor-pointer items-center justify-between px-4 py-1 hover:bg-gray-100"
                onClick={() => onSelectCategory(tag.id)}
                onKeyDown={(e) =>
                  e.key === "Enter" ? onSelectCategory(tag.id) : undefined
                }
              >
                <TagComponent {...tag} />
                <button
                  onClick={(evt) => handleOnDeleteCategory(evt, tag.id)}
                  onKeyDown={(e) =>
                    e.key === "Enter"
                      ? handleOnDeleteCategory(e, tag.id)
                      : undefined
                  }
                >
                  <CrossIcon className="h-3 w-3" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function useGenerateTagColor(type: CategoryType) {
  const { data } = useListCategories(type);
  const generate = useCallback(() => {
    const usedColors = new Set(data?.map((category) => category.color) ?? []);
    const availableColors = colors.filter((color) => !usedColors.has(color));

    return (
      availableColors[Math.floor(Math.random() * availableColors.length)] ??
      "red"
    );
  }, [data]);

  return generate;
}
