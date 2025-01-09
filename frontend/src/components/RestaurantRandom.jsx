import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const PAGE_SIZE = 100; // ページサイズ最大で

const RestaurantRandom = () => {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState(null); // 初期値をnullに

  useEffect(() => {
    if (!router.isReady) return;

    // クエリを直接取得
    const query = {
      ...router.query, 
      limit: PAGE_SIZE, // ページサイズを追加
    };

    const queryString = new URLSearchParams(query).toString();
    console.log("Generated Query String:", queryString);

    // クエリを使ってAPIを呼び出し
    fetchRestaurant(queryString);
  }, [router.isReady]);

  const fetchRestaurant = async (queryString) => {
    try {
      const url = `http://localhost:8000/search/hotpepper-restaurants/random?${queryString}`;
      console.log("Fetch URL:", url);

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch restaurant");
      }

      const data = await res.json();
      console.log("APIレスポンス:", data);
      // ---------------------------------------------
      // data = {
      //   "restaurants": {
      //       "id": "...",
      //       "name": "...",
      //       ...
      //   }
      // }
      // ---------------------------------------------

      // バックエンドが `restaurants` プロパティに単一のレストランを入れて返す想定
      const singleRestaurant = data.restaurants || null;
      setRestaurant(singleRestaurant);
    } catch (error) {
      console.error("API呼び出し失敗:", error);
    }
  };

  if (!restaurant) {
    return <p>Loading...</p>; // データ取得中はローディング表示
  }

  // Google Mapsリンク作成 (住所に対して)
  const googleMapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`;

  return (
    <div>
      <h1>{restaurant.name}</h1>
      {restaurant.logo_image && (
        <img src={restaurant.logo_image} alt={`${restaurant.name} ロゴ`} />
      )}

      <p>
        <strong>住所:</strong>{" "}
        <a href={googleMapLink} target="_blank" rel="noopener noreferrer">
          {restaurant.address}
        </a>
      </p>

      <p>
        <strong>アクセス:</strong> {restaurant.access}
      </p>
      
      {restaurant.genre && (
        <p>
          <strong>ジャンル:</strong> {restaurant.genre.name} ({restaurant.genre.catch})
        </p>
      )}

      <p>
        <strong>営業時間:</strong> {restaurant.open}
      </p>

      {restaurant.budget && (
        <p>
          <strong>予算:</strong> {restaurant.budget.average}
        </p>
      )}

      {/* もしデータにあれば */}
      <p>
        <strong>キャッチコピー:</strong> {restaurant.catch || "不明"}
      </p>
      <p>
        <strong>禁煙:</strong> {restaurant.non_smoking || "不明"}
      </p>
      <p>
        <strong>WiFi:</strong> {restaurant.wifi || "不明"}
      </p>
      <p>
        <strong>駐車場:</strong> {restaurant.parking || "不明"}
      </p>

      {restaurant.shop_detail_memo && (
        <p>
          <strong>その他メモ:</strong> {restaurant.shop_detail_memo}
        </p>
      )}
    </div>
  );
};

export default RestaurantRandom;