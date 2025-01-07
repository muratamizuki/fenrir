// 親
import React, { useState } from "react";
import { useRouter } from "next/router";
import Options from "./Options";
import SearchInput from "./SearchInput";

const Homepage = () => {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedDistance, setSelectedDistance] = useState("3");

  // 選択されたオプションのステートを保持
  const [selectedMainOptions, setSelectedMainOptions] = useState({});
  const [selectedSubOptions, setSelectedSubOptions] = useState({});

  // 店一覧とページングのステート（必要に応じて）
  const [restaurants, setRestaurants] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

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
        range: selectedDistance, // 距離 (既に "3" 形式)
        keyword: searchKeyword, // 検索キーワード
        ...mergeCheckedOptions(selectedMainOptions), // メインオプション
        ...mergeCheckedOptions(selectedSubOptions), // サブオプション
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

      {/* オプションコンポーネントを使用 */}
      <Options
        selectedDistance={selectedDistance}
        onDistanceChange={handleDistanceChange}
        onMainOptionsChange={setSelectedMainOptions}
        onSubOptionsChange={setSelectedSubOptions}
      />
    </div>
  );
};

export default Homepage;
