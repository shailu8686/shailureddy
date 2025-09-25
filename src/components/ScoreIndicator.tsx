import React from 'react';

interface ScoreIndicatorProps {
  score: number;
}

export const ScoreIndicator: React.FC<ScoreIndicatorProps> = ({ score }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreWidth = (score: number) => `${score}%`;

  return (
    <div className="flex items-center gap-2">
      <span className={`px-2 py-1 rounded text-sm font-medium ${getScoreColor(score)}`}>
        {score}
      </span>
      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-20">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: getScoreWidth(score) }}
        />
      </div>
    </div>
  );
};
