import type { InputHTMLAttributes } from "react";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export default function TextInput({
  className = "",
  error,
  id,
  label,
  ...props
}: TextInputProps) {
  const inputId = id ?? props.name ?? label;

  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        id={inputId}
        className={[
          "min-h-11 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-950 outline-none transition",
          "placeholder:text-slate-400 hover:border-slate-300",
          "focus:border-brand-500 focus:ring-2 focus:ring-brand-100",
          "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70",
          error ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "",
          className,
        ].join(" ")}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </label>
  );
}
