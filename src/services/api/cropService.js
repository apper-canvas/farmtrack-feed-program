class CropService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'crop_c';
  }

  async getAll() {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
const params = {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "planting_date_c"}},
          {"field": {"Name": "expected_harvest_c"}},
          {"field": {"Name": "field_location_c"}},
          {"field": {"Name": "quantity_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.success) {
        console.error("Failed to fetch crops:", response?.message);
        throw new Error(response?.message || "Failed to fetch crops");
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      // Map database field names to UI field names for backward compatibility
      return response.data.map(crop => ({
        Id: crop.Id,
        name: crop.name_c,
        variety: crop.variety_c,
plantingDate: crop.planting_date_c,
expectedHarvest: crop.expected_harvest_c,
        fieldLocation: crop.field_location_c,
        quantity: crop.quantity_c,
        status: crop.status_c,
        notes: crop.notes_c
      }));
    } catch (error) {
      console.error("Error fetching crops:", error?.response?.data?.message || error);
      throw new Error(error?.message || "Failed to fetch crops");
    }
  }

  async getById(id) {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const params = {
fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "variety_c"}},
{"field": {"Name": "planting_date_c"}},
          {"field": {"Name": "expected_harvest_c"}},
          {"field": {"Name": "field_location_c"}},
          {"field": {"Name": "quantity_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.success) {
        console.error(`Failed to fetch crop ${id}:`, response?.message);
        throw new Error(response?.message || "Crop not found");
      }
      
      if (!response.data) {
        throw new Error("Crop not found");
      }
      
      // Map database field names to UI field names
      return {
        Id: response.data.Id,
        name: response.data.name_c,
        variety: response.data.variety_c,
plantingDate: response.data.planting_date_c,
        expectedHarvest: response.data.expected_harvest_c,
        fieldLocation: response.data.field_location_c,
        quantity: response.data.quantity_c,
        status: response.data.status_c,
        notes: response.data.notes_c
      };
    } catch (error) {
      console.error(`Error fetching crop ${id}:`, error?.response?.data?.message || error);
      throw new Error(error?.message || "Crop not found");
    }
  }

  async create(cropData) {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Map UI field names to database field names
      const params = {
        records: [{
name_c: cropData.name,
          variety_c: cropData.variety,
          planting_date_c: cropData.plantingDate ? cropData.plantingDate : null,
expected_harvest_c: cropData.expectedHarvest ? cropData.expectedHarvest : null,
          field_location_c: cropData.fieldLocation,
          quantity_c: parseFloat(cropData.quantity) || 0,
          status_c: cropData.status,
          notes_c: cropData.notes
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to create crop:", response.message);
        throw new Error(response.message);
      }
      
if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} crops:`, JSON.stringify(failed));
          const errorMessages = failed.flatMap(record => {
            const errors = record.errors?.map(error => `${error.fieldLabel}: ${error}`) || [];
            if (record.message) errors.push(record.message);
            return errors;
          });
          throw new Error(errorMessages.join(', ') || 'Failed to create crop');
        }
        
        if (successful.length > 0) {
          const createdCrop = successful[0].data;
          // Map back to UI field names
          return {
            Id: createdCrop.Id,
            name: createdCrop.name_c,
            variety: createdCrop.variety_c,
plantingDate: createdCrop.planting_date_c,
            expectedHarvest: createdCrop.expected_harvest_c,
            fieldLocation: createdCrop.field_location_c,
            quantity: createdCrop.quantity_c,
            status: createdCrop.status_c,
            notes: createdCrop.notes_c
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating crop:", error?.response?.data?.message || error);
      throw new Error(error?.message || "Failed to create crop");
    }
  }

  async update(id, cropData) {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Map UI field names to database field names
      const params = {
        records: [{
          Id: parseInt(id),
          name_c: cropData.name,
          variety_c: cropData.variety,
planting_date_c: cropData.plantingDate ? cropData.plantingDate : null,
expected_harvest_c: cropData.expectedHarvest ? cropData.expectedHarvest : null,
          field_location_c: cropData.fieldLocation,
          quantity_c: parseFloat(cropData.quantity) || 0,
          status_c: cropData.status,
          notes_c: cropData.notes
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to update crop:", response.message);
        throw new Error(response.message);
      }
      
if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} crops:`, JSON.stringify(failed));
          const errorMessages = failed.flatMap(record => {
            const errors = record.errors?.map(error => `${error.fieldLabel}: ${error}`) || [];
            if (record.message) errors.push(record.message);
            return errors;
          });
          throw new Error(errorMessages.join(', ') || 'Failed to update crop');
        }
        
        if (successful.length > 0) {
          const updatedCrop = successful[0].data;
          // Map back to UI field names
          return {
            Id: updatedCrop.Id,
            name: updatedCrop.name_c,
            variety: updatedCrop.variety_c,
plantingDate: updatedCrop.planting_date_c,
            expectedHarvest: updatedCrop.expected_harvest_c,
            fieldLocation: updatedCrop.field_location_c,
            quantity: updatedCrop.quantity_c,
            status: updatedCrop.status_c,
            notes: updatedCrop.notes_c
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating crop:", error?.response?.data?.message || error);
      throw new Error(error?.message || "Failed to update crop");
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
        console.error("Failed to delete crop:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} crops:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting crop:", error?.response?.data?.message || error);
      throw new Error(error?.message || "Failed to delete crop");
    }
  }
}

export const cropService = new CropService();