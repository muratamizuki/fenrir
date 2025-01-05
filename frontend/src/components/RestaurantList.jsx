import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import RestaurantItem from "./RestaurantItem";

const RestaurantList = () => {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    // router.query が利用可能になったら実行
    if (!router.isReady) return;

    // クエリ取得
    const { lat, lng, range, keyword, ...rest } = router.query;

    // バックエンドに問い合わせ
    const fetchRestaurants = async () => {
      try {
        const response = await fetch("http://localhost:8000/search/hotpepper-restaurants", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // クエリパラメータ
          body: JSON.stringify({
            lat,
            lng,
            range,
            keyword,
            ...rest, // チェックボックスなどのオプション
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch restaurants");
        }

        const data = await response.json();
        setRestaurants(data.results || []);
        console.log("レスポンス:", data);
      } catch (error) {
        console.error("APIerror:", error);
      }
    };

    fetchRestaurants();
  }, [router.isReady, router.query]);

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
    </div>
  );
};

export default RestaurantList;
