"use client";

import React, { useState } from "react";

const SuggestionInputWithID = ({
  label,
  value,
  setId,
  fullWidth = false,
  suggestions = [],
  type = "text",
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setInputValue(inputValue);

    const filtered = suggestions.filter((suggestion) =>
      suggestion.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredSuggestions(filtered);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.name);
    setShowSuggestions(false);
    setId(suggestion._id);
  };

  const handleBlur = () => {
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault(); // Prevent default Tab behavior
      const nextIndex = selectedSuggestionIndex + 1;
      const lastIndex = filteredSuggestions.length - 1;
      if (nextIndex > lastIndex) {
        // Reached the last suggestion, cycle back to the beginning
        setSelectedSuggestionIndex(0);
      } else {
        setSelectedSuggestionIndex(nextIndex);
      }
    } else if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission on Enter
      const selectedSuggestion = filteredSuggestions[selectedSuggestionIndex];
      if (selectedSuggestion) {
        setInputValue(selectedSuggestion.name);
        setShowSuggestions(false);
        setId(selectedSuggestion._id);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault(); // Prevent scrolling on ArrowUp
      const prevIndex = selectedSuggestionIndex - 1;
      if (prevIndex >= 0) {
        setSelectedSuggestionIndex(prevIndex);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault(); // Prevent scrolling on ArrowDown
      const nextIndex = selectedSuggestionIndex + 1;
      if (nextIndex < filteredSuggestions.length) {
        setSelectedSuggestionIndex(nextIndex);
      }
    }
  };

  return (
    <div className="input-item">
      <label htmlFor="brandname" className="input-label">
        {label}
      </label>
      <input
        type={type}
        className={`input-box capitalize ${fullWidth ? "!w-full" : ""}`}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
      {showSuggestions && (
        <ul className="suggestion-list overflow-auto max-h-24 bg-white shadow-md mt-2 rounded-md capitalize">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={suggestion._id}
              className={`suggestion-item py-2 px-4 cursor-pointer hover:bg-gray-200 ${
                index === selectedSuggestionIndex ? "bg-gray-200" : ""
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseDown={(e) => e.preventDefault()} // Prevent input blur on suggestion click
              tabIndex="0"
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SuggestionInputWithID;
