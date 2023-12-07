import React from 'react';
import { Card } from './ui/card';

interface Option {
  label: string;
  count: number | null;
  icon: JSX.Element;
}

const CardStat = ({ option }: { option: Option }) => {
  return (
    <Card className="w-full px-6 py-4 space-y-2">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-2xl">{option.count}</h1>
        <span className="flex items-center justify-center rounded-full w-8 h-8 bg-primary text-white">
          {option.icon}
        </span>
      </div>
      <h2 className="text-sm font-semibold text-muted-foreground">
        {option.label}
      </h2>
    </Card>
  );
};

export default CardStat;
