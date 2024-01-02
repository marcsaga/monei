/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, type JSX, useEffect } from "react";
import { type CellContext } from "@tanstack/react-table";
import { useLocaleNumberFormatter } from "~/utils/formatters/number";

export function getInputEditableCell<T extends object>(
  { getValue, row: { index }, column: { id }, table }: CellContext<T, unknown>,
  type: React.HTMLInputTypeAttribute,
): JSX.Element {
  const {
    decimalSeparator,
    formatNumber,
    currencyToNumber,
    removeThousandSeparator,
  } = useLocaleNumberFormatter();
  const initialValue = getValue();
  const [value, setValue] = useState(
    type === "number" && typeof initialValue === "number"
      ? formatNumber(initialValue)
      : initialValue,
  );

  const onBlur = () => {
    let sendValue = value;
    if (type === "number" && typeof value === "string") {
      sendValue = currencyToNumber(value);
    }
    table.options.meta?.updateData(index, id, sendValue);

    if (type === "number") {
      setValue(formatNumber(Number(sendValue)));
    }
  };

  const onFocus = () => {
    if (type === "number" && typeof value === "string") {
      setValue(removeThousandSeparator(value));
    }
  };

  useEffect(() => {
    if (initialValue !== value) setValue(formatNumber(Number(initialValue)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue]);

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (type === "number") {
      setValue(formatNumberInputChange(e.target.value, decimalSeparator));
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
      onFocus={onFocus}
      onBlur={onBlur}
      type={type === "number" ? "text" : type}
    />
  );
}

function formatNumberInputChange(value: string, decimalSeparator: string) {
  switch (decimalSeparator) {
    case ",":
      return (
        value
          // Remove all dots and replace them with commas
          .replace(/\./g, ",")
          // Remove non-digit and non-comma characters
          .replace(/[^\d,]/g, "")
          // Remove extra commas and keep only the first one
          .replace(/(,.*)\,/g, "$1")
          // Limit to one comma after digits
          .replace(/(\d+,\d{2}).*/g, "$1")
      );
    case ".":
      return (
        value
          // Remove all commas and replace them with dots
          .replace(/\,/g, ".")
          // Remove non-digit and non-dot characters
          .replace(/[^\d.]/g, "")
          // Remove extra dots and keep only the first one
          .replace(/(\..*)\./g, "$1")
          // Limit to one dot after digits
          .replace(/(\d+\.\d{2}).*/g, "$1")
      );
    default:
      return value;
  }
}
