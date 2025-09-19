import financialsData from "@/services/mockData/financials.json";

class FinancialService {
  constructor() {
    this.financials = [...financialsData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 280));
    return [...this.financials];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const financial = this.financials.find(f => f.Id === parseInt(id));
    if (!financial) {
      throw new Error("Financial record not found");
    }
    return { ...financial };
  }

  async create(financialData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newId = Math.max(...this.financials.map(f => f.Id)) + 1;
    const newFinancial = {
      Id: newId,
      ...financialData,
      date: financialData.date ? new Date(financialData.date).toISOString() : new Date().toISOString(),
      amount: parseFloat(financialData.amount) || 0
    };
    
    this.financials.push(newFinancial);
    return { ...newFinancial };
  }

  async update(id, financialData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const index = this.financials.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Financial record not found");
    }
    
    const updatedFinancial = {
      ...this.financials[index],
      ...financialData,
      Id: parseInt(id),
      date: financialData.date ? new Date(financialData.date).toISOString() : this.financials[index].date,
      amount: parseFloat(financialData.amount) || this.financials[index].amount
    };
    
    this.financials[index] = updatedFinancial;
    return { ...updatedFinancial };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = this.financials.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Financial record not found");
    }
    
    this.financials.splice(index, 1);
    return true;
  }
}

export const financialService = new FinancialService();