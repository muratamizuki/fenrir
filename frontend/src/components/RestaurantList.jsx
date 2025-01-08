// 親
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import SearchInput from "./SearchInput";
import Options from "./Options";
import { mainOptions, subOptions } from "./Options";
// import RestaurantItem from "./RestaurantItem";

const PAGE_SIZE = 10;

const RestaurantList = () => {
  const router = useRouter();

  // 1. 検索条件
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [range, setRange] = useState("3");
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedDistance, setSelectedDistance] = useState("3");
  const [selectedMainOptions, set] = useState({});
  const [selectedSubOptions, setSelectedSubOptions] = useState({});
  // オプション
  const [mainOptions, setMainOptions] = useState([]);
  const [subOptions, setSubOptions] = useState([]);

  // 結果表示
  const [restaurants, setRestaurants] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const [checkedMainStates, setCheckedMainStates] = useState(
    mainOptions.reduce((acc, option) => {
      acc[option.value] = false;
      return acc;
    }, {})
  );

  const [checkedSubStates, setCheckedSubStates] = useState(
    subOptions.reduce((acc, option) => {
      acc[option.value] = false;
      return acc;
    }, {})
  );
  
  // 入った時のAPI呼び出し
  useEffect(() => {
    if (!router.isReady) return;

    const {
      lat: qLat,
      lng: qLng,
      range: qRange,
      keyword: qKeyword,
      page: qPage,
      ...rest
    } = router.query;

    if (qLat) setLat(qLat);
    if (qLng) setLng(qLng);
    if (qRange) setRange(qRange);
    if (qKeyword) setKeyword(qKeyword);
    if (qPage) setPage(Number(qPage));

    const mainCopy = { ...checkedMainStates };
    const subCopy = { ...checkedSubStates };

    Object.entries(rest).forEach(([key, value]) => {
      if (value === "1") {
        if (mainCopy[key] !== undefined) mainCopy[key] = true;
        if (subCopy[key] !== undefined) subCopy[key] = true;
      }
    });
    setCheckedMainStates(mainCopy);
    setCheckedSubStates(subCopy);

    fetchRestaurants({
      lat: qLat || "",
      lng: qLng || "",
      range: qRange || "3",
      keyword: qKeyword || "",
      page: qPage ? Number(qPage) : 1,
      main: mainCopy,
      sub: subCopy,
    });
  }, [router.isReady]);
  const mergeCheckedOptions = (options) => {
    return Object.entries(options || {}).reduce((acc, [key, value]) => {
      if (value) {
        acc[key] = String(value);
      }
      return acc;
    }, {});
  };
  

  // API呼び出
  const fetchRestaurants = async () => {
  
    // クエリ
    const query = router.query;
  
    const queryString = new URLSearchParams(query).toString();
    const url = `http://localhost:8000/search/hotpepper-restaurants?${queryString}`;
    console.log("Generated URL:", url);
  
    try {
      const response = await fetch(url, { method: "GET" });
      if (!response.ok) {
        throw new Error("Failed to fetch restaurants");
      }
      const data = await response.json();
      setRestaurants(data.restaurants || []);
      console.log("API Response:", data);
    } catch (error) {
      console.error("API呼び出し失敗:", error);
    }
  };

  // geolocation
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

  // 検索ワードの変更
  const handleSearch = (keyword) => {
    console.log("検索ワード:", keyword);
    setSearchKeyword(keyword);
    handleSubmit(keyword); // 送信
  };
  const handleSubmit = async (keyword) => {
    try {
      const position = await getCurrentPosition(); // 現在位置を取得

      const payload = {
        lat: position.latitude, // 緯度
        lng: position.longitude, // 経度
        range: selectedDistance, // 距離
        keyword: keyword, // 検索キーワード
        ...mergeCheckedOptions(mainOptions, ), // メインオプション
        ...mergeCheckedOptions(subOptions, selectedSubOptions), // サブオプション
      };

      console.log("送信データ:", payload);

      // 検索結果ページへ遷移
      router.push({
        pathname: "/results",
        query: payload,
      });
      console.log("送信データ:", payload);
    } catch (error) {
      console.error("エラー", error);
    }
  };

  // ページング
  const handleLoadMore = async () => {
    const nextPage = page + 1;
    setPage(nextPage);

    await fetchRestaurants({
      lat,
      lng,
      range,
      keyword,
      page: nextPage,
      main: checkedMainStates,
      sub: checkedSubStates,
      isLoadMore: true,
    });
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1rem" }}>
      <h1>検索</h1>
      <SearchInput onSearch={handleSearch} />

      <div style={{ display: "flex", marginTop: "2rem" }}>
        <div style={{ flex: 3, marginRight: "1rem" }}>
          <h2>検索結果一覧</h2>
          {/* ここをコンポーネント化 */}
          {restaurants.map((restaurant) => (
            <Link
              key={restaurant.id}
              href={{
                pathname: "/details",
                query: { id: restaurant.id },
              }}
            >
              <a style={{ textDecoration: "none", color: "inherit" }}>
                <div>
                  <h3>{restaurant.name}</h3>
                  <img src={restaurant.logo_image} alt={`${restaurant.name} ロゴ`} />
                  <p>{restaurant.address}</p>
                  <p>{restaurant.catchPhrase}</p>
                </div>
              </a>
            </Link>
          ))}
          {hasNextPage && (
            <button onClick={handleLoadMore} style={{ marginTop: "1rem" }}>
              もっと読み込む
            </button>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <Options
            selectedDistance={range}
            onDistanceChange={setRange}
            onMainOptionsChange={setCheckedMainStates}
            onSubOptionsChange={setCheckedSubStates}
            initialMainOptions={checkedMainStates}
            initialSubOptions={checkedSubStates}
          />
        </div>
      </div>
    </div>
  );
};

export default RestaurantList;
