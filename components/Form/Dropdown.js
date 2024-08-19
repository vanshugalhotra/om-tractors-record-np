import React from "react";

export const Dropdown = ({
  label,
  toggleDropDown,
  value,
  isOpen,
  options,
  setOption,
}) => {
  return (
    <div className="input-item w-full">
      <label htmlFor="brand" className="input-label">
        {label}
      </label>
      {/* dropdown */}
      <div className="relative">
        <div className="py-2 px-2 my-1 rounded-md shadow-sm">
          <button
            type="button"
            className="flex justify-between w-full gap-x-1.5 rounded-md py-3 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 outline-none"
            id="menu-button-sort"
            aria-expanded="true"
            aria-haspopup="true"
            onClick={() => {
              toggleDropDown();
            }}
          >
            <span className="ml-4">{value}</span>
            <svg
              className="mr-4 h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div
          className={`${
            isOpen ? "block" : "hidden"
          } transition-all duration-150 ease-out absolute right-0 z-10 w-full origin-top-right rounded-md bg-gray-100 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none capitalize `}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex="-1"
        >
          <div className="py-1 cursor-pointer" role="none">
            {options.map((name) => {
              return (
                <div
                  key={name}
                  onClick={() => {
                    setOption(name); // Set the selected option
                    toggleDropDown();
                  }}
                  className="text-gray-700 block px-4 py-2 text-sm transition-all duration-150 ease-out hover:bg-gray-200 outline-none bg-inherit cursor-pointer w-full"
                  role="menuitem"
                  tabIndex="-1"
                >
                  {name}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
