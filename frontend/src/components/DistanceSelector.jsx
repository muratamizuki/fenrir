import React from "react";
// optionsで使ってる　忘れる
const DistanceSelector = ({ options, selectedValue, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <label
          key={option.value}
          className={`
            flex items-center justify-center px-4 py-2 rounded-full cursor-pointer
            transition-colors duration-200 ease-in-out
            ${selectedValue === option.value
              ? "bg-pink-500 text-white"
              : "bg-white text-pink-600 hover:bg-pink-100"}
          `}
        >
          <input
            type="radio"
            name="distance"
            value={option.value}
            checked={selectedValue === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};

export default DistanceSelector;

