import cropsData from "@/services/mockData/crops.json";

class CropService {
  constructor() {
    this.crops = [...cropsData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.crops];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const crop = this.crops.find(c => c.Id === parseInt(id));
    if (!crop) {
      throw new Error("Crop not found");
    }
    return { ...crop };
  }

  async create(cropData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newId = Math.max(...this.crops.map(c => c.Id)) + 1;
    const newCrop = {
      Id: newId,
      ...cropData,
      plantingDate: cropData.plantingDate ? new Date(cropData.plantingDate).toISOString() : null,
      expectedHarvest: cropData.expectedHarvest ? new Date(cropData.expectedHarvest).toISOString() : null
    };
    
    this.crops.push(newCrop);
    return { ...newCrop };
  }

  async update(id, cropData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.crops.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Crop not found");
    }
    
    const updatedCrop = {
      ...this.crops[index],
      ...cropData,
      Id: parseInt(id),
      plantingDate: cropData.plantingDate ? new Date(cropData.plantingDate).toISOString() : this.crops[index].plantingDate,
      expectedHarvest: cropData.expectedHarvest ? new Date(cropData.expectedHarvest).toISOString() : this.crops[index].expectedHarvest
    };
    
    this.crops[index] = updatedCrop;
    return { ...updatedCrop };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.crops.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Crop not found");
    }
    
    this.crops.splice(index, 1);
    return true;
  }
}

export const cropService = new CropService();