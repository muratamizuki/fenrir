import React, { useState } from "react";
import { useRouter } from "next/router";
import CheckboxGroup from "./CheckboxGroup";
import DistanceSelector from "./DistanceSelector";
import SearchInput from "./SearchInput";

// チェックボックスのオプション　こーどがすごいことになるからどうにかしたい
const options = {
  main: [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ],
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

const Homepage = () => {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState("");
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
    handleSubmit(); // 送信
  };

  // 距離が変わった時
  const handleDistanceChange = (selectedValue) => {
    setSelectedDistance(selectedValue);
    console.log("選択された距離 (value):", selectedValue);
  };

  // チェックボックスが変わった時
  const handleCheckboxChange = (setState) => (value) => {
    setState((prev) => ({ ...prev, [value]: !prev[value] }));
  };

  // Geolocation
  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is error"));
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(new Error(`error: ${error.message}`));
        }
      );
    });
  };

  // チェックされたオプションを統合
  const mergeCheckedOptions = (states) =>
    Object.entries(states)
      .filter(([_, checked]) => checked) 
      .reduce((acc, [key]) => {
        acc[key] = 1;
        return acc;
      }, {});

  // 送信
  const handleSubmit = async () => {
    try {
      const position = await getCurrentPosition(); // 現在位置を取得

      const payload = {
        lat: position.latitude, // 緯度
        lng: position.longitude, // 経度
        range: selectedDistance.replace("range:", ""), // 距離
        keyword: searchKeyword, // 検索キーワード
        ...mergeCheckedOptions(checkedMainStates), // メインオプション
        ...mergeCheckedOptions(checkedSubStates), // サブオプション
      };

      console.log("送信データ:", payload);

      // 検索結果ページへ遷移
      router.push({
        pathname: "/results",
        query: payload,
      });
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

export default Homepage;
