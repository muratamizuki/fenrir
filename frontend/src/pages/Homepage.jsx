import React, { useState } from "react";
import CheckboxGroup from "../components/CheckboxGroup";
import SubmitButton from "../components/SubmitButton";
import DistanceSelector from "../components/DistanceSelector";

const ParentComponent = () => {
  // 距離用のオプション
  const options = [
    { value: "range:1", label: "300m" },
    { value: "range:2", label: "500m" },
    { value: "range:3", label: "1000m" },
    { value: "range:4", label: "2000m" },
    { value: "range:5", label: "3000m" },
  ];

  // チェックボックスのオプション
  const checkboxOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  // チェックボックスの状態管理
  const [checkedStates, setCheckedStates] = useState(
    checkboxOptions.reduce((acc, option) => {
      acc[option.value] = false;
      return acc;
    }, {})
  );

  // 初期値は1000m
  const [selectedDistance, setSelectedDistance] = useState("1000m");

  // チェックボックスが変わった時
  const handleCheckboxChange = (value) => {
    setCheckedStates((prev) => ({ ...prev, [value]: !prev[value] }));
  };

  // 距離が変わった時に更新
  const handleDistanceChange = (selectedValue) => {
    setSelectedDistance(selectedValue);
    console.log("選択された距離 (value):", selectedValue);
  };

  // 送信
  const handleSubmit = async () => {
    // チェックされた項目を抽出
    const checkedLabels = checkboxOptions
      .filter((option) => checkedStates[option.value])
      .map((option) => option.label);

    const payload = {
      selectedLabels: checkedLabels, 
      distanceValue: selectedDistance,
    };

    console.log("送信データ:", payload);

    try {
      const response = await fetch("http://localhost:5000//hotpepper-restaurants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("バックエンドからの応答:", data);
      } else {
        console.error("送信に失敗しました");
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  return (
    <div>
      <h1>検索</h1>
      <CheckboxGroup
        options={checkboxOptions}
        checkedStates={checkedStates}
        onChange={handleCheckboxChange}
      />
      <SubmitButton onSubmit={handleSubmit} />
      <DistanceSelector
        options={options}
        selectedValue={selectedDistance}
        onChange={handleDistanceChange}
      />
    </div>
  );
};

export default ParentComponent;
