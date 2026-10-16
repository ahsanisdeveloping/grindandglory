"use client";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Check, ChevronDown } from "lucide-react";

export function FilterSelect({ label, value, options, onChange, className = "" }: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={`accounts-select ${className}`}>
      <Select
        className="account-filter-trigger"
        variant="standard"
        displayEmpty
        value={value}
        onChange={(event) => onChange(event.target.value)}
        inputProps={{ "aria-label": label }}
        IconComponent={ChevronDown}
        renderValue={() => options.find((option) => option.value === value)?.label ?? label}
        MenuProps={{
          disableScrollLock: true,
          transitionDuration: 140,
          slotProps: {
            paper: { className: "account-filter-menu" },
            list: { "aria-label": label },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value} className="account-filter-option" disableRipple>
            <span>{option.label}</span>
            <Check size={16} aria-hidden="true" className={option.value === value ? "filter-check" : "filter-check filter-check-hidden"} />
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}
