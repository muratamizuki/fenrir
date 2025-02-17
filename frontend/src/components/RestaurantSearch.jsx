// 親
import React, { useState } from "react";
import { useRouter } from "next/router";
import Options from "./Options";
import Link from 'next/link';
import SearchInput from "./SearchInput";
import { mainOptions, subOptions } from "./Options";


const RestaurantSearch = () => {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedDistance, setSelectedDistance] = useState("3");

  // 選択されたオプションのステートを保持
  const [selectedMainOptions, setSelectedMainOptions] = useState({});
  const [selectedSubOptions, setSelectedSubOptions] = useState({});

  // 検索ワードの変更
  const handleSearch = (keyword) => {
    console.log("検索ワード:", keyword);
    setSearchKeyword(keyword);
    handleSubmit(keyword); // 送信
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
  const mergeCheckedOptions = (options, states) => {
    return options.reduce((acc, option) => {
      if (states[option.value]) {
        acc[option.value] = 1;
      }
      return acc;
    }, {});
  };

  // 送信
  const handleSubmit = async (keyword) => {
    try {
      const position = await getCurrentPosition(); // 現在位置を取得

      const payload = {
        lat: position.latitude, // 緯度
        lng: position.longitude, // 経度
        range: selectedDistance, // 距離
        keyword: keyword, // 検索キーワード
        ...mergeCheckedOptions(mainOptions, selectedMainOptions), // メインオプション
        ...mergeCheckedOptions(subOptions, selectedSubOptions), // サブオプション
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
    <div className="container mx-auto px-4">
      <header className="bg-pink-100 rounded-t-3xl p-6 mb-8 shadow-md flex items-center justify-between">
        <div className="w-1/3"></div>
        <Link href="/search">
          <a className="text-3xl font-bold text-pink-600 text-center hover:text-pink-700 transition-colors duration-300">
            ランチョイス
          </a>
        </Link>
        <div className="w-1/3 flex justify-end">
          <Link href="/">
            <a className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors duration-300">
              らんだむ検索はこっち！！
            </a>
          </Link>
        </div>
      </header>
      <a className="text-3xl font-bold text-pink-600 text-center hover:text-pink-700 transition-colors duration-300">
            お店検索モード
      </a>
      <SearchInput onSearch={handleSearch} />
      <Options
        selectedDistance={selectedDistance}
        onDistanceChange={handleDistanceChange}
        onMainOptionsChange={setSelectedMainOptions}
        onSubOptionsChange={setSelectedSubOptions}
        className="flex-shrink-0"
      />
    </div>
  );
};

export default RestaurantSearch;
