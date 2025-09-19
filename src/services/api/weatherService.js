class WeatherService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'weather_c';
  }

  async getForecast() {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const params = {
        fields: [
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "high_temperature_c"}},
          {"field": {"Name": "low_temperature_c"}},
          {"field": {"Name": "condition_c"}},
          {"field": {"Name": "humidity_c"}},
          {"field": {"Name": "precipitation_c"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 7, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.success) {
        console.error("Failed to fetch weather forecast:", response?.message);
        throw new Error(response?.message || "Failed to fetch weather forecast");
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      // Map database field names to UI field names for backward compatibility
      return response.data.map(weather => ({
        date: weather.date_c,
        temperature: {
          high: weather.high_temperature_c,
          low: weather.low_temperature_c
        },
        condition: weather.condition_c,
        humidity: weather.humidity_c,
        precipitation: weather.precipitation_c
      }));
    } catch (error) {
      console.error("Error fetching weather forecast:", error?.response?.data?.message || error);
      throw new Error(error?.message || "Failed to fetch weather forecast");
    }
  }

  async getCurrentWeather() {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const params = {
        fields: [
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "high_temperature_c"}},
          {"field": {"Name": "low_temperature_c"}},
          {"field": {"Name": "condition_c"}},
          {"field": {"Name": "humidity_c"}},
          {"field": {"Name": "precipitation_c"}}
        ],
        where: [{"FieldName": "date_c", "Operator": "EqualTo", "Values": [new Date().toISOString().split('T')[0]]}],
        pagingInfo: {"limit": 1, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.success) {
        console.error("Failed to fetch current weather:", response?.message);
        throw new Error(response?.message || "Failed to fetch current weather");
      }
      
      if (!response.data || response.data.length === 0) {
        // Fallback to first record if no current date found
        const allWeather = await this.getForecast();
        return allWeather.length > 0 ? allWeather[0] : null;
      }
      
      const weather = response.data[0];
      // Map database field names to UI field names
      return {
        date: weather.date_c,
        temperature: {
          high: weather.high_temperature_c,
          low: weather.low_temperature_c
        },
        condition: weather.condition_c,
        humidity: weather.humidity_c,
        precipitation: weather.precipitation_c
      };
    } catch (error) {
      console.error("Error fetching current weather:", error?.response?.data?.message || error);
      throw new Error(error?.message || "Failed to fetch current weather");
    }
  }

  async getWeatherByDate(date) {
    try {
      await new Promise(resolve => setTimeout(resolve, 250));
      
      const params = {
        fields: [
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "high_temperature_c"}},
          {"field": {"Name": "low_temperature_c"}},
          {"field": {"Name": "condition_c"}},
          {"field": {"Name": "humidity_c"}},
          {"field": {"Name": "precipitation_c"}}
        ],
        where: [{"FieldName": "date_c", "Operator": "EqualTo", "Values": [new Date(date).toISOString().split('T')[0]]}],
        pagingInfo: {"limit": 1, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.success) {
        console.error(`Failed to fetch weather for ${date}:`, response?.message);
        throw new Error(response?.message || "Weather data not found for this date");
      }
      
      if (!response.data || response.data.length === 0) {
        throw new Error("Weather data not found for this date");
      }
      
      const weather = response.data[0];
      // Map database field names to UI field names
      return {
        date: weather.date_c,
        temperature: {
          high: weather.high_temperature_c,
          low: weather.low_temperature_c
        },
        condition: weather.condition_c,
        humidity: weather.humidity_c,
        precipitation: weather.precipitation_c
      };
    } catch (error) {
      console.error(`Error fetching weather for ${date}:`, error?.response?.data?.message || error);
      throw new Error(error?.message || "Weather data not found for this date");
    }
  }
}

export const weatherService = new WeatherService();