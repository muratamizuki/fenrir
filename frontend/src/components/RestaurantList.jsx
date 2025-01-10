// 親
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import SearchInput from "./SearchInput";
import Options from "./Options";
import { mainOptions, subOptions } from "./Options";

const PAGE_SIZE = 10;

// Geolocation
const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is error"));
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (err) => {
        reject(new Error(`error: ${err.message}`));
      }
    );
  });
};

// オプションを統合
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

  // 検索
  const [keyword, setKeyword] = useState("");
  const [range, setRange] = useState("3");
  const [selectedMainOptions, setSelectedMainOptions] = useState({});
  const [selectedSubOptions, setSelectedSubOptions] = useState({});

  // 結果表示
  const [restaurants, setRestaurants] = useState([]);

  // ページング関連
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 位置情報
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  // 初回クエリ
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

    if (qPage) {
      setCurrentPage(Number(qPage) || 1);
    }

    // メイン/サブオプション復元
    const mainTemp = {};
    mainOptions.forEach((opt) => {
      if (rest[opt.value] === "1") {
        mainTemp[opt.value] = true;
      }
    });
    setSelectedMainOptions(mainTemp);

    const subTemp = {};
    subOptions.forEach((opt) => {
      if (rest[opt.value] === "1") {
        subTemp[opt.value] = true;
      }
    });
    setSelectedSubOptions(subTemp);

    // API呼び出し
    fetchRestaurants({
      lat: qLat || "",
      lng: qLng || "",
      range: qRange || "3",
      keyword: qKeyword || "",
      page: qPage ? Number(qPage) : 1,
      main: mainTemp,
      sub: subTemp,
    });
  }, [router.isReady]);


  const fetchRestaurants = async ({
    lat,
    lng,
    range,
    keyword,
    page,
    main,
    sub,
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
      

      // 上書き
      setRestaurants(data.restaurants || []);

      // totalPages
      if (data.totalPages) {
        setTotalPages(data.totalPages);
      } else {
        setTotalPages(1);
      }
    } catch (error) {
      console.error("API Error:", error);
      setRestaurants([]);
    }
  };

  // 検索
  const handleSubmit = async (kw) => {
    try {
      const pos = await getCurrentPosition();
      const payload = {
        lat: pos.latitude,
        lng: pos.longitude,
        range,
        keyword: kw,
        page: "1",
        ...mergeCheckedOptions(mainOptions, selectedMainOptions),
        ...mergeCheckedOptions(subOptions, selectedSubOptions),
      };

      // API
      await fetchRestaurants({
        lat: pos.latitude,
        lng: pos.longitude,
        range,
        keyword: kw,
        page: 1,
        main: selectedMainOptions,
        sub: selectedSubOptions,
      });

      // URL
      router.push({
        pathname: "/results",
        query: payload,
      });
      setCurrentPage(1);
    } catch (err) {
      console.error("Geo or API err:", err);
      alert("位置情報が取得できませんでした");
    }
  };

  // 4. 前ページボタン
  const handlePrevPage = async () => {
    if (currentPage <= 1) {
      // クエリが1のとき戻れない
      return; 
    }
    const newPage = currentPage - 1;

    await fetchRestaurants({
      lat,
      lng,
      range,
      keyword,
      page: newPage,
      main: selectedMainOptions,
      sub: selectedSubOptions,
    });
    router.push({
      pathname: "/results",
      query: {
        lat,
        lng,
        range,
        keyword,
        page: String(newPage),
        ...mergeCheckedOptions(mainOptions, selectedMainOptions),
        ...mergeCheckedOptions(subOptions, selectedSubOptions),
      },
    });
    setCurrentPage(newPage);
  };

  // =============================
  // 5. 次ページボタン
  // =============================
  const handleNextPage = async () => {
    // ここでは特に制限しない or もし totalPages を使うなら if (currentPage >= totalPages) return;
    // 例: if (currentPage >= totalPages) return;

    const newPage = currentPage + 1;
    await fetchRestaurants({
      lat,
      lng,
      range,
      keyword,
      page: newPage,
      main: selectedMainOptions,
      sub: selectedSubOptions,
    });
    router.push({
      pathname: "/results",
      query: {
        lat,
        lng,
        range,
        keyword,
        page: String(newPage),
        ...mergeCheckedOptions(mainOptions, selectedMainOptions),
        ...mergeCheckedOptions(subOptions, selectedSubOptions),
      },
    });
    setCurrentPage(newPage);
  };


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="bg-pink-100 rounded-t-3xl p-6 mb-8 shadow-md flex items-center justify-between">
        <div className="w-1/3"></div>
        <Link href="/search">
          <a className="text-3xl font-bold text-pink-600 text-center hover:text-pink-700 transition-colors duration-300">
            お店一覧
          </a>
        </Link>
      </header>

      <SearchInput onSearch={(kw) => {
        setKeyword(kw);
        handleSubmit(kw);
      }} />

      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <div className="md:w-3/4">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">検索結果 (ページ {currentPage})</h2>

          {restaurants.length === 0 ? (
            <p className="text-gray-600 text-center py-8">店舗が存在しません</p>
          ) : (
            <div className="space-y-6">
              {restaurants.map((r) => (
                <Link key={r.id} href={{ pathname: "/details", query: { id: r.id } }}>
                  <a className="block bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-pink-600 mb-2">{r.name}</h3>
                      <div className="flex items-center space-x-4">
                        {r.logo_image && (
                          <img
                            src={r.logo_image}
                            alt={r.name}
                            ganre={r.ganre}
                            
                            className="w-24 h-24 object-cover rounded-full"
                          />
                        )}
                        <div>
                          <p className="text-gray-600">{r.address}</p>
                          <p className="text-gray-500 mt-1">{r.catchPhrase}</p>
                        </div>
                      </div>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          )}

          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className="px-4 py-2 bg-pink-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-600 transition-colors duration-300"
            >
              前のページ
            </button>
            <button
              onClick={handleNextPage}
              className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors duration-300"
            >
              次のページ
            </button>
          </div>
        </div>

        <div className="md:w-1/4">
          <Options
            selectedDistance={range}
            onDistanceChange={setRange}
            onMainOptionsChange={setSelectedMainOptions}
            onSubOptionsChange={setSelectedSubOptions}
            initialMainOptions={selectedMainOptions}
            initialSubOptions={selectedSubOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default RestaurantList;
