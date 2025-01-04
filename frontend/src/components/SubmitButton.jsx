import React from "react";
// 使わなくなっちゃったボタンコンポーネントのことを忘れないように残しておくお前は俺の記憶に残り続けるよ
const SubmitButton = ({ onSubmit }) => (
  <button onClick={onSubmit}>検索</button>
);

export default SubmitButton;
