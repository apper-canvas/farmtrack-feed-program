class TaskService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'task_c';
  }

  async getAll() {
    try {
      await new Promise(resolve => setTimeout(resolve, 250));
      
      const params = {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "crop_id_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "completed_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.success) {
        console.error("Failed to fetch tasks:", response?.message);
        throw new Error(response?.message || "Failed to fetch tasks");
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      // Map database field names to UI field names for backward compatibility
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c,
        description: task.description_c,
        cropId: task.crop_id_c,
        dueDate: task.due_date_c,
        priority: task.priority_c,
        category: task.category_c,
        completed: task.completed_c
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      throw new Error(error?.message || "Failed to fetch tasks");
    }
  }

  async getById(id) {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const params = {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "crop_id_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "completed_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.success) {
        console.error(`Failed to fetch task ${id}:`, response?.message);
        throw new Error(response?.message || "Task not found");
      }
      
      if (!response.data) {
        throw new Error("Task not found");
      }
      
      // Map database field names to UI field names
      return {
        Id: response.data.Id,
        title: response.data.title_c,
        description: response.data.description_c,
        cropId: response.data.crop_id_c,
        dueDate: response.data.due_date_c,
        priority: response.data.priority_c,
        category: response.data.category_c,
        completed: response.data.completed_c
      };
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      throw new Error(error?.message || "Task not found");
    }
  }

  async create(taskData) {
    try {
      await new Promise(resolve => setTimeout(resolve, 350));
      
      // Map UI field names to database field names
      const params = {
        records: [{
          title_c: taskData.title,
          description_c: taskData.description,
          crop_id_c: taskData.cropId ? parseInt(taskData.cropId) : null,
          due_date_c: taskData.dueDate ? taskData.dueDate : null,
          priority_c: taskData.priority,
          category_c: taskData.category,
          completed_c: taskData.completed || false
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to create task:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const createdTask = successful[0].data;
          // Map back to UI field names
          return {
            Id: createdTask.Id,
            title: createdTask.title_c,
            description: createdTask.description_c,
            cropId: createdTask.crop_id_c,
            dueDate: createdTask.due_date_c,
            priority: createdTask.priority_c,
            category: createdTask.category_c,
            completed: createdTask.completed_c
          };
        }
      }
      
      throw new Error("Failed to create task");
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      throw new Error(error?.message || "Failed to create task");
    }
  }

  async update(id, taskData) {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Map UI field names to database field names
      const params = {
        records: [{
          Id: parseInt(id),
          title_c: taskData.title,
          description_c: taskData.description,
          crop_id_c: taskData.cropId ? parseInt(taskData.cropId) : null,
          due_date_c: taskData.dueDate ? taskData.dueDate : null,
          priority_c: taskData.priority,
          category_c: taskData.category,
          completed_c: taskData.completed
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to update task:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updatedTask = successful[0].data;
          // Map back to UI field names
          return {
            Id: updatedTask.Id,
            title: updatedTask.title_c,
            description: updatedTask.description_c,
            cropId: updatedTask.crop_id_c,
            dueDate: updatedTask.due_date_c,
            priority: updatedTask.priority_c,
            category: updatedTask.category_c,
            completed: updatedTask.completed_c
          };
        }
      }
      
      throw new Error("Failed to update task");
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error);
      throw new Error(error?.message || "Failed to update task");
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
        console.error("Failed to delete task:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error);
      throw new Error(error?.message || "Failed to delete task");
    }
  }
}

export const taskService = new TaskService();