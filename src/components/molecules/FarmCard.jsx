import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const FarmCard = ({ farm, onEdit, onDelete }) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary-500">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {farm.name}
            </h3>
            {farm.location && (
              <div className="flex items-center text-gray-600 text-sm">
                <ApperIcon name="MapPin" className="h-4 w-4 mr-1" />
                {farm.location}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              icon="Edit"
              onClick={() => onEdit(farm)}
              className="text-gray-500 hover:text-primary-600"
            />
            <Button
              size="sm"
              variant="ghost"
              icon="Trash2"
              onClick={() => onDelete(farm.Id)}
              className="text-gray-500 hover:text-red-600"
            />
          </div>
        </div>

        {/* Description */}
        {farm.description && (
          <div className="text-gray-600 text-sm leading-relaxed">
            {farm.description}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <Badge variant="secondary" className="text-xs">
            <ApperIcon name="Building2" className="h-3 w-3 mr-1" />
            Farm
          </Badge>
          <div className="text-xs text-gray-500">
            ID: {farm.Id}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FarmCard;