import React, { useState } from "react";

const SearchInput = ({ placeholder = "検索ワードを入力してください", onSearch }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(inputValue); // 検索ワードわたす
    }
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        style={{
          padding: "0.5rem",
          fontSize: "1rem",
          width: "80%",
          marginRight: "0.5rem",
        }}
      />
      <button onClick={handleSearch} style={{ padding: "0.5rem 1rem", fontSize: "1rem" }}>
        検索
      </button>
    </div>
  );
};

export default SearchInput;
