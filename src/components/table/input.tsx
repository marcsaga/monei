/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, type JSX } from "react";
import { type CellContext } from "@tanstack/react-table";

export function getInputEditableCell<T extends object>(
  { getValue, row: { index }, column: { id }, table }: CellContext<T, unknown>,
  type: React.HTMLInputTypeAttribute,
): JSX.Element {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    const sendValue =
      type === "number" && !Number.isNaN(value) ? Number(value) : value;
    table.options.meta?.updateData(index, id, sendValue);
  };

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (type === "number") {
      const newValue = e.target.value
        .replace(/\,/g, ".")
        .replace(/[^0-9.]|(?<=.\d\d)\d+$/g, "");
      setValue(newValue);
      return;
    }
    setValue(e.target.value);
  }

  return (
    <input
      className={`h-full ${
        type === "date" ? "w-auto" : "w-full"
      } border-none bg-transparent outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
      value={(value as string) ?? ""}
      onChange={handleOnChange}
      onBlur={onBlur}
      type={type === "number" ? "text" : type}
    />
  );
}
