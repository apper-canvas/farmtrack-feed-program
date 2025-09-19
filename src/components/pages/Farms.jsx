import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Textarea from '@/components/atoms/Textarea';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import farmService from '@/services/api/farmService';

const Farms = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [formData, setFormData] = useState({
    Name: '',
    Location: '',
    Size: '',
    SoilType: 'Loamy',
    EstablishedDate: '',
    Status: 'Active',
    Description: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  const soilTypes = [
    { value: 'Loamy', label: 'Loamy' },
    { value: 'Clay', label: 'Clay' },
    { value: 'Sandy', label: 'Sandy' },
    { value: 'Silty', label: 'Silty' },
    { value: 'Peaty', label: 'Peaty' },
    { value: 'Chalky', label: 'Chalky' }
  ];

  const statuses = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Maintenance', label: 'Under Maintenance' },
    { value: 'Planning', label: 'Planning Phase' }
  ];

  const fetchFarms = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await farmService.getAll();
      setFarms(data || []);
    } catch (err) {
      setError('Failed to load farms');
      console.error('Error loading farms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const openModal = (farm = null) => {
    if (farm) {
      setEditingFarm(farm);
      setFormData({
        Name: farm.Name || '',
        Location: farm.Location || '',
        Size: farm.Size?.toString() || '',
        SoilType: farm.SoilType || 'Loamy',
        EstablishedDate: farm.EstablishedDate ? farm.EstablishedDate.split('T')[0] : '',
        Status: farm.Status || 'Active',
        Description: farm.Description || ''
      });
    } else {
      setEditingFarm(null);
      setFormData({
        Name: '',
        Location: '',
        Size: '',
        SoilType: 'Loamy',
        EstablishedDate: '',
        Status: 'Active',
        Description: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFarm(null);
    setFormData({
      Name: '',
      Location: '',
      Size: '',
      SoilType: 'Loamy',
      EstablishedDate: '',
      Status: 'Active',
      Description: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.Name.trim()) {
      toast.error('Farm name is required');
      return;
    }

    if (!formData.Location.trim()) {
      toast.error('Location is required');
      return;
    }

    setFormLoading(true);
    try {
      let result;
      if (editingFarm) {
        result = await farmService.update(editingFarm.Id, formData);
      } else {
        result = await farmService.create(formData);
      }

      if (result) {
        await fetchFarms();
        closeModal();
      }
    } catch (err) {
      console.error('Error saving farm:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (farm) => {
    if (window.confirm(`Are you sure you want to delete "${farm.Name}"? This action cannot be undone.`)) {
      const success = await farmService.delete(farm.Id);
      if (success) {
        await fetchFarms();
      }
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <Loading message="Loading farms..." />;
  }

  if (error) {
    return <Error message={error} onRetry={fetchFarms} />;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Farm Management</h1>
          <p className="text-gray-600 mt-1">Manage your farm properties and locations</p>
        </div>
        <Button
          onClick={() => openModal()}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={16} />
          Add Farm
        </Button>
      </div>

      {/* Farms List */}
      {farms.length === 0 ? (
        <Empty 
          message="No farms found" 
          description="Get started by adding your first farm"
          actionLabel="Add Farm"
          onAction={() => openModal()}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm) => (
            <motion.div
              key={farm.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {farm.Name}
                      </h3>
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <ApperIcon name="MapPin" size={14} className="mr-1" />
                        {farm.Location}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(farm.Status)}`}>
                      {farm.Status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Size:</span>
                      <span className="font-medium">{farm.Size} acres</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Soil Type:</span>
                      <span className="font-medium">{farm.SoilType}</span>
                    </div>
                    {farm.EstablishedDate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Established:</span>
                        <span className="font-medium">
                          {new Date(farm.EstablishedDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {farm.Description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {farm.Description}
                    </p>
                  )}

                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openModal(farm)}
                      className="flex items-center gap-1"
                    >
                      <ApperIcon name="Edit2" size={14} />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(farm)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      <ApperIcon name="Trash2" size={14} />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingFarm ? 'Edit Farm' : 'Add New Farm'}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={closeModal}
                  className="p-2"
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Farm Name *"
                    name="Name"
                    value={formData.Name}
                    onChange={handleInputChange}
                    placeholder="Enter farm name"
                    required
                  />

                  <Input
                    label="Location *"
                    name="Location"
                    value={formData.Location}
                    onChange={handleInputChange}
                    placeholder="Enter location"
                    required
                  />

                  <Input
                    label="Size (acres)"
                    name="Size"
                    type="number"
                    value={formData.Size}
                    onChange={handleInputChange}
                    placeholder="Enter size in acres"
                    min="0"
                    step="0.01"
                  />

                  <Select
                    label="Soil Type"
                    name="SoilType"
                    value={formData.SoilType}
                    onChange={handleInputChange}
                    options={soilTypes}
                  />

                  <Input
                    label="Established Date"
                    name="EstablishedDate"
                    type="date"
                    value={formData.EstablishedDate}
                    onChange={handleInputChange}
                  />

                  <Select
                    label="Status"
                    name="Status"
                    value={formData.Status}
                    onChange={handleInputChange}
                    options={statuses}
                  />
                </div>

                <Textarea
                  label="Description"
                  name="Description"
                  value={formData.Description}
                  onChange={handleInputChange}
                  placeholder="Enter farm description (optional)"
                  rows={3}
                />

                <div className="flex justify-end gap-3 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeModal}
                    disabled={formLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={formLoading}
                    className="flex items-center gap-2"
                  >
                    {formLoading && <ApperIcon name="Loader2" size={16} className="animate-spin" />}
                    {editingFarm ? 'Update Farm' : 'Create Farm'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Farms;