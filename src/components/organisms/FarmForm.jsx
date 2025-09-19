import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import ApperIcon from "@/components/ApperIcon";
import { farmService } from "@/services/api/farmService";

const FarmForm = ({ farm, onSave, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: ""
  });

  useEffect(() => {
    if (farm) {
      setFormData({
        name: farm.name || "",
        location: farm.location || "",
        description: farm.description || ""
      });
    }
  }, [farm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Farm name is required");
      return;
    }

    setLoading(true);

    try {
      if (farm) {
        await farmService.update(farm.Id, formData);
        toast.success("Farm updated successfully!");
      } else {
        await farmService.create(formData);
        toast.success("Farm created successfully!");
      }
      
      onSave();
    } catch (error) {
      toast.error(error.message || `Failed to ${farm ? "update" : "create"} farm`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Farm Name */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Farm Name *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter farm name"
              required
            />
          </div>

          {/* Location */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <Input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="Enter farm location"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter farm description..."
              rows={4}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            icon={farm ? "Save" : "Plus"}
          >
            {farm ? "Update Farm" : "Create Farm"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default FarmForm;