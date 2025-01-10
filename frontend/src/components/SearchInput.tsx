import React, { useState } from "react";

interface SearchInputProps {
  placeholder?: string;
  onSearch: (keyword: string) => void;
}
// 検索ワードの入力欄
const SearchInput: React.FC<SearchInputProps> = ({ placeholder = "検索ワードを入力してください", onSearch }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(inputValue);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="flex-grow px-4 py-2 text-lg border-2 border-pink-300 rounded-full focus:outline-none focus:border-pink-500 transition-colors duration-300"
      />
      <button
        onClick={handleSearch}
        className="px-6 py-2 text-lg font-semibold text-white bg-pink-500 rounded-full hover:bg-pink-600 transition-colors duration-300"
      >
        検索
      </button>
    </div>
  );
};

export default SearchInput;

