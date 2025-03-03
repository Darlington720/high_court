import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatisticsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({ title, value, icon: Icon, color }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${color}-500`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{value.toLocaleString()}</h3>
        </div>
        <div className={`bg-${color}-100 p-3 rounded-full`}>
          <Icon className={`text-${color}-500`} size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatisticsCard;