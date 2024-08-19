import React from "react";

const InputContainer = ({
  label,
  value,
  onChange,
  type = "text",
  fullWidth = false,
  disabled = false,
}) => {
  return (
    <div className="input-item">
      <label htmlFor="brandname" className="input-label">
        {label}
      </label>
      <input
        type={type}
        className={`input-box ${fullWidth ? "!w-full" : ""}`}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
};

export default InputContainer;
