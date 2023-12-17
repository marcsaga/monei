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

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (type === "number") {
      const number = e.target.valueAsNumber;
      setValue(Number.isNaN(number) ? null : number);
      return;
    }
    if (type === "date") {
      setValue(e.target.valueAsDate);
      return;
    }
    setValue(e.target.value);
  }

  return (
    <input
      className={`h-full ${
        type === "date" ? "w-auto" : "w-full"
      } border-none bg-transparent outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
      value={
        value instanceof Date
          ? value.toISOString().slice(0, 10)
          : (value as string) ?? ""
      }
      onChange={handleOnChange}
      onBlur={onBlur}
      type={type}
    />
  );
}
