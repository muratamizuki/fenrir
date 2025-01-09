// 親
// このページインデントおかしいことに気づいた←修正しろ
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const PAGE_SIZE = 100; // ページサイズ最大で


const RestaurantRandom = () => {
    const router = useRouter();
    const [restaurants, setRestaurants] = useState([]);
  
    useEffect(() => {
      if (!router.isReady) return;
  
      // クエリを直接取得
      const query = {
        ...router.query, // 既存のクエリ
        limit: PAGE_SIZE, // ページサイズを追加
      };
  
      const queryString = new URLSearchParams(query).toString();
      console.log("Generated Query String:", queryString);
  
      // クエリを使ってAPIを呼び出し
      fetchRestaurants(queryString);
    }, [router.isReady]);
  
    const fetchRestaurants = async (queryString) => {
      try {
        const url = `http://localhost:8000/search/hotpepper-restaurants/random?${queryString}`;
        console.log("Fetch URL:", url);
  
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Failed to fetch restaurants");
        }
  
        const data = await res.json();
        console.log("APIレスポンス:", data);
  
        setRestaurants(data.restaurants || []);
      } catch (error) {
        console.error("API呼び出し失敗:", error);
      }
    };
  
    return (
      <div>
        <h1>レストラン一覧</h1>
        {restaurants.length === 0 ? (
          <p>該当するレストランがありません</p>
        ) : (
          restaurants.map((r) => (
            <div key={r.id}>
              <h3>{r.name}</h3>
              <p>{r.address}</p>
            </div>
          ))
        )}
      </div>
    );
  };

export default RestaurantRandom;
