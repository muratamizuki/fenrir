import React, { useState } from "react";
import CheckboxGroup from "./CheckboxGroup";

const App = () => {
  const options = [
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
    { value: "angular", label: "Angular" },
    { value: "svelte", label: "Svelte" },
  ];

  const [selectedOptions, setSelectedOptions] = useState({});

  const handleCheckboxGroupChange = (newStates) => {
    setSelectedOptions(newStates);
    console.log("Selected options:", newStates);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>チェックボックスグループ</h1>
      <CheckboxGroup options={options} onChange={handleCheckboxGroupChange} />
      <h2>選択された項目:</h2>
      <ul>
        {Object.entries(selectedOptions)
          .filter(([key, value]) => value)
          .map(([key]) => (
            <li key={key}>{options.find((option) => option.value === key)?.label}</li>
          ))}
      </ul>
    </div>
  );
};

export default App;
