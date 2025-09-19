import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { farmService } from "@/services/api/farmService";
import ApperIcon from "@/components/ApperIcon";
import Textarea from "@/components/atoms/Textarea";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";

const FarmForm = ({ farm, onSave, onCancel }) => {
  const [loading, setLoading] = useState(false);
const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    type: "",
    size: ""
  });

  useEffect(() => {
    if (farm) {
setFormData({
        name: farm.name || "",
        location: farm.location || "",
        description: farm.description || "",
        type: farm.type || "",
        size: farm.size || ""
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
{/* Farm Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Farm Type
            </label>
            <Select
              value={formData.type}
              onChange={(value) => handleChange("type", value)}
              placeholder="Select farm type..."
              options={[
                { value: "crop", label: "Crop Farm" },
                { value: "dairy", label: "Dairy Farm" },
                { value: "livestock", label: "Livestock Farm" },
                { value: "mixed", label: "Mixed Farm" },
                { value: "organic", label: "Organic Farm" },
                { value: "poultry", label: "Poultry Farm" },
                { value: "fruit", label: "Fruit Farm" },
                { value: "vegetable", label: "Vegetable Farm" }
              ]}
            />
          </div>

          {/* Farm Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size (Acres)
            </label>
            <Input
              type="number"
              value={formData.size}
              onChange={(e) => handleChange("size", e.target.value)}
              placeholder="Enter farm size in acres..."
              min="0"
              step="0.1"
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