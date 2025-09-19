import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";

const FarmCard = ({ farm, onEdit, onDelete }) => {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-md">
            <ApperIcon name="TreePine" className="h-6 w-6 text-green-700" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">{farm.name}</h3>
            {farm.location && (
              <p className="text-sm text-gray-600 flex items-center space-x-1">
                <ApperIcon name="MapPin" className="h-4 w-4" />
                <span>{farm.location}</span>
              </p>
            )}
          </div>
        </div>
      </div>
      
      {farm.description && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700 leading-relaxed">{farm.description}</p>
        </div>
      )}
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(farm)}
          icon="Edit"
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(farm.Id)}
          icon="Trash2"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          Delete
        </Button>
      </div>
    </Card>
  );
};

export default FarmCard;