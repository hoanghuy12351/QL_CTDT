import type { SelectHTMLAttributes } from "react";

export type SelectOption = {
  label: string;
  value: string | number;
};

type SelectInputProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
};

export default function SelectInput({
  className = "",
  error,
  id,
  label,
  options,
  placeholder = "Chọn giá trị",
  required,
  ...props
}: SelectInputProps) {
  const inputId = id ?? props.name ?? label;

  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">
        {label}
        {required ? <span className="ml-1 text-red-500">*</span> : null}
      </span>

      <select
        id={inputId}
        aria-invalid={Boolean(error)}
        className={[
          "min-h-11 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-950 outline-none transition",
          "hover:border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100",
          "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70",
          error ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "",
          className,
        ].join(" ")}
        required={required}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={String(option.value)} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </label>
  );
}
