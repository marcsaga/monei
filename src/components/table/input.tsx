/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, type JSX } from "react";
import { type CellContext } from "@tanstack/react-table";

export function getInputEditableCell<T extends object>(
  { getValue, row: { index }, column: { id }, table }: CellContext<T, unknown>,
  type: React.HTMLInputTypeAttribute,
): JSX.Element {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    table.options.meta?.updateData(index, id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      className={`h-full ${
        type === "date" ? "w-auto" : "w-full"
      } border-none bg-transparent outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
      value={value as string}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      type={type}
    />
  );
}
