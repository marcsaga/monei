/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, type JSX, useEffect } from "react";
import { type CellContext } from "@tanstack/react-table";
import { TagComponent, generateTagColor } from "../tag";
import { useClickOutside } from "~/hooks/use-click-outside";
import { api } from "~/utils/api";
import { type CategoryColor, type Category } from "~/utils/interfaces";
import { CrossIcon } from "../icon";
import { useExpenseFilters } from "~/pages/expenses";

function useListCategories(_type: "expense" | "income") {
  return api.category.listExpenseCategories.useQuery({}, { staleTime: 60_000 });
}

function useCurrentViewFilters(_type: "expense" | "income") {
  return useExpenseFilters();
}

function useCurrentListContext(_type: "expense" | "income") {
  const context = api.useContext();
  return context.expense.list;
}

export type CategoryInputUpdateData =
  | { type: "update"; id: string | null }
  | { type: "create"; color: CategoryColor; name: string };

export function getCategoryInputCell<T extends object>(
  { getValue, row: { index }, column: { id }, table }: CellContext<T, unknown>,
  type: "expense" | "income",
): JSX.Element {
  const selectedCategory = getValue() as Category | undefined;
  const [activeCategory, setActiveCategory] = useState(selectedCategory);
  const [newCategory, setNewCategory] = useState("");
  const [showSelector, setShowSelector] = useState(false);

  const dropdownRootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const { data } = useListCategories(type);
  const { filters } = useCurrentViewFilters(type);
  const listContext = useCurrentListContext(type);
  const context = api.useContext();

  useClickOutside(dropdownRootRef, () => setShowSelector(false));

  const deleteCategory = api.category.deleteCategory.useMutation({
    onMutate: ({ id }) => {
      context.category.listExpenseCategories.setData(
        {},
        (prev) => prev?.filter((category) => category.id !== id),
      );
      listContext.setData(
        filters,
        (prev) =>
          prev?.map((obj) => ({
            ...obj,
            category: obj.category?.id === id ? undefined : obj.category,
          })),
      );
    },
    onSuccess: () => {
      void context.category.listExpenseCategories.invalidate();
      void listContext.invalidate();
    },
  });

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

  function onDeleteCategory(id: string) {
    deleteCategory.mutate({ id });
  }

  useEffect(() => {
    setActiveCategory(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    function onEnter(e: KeyboardEvent) {
      if (e.key === "Enter") {
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
    <div className="relative">
      <div className="cursor-pointer" onClick={() => setShowSelector(true)}>
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
              <input
                ref={inputRef}
                className="h-full w-full bg-gray-200 outline-none"
                onChange={handleOnChange}
                value={newCategory}
              />
            )}
          </div>
          <span className="px-4 py-2 text-xs text-gray-500">
            Select an option or create one
          </span>
          <ul className="pb-2">
            {data?.map((tag) => (
              <li
                key={tag.id}
                className="flex cursor-pointer items-center justify-between px-4 py-1 hover:bg-gray-100"
                onClick={() => onSelectCategory(tag.id)}
              >
                <TagComponent {...tag} />
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    onDeleteCategory(tag.id);
                  }}
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
