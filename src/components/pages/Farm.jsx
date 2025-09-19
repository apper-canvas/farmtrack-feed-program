import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import StatsCard from "@/components/molecules/StatsCard";
import { cropService } from "@/services/api/cropService";
import { taskService } from "@/services/api/taskService";
import { financialService } from "@/services/api/financialService";
import { weatherService } from "@/services/api/weatherService";

const Farm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Data states
  const [crops, setCrops] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [financials, setFinancials] = useState([]);
  const [weather, setWeather] = useState(null);
  
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setError("");

    try {
      // Load all data concurrently for better performance
      const [cropsData, tasksData, financialsData, weatherData] = await Promise.all([
        cropService.getAll().catch(() => []),
        taskService.getAll().catch(() => []),
        financialService.getAll().catch(() => []),
        weatherService.getCurrentWeather().catch(() => null)
      ]);

      setCrops(cropsData);
      setTasks(tasksData);
      setFinancials(financialsData);
      setWeather(weatherData);
    } catch (error) {
      setError("Failed to load farm data");
      console.error("Error loading farm data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate key metrics
  const totalCrops = crops.length;
  const activeCrops = crops.filter(c => c.status === "growing" || c.status === "planted").length;
  const readyCrops = crops.filter(c => c.status === "ready").length;
  
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(t => !t.completed).length;
  const overdueTasks = tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length;
  
  const totalIncome = financials
    .filter(f => f.type === "income")
    .reduce((sum, f) => sum + parseFloat(f.amount || 0), 0);
  const totalExpenses = financials
    .filter(f => f.type === "expense")
    .reduce((sum, f) => sum + parseFloat(f.amount || 0), 0);
  const netProfit = totalIncome - totalExpenses;

  // Get recent activities (last 5 completed tasks and financial transactions)
  const recentActivities = [
    ...tasks.filter(t => t.completed).slice(0, 3).map(t => ({
      type: "task",
      title: `Completed: ${t.title}`,
      time: "Recently",
      icon: "CheckCircle",
      color: "text-green-600"
    })),
    ...financials.slice(0, 2).map(f => ({
      type: "financial",
      title: `${f.type === "income" ? "Income" : "Expense"}: ${f.description}`,
      time: f.date ? new Date(f.date).toLocaleDateString() : "Recently",
      icon: f.type === "income" ? "TrendingUp" : "TrendingDown",
      color: f.type === "income" ? "text-green-600" : "text-red-600"
    }))
  ].slice(0, 5);

  // Get upcoming tasks (next 3 due tasks)
  const upcomingTasks = tasks
    .filter(t => !t.completed)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  if (loading) return <Loading variant="page" />;
  if (error) return <Error message={error} onRetry={loadAllData} />;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-4">
          Welcome to Your Farm
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Your complete farm management dashboard
        </p>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            onClick={() => navigate("/crops")}
            icon="Sprout"
            variant="primary"
            size="lg"
          >
            Manage Crops
          </Button>
          <Button
            onClick={() => navigate("/tasks")}
            icon="CheckSquare"
            variant="secondary"
            size="lg"
          >
            View Tasks
          </Button>
          <Button
            onClick={() => navigate("/finances")}
            icon="DollarSign"
            variant="accent"
            size="lg"
          >
            Track Finances
          </Button>
          <Button
            onClick={() => navigate("/weather")}
            icon="Cloud"
            variant="outline"
            size="lg"
          >
            Check Weather
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Crops"
          value={totalCrops}
          icon="Sprout"
          color="success"
          trendValue={`${activeCrops} active`}
          onClick={() => navigate("/crops")}
        />
        <StatsCard
          title="Pending Tasks"
          value={pendingTasks}
          icon="CheckSquare"
          color={overdueTasks > 0 ? "warning" : "info"}
          trendValue={overdueTasks > 0 ? `${overdueTasks} overdue` : "On track"}
          onClick={() => navigate("/tasks")}
        />
        <StatsCard
          title="Net Profit"
          value={`$${netProfit.toLocaleString()}`}
          icon="DollarSign"
          color={netProfit >= 0 ? "success" : "warning"}
          trend={netProfit >= 0 ? "up" : "down"}
          trendValue={netProfit >= 0 ? "Profitable" : "Loss"}
          onClick={() => navigate("/finances")}
        />
        <StatsCard
          title="Ready to Harvest"
          value={readyCrops}
          icon="Target"
          color="warning"
          trendValue="crops ready"
          onClick={() => navigate("/crops")}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weather Overview */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Today's Weather</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/weather")}
              icon="ExternalLink"
            >
              Full Forecast
            </Button>
          </div>
          
          {weather ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <ApperIcon name="Thermometer" className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-medium text-gray-600">Temperature</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {weather.temperature?.high}° / {weather.temperature?.low}°
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <ApperIcon name="Eye" className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium text-gray-600">Conditions</span>
                </div>
                <div className="text-lg font-bold text-gray-900 capitalize">
                  {weather.condition || "Clear"}
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <ApperIcon name="Droplets" className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-600">Humidity</span>
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {weather.humidity || 0}%
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <ApperIcon name="CloudRain" className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">Rain Chance</span>
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {weather.precipitation || 0}%
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <ApperIcon name="CloudOff" className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">Weather data unavailable</p>
            </div>
          )}
        </Card>

        {/* Farm Insights */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <ApperIcon name="Lightbulb" className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Farm Insights</h2>
          </div>
          
          <div className="space-y-4">
            {readyCrops > 0 && (
              <div className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                <ApperIcon name="AlertCircle" className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">Harvest Ready</div>
                  <div className="text-sm text-gray-600">
                    {readyCrops} crop{readyCrops !== 1 ? 's' : ''} ready for harvest
                  </div>
                </div>
              </div>
            )}
            
            {overdueTasks > 0 && (
              <div className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                <ApperIcon name="Clock" className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">Overdue Tasks</div>
                  <div className="text-sm text-gray-600">
                    {overdueTasks} task{overdueTasks !== 1 ? 's' : ''} past due date
                  </div>
                </div>
              </div>
            )}
            
            {netProfit > 0 && (
              <div className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                <ApperIcon name="TrendingUp" className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">Profitable Operations</div>
                  <div className="text-sm text-gray-600">
                    ${netProfit.toLocaleString()} net profit this period
                  </div>
                </div>
              </div>
            )}
            
            {weather?.condition === "rainy" && (
              <div className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                <ApperIcon name="CloudRain" className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">Weather Alert</div>
                  <div className="text-sm text-gray-600">
                    Rainy conditions - consider postponing field work
                  </div>
                </div>
              </div>
            )}

            {recentActivities.length === 0 && overdueTasks === 0 && readyCrops === 0 && (
              <div className="text-center py-6">
                <ApperIcon name="Smile" className="h-12 w-12 mx-auto text-green-500 mb-2" />
                <p className="text-green-700 font-medium">All systems running smoothly!</p>
                <p className="text-green-600 text-sm">Your farm operations are on track</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Activities & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Activities</h2>
            <ApperIcon name="Activity" className="h-6 w-6 text-gray-400" />
          </div>
          
          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <ApperIcon name={activity.icon} className={`h-5 w-5 mt-0.5 ${activity.color}`} />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{activity.title}</div>
                    <div className="text-sm text-gray-600">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ApperIcon name="FileText" className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">No recent activities</p>
            </div>
          )}
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Upcoming Tasks</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/tasks")}
              icon="Plus"
            >
              Add Task
            </Button>
          </div>
          
          {upcomingTasks.length > 0 ? (
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.Id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`h-3 w-3 rounded-full mt-2 ${
                    task.priority === "high" ? "bg-red-500" :
                    task.priority === "medium" ? "bg-yellow-500" : "bg-green-500"
                  }`}></div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{task.title}</div>
                    <div className="text-sm text-gray-600">
                      Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}
                    </div>
                  </div>
                </div>
              ))}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/tasks")}
                className="w-full"
              >
                View All Tasks
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <ApperIcon name="CheckCircle" className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500 mb-4">No upcoming tasks</p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate("/tasks")}
              >
                Create First Task
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Module Navigation Cards */}
      <Card>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Farm Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            onClick={() => navigate("/crops")}
            className="cursor-pointer group bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ApperIcon name="Sprout" className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Crops</h3>
                <p className="text-sm text-gray-600">{totalCrops} total</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate("/tasks")}
            className="cursor-pointer group bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ApperIcon name="CheckSquare" className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Tasks</h3>
                <p className="text-sm text-gray-600">{pendingTasks} pending</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate("/finances")}
            className="cursor-pointer group bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-yellow-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ApperIcon name="DollarSign" className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Finances</h3>
                <p className="text-sm text-gray-600">${Math.abs(netProfit).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate("/weather")}
            className="cursor-pointer group bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ApperIcon name="Cloud" className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Weather</h3>
                <p className="text-sm text-gray-600 capitalize">{weather?.condition || "Loading..."}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Farm;