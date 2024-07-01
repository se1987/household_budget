import React from 'react';

// propsの型を定義
interface TitleProps {
  value: string;
}

const Title:React.FC<TitleProps> = ({ value }) => {
  return (
    <div className="flex items-center justify-center bg-blue-90">
      <h1 className="text-2xl font-bold mb-4">{ value }</h1>
    </div>
  )
}

export default Title