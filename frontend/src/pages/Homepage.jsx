import React, { useState } from "react";
import CheckboxGroup from "../components/CheckboxGroup";
import SubmitButton from "../components/SubmitButton";
import DistanceSelector from "../components/DistanceSelector";
import SearchInput from "../components/SearchInput";
// jsはインデントがspace2つが多いらしいややこい、終わってから変えるかも
const ParentComponent = () => {
    const [searchKeyword, setSearchKeyword] = useState("");
  
    // 検索ワードの変更
    const handleSearch = (keyword) => {
      console.log("検索ワード:", keyword);
      setSearchKeyword(keyword);
    };
  
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
    const [selectedDistance, setSelectedDistance] = useState("range:3");
  
    // チェックボックスが変わった時
    const handleCheckboxChange = (value) => {
      setCheckedStates((prev) => ({ ...prev, [value]: !prev[value] }));
    };
  
    // 距離が変わった時に更新
    const handleDistanceChange = (selectedValue) => {
      setSelectedDistance(selectedValue);
      console.log("選択された距離 (value):", selectedValue);
    };
  
    // Geolocationで現在位置を取得
    const getCurrentPosition = () => {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocation is not supported by this browser."));
        }
  
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            reject(new Error(`Geolocation error: ${error.message}`));
          }
        );
      });
    };
  
    // 送信
    const handleSubmit = async () => {
      try {
        // 現在位置を取得
        const position = await getCurrentPosition();
  
        // チェックされた項目を抽出
        const checkedLabels = checkboxOptions
          .filter((option) => checkedStates[option.value])
          .map((option) => option.label);
  
        const payload = {
          selectedLabels: checkedLabels,
          distanceValue: selectedDistance,
          latitude: position.latitude,
          longitude: position.longitude,
          searchKeyword, // 検索ワードを追加
        };
  
        console.log("送信データ:", payload);
  
        const response = await fetch("http://localhost:8000/search/hotpepper-restaurants", {
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
        <SearchInput onSearch={handleSearch} /> {/* 検索入力スペースを追加 */}
        <CheckboxGroup
          options={checkboxOptions}
          checkedStates={checkedStates}
          onChange={handleCheckboxChange}
        />
        <DistanceSelector
          options={options}
          selectedValue={selectedDistance}
          onChange={handleDistanceChange}
        />
        <SubmitButton onSubmit={handleSubmit} />
      </div>
    );
  };
  
  export default ParentComponent;