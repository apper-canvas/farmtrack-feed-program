class FinancialService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'financial_c';
  }

  async getAll() {
    try {
      await new Promise(resolve => setTimeout(resolve, 280));
      
      const params = {
        fields: [
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "crop_id_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.success) {
        console.error("Failed to fetch financial records:", response?.message);
        throw new Error(response?.message || "Failed to fetch financial records");
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      // Map database field names to UI field names for backward compatibility
      return response.data.map(financial => ({
        Id: financial.Id,
        type: financial.type_c,
        category: financial.category_c,
        amount: financial.amount_c,
        description: financial.description_c,
        date: financial.date_c,
        cropId: financial.crop_id_c
      }));
    } catch (error) {
      console.error("Error fetching financial records:", error?.response?.data?.message || error);
      throw new Error(error?.message || "Failed to fetch financial records");
    }
  }

  async getById(id) {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const params = {
        fields: [
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "crop_id_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.success) {
        console.error(`Failed to fetch financial record ${id}:`, response?.message);
        throw new Error(response?.message || "Financial record not found");
      }
      
      if (!response.data) {
        throw new Error("Financial record not found");
      }
      
      // Map database field names to UI field names
      return {
        Id: response.data.Id,
        type: response.data.type_c,
        category: response.data.category_c,
        amount: response.data.amount_c,
        description: response.data.description_c,
        date: response.data.date_c,
        cropId: response.data.crop_id_c
      };
    } catch (error) {
      console.error(`Error fetching financial record ${id}:`, error?.response?.data?.message || error);
      throw new Error(error?.message || "Financial record not found");
    }
  }

  async create(financialData) {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Map UI field names to database field names
      const params = {
        records: [{
          type_c: financialData.type,
          category_c: financialData.category,
          amount_c: parseFloat(financialData.amount) || 0,
          description_c: financialData.description,
          date_c: financialData.date ? financialData.date : new Date().toISOString().split('T')[0],
          crop_id_c: financialData.cropId ? parseInt(financialData.cropId) : null
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to create financial record:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} financial records:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const createdFinancial = successful[0].data;
          // Map back to UI field names
          return {
            Id: createdFinancial.Id,
            type: createdFinancial.type_c,
            category: createdFinancial.category_c,
            amount: createdFinancial.amount_c,
            description: createdFinancial.description_c,
            date: createdFinancial.date_c,
            cropId: createdFinancial.crop_id_c
          };
        }
      }
      
      throw new Error("Failed to create financial record");
    } catch (error) {
      console.error("Error creating financial record:", error?.response?.data?.message || error);
      throw new Error(error?.message || "Failed to create financial record");
    }
  }

  async update(id, financialData) {
    try {
      await new Promise(resolve => setTimeout(resolve, 350));
      
      // Map UI field names to database field names
      const params = {
        records: [{
          Id: parseInt(id),
          type_c: financialData.type,
          category_c: financialData.category,
          amount_c: parseFloat(financialData.amount) || 0,
          description_c: financialData.description,
          date_c: financialData.date ? financialData.date : null,
          crop_id_c: financialData.cropId ? parseInt(financialData.cropId) : null
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to update financial record:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} financial records:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updatedFinancial = successful[0].data;
          // Map back to UI field names
          return {
            Id: updatedFinancial.Id,
            type: updatedFinancial.type_c,
            category: updatedFinancial.category_c,
            amount: updatedFinancial.amount_c,
            description: updatedFinancial.description_c,
            date: updatedFinancial.date_c,
            cropId: updatedFinancial.crop_id_c
          };
        }
      }
      
      throw new Error("Failed to update financial record");
    } catch (error) {
      console.error("Error updating financial record:", error?.response?.data?.message || error);
      throw new Error(error?.message || "Failed to update financial record");
    }
  }

  async delete(id) {
    try {
      await new Promise(resolve => setTimeout(resolve, 250));
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to delete financial record:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} financial records:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting financial record:", error?.response?.data?.message || error);
      throw new Error(error?.message || "Failed to delete financial record");
    }
  }
}

export const financialService = new FinancialService();