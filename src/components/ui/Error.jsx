import React from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong", 
  onRetry,
  showRetry = true,
  variant = "default" 
}) => {
  if (variant === "inline") {
    return (
      <div className="flex items-center justify-center p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg">
        <div className="flex items-center space-x-3">
          <ApperIcon name="AlertCircle" className="h-5 w-5 text-red-500" />
          <span className="text-red-700 font-medium">{message}</span>
          {showRetry && onRetry && (
            <Button variant="ghost" size="sm" onClick={onRetry}>
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <Card className="text-center max-w-md mx-auto bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
        <div className="space-y-6">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-red-100 to-red-200">
            <ApperIcon name="AlertTriangle" className="h-10 w-10 text-red-600" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-red-800">Oops! Something went wrong</h3>
            <p className="text-red-600 leading-relaxed">{message}</p>
          </div>
          
          {showRetry && onRetry && (
            <div className="space-y-3">
              <Button 
                onClick={onRetry} 
                variant="primary"
                icon="RefreshCw"
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
              >
                Try Again
              </Button>
              <p className="text-sm text-red-500">
                If the problem persists, please contact support
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Error;