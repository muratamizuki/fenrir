import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DistanceSelector from "./DistanceSelector";
import SearchInput from "./SearchInput";
import CheckboxGroup from "./CheckboxGroup";
import RestaurantItem from "./RestaurantItem";

// チェックボックスのオプション定義
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

// チェックボックス初期状態
const initializeStates = (optionArray) =>
  optionArray.reduce((acc, option) => {
    acc[option.value] = false;
    return acc;
  }, {});

const PAGE_SIZE = 10;

const ResultsPage = () => {
  const router = useRouter();

  // ------------------------
  // 1. 検索条件
  // ------------------------
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [range, setRange] = useState("3");
  const [keyword, setKeyword] = useState("");
  const [checkedMainStates, setCheckedMainStates] = useState(
    initializeStates(options.main)
  );
  const [checkedSubStates, setCheckedSubStates] = useState(
    initializeStates(options.sub)
  );

  // ------------------------
  // 2. 結果表示/ページング
  // ------------------------
  const [restaurants, setRestaurants] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  // ------------------------
  // 初回マウント時: URLクエリから読み取り & APIコール
  // ------------------------
  useEffect(() => {
    if (!router.isReady) return; // クエリが読み込まれるまで待つ

    const {
      lat: qLat,
      lng: qLng,
      range: qRange,
      keyword: qKeyword,
      page: qPage, // あれば
      ...rest
    } = router.query;

    // ステートに反映
    if (qLat) setLat(qLat);
    if (qLng) setLng(qLng);
    if (qRange) setRange(qRange);
    if (qKeyword) setKeyword(qKeyword);
    if (qPage) setPage(Number(qPage));

    // チェックボックス系
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

    // 初回リクエスト (ページに飛んできた時点でクエリを使ってAPIリクエスト)
    fetchRestaurants({
      lat: qLat || "",
      lng: qLng || "",
      range: qRange || "3",
      keyword: qKeyword || "",
      page: qPage ? Number(qPage) : 1,
      main: mainCopy,
      sub: subCopy,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  // ------------------------
  // API呼び出し関数
  // ------------------------
  const fetchRestaurants = async ({
    lat,
    lng,
    range,
    keyword,
    page,
    main,
    sub,
    isLoadMore = false,
  }) => {
    try {
      const mergeCheckedOptions = (states) =>
        Object.entries(states)
          .filter(([_, checked]) => checked)
          .reduce((acc, [key]) => {
            acc[key] = 1;
            return acc;
          }, {});

      const queryObj = {
        lat,
        lng,
        range,
        keyword,
        page: String(page),
        limit: String(PAGE_SIZE),
        ...mergeCheckedOptions(main),
        ...mergeCheckedOptions(sub),
      };
      const queryString = new URLSearchParams(queryObj).toString();
      const url = `http://localhost:8000/search/hotpepper-restaurants?${queryString}`;

      const response = await fetch(url, { method: "GET" });
      if (!response.ok) {
        throw new Error("Failed to fetch restaurants");
      }
      const data = await response.json();

      if (isLoadMore) {
        setRestaurants((prev) => [...prev, ...data.restaurants]);
      } else {
        setRestaurants(data.restaurants);
      }

      if (typeof data.hasNextPage !== "undefined") {
        setHasNextPage(data.hasNextPage);
      } else {
        setHasNextPage(data.restaurants.length === PAGE_SIZE);
      }
    } catch (error) {
      console.error("API呼び出し失敗:", error);
    }
  };

  // ------------------------
  // 検索ボタン(送信ボタン) を押した時
  // ------------------------
  const handleSearchSubmit = async () => {
    setPage(1);
    await fetchRestaurants({
      lat,
      lng,
      range,
      keyword,
      page: 1,
      main: checkedMainStates,
      sub: checkedSubStates,
      isLoadMore: false,
    });
  };

  // ------------------------
  // もっと読み込む
  // ------------------------
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

  // ------------------------
  // UIハンドラ
  // ------------------------
  const handleKeywordChange = (val) => {
    setKeyword(val);
  };
  const handleDistanceChange = (val) => {
    setRange(val);
  };
  const handleCheckboxChange = (setState) => (value) => {
    setState((prev) => ({ ...prev, [value]: !prev[value] }));
  };

  // ------------------------
  // レイアウト
  // ------------------------
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1rem" }}>
      {/* 検索欄 → SearchInputにボタン内蔵 */}
      <h1>検索</h1>
      <SearchInput
        value={keyword}
        onChange={handleKeywordChange}
        onSubmit={handleSearchSubmit} // ボタン押下時
      />

      {/* メイン画面: 左に店一覧(縦一列)、右にオプション */}
      <div style={{ display: "flex", marginTop: "2rem" }}>
        {/* 左カラム: 一列で店一覧 */}
        <div style={{ flex: 3, marginRight: "1rem" }}>
          <h2>検索結果一覧</h2>
          {/* 一列表示 → flexを外す/あるいはflexDirection: column */}
          <div>
            {restaurants.map((restaurant) => (
              <RestaurantItem
                key={restaurant.id}
                name={restaurant.name}
                logoImage={restaurant.logo_image}
                address={restaurant.address}
                catchPhrase={restaurant.catch}
              />
            ))}
          </div>

          {/* もっと読み込む */}
          {hasNextPage && (
            <button onClick={handleLoadMore} style={{ marginTop: "1rem" }}>
              もっと読み込む
            </button>
          )}
        </div>

        {/* 右カラム: オプション類 */}
        <div style={{ flex: 1 }}>
          <h2>距離</h2>
          <DistanceSelector
            options={[
              { value: "1", label: "300m" },
              { value: "2", label: "500m" },
              { value: "3", label: "1000m" },
              { value: "4", label: "2000m" },
              { value: "5", label: "3000m" },
            ]}
            selectedValue={range}
            onChange={handleDistanceChange}
          />
          <h3>メインオプション</h3>
          <CheckboxGroup
            options={options.main}
            checkedStates={checkedMainStates}
            onChange={handleCheckboxChange(setCheckedMainStates)}
          />

          <h3>サブオプション</h3>
          <CheckboxGroup
            options={options.sub}
            checkedStates={checkedSubStates}
            onChange={handleCheckboxChange(setCheckedSubStates)}
          />
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
