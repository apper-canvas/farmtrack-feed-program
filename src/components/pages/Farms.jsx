import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Textarea from '@/components/atoms/Textarea';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import { farmService } from '@/services/api/farmService';

const Farms = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    acreage: '',
    soilType: '',
    cropTypes: '',
    ownershipType: '',
    acquisitionDate: '',
    notes: ''
  });

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await farmService.getAll();
      setFarms(data || []);
    } catch (err) {
      console.error('Error loading farms:', err);
      setError('Failed to load farms. Please try again.');
      setFarms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      acreage: '',
      soilType: '',
      cropTypes: '',
      ownershipType: '',
      acquisitionDate: '',
      notes: ''
    });
    setEditingFarm(null);
  };

  const openModal = (farm = null) => {
    if (farm) {
      setEditingFarm(farm);
      setFormData({
        name: farm.name || '',
        location: farm.location || '',
        acreage: farm.acreage?.toString() || '',
        soilType: farm.soilType || '',
        cropTypes: farm.cropTypes || '',
        ownershipType: farm.ownershipType || '',
        acquisitionDate: farm.acquisitionDate || '',
        notes: farm.notes || ''
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Farm name is required');
      return;
    }

    if (!formData.location.trim()) {
      toast.error('Location is required');
      return;
    }

    if (!formData.acreage || isNaN(formData.acreage) || Number(formData.acreage) <= 0) {
      toast.error('Please enter a valid acreage');
      return;
    }

    setIsSubmitting(true);
    try {
      const farmData = {
        name: formData.name.trim(),
        location: formData.location.trim(),
        acreage: Number(formData.acreage),
        soilType: formData.soilType.trim(),
        cropTypes: formData.cropTypes.trim(),
        ownershipType: formData.ownershipType.trim(),
        acquisitionDate: formData.acquisitionDate,
        notes: formData.notes.trim()
      };

      if (editingFarm) {
        await farmService.update(editingFarm.Id, farmData);
        toast.success('Farm updated successfully');
      } else {
        await farmService.create(farmData);
        toast.success('Farm created successfully');
      }

      closeModal();
      await loadFarms();
    } catch (err) {
      console.error('Error saving farm:', err);
      toast.error(editingFarm ? 'Failed to update farm' : 'Failed to create farm');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (farm) => {
    if (!deleteConfirm || deleteConfirm.Id !== farm.Id) {
      setDeleteConfirm(farm);
      return;
    }

    try {
      await farmService.delete(farm.Id);
      toast.success('Farm deleted successfully');
      setDeleteConfirm(null);
      await loadFarms();
    } catch (err) {
      console.error('Error deleting farm:', err);
      toast.error('Failed to delete farm');
    }
  };

  const filteredFarms = farms.filter(farm => {
    if (!searchTerm.trim()) return true;
    const search = searchTerm.toLowerCase();
    return (
      farm.name?.toLowerCase().includes(search) ||
      farm.location?.toLowerCase().includes(search) ||
      farm.soilType?.toLowerCase().includes(search) ||
      farm.cropTypes?.toLowerCase().includes(search)
    );
  });

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadFarms} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Farms</h1>
          <p className="text-gray-600 mt-1">Manage your farm properties and locations</p>
        </div>
        <Button onClick={() => openModal()} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          Add Farm
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search farms by name, location, soil type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {filteredFarms.length === 0 ? (
        <Empty
          message={searchTerm ? "No farms match your search" : "No farms found"}
          description={searchTerm ? "Try adjusting your search terms" : "Get started by adding your first farm"}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarms.map((farm) => (
            <Card key={farm.Id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{farm.name}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <ApperIcon name="MapPin" size={14} />
                    {farm.location}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openModal(farm)}
                    className="p-2"
                  >
                    <ApperIcon name="Edit2" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(farm)}
                    className={`p-2 ${
                      deleteConfirm?.Id === farm.Id 
                        ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                        : 'text-gray-500 hover:text-red-600'
                    }`}
                  >
                    <ApperIcon name={deleteConfirm?.Id === farm.Id ? "Check" : "Trash2"} size={16} />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Acreage:</span>
                  <span className="font-medium">{farm.acreage} acres</span>
                </div>
                {farm.soilType && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Soil Type:</span>
                    <span className="font-medium">{farm.soilType}</span>
                  </div>
                )}
                {farm.cropTypes && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Crops:</span>
                    <span className="font-medium">{farm.cropTypes}</span>
                  </div>
                )}
                {farm.ownershipType && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Ownership:</span>
                    <span className="font-medium">{farm.ownershipType}</span>
                  </div>
                )}
              </div>

              {farm.notes && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm text-gray-600">{farm.notes}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingFarm ? 'Edit Farm' : 'Add New Farm'}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeModal}
                  className="p-2"
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Farm Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
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
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Enter farm location"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Acreage *
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.acreage}
                    onChange={(e) => handleInputChange('acreage', e.target.value)}
                    placeholder="Enter acreage"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Soil Type
                  </label>
                  <Input
                    type="text"
                    value={formData.soilType}
                    onChange={(e) => handleInputChange('soilType', e.target.value)}
                    placeholder="e.g., Clay, Sandy, Loam"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Crop Types
                  </label>
                  <Input
                    type="text"
                    value={formData.cropTypes}
                    onChange={(e) => handleInputChange('cropTypes', e.target.value)}
                    placeholder="e.g., Corn, Wheat, Soybeans"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ownership Type
                  </label>
                  <Select
                    value={formData.ownershipType}
                    onChange={(e) => handleInputChange('ownershipType', e.target.value)}
                  >
                    <option value="">Select ownership type</option>
                    <option value="Owned">Owned</option>
                    <option value="Leased">Leased</option>
                    <option value="Rented">Rented</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Acquisition Date
                  </label>
                  <Input
                    type="date"
                    value={formData.acquisitionDate}
                    onChange={(e) => handleInputChange('acquisitionDate', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Additional notes about the farm..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeModal}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <ApperIcon name="Loader2" size={16} className="animate-spin" />
                        {editingFarm ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      editingFarm ? 'Update Farm' : 'Create Farm'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Farms;