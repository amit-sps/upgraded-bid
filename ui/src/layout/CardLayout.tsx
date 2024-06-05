import React, { ReactNode, useState, useEffect } from "react";
import { gradientColors } from "../assets";



interface CardLayoutProps {
  child: ReactNode;
  count: number;
}

const CardLayout: React.FC<CardLayoutProps> = ({ child, count }) => {
  const [usedGradientIndexes, setUsedGradientIndexes] = useState<number[]>([]);

  const getRandomGradientIndex = (): number => {
    const availableIndexes = gradientColors
      .map((_, index) => index)
      .filter(index => !usedGradientIndexes.includes(index));
    const randomIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
    return randomIndex;
  };

  useEffect(() => {
    const randomIndex = getRandomGradientIndex();
    setUsedGradientIndexes([...usedGradientIndexes, randomIndex]);
  }, []);

  const randomGradientIndex = usedGradientIndexes[0];
  const randomGradient = gradientColors[randomGradientIndex];

  return (
    <div className="wrapper-bg cursor-pointer border-2 shadow-xl px-4 py-6 rounded-lg transform transition duration-500 hover:scale-110" style={{ background: randomGradient }}>
      <h2 className="title-font font-medium text-3xl text-white">{count}</h2>
      <div className="mt-4 text-white">
        {child}
      </div>
    </div>
  );
};

export default CardLayout;
