import React from "react";

const CheckboxGroup = ({ options, checkedStates, onChange }) => (
  <div className="grid grid-cols-2 gap-2">
    {options.map((option) => (
      <label
        key={option.value}
        className={`
          flex items-center p-2 rounded-lg cursor-pointer
          transition-colors duration-200 ease-in-out
          ${checkedStates[option.value]
            ? "bg-pink-100 text-pink-600"
            : "bg-white text-gray-700 hover:bg-pink-50"}
        `}
      >
        <input
          type="checkbox"
          checked={checkedStates[option.value]}
          onChange={() => onChange(option.value)}
          className="sr-only"
        />
        <span className={`w-4 h-4 mr-2 rounded border ${
          checkedStates[option.value]
            ? "bg-pink-500 border-pink-500"
            : "border-gray-300"
        }`}>
          {checkedStates[option.value] && (
            <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </span>
        {option.label}
      </label>
    ))}
  </div>
);

export default CheckboxGroup;

