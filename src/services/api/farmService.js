import { toast } from 'react-toastify';

// Delay function for realistic API simulation
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class FarmService {
  constructor() {
    this.tableName = 'farm_c';
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) {
        this.initializeClient();
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Location"}},
          {"field": {"Name": "Size"}},
          {"field": {"Name": "SoilType"}},
          {"field": {"Name": "EstablishedDate"}},
          {"field": {"Name": "Status"}},
          {"field": {"Name": "Description"}}
        ],
        orderBy: [{"fieldName": "Name", "sorttype": "ASC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error('Farm service - Failed to fetch farms:', response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Farm service - Error fetching farms:', error?.response?.data?.message || error.message);
      toast.error('Failed to load farms. Please try again.');
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) {
        this.initializeClient();
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Location"}},
          {"field": {"Name": "Size"}},
          {"field": {"Name": "SoilType"}},
          {"field": {"Name": "EstablishedDate"}},
          {"field": {"Name": "Status"}},
          {"field": {"Name": "Description"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);

      if (!response.success) {
        console.error(`Farm service - Failed to fetch farm ${id}:`, response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Farm service - Error fetching farm ${id}:`, error?.response?.data?.message || error.message);
      toast.error('Failed to load farm details. Please try again.');
      return null;
    }
  }

  async create(farmData) {
    try {
      if (!this.apperClient) {
        this.initializeClient();
      }

      // Filter to only include updateable fields
      const updateableFields = {
        Name: farmData.Name,
        Location: farmData.Location,
        Size: parseFloat(farmData.Size) || 0,
        SoilType: farmData.SoilType,
        EstablishedDate: farmData.EstablishedDate,
        Status: farmData.Status,
        Description: farmData.Description || ''
      };

      const params = {
        records: [updateableFields]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error('Farm service - Failed to create farm:', response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Farm service - Failed to create ${failed.length} farms:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Farm created successfully!');
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error('Farm service - Error creating farm:', error?.response?.data?.message || error.message);
      toast.error('Failed to create farm. Please try again.');
      return null;
    }
  }

  async update(id, farmData) {
    try {
      if (!this.apperClient) {
        this.initializeClient();
      }

      // Filter to only include updateable fields
      const updateableFields = {
        Id: parseInt(id),
        Name: farmData.Name,
        Location: farmData.Location,
        Size: parseFloat(farmData.Size) || 0,
        SoilType: farmData.SoilType,
        EstablishedDate: farmData.EstablishedDate,
        Status: farmData.Status,
        Description: farmData.Description || ''
      };

      const params = {
        records: [updateableFields]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(`Farm service - Failed to update farm ${id}:`, response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Farm service - Failed to update ${failed.length} farms:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Farm updated successfully!');
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error(`Farm service - Error updating farm ${id}:`, error?.response?.data?.message || error.message);
      toast.error('Failed to update farm. Please try again.');
      return null;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) {
        this.initializeClient();
      }

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(`Farm service - Failed to delete farm ${id}:`, response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Farm service - Failed to delete ${failed.length} farms:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Farm deleted successfully!');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error(`Farm service - Error deleting farm ${id}:`, error?.response?.data?.message || error.message);
      toast.error('Failed to delete farm. Please try again.');
      return false;
    }
  }
}

export default new FarmService();