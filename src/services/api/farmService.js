class FarmService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'farms_c';
  }

  async getAll() {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const params = {
fields: [
{"field": {"Name": "name_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "size_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.success) {
        console.error("Failed to fetch farms:", response?.message);
        throw new Error(response?.message || "Failed to fetch farms");
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      // Map database field names to UI field names for backward compatibility
      return response.data.map(farm => ({
        Id: farm.Id,
name: farm.name_c,
        location: farm.location_c,
        description: farm.description_c,
        type: farm.type_c,
        size: farm.size_c
      }));
    } catch (error) {
      console.error("Error fetching farms:", error?.response?.data?.message || error);
      throw new Error(error?.message || "Failed to fetch farms");
    }
  }

  async getById(id) {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const params = {
fields: [
{"field": {"Name": "name_c"}},
{"field": {"Name": "location_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "size_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.success) {
        console.error(`Failed to fetch farm ${id}:`, response?.message);
        throw new Error(response?.message || "Farm not found");
      }
      
      if (!response.data) {
        throw new Error("Farm not found");
      }
      
      // Map database field names to UI field names
      return {
        Id: response.data.Id,
name: response.data.name_c,
        location: response.data.location_c,
        description: response.data.description_c,
        type: response.data.type_c,
        size: response.data.size_c
      };
    } catch (error) {
      console.error(`Error fetching farm ${id}:`, error?.response?.data?.message || error);
      throw new Error(error?.message || "Farm not found");
    }
  }

  async create(farmData) {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Map UI field names to database field names
      const params = {
        records: [{
name_c: farmData.name,
          location_c: farmData.location,
          description_c: farmData.description,
          type_c: farmData.type,
          size_c: farmData.size
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to create farm:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} farms:`, JSON.stringify(failed));
          const errorMessages = failed.flatMap(record => {
            const errors = record.errors?.map(error => `${error.fieldLabel}: ${error}`) || [];
            if (record.message) errors.push(record.message);
            return errors;
          });
          throw new Error(errorMessages.join(', ') || 'Failed to create farm');
        }
        
        if (successful.length > 0) {
          const createdFarm = successful[0].data;
          // Map back to UI field names
          return {
            Id: createdFarm.Id,
name: createdFarm.name_c,
location: createdFarm.location_c,
description: createdFarm.description_c,
            type: createdFarm.type_c,
            size: createdFarm.size_c
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating farm:", error?.response?.data?.message || error);
      throw new Error(error?.message || "Failed to create farm");
    }
  }

  async update(id, farmData) {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Map UI field names to database field names
      const params = {
        records: [{
          Id: parseInt(id),
name_c: farmData.name,
          location_c: farmData.location,
          description_c: farmData.description,
          type_c: farmData.type,
          size_c: farmData.size
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to update farm:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} farms:`, JSON.stringify(failed));
          const errorMessages = failed.flatMap(record => {
            const errors = record.errors?.map(error => `${error.fieldLabel}: ${error}`) || [];
            if (record.message) errors.push(record.message);
            return errors;
          });
          throw new Error(errorMessages.join(', ') || 'Failed to update farm');
        }
        
if (successful.length > 0) {
          const updatedFarm = successful[0].data;
          // Map back to UI field names
          return {
            Id: updatedFarm.Id,
name: updatedFarm.name_c,
            location: updatedFarm.location_c,
            description: updatedFarm.description_c,
            type: updatedFarm.type_c,
            size: updatedFarm.size_c
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating farm:", error?.response?.data?.message || error);
      throw new Error(error?.message || "Failed to update farm");
    }
  }

  async delete(id) {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to delete farm:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} farms:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting farm:", error?.response?.data?.message || error);
      throw new Error(error?.message || "Failed to delete farm");
    }
  }
}

export const farmService = new FarmService();