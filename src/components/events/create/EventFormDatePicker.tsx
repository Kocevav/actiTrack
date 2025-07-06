import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function EventFormDatePicker({
  label,
  value,
  onChange,
  required = false,
  disabled = false,
}: {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-neutral-200 font-medium">{label}</label>
      <DatePicker
        selected={value}
        onChange={onChange}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="Pp"
        placeholderText="Select date and time"
        className="w-full px-4 py-3 rounded-xl bg-neutral-800 text-white border border-neutral-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-400 outline-none transition"
        required={required}
        disabled={disabled}
      />
    </div>
  );
}
