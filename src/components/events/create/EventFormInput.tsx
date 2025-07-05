import React from "react";

export function EventFormInput({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  textarea?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-neutral-200 font-medium">{label}</label>
      {textarea ? (
        <textarea
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl bg-neutral-800 text-white border border-neutral-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-400 outline-none transition resize-none min-h-[90px]"
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
        />
      ) : (
        <input
          type="text"
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl bg-neutral-800 text-white border border-neutral-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-400 outline-none transition"
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
        />
      )}
    </div>
  );
}
