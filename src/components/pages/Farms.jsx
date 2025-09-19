import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { farmService } from "@/services/api/farmService";
import ApperIcon from "@/components/ApperIcon";
import Textarea from "@/components/atoms/Textarea";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";

const Farms = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    type: '',
    size: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await farmService.getAll();
      setFarms(data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
if (!formData.name.trim() || !formData.location.trim()) {
      toast.error('Name and location are required');
      return;
    }

    setFormLoading(true);
    try {
      if (editingFarm) {
        const updatedFarm = await farmService.update(editingFarm.Id, formData);
        setFarms(prev => prev.map(f => f.Id === editingFarm.Id ? updatedFarm : f));
        toast.success('Farm updated successfully');
      } else {
        const newFarm = await farmService.create(formData);
        setFarms(prev => [newFarm, ...prev]);
        toast.success('Farm created successfully');
      }
      resetForm();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (farm) => {
    setEditingFarm(farm);
    setFormData({
name: farm.name || '',
      location: farm.location || '',
      description: farm.description || '',
      type: farm.type || '',
      size: farm.size || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (farm) => {
    if (!window.confirm(`Are you sure you want to delete "${farm.name}"?`)) {
      return;
    }

    try {
      await farmService.delete(farm.Id);
      setFarms(prev => prev.filter(f => f.Id !== farm.Id));
      toast.success('Farm deleted successfully');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const resetForm = () => {
setFormData({ name: '', location: '', description: '', type: '', size: '' });
    setEditingFarm(null);
    setShowForm(false);
  };

  const filteredFarms = farms.filter(farm =>
    farm.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farm.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadFarms} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Farms</h1>
          <p className="text-gray-600">Manage your farm locations and properties</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={16} />
          Add Farm
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search farms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  {editingFarm ? 'Edit Farm' : 'Add New Farm'}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetForm}
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter farm name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <Input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Enter farm location"
                    required
                  />
</div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type *
                  </label>
                  <Select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    required
                  >
                    <option value="">Select farm type</option>
                    <option value="Crop Farm">Crop Farm</option>
                    <option value="Livestock Farm">Livestock Farm</option>
                    <option value="Dairy Farm">Dairy Farm</option>
                    <option value="Poultry Farm">Poultry Farm</option>
                    <option value="Mixed Farm">Mixed Farm</option>
                    <option value="Organic Farm">Organic Farm</option>
                    <option value="Greenhouse">Greenhouse</option>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size (acres) *
                  </label>
                  <Input
                    type="number"
                    value={formData.size}
                    onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                    placeholder="Enter farm size in acres"
                    min="0"
                    step="0.1"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter farm description"
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="flex-1"
                    disabled={formLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={formLoading}
                  >
                    {formLoading ? (
                      <ApperIcon name="Loader2" size={16} className="animate-spin" />
                    ) : (
                      editingFarm ? 'Update' : 'Create'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}

      {/* Farms List */}
      {filteredFarms.length === 0 ? (
        <Empty 
          message={searchTerm ? "No farms match your search" : "No farms found"} 
          description={searchTerm ? "Try adjusting your search terms" : "Get started by adding your first farm"}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredFarms.map((farm) => (
            <Card key={farm.Id} className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{farm.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <ApperIcon name="MapPin" size={14} className="mr-1" />
                    {farm.location}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(farm)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ApperIcon name="Edit2" size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(farm)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <ApperIcon name="Trash2" size={14} />
                  </Button>
                </div>
              </div>
              
              {farm.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {farm.description}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  ID: {farm.Id}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Farms;