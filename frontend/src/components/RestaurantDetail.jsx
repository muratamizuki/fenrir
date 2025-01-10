// 親
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import RestaurantDisplay from "./RestaurantDisplay";
import Link from "next/link";

const RestaurantDetail = () => {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!router.isReady) return;

    const { id } = router.query;
    fetchRestaurantDetails(id);
  }, [router.isReady]);

  // IDで検索
  const fetchRestaurantDetails = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/search/hotpepper-restaurants/detail?id=${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch restaurant details");
      }
      const data = await response.json();
      setRestaurant(data.restaurants[0]);
    } catch (error) {
      console.error("Error fetching restaurant details:", error);
      setError("Failed to fetch restaurant details. Please try again.");
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
        <Link href="/search">
          <a className="text-3xl font-bold text-pink-600 text-center hover:text-pink-700 transition-colors duration-300">
            お店一覧
          </a>
        </Link>
      </header>
      <RestaurantDisplay restaurant={restaurant} />
    </div>
  );
};

export default RestaurantDetail;
