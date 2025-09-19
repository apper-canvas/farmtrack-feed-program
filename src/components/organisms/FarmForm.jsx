import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Card from "@/components/atoms/Card";
import { farmService } from "@/services/api/farmService";

const FarmForm = ({ farm, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: ""
  });

  const [loading, setLoading] = useState(false);

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
      toast.error(error.message || "Failed to save farm");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {farm ? "Edit Farm" : "Add New Farm"}
        </h2>
        <p className="text-gray-600">
          {farm ? "Update farm information" : "Enter details for your new farm"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Farm Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Green Valley Farm, North Fields"
            required
          />

          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Iowa, California, Texas"
            required
          />
        </div>

        <Textarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Brief description of the farm, its features, or specialties..."
          rows={4}
        />

        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon="Save"
            disabled={loading}
          >
            {loading ? "Saving..." : farm ? "Update Farm" : "Add Farm"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default FarmForm;