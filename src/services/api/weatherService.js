import weatherData from "@/services/mockData/weather.json";

class WeatherService {
  constructor() {
    this.weather = [...weatherData];
  }

  async getForecast() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.weather];
  }

  async getCurrentWeather() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...this.weather[0] };
  }

  async getWeatherByDate(date) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const weather = this.weather.find(w => 
      new Date(w.date).toDateString() === new Date(date).toDateString()
    );
    if (!weather) {
      throw new Error("Weather data not found for this date");
    }
    return { ...weather };
  }
}

export const weatherService = new WeatherService();