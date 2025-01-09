// 親
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const RestaurantDetail = () => {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState(null); // 一個の情報

  useEffect(() => {
    if (!router.isReady) return;

    const { id } = router.query;
    fetchRestaurantDetails(id);
  }, [router.isReady]);

  const fetchRestaurantDetails = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/search/hotpepper-restaurants/detail?id=${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch restaurant details");
      }
      const data = await response.json();
      setRestaurant(data.restaurants[0]);
    } catch (error) {
      console.error("Error fetching restaurant details:", error);
    }
  };

  if (!restaurant) {
    return <p>Loading...</p>; // ロード
  }

  const googleMapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`;

  return (
    <div>
      <h1>{restaurant.name}</h1>
      <img src={restaurant.logo_image} alt={`${restaurant.name} ロゴ`} />
      <p>
        <strong>住所:</strong>{" "}
        <a href={googleMapLink} target="_blank" rel="noopener noreferrer">
          {restaurant.address}
        </a>
      </p>
      <p><strong>アクセス:</strong> {restaurant.access}</p>
      <p><strong>ジャンル:</strong> {restaurant.genre.name} ({restaurant.genre.catch})</p>
      <p><strong>営業時間:</strong> {restaurant.open}</p>
      <p><strong>予算:</strong> {restaurant.budget.average}</p>
      <p><strong>キャッチコピー:</strong> {restaurant.catch}</p>
      <p><strong>禁煙:</strong> {restaurant.non_smoking}</p>
      <p><strong>WiFi:</strong> {restaurant.wifi}</p>
      <p><strong>駐車場:</strong> {restaurant.parking}</p>
      {restaurant.shop_detail_memo && (
        <p><strong>その他のメモ:</strong> {restaurant.shop_detail_memo}</p>
)}
    </div>
  );
};

export default RestaurantDetail;
