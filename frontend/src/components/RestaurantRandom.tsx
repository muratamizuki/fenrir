// 親
// ランダムでお店を表示するやつ、detailとおんなじ感じ
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import RestaurantDisplay from "./RestaurantDisplay";
import Link from "next/link";

const PAGE_SIZE = 100;

const RestaurantRandom: React.FC = () => {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) return;

    const query = {
      ...router.query,
      limit: PAGE_SIZE,
    };

    const queryString = new URLSearchParams(
      Object.entries(query).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    console.log("Generated Query String:", queryString);

    fetchRestaurant(queryString);
  }, [router.isReady, router.query]);

  const fetchRestaurant = async (queryString: string) => {
    try {
      setLoading(true);
      const url = `http://localhost:8000/search/hotpepper-restaurants/random?${queryString}`;
      console.log("Fetch URL:", url);

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch restaurant");
      }

      const data = await res.json();
      console.log("APIレスポンス:", data);

      const singleRestaurant = data.restaurants || null;
      setRestaurant(singleRestaurant);
    } catch (error) {
      console.error("API呼び出し失敗:", error);
      setError("条件に合ったお店がありません、条件を変えて検索してください");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center text-xl mt-8">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-xl mt-8 text-red-500">{error}</p>;
  }

  if (!restaurant) {
    return <p className="text-center text-xl mt-8">No restaurant found.</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="bg-pink-100 rounded-t-3xl p-6 mb-8 shadow-md flex items-center justify-center">
        <Link href="/">
          <a className="text-3xl font-bold text-pink-600 text-center hover:text-pink-700 transition-colors duration-300">
            おすすめのお店はこれ！！
          </a>
        </Link>
      </header>
      <RestaurantDisplay restaurant={restaurant} />
    </div>
  );
};

export default RestaurantRandom;
