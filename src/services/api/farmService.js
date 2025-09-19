const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const farmService = {
  async getAll() {
    await delay(200);
    try {
      // Initialize ApperClient with Project ID and Public Key
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name"}},
          {"field": {"Name": "location"}},
          {"field": {"Name": "acreage"}},
          {"field": {"Name": "soilType"}},
          {"field": {"Name": "cropTypes"}},
          {"field": {"Name": "ownershipType"}},
          {"field": {"Name": "acquisitionDate"}},
          {"field": {"Name": "notes"}}
        ],
        orderBy: [{"fieldName": "name", "sorttype": "ASC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };

      const response = await apperClient.fetchRecords('farm_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching farms:', error?.response?.data?.message || error);
      throw new Error('Failed to load farms');
    }
  },

  async getById(farmId) {
    await delay(150);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name"}},
          {"field": {"Name": "location"}},
          {"field": {"Name": "acreage"}},
          {"field": {"Name": "soilType"}},
          {"field": {"Name": "cropTypes"}},
          {"field": {"Name": "ownershipType"}},
          {"field": {"Name": "acquisitionDate"}},
          {"field": {"Name": "notes"}}
        ]
      };

      const response = await apperClient.getRecordById('farm_c', farmId, params);
      return response.data;
    } catch (error) {
      console.error(`Error fetching farm ${farmId}:`, error?.response?.data?.message || error);
      throw new Error('Failed to load farm details');
    }
  },

  async create(farmData) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          name: farmData.name,
          location: farmData.location,
          acreage: farmData.acreage,
          soilType: farmData.soilType || null,
          cropTypes: farmData.cropTypes || null,
          ownershipType: farmData.ownershipType || null,
          acquisitionDate: farmData.acquisitionDate || null,
          notes: farmData.notes || null
        }]
      };

      const response = await apperClient.createRecord('farm_c', params);
      
      if (!response.success) {
        console.error('Create farm failed:', response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create farm:`, failed);
          throw new Error(failed[0].message || 'Failed to create farm');
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error('Error creating farm:', error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(farmId, farmData) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: farmId,
          name: farmData.name,
          location: farmData.location,
          acreage: farmData.acreage,
          soilType: farmData.soilType || null,
          cropTypes: farmData.cropTypes || null,
          ownershipType: farmData.ownershipType || null,
          acquisitionDate: farmData.acquisitionDate || null,
          notes: farmData.notes || null
        }]
      };

      const response = await apperClient.updateRecord('farm_c', params);
      
      if (!response.success) {
        console.error('Update farm failed:', response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update farm:`, failed);
          throw new Error(failed[0].message || 'Failed to update farm');
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error('Error updating farm:', error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(farmId) {
    await delay(250);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = { 
        RecordIds: [farmId]
      };

      const response = await apperClient.deleteRecord('farm_c', params);
      
      if (!response.success) {
        console.error('Delete farm failed:', response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete farm:`, failed);
          throw new Error(failed[0].message || 'Failed to delete farm');
        }
        
        return successful.length === 1;
      }
    } catch (error) {
      console.error('Error deleting farm:', error?.response?.data?.message || error);
      throw error;
    }
  }
};