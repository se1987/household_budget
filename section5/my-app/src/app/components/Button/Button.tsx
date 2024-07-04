import React from 'react';

interface ButtonProps {
  value: string;
  buttonType?: 'submit' | 'reset' | 'button'; // オプショナルにする
  clickFunc?: () => void; // オプショナルにする
}

// デフォルトプロパティ設定
// clickFunc: () => {} // 何もしない関数

const Button: React.FC<ButtonProps> = ({
  value,
  buttonType,
  clickFunc = () => {},
}: ButtonProps) => {
  return (
    <button
      className="w-full m-4 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
      type={buttonType}
      onClick={clickFunc}
    >
      {value}
    </button>
  );
};

export default Button;
