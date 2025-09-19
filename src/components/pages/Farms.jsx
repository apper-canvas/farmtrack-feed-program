import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import FarmCard from "@/components/molecules/FarmCard";
import FarmForm from "@/components/organisms/FarmForm";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { farmService } from "@/services/api/farmService";

const Farms = () => {
  const [farms, setFarms] = useState([]);
  const [filteredFarms, setFilteredFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadFarms();
  }, []);

  useEffect(() => {
    filterFarms();
  }, [farms, searchTerm]);

  const loadFarms = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await farmService.getAll();
      setFarms(data);
    } catch (error) {
      setError(error.message || "Failed to load farms");
    } finally {
      setLoading(false);
    }
  };

  const filterFarms = () => {
    let filtered = [...farms];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(farm =>
        farm.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farm.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farm.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFarms(filtered);
  };

  const handleAddFarm = () => {
    setEditingFarm(null);
    setShowForm(true);
  };

  const handleEditFarm = (farm) => {
    setEditingFarm(farm);
    setShowForm(true);
  };

  const handleDeleteFarm = async (farmId) => {
    if (window.confirm("Are you sure you want to delete this farm?")) {
      try {
        await farmService.delete(farmId);
        toast.success("Farm deleted successfully!");
        loadFarms();
      } catch (error) {
        toast.error("Failed to delete farm");
      }
    }
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditingFarm(null);
    loadFarms();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingFarm(null);
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              {editingFarm ? "Edit Farm" : "Add New Farm"}
            </h1>
            <p className="text-gray-600 mt-2">
              {editingFarm ? "Update farm information" : "Add a new farm to your operations"}
            </p>
          </div>
        </div>
        <FarmForm
          farm={editingFarm}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      </div>
    );
  }

  if (loading) return <Loading variant="list" />;
  if (error) return <Error message={error} onRetry={loadFarms} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Farm Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage all your farm locations and properties
          </p>
        </div>
        <Button
          onClick={handleAddFarm}
          icon="Plus"
          variant="primary"
          size="lg"
        >
          Add New Farm
        </Button>
      </div>

      {/* Search */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search farms by name, location, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {/* Stats */}
      {farms.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="text-2xl font-bold text-green-800">
              {farms.length}
            </div>
            <div className="text-sm text-green-600 font-medium">Total Farms</div>
          </Card>
          <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="text-2xl font-bold text-blue-800">
              {farms.filter(f => f.location).length}
            </div>
            <div className="text-sm text-blue-600 font-medium">With Locations</div>
          </Card>
          <Card className="text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="text-2xl font-bold text-purple-800">
              {farms.filter(f => f.description).length}
            </div>
            <div className="text-sm text-purple-600 font-medium">With Descriptions</div>
          </Card>
        </div>
      )}

      {/* Farms Grid */}
      {filteredFarms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarms.map((farm) => (
            <FarmCard
              key={farm.Id}
              farm={farm}
              onEdit={handleEditFarm}
              onDelete={handleDeleteFarm}
            />
          ))}
        </div>
      ) : farms.length === 0 ? (
        <Empty
          title="No farms found"
          description="Start by adding your first farm to begin managing your farm operations"
          icon="TreePine"
          actionLabel="Add First Farm"
          onAction={handleAddFarm}
        />
      ) : (
        <Card className="text-center py-12">
          <ApperIcon name="Search" className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No farms match your search</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
          <Button
            onClick={() => setSearchTerm("")}
            variant="outline"
          >
            Clear Search
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Farms;