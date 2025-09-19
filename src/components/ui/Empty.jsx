import React from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found",
  description = "Get started by adding your first item",
  icon = "Inbox",
  actionLabel = "Add Item",
  onAction,
  showAction = true 
}) => {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <Card className="text-center max-w-md mx-auto bg-gradient-to-br from-gray-50 to-blue-50 border-blue-200">
        <div className="space-y-6">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200">
            <ApperIcon name={icon} className="h-10 w-10 text-blue-600" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
          </div>
          
          {showAction && onAction && (
            <div className="space-y-3">
              <Button 
                onClick={onAction} 
                variant="primary"
                icon="Plus"
                size="lg"
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
              >
                {actionLabel}
              </Button>
              <p className="text-sm text-gray-500">
                Start managing your farm operations efficiently
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Empty;