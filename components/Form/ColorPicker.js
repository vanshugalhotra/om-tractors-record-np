"use client";
import { FaPalette } from "react-icons/fa";

const ColorPicker = ({ label, color, setColor }) => {
  const handleChange = (e) => {
    setColor(e.target.value);
  };

  return (
    <div className="input-item">
      <label className="input-label flex items-center space-x-2">
        <FaPalette className="text-xl text-gray-700" />
        <span>{label}</span>
      </label>
      <div className="flex items-center space-x-2">
        <input
          type="color"
          value={color}
          onChange={handleChange}
          className="input-box w-16 h-16 p-1 cursor-pointer border-none rounded-lg"
        />
        <span className="text-base font-medium text-gray-600">{color}</span>
      </div>
    </div>
  );
};

export default ColorPicker;
