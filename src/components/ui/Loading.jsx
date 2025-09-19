import React from "react";
import Card from "@/components/atoms/Card";

const LoadingSkeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded-lg ${className}`} 
       style={{
         animation: "shimmer 2s infinite linear",
         backgroundImage: "linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)"
       }} />
);

const Loading = ({ variant = "default" }) => {
  if (variant === "dashboard") {
    return (
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="space-y-4">
              <div className="flex items-center space-x-3">
                <LoadingSkeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <LoadingSkeleton className="h-4 w-24" />
                  <LoadingSkeleton className="h-6 w-16" />
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="space-y-4">
            <LoadingSkeleton className="h-6 w-32" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <LoadingSkeleton className="h-4 w-4 rounded" />
                  <LoadingSkeleton className="h-4 flex-1" />
                  <LoadingSkeleton className="h-6 w-16 rounded-full" />
                </div>
              ))}
            </div>
          </Card>
          
          <Card className="space-y-4">
            <LoadingSkeleton className="h-6 w-40" />
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="space-y-2">
                    <LoadingSkeleton className="h-4 w-32" />
                    <LoadingSkeleton className="h-3 w-24" />
                  </div>
                  <LoadingSkeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="space-y-4 p-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="flex items-center space-x-4">
            <LoadingSkeleton className="h-16 w-16 rounded-lg" />
            <div className="flex-1 space-y-2">
              <LoadingSkeleton className="h-5 w-48" />
              <LoadingSkeleton className="h-4 w-32" />
              <LoadingSkeleton className="h-4 w-24" />
            </div>
            <div className="space-y-2">
              <LoadingSkeleton className="h-6 w-20 rounded-full" />
              <LoadingSkeleton className="h-4 w-16" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="h-16 w-16 mx-auto border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 h-16 w-16 mx-auto border-4 border-transparent border-t-accent-500 rounded-full animate-spin" 
               style={{ animationDirection: "reverse", animationDuration: "1.5s" }}></div>
        </div>
        <div className="space-y-2">
          <LoadingSkeleton className="h-4 w-32 mx-auto" />
          <LoadingSkeleton className="h-3 w-24 mx-auto" />
        </div>
      </div>
    </div>
  );
};

export default Loading;