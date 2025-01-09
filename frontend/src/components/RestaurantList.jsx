// 親
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import SearchInput from "./SearchInput";
import Options from "./Options";
import { mainOptions, subOptions } from "./Options";

const PAGE_SIZE = 10;

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

// チェック
const mergeCheckedOptions = (optionsArray, states) => {
  return optionsArray.reduce((acc, option) => {
    if (states[option.value]) {
      acc[option.value] = "1";
    }
    return acc;
  }, {});
};

const RestaurantList = () => {
  const router = useRouter();

  const [keyword, setKeyword] = useState("");
  const [range, setRange] = useState("3");

  // メイン/サブオプション
  const [selectedMainOptions, setSelectedMainOptions] = useState({});
  const [selectedSubOptions, setSelectedSubOptions] = useState({});

  const [restaurants, setRestaurants] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  // lat, lng
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  // ページング
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  useEffect(() => {
    fetchItems(currentPage);
  }, [currentPage]);

  // 
  const fetchItems = async (page) => {
    const res = await fetch(`/api/items?page=${page}`);
    const data = await res.json();
    setItems(data.items);
    setTotalPages(data.totalPages);
  };

  // ページ番号
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }


  // チェックボックスの引き継ぎ
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
    if (qPage) setPage(Number(qPage) || 1);

    // メインオプション復元
    const mainTemp = {};
    mainOptions.forEach((opt) => {
      if (rest[opt.value] === "1") {
        mainTemp[opt.value] = true;
      }
    });
    setSelectedMainOptions(mainTemp);

    // サブオプション復元
    const subTemp = {};
    subOptions.forEach((opt) => {
      if (rest[opt.value] === "1") {
        subTemp[opt.value] = true;
      }
    });
    setSelectedSubOptions(subTemp);

    // fetch
    fetchRestaurants({
      lat: qLat || "",
      lng: qLng || "",
      range: qRange || "3",
      keyword: qKeyword || "",
      page: qPage ? Number(qPage) : 1,
      main: mainTemp,
      sub: subTemp,
      isLoadMore: false,
    });
  }, [router.isReady]);

  // apiよび
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
      const payload = {
        lat,
        lng,
        range,
        keyword,
        page: String(page),
        limit: String(PAGE_SIZE),
        ...mergeCheckedOptions(mainOptions, main),
        ...mergeCheckedOptions(subOptions, sub),
      };

      const qs = new URLSearchParams(payload).toString();
      const url = `http://localhost:8000/search/hotpepper-restaurants?${qs}`;

      console.log("Fetch URL:", url);
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch restaurants");
      }
      const data = await res.json();
      console.log("APIレスポンス:", data);

      if (isLoadMore) {
        setRestaurants((prev) => [...prev, ...data.restaurants]);
      } else {
        setRestaurants(data.restaurants || []);
      }
      setHasNextPage((data.restaurants || []).length === PAGE_SIZE);
    } catch (error) {
      console.error("API呼び出し失敗:", error);
    }
  };

  const handleSubmit = async (keyword) => {
    try {
      const position = await getCurrentPosition();
      const payload = {
        lat: position.latitude,
        lng: position.longitude,
        range,
        keyword: keyword,
        page: "1",
        ...mergeCheckedOptions(mainOptions, selectedMainOptions),
        ...mergeCheckedOptions(subOptions, selectedSubOptions),
      };

      // API再fetch
      await fetchRestaurants({
        lat: position.latitude,
        lng: position.longitude,
        range,
        keyword: keyword,
        page: 1,
        main: selectedMainOptions,
        sub: selectedSubOptions,
        isLoadMore: false,
      });

      // URL 更新
      router.push({
        pathname: "/results",
        query: payload,
      });
      console.log("送信データ:", payload);
    } catch (err) {
      console.error("位置情報取得 or API呼び出し失敗:", err);
      alert("位置情報が取得できませんでした");
    }
  };

  // 送信
  const handleSearch = (keyword) => {
    console.log("検索ワード:", keyword);
    setKeyword(keyword);
    handleSubmit(keyword);
  };

  // 「もっと読み込む」
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

    router.push({
      pathname: "/results",
      query: {
        ...router.query,
        page: String(nextPage),
      },
    });
  };

  // 距離/オプションが変わった時
  const handleDistanceChange = (val) => {
    setRange(val);
  };
  const handleMainOptionsChange = (updated) => {
    setSelectedMainOptions(updated);
  };
  const handleSubOptionsChange = (updated) => {
    setSelectedSubOptions(updated);
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1rem" }}>
      <h1>レストラン一覧</h1>

      <SearchInput onSearch={handleSearch} />

      <div style={{ display: "flex", marginTop: "2rem" }}>
        <div style={{ flex: 3, marginRight: "1rem" }}>
          <h2>検索結果</h2>
          {restaurants.length === 0 ? (
            <p>該当するレストランがありません</p>
          ) : (
            restaurants.map((r) => (
              <Link
                key={r.id}
                href={{
                  pathname: "/details",
                  query: { id: r.id },
                }}
              >
                <a style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ marginBottom: "1rem" }}>
                    <h3>{r.name}</h3>
                    {r.logo_image && (
                      <img
                        src={r.logo_image}
                        alt={r.name}
                        style={{ width: "120px" }}
                      />
                    )}
                    <p>{r.address}</p>
                    <p>{r.catchPhrase}</p>
                  </div>
                </a>
              </Link>
            ))
          )}
          {hasNextPage && (
            <button onClick={handleLoadMore} style={{ marginTop: "1rem" }}>
              もっと読み込む
            </button>
          )}
          <h2>Pagination Example</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>

      {/* 前へ */}
      <button
        disabled={currentPage <= 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        前のページ
      </button>

      {/* 番号 */}
      {pageNumbers.map((num) => (
        <button
          key={num}
          style={{
            fontWeight: currentPage === num ? "bold" : "normal",
            margin: "0 2px",
          }}
          onClick={() => setCurrentPage(num)}
        >
          {num}
        </button>
      ))}

      {/* 次のページ */}
      <button
        disabled={currentPage >= totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        次のページ
      </button>
        </div>

        <div style={{ flex: 1 }}>
          <Options
            selectedDistance={range}
            onDistanceChange={handleDistanceChange}
            onMainOptionsChange={handleMainOptionsChange}
            onSubOptionsChange={handleSubOptionsChange}
            initialMainOptions={selectedMainOptions}
            initialSubOptions={selectedSubOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default RestaurantList;
