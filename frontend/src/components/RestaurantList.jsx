import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import RestaurantItem from "./RestaurantItem";

const PAGE_SIZE = 10; // 1ページあたり何件表示するか

const RestaurantList = () => {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;

    const { lat, lng, range, keyword, ...rest } = router.query;

    const fetchRestaurants = async () => {
        try {
          const queryString = new URLSearchParams({
            lat,
            lng,
            range,
            keyword,
            page: String(page), // 数値を文字列に変換
            limit: String(PAGE_SIZE),
            ...rest,
          }).toString();
      
          const response = await fetch(`http://localhost:8000/search/hotpepper-restaurants?${queryString}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
      
          if (!response.ok) {
            throw new Error("Failed to fetch restaurants");
          }
      
          const data = await response.json();
          console.log("レスポンス:", data);

        // ページ
        if (page === 1) {
          setRestaurants(data.restaurants);
        } else {
          setRestaurants((prev) => [...prev, ...data.restaurants]);
        }

        // 次ページがあるかどうかをバックエンドから取得
        if (typeof data.hasNextPage !== "undefined") {
          setHasNextPage(data.hasNextPage);
        } else {
          // もし hasNextPage を返していないなら、件数比較などで判断する
          setHasNextPage(data.restaurants.length === PAGE_SIZE);
        }
      } catch (error) {
        console.error("APIerror:", error);
      }
    };

    fetchRestaurants();
    // page が変わるたびに再リクエスト
  }, [router.isReady, router.query, page]);

  // クエリが変わったら、ページを1にリセットする
  // (例) 距離や検索ワードを変更したら最初のページから再取得
  useEffect(() => {
    setPage(1);
  }, [router.query]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="restaurant-list">
      {restaurants.map((restaurant) => (
        <RestaurantItem
          key={restaurant.id}
          name={restaurant.name}
          logoImage={restaurant.logo_image}
          address={restaurant.address}
          catchPhrase={restaurant.catch}
        />
      ))}

      {hasNextPage && (
        <button onClick={handleLoadMore}>
          もっと読み込む
        </button>
      )}
    </div>
  );
};

export default RestaurantList;
