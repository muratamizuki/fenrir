import React, { useState } from "react";
import CheckboxGroup from "../components/CheckboxGroup";
import DistanceSelector from "../components/DistanceSelector";
import SearchInput from "../components/SearchInput";
// jsはインデントがspace2つが多いらしいややこい、終わってから変えるかも

// チェックボックスのオプション　こーどがすごいことになるからどうにかしたい
const options = {
    main: [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
        { value: "option3", label: "Option 3" },
    ],
    // さぶオプション　上に同じ
    sub: [
        { value: "suboption1", label: "Sub Option 1" },
        { value: "suboption2", label: "Sub Option 2" },
        { value: "suboption3", label: "Sub Option 3" },
    ],
};

// チェックボックスの状態管理
const initializeStates = (options) =>
    options.reduce((acc, option) => {
    acc[option.value] = false;
    return acc;
    }, {});

const ParentComponent = () => {
    const [searchKeyword, setSearchKeyword] = useState("");
    // 初期値は1000m
    const [selectedDistance, setSelectedDistance] = useState("range:3");
    const [checkedMainStates, setCheckedMainStates] = useState(
      initializeStates(options.main)
    );
    const [checkedSubStates, setCheckedSubStates] = useState(
      initializeStates(options.sub)
    );
  

    // 検索ワードの変更
    const handleSearch = (keyword) => {
      console.log("検索ワード:", keyword);
      setSearchKeyword(keyword);
      handleSubmit(keyword); // 送信
    };

    // 距離が変わった時に更新
    const handleDistanceChange = (selectedValue) => {
        setSelectedDistance(selectedValue);
        console.log("選択された距離 (value):", selectedValue);
        };
    
    // チェックボックスが変わった時
    const handleCheckboxChange = (setState) => (value) => {
        setState((prev) => ({ ...prev, [value]: !prev[value] }));
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
  
        // 送信データ
        let payload = {
          lat: position.latitude,
          lng: position.longitude,
          range: selectedDistance,
          keyword: searchKeyword, // キーワードも入れた
        };
  
        // チェックされたオプションをペイロードに追加
        const mergeCheckedOptions = (states) =>
          Object.entries(states)
            .filter(([_, checked]) => checked)
            .reduce((acc, [key]) => {
              acc[key] = 1;
              return acc;
          }, {});
        payload = {
          ...payload,
          ...mergeCheckedOptions(checkedMainStates),
          ...mergeCheckedOptions(checkedSubStates),
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
          console.log("応答", data);
        } else {
          console.error("送信に失敗", payload);
        }
      } catch (error) {
        console.error("エラー", error);
      }
    };
  
    return (
      <div>
        <h1>検索</h1>
        <SearchInput onSearch={handleSearch} /> 
        <DistanceSelector
          options={[
            { value: "1", label: "300m" },
            { value: "2", label: "500m" },
            { value: "3", label: "1000m" },
            { value: "4", label: "2000m" },
            { value: "5", label: "3000m" },
          ]}
          selectedValue={selectedDistance}
          onChange={handleDistanceChange}
        />
        
        <h2>メインオプション</h2>
      <CheckboxGroup
        options={options.main}
        checkedStates={checkedMainStates}
        onChange={handleCheckboxChange(setCheckedMainStates)}
      />
      <h2>サブオプション</h2>
      <CheckboxGroup
        options={options.sub}
        checkedStates={checkedSubStates}
        onChange={handleCheckboxChange(setCheckedSubStates)}
      />
      </div>
    );
  };
  
  export default ParentComponent;
