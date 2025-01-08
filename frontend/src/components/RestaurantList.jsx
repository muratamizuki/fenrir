import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import SearchInput from "./SearchInput";
import Options from "./Options";
import RestaurantItem from "./RestaurantItem";

const PAGE_SIZE = 10;

const RestaurantList = () => {
  const router = useRouter();

  // 1. 検索条件
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [range, setRange] = useState("3");
  const [keyword, setKeyword] = useState("");

  // オプション
  const [mainOptions, setMainOptions] = useState([]);
  const [subOptions, setSubOptions] = useState([]);

  const [checkedMainStates, setCheckedMainStates] = useState({});
  const [checkedSubStates, setCheckedSubStates] = useState({});

  // 結果表示
  const [restaurants, setRestaurants] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

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

  // API呼び出
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

      setHasNextPage(data.restaurants.length === PAGE_SIZE);
    } catch (error) {
      console.error("API呼び出し失敗:", error);
    }
  };

  // 検索botann
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
      <SearchInput
        value={keyword}
        onChange={setKeyword}
        onSubmit={handleSearchSubmit}
      />

      <div style={{ display: "flex", marginTop: "2rem" }}>
        <div style={{ flex: 3, marginRight: "1rem" }}>
          <h2>検索結果一覧</h2>
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
