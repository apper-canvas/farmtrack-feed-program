import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue,
  color = "primary" 
}) => {
  const colorClasses = {
    primary: "from-primary-500 to-primary-600 text-white",
    secondary: "from-secondary-500 to-secondary-600 text-white", 
    accent: "from-accent-500 to-accent-600 text-white",
    success: "from-green-500 to-green-600 text-white",
    warning: "from-yellow-500 to-yellow-600 text-white",
    info: "from-blue-500 to-blue-600 text-white"
  };

  const getTrendColor = (trend) => {
    if (trend === "up") return "text-green-600";
    if (trend === "down") return "text-red-600";
    return "text-gray-600";
  };

  const getTrendIcon = (trend) => {
    if (trend === "up") return "TrendingUp";
    if (trend === "down") return "TrendingDown";
    return "Minus";
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
          {trend && (
            <div className={`flex items-center space-x-1 text-sm ${getTrendColor(trend)}`}>
              <ApperIcon name={getTrendIcon(trend)} className="h-4 w-4" />
              <span className="font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        
        <div className={`flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
          <ApperIcon name={icon} className="h-8 w-8" />
        </div>
      </div>
      
      <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 opacity-10"></div>
    </Card>
  );
};

export default StatsCard;