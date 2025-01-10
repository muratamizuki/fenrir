// 詳細表示コンポーネント
import React from 'react';

// propsの定義
const RestaurantDisplay = ({ restaurant }) => {
  const googleMapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{restaurant.name}</h1>
      <img src={restaurant.logo_image} alt={`${restaurant.name} ロゴ`} className="w-32 h-32 object-cover rounded-md mb-4" />
      <div className="space-y-2">
        <p>
          <strong className="font-semibold">住所:</strong>{" "}
          <a href={googleMapLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            {restaurant.address}
          </a>
        </p>
        <p><strong className="font-semibold">アクセス:</strong> {restaurant.access}</p>
        <p><strong className="font-semibold">ジャンル:</strong> {restaurant.genre.name} ({restaurant.genre.catch})</p>
        <p><strong className="font-semibold">営業時間:</strong> {restaurant.open}</p>
        <p><strong className="font-semibold">予算:</strong> {restaurant.budget.average}</p>
        <p><strong className="font-semibold">キャッチコピー:</strong> {restaurant.catch || "不明"}</p>
        <p><strong className="font-semibold">禁煙:</strong> {restaurant.non_smoking || "不明"}</p>
        <p><strong className="font-semibold">WiFi:</strong> {restaurant.wifi || "不明"}</p>
        <p><strong className="font-semibold">駐車場:</strong> {restaurant.parking || "不明"}</p>
        {restaurant.shop_detail_memo && (
          <p><strong className="font-semibold">その他のメモ:</strong> {restaurant.shop_detail_memo}</p>
        )}
      </div>
    </div>
  );
};

export default RestaurantDisplay;
