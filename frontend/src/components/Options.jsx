import React, { useState, useEffect } from "react";
import DistanceSelector from "./DistanceSelector";
import CheckboxGroup from "./CheckboxGroup";

// チェックボックスのオプション
const Options = ({
  selectedDistance,
  onDistanceChange,
  onMainOptionsChange, 
  onSubOptionsChange,
  initialMainOptions = {},
  initialSubOptions = {},
}) => {
  // オプション定義
  const mainOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  const subOptions = [
    { value: "suboption1", label: "Sub Option 1" },
    { value: "suboption2", label: "Sub Option 2" },
    { value: "suboption3", label: "Sub Option 3" },
  ];

  // チェックボックスの状態管理
  const [checkedMainStates, setCheckedMainStates] = useState(
    mainOptions.reduce((acc, option) => {
      acc[option.value] = initialMainOptions[option.value] || false;
      return acc;
    }, {})
  );

  const [checkedSubStates, setCheckedSubStates] = useState(
    subOptions.reduce((acc, option) => {
      acc[option.value] = initialSubOptions[option.value] || false;
      return acc;
    }, {})
  );

  // メインオプション
  const handleMainCheckboxChange = (value) => {
    setCheckedMainStates((prev) => {
      const updated = { ...prev, [value]: !prev[value] };
      onMainOptionsChange(updated); 
      return updated;
    });
  };

  // サブオプション
  const handleSubCheckboxChange = (value) => {
    setCheckedSubStates((prev) => {
      const updated = { ...prev, [value]: !prev[value] };
      onSubOptionsChange(updated); 
      return updated;
    });
  };

  return (
    <div>
      <h2>距離</h2>
      <DistanceSelector
        options={[
          { value: "1", label: "300m" },
          { value: "2", label: "500m" },
          { value: "3", label: "1000m" },
          { value: "4", label: "2000m" },
          { value: "5", label: "3000m" },
        ]}
        selectedValue={selectedDistance}
        onChange={onDistanceChange}
      />

      <h3>メインオプション</h3>
      <CheckboxGroup
        options={mainOptions}
        checkedStates={checkedMainStates}
        onChange={handleMainCheckboxChange}
      />

      <h3>サブオプション</h3>
      <CheckboxGroup
        options={subOptions}
        checkedStates={checkedSubStates}
        onChange={handleSubCheckboxChange}
      />
    </div>
  );
};

export default Options;
