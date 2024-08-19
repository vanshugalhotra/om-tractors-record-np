// components/DobPicker.js
import React from 'react';
import DatePicker from 'react-datepicker';
import { CiCalendarDate } from 'react-icons/ci'; // Import CiCalendarDate icon
import 'react-datepicker/dist/react-datepicker.css';

const DobPicker = ({ selectedDate, onChange }) => {
  return (
    <div className="relative">
      <DatePicker
        selected={selectedDate}
        onChange={onChange}
        showYearDropdown
        dateFormat="yyyy-MM-dd" // MongoDB compatible date format
        maxDate={new Date()} // Optional: Set max date as today
        className="block w-full px-3 py-2 text-base placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 relative z-10" // Add z-10 here
        popperClassName="date-picker-popper" // Add custom class name for popper
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-20">
        <CiCalendarDate className="w-6 h-6" />
      </div>
    </div>
  );
};

export default DobPicker;
