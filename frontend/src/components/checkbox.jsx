import React, { useState } from "react";

const SimpleCheckbox = ({ label, onChange }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    onChange(newCheckedState);
  };

  return (
    <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
        style={{ marginRight: "8px" }}
      />
      {label}
    </label>
  );
};

export default SimpleCheckbox;
