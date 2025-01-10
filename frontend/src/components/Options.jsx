import React, { useState } from "react";
import DistanceSelector from "./DistanceSelector";
import CheckboxGroup from "./CheckboxGroup";

// オプションの定義
export const mainOptions = [
  { value: "free_food", label: "食べ放題" },
  { value: "free_drink", label: "飲み放題" },
  { value: "lunch", label: "ランチ営業あり" },
  { value: "course", label: "コースあり" },
  { value: "non_smoking", label: "禁煙" },
  { value: "card", label: "カード支払い可" },
  { value: "private_room", label: "個室あり" },
  { value: "parking", label: "駐車場あり" },
  { value: "barrier_free", label: "バリアフリー" },
  { value: "midnight", label: "23時以降も営業" },
  { value: "midnight_meal", label: "23時以降食事OK" },
  { value: "pet", label: "ペット可" },
  { value: "child", label: "お子様連れOK" },
  { value: "wifi", label: "Wi-Fiあり" },
  { value: "tatami", label: "座敷あり" },
  { value: "horigotatsu", label: "掘りごたつあり" },
];

export const subOptions = [
  { value: "open_air", label: "オープンエア" },
  { value: "night_view", label: "夜景がキレイ" },
  { value: "sommelier", label: "ソムリエがいる" },
  { value: "show", label: "ライブ・ショーあり" },
  { value: "equipment", label: "エンタメ設備あり" },
  { value: "karaoke", label: "カラオケあり" },
  { value: "band", label: "バンド演奏可" },
  { value: "charter", label: "貸切" },
  { value: "wedding", label: "結婚式二次会等" },
  { value: "tv", label: "TV・プロジェクターあり" },
  { value: "sake", label: "日本酒が充実" },
  { value: "wine", label: "ワインが充実" },
  { value: "cocktail", label: "カクテルが充実" },
  { value: "shochu", label: "焼酎が充実" },
  { value: "english", label: "英語メニューあり" },
  { value: "ktai", label: "携帯電話OK" },
];


const Options = ({
  selectedDistance,
  onDistanceChange,
  onMainOptionsChange,
  onSubOptionsChange,
  initialMainOptions = {},
  initialSubOptions = {},
}) => {
  const [showMainOptions, setShowMainOptions] = useState(false);
  const [showSubOptions, setShowSubOptions] = useState(false);
  
  // 初期化
  const [checkedMainStates, setCheckedMainStates] = useState(
    mainOptions.reduce((acc, option) => {
      acc[option.value] = initialMainOptions[option.value] || false;
      return acc;
    }, {})
  );
  
  // 上に同じ
  const [checkedSubStates, setCheckedSubStates] = useState(
    subOptions.reduce((acc, option) => {
      acc[option.value] = initialSubOptions[option.value] || false;
      return acc;
    }, {})
  );

  // チェックされた
  const handleMainCheckboxChange = (value) => {
    setCheckedMainStates((prev) => {
      const updated = { ...prev, [value]: !prev[value] };
      onMainOptionsChange(updated);
      return updated;
    });
  };

  // 上に
  const handleSubCheckboxChange = (value) => {
    setCheckedSubStates((prev) => {
      const updated = { ...prev, [value]: !prev[value] };
      onSubOptionsChange(updated);
      return updated;
    });
  };

  return (
    <div className="bg-pink-50 p-6 rounded-3xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-pink-600">距離</h2>
      <DistanceSelector
        options={[
          { value: "1", label: "300m" },
          { value: "2", label: "500m" },
          { value: "3", label: "1000m" },
          { value: "4", label: "2000m" },
          { value: "5", label: "3000m" },
        ]}
        selectedValue={selectedDistance}
        onChange={onDistanceChange}
      />

      <div className="mt-6">
        <h3
          onClick={() => setShowMainOptions((prev) => !prev)}
          className="text-xl font-semibold mb-2 text-pink-500 cursor-pointer hover:text-pink-600 transition-colors"
        >
          メインオプション {showMainOptions ? "▼" : "▶"}
        </h3>
        {showMainOptions && (
          <div className="bg-white p-4 rounded-2xl">
            <CheckboxGroup
              options={mainOptions}
              checkedStates={checkedMainStates}
              onChange={handleMainCheckboxChange}
            />
          </div>
        )}
      </div>

      <div className="mt-6">
        <h3
          onClick={() => setShowSubOptions((prev) => !prev)}
          className="text-xl font-semibold mb-2 text-pink-500 cursor-pointer hover:text-pink-600 transition-colors"
        >
          サブオプション {showSubOptions ? "▼" : "▶"}
        </h3>
        {showSubOptions && (
          <div className="bg-white p-4 rounded-2xl">
            <CheckboxGroup
              options={subOptions}
              checkedStates={checkedSubStates}
              onChange={handleSubCheckboxChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Options;