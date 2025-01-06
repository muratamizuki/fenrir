// pages/results.jsx
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SearchInput from "../components/SearchInput";
import Options from "../components/Options";
import RestaurantList from "../components/RestaurantList";

const PAGE_SIZE = 10;

const ResultsPage = () => {
  const router = useRouter();

  // ------------------------
  // 1. 検索条件のステート
  // ------------------------
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [range, setRange] = useState("3"); // 例: "3" に変更
  const [keyword, setKeyword] = useState("");

  // 選択されたオプションのステートを保持
  const [selectedMainOptions, setSelectedMainOptions] = useState({});
  const [selectedSubOptions, setSelectedSubOptions] = useState({});

  // ------------------------
  // 2. 結果表示/ページングのステート
  // ------------------------
  const [restaurants, setRestaurants] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  // ------------------------
  // 3. 初回マウント時: URLクエリからステートをセットし、APIを呼び出す
  // ------------------------
  useEffect(() => {
    if (!router.isReady) return; // クエリが読み込まれるまで待つ

    const {
      lat: qLat,
      lng: qLng,
      range: qRange,
      keyword: qKeyword,
      page: qPage,
      ...rest
    } = router.query;

    // ステートに反映
    if (qLat) setLat(qLat);
    if (qLng) setLng(qLng);
    if (qRange) setRange(qRange);
    if (qKeyword) setKeyword(qKeyword);
    if (qPage) setPage(Number(qPage));

    // チェックボックスのステート更新
    const mainOptions = ["option1", "option2", "option3"];
    const subOptions = ["suboption1", "suboption2", "suboption3"];

    const initialMain = {};
    const initialSub = {};

    mainOptions.forEach((key) => {
      initialMain[key] = rest[key] === "1";
    });

    subOptions.forEach((key) => {
      initialSub[key] = rest[key] === "1";
    });

    setSelectedMainOptions(initialMain);
    setSelectedSubOptions(initialSub);

    // 初回リクエスト
    fetchRestaurants({
      lat: qLat || "",
      lng: qLng || "",
      range: qRange || "3",
      keyword: qKeyword || "",
      page: qPage ? Number(qPage) : 1,
      main: initialMain,
      sub: initialSub,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  // ------------------------
  // 4. API呼び出し関数
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
      // チェックされたオプションだけ { option1: 1, suboption3: 1 } のようにまとめる
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
      console.log("APIレスポンス:", data);

      if (isLoadMore) {
        setRestaurants((prev) => [...prev, ...data.restaurants]);
      } else {
        setRestaurants(data.restaurants || []);
      }

      if (typeof data.hasNextPage !== "undefined") {
        setHasNextPage(data.hasNextPage);
      } else {
        setHasNextPage((data.restaurants || []).length === PAGE_SIZE);
      }
    } catch (error) {
      console.error("API呼び出し失敗:", error);
    }
  };

  // ------------------------
  // 5. 検索ボタン（送信ボタン）を押した時
  // ------------------------
  const handleSearchSubmit = async () => {
    setPage(1);
    await fetchRestaurants({
      lat,
      lng,
      range,
      keyword,
      page: 1,
      main: selectedMainOptions,
      sub: selectedSubOptions,
      isLoadMore: false,
    });

    // クエリを更新してブックマーク可能にする場合
    const payload = {
      lat,
      lng,
      range,
      keyword,
      page: 1,
      ...Object.entries(selectedMainOptions)
        .filter(([_, checked]) => checked)
        .reduce((acc, [key]) => {
          acc[key] = 1;
          return acc;
        }, {}),
      ...Object.entries(selectedSubOptions)
        .filter(([_, checked]) => checked)
        .reduce((acc, [key]) => {
          acc[key] = 1;
          return acc;
        }, {}),
    };

    router.push({
      pathname: "/results",
      query: payload,
    });
  };

  // ------------------------
  // 6. 「もっと読み込む」ボタン
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
      main: selectedMainOptions,
      sub: selectedSubOptions,
      isLoadMore: true,
    });

    // クエリに page を追加（オプション）
    router.push({
      pathname: "/results",
      query: { ...router.query, page: nextPage },
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

  // ------------------------
  // レイアウト
  // ------------------------
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1rem" }}>
      {/* 検索欄 */}
      <h1>検索</h1>
      <SearchInput
        value={keyword}
        onChange={handleKeywordChange}
        onSubmit={handleSearchSubmit} // 送信ボタン押下時
      />

      {/* メイン画面: 左に店一覧、右にオプション */}
      <div style={{ display: "flex", marginTop: "2rem", gap: "1rem" }}>
        {/* 左カラム: 店一覧 */}
        <div style={{ flex: 3 }}>
          <h2>検索結果一覧</h2>
          <RestaurantList restaurants={restaurants} />

          {/* もっと読み込む */}
          {hasNextPage && (
            <button onClick={handleLoadMore} style={{ marginTop: "1rem" }}>
              もっと読み込む
            </button>
          )}
        </div>

        {/* 右カラム: オプション類 */}
        <div style={{ flex: 1 }}>
          <Options
            selectedDistance={range}
            onDistanceChange={handleDistanceChange}
            onMainOptionsChange={setSelectedMainOptions} // メインオプション変更時
            onSubOptionsChange={setSelectedSubOptions}   // サブオプション変更時
          />
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
