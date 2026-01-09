import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRequest, postRequest } from "../api/requests";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ArrowLeft, Weight, Ruler, Brain, Plus} from "lucide-react";

const ChildGrowthTracking = () => {
  const { childId } = useParams();
  const navigate = useNavigate();
  const [growthData, setGrowthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [childInfo, setChildInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    recorded_at: new Date().toISOString().split('T')[0],
    weight: "",
    height: "",
    head_circumference: "",
    milestone_notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchGrowthData = async () => {
      try {
        setLoading(true);
        // Fetch growth records for this child using the actual API
        const response = await getRequest(
          `/child-growth/list/${childId}`
        );

        // Transform data for charts - handle empty array
        const transformedData = (response || []).map((record) => ({
          date: new Date(record.recorded_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "2-digit",
          }),
          fullDate: record.recorded_at,
          weight: record.weight,
          height: record.height,
          headCircumference: record.head_circumference,
          timestamp: new Date(record.recorded_at).getTime(),
        }));

        // Sort by date
        transformedData.sort((a, b) => a.timestamp - b.timestamp);

        setGrowthData(transformedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching growth data:", err);
        setError("Failed to load growth data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // Fetch child info directly instead of from children list
    const fetchChildInfo = async () => {
      try {
        const response = await getRequest(`/child/detail/${childId}`);
        setChildInfo(response);
      } catch (err) {
        console.error("Error fetching child info:", err);
      }
    };

    if (childId) {
      fetchGrowthData();
      fetchChildInfo();
    }
  }, [childId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitRecord = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.recorded_at || !formData.weight || !formData.height || !formData.head_circumference) {
      setError("Please fill in all required fields (date, weight, height, head circumference)");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        child_id: childId,
        recorded_at: formData.recorded_at,
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        head_circumference: parseFloat(formData.head_circumference),
        milestone_notes: formData.milestone_notes || undefined,
      };

      await postRequest("/child-growth/create", payload);
      
      // Reset form and refetch data
      setFormData({
        recorded_at: new Date().toISOString().split('T')[0],
        weight: "",
        height: "",
        head_circumference: "",
        milestone_notes: "",
      });
      setShowModal(false);
      setError(null);
      
      // Refetch growth data
      const response = await getRequest(`/child-growth/list/${childId}`);
      const transformedData = (response || []).map((record) => ({
        date: new Date(record.recorded_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "2-digit",
        }),
        fullDate: record.recorded_at,
        weight: record.weight,
        height: record.height,
        headCircumference: record.head_circumference,
        timestamp: new Date(record.recorded_at).getTime(),
      }));
      transformedData.sort((a, b) => a.timestamp - b.timestamp);
      setGrowthData(transformedData);
    } catch (err) {
      console.error("Error creating growth record:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const getChartStats = (dataKey) => {
    if (growthData.length === 0) return { min: 0, max: 0, latest: 0, change: 0 };

    const values = growthData.map((d) => d[dataKey]).filter((v) => v > 0);
    if (values.length === 0) return { min: 0, max: 0, latest: 0, change: 0 };

    return {
      min: Math.min(...values),
      max: Math.max(...values),
      latest: values[values.length - 1],
      change:
        values.length > 1
          ? (values[values.length - 1] - values[0]).toFixed(2)
          : 0,
    };
  };

  const ChartCard = ({ title, icon: Icon, dataKey, unit, stats }) => (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 rounded-full bg-[#fceaea]">
          <Icon className="w-6 h-6 text-[#e5989b]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">Progress over time</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#fceaea] rounded-lg p-3">
          <p className="text-xs text-gray-600">Latest</p>
          <p className="text-lg font-bold text-[#e5989b]">
            {stats.latest} {unit}
          </p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xs text-gray-600">Min</p>
          <p className="text-lg font-bold text-blue-600">{stats.min} {unit}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-xs text-gray-600">Max</p>
          <p className="text-lg font-bold text-green-600">{stats.max} {unit}</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={growthData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            stroke="#9ca3af"
            style={{ fontSize: "12px" }}
          />
          <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5989b",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
            formatter={(value) => [`${value} ${unit}`, title]}
            labelStyle={{ color: "#374151" }}
          />
          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            iconType="line"
            formatter={() => title}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#e5989b"
            strokeWidth={2}
            dot={{ fill: "#e5989b", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Total Change:</span>
          <span
            className={`font-semibold ${
              stats.change > 0 ? "text-green-600" : "text-gray-600"
            }`}
          >
            {stats.change > 0 ? "+" : ""}
            {stats.change} {unit}
          </span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff6f6]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-[#fceaea] flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-[#e5989b] border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-600">Loading growth data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff6f6] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#e5989b] hover:text-[#d88a8d] mb-4 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Growth Tracking
                {childInfo && (
                  <span className="text-[#e5989b] ml-2">
                    {childInfo.firstname} {childInfo.lastname}
                  </span>
                )}
              </h1>
              <p className="text-gray-600 mt-2">
                Monitor {childInfo?.firstname || "your child"}'s development over
                time with detailed growth metrics
              </p>
            </div>
            
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#e5989b] text-white px-6 py-3 rounded-lg hover:bg-[#d88a8d] transition-colors font-medium flex items-center space-x-2 shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Record</span>
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        {growthData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-full bg-[#fceaea]">
                  <Ruler className="w-6 h-6 text-[#e5989b]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Height</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {getChartStats("height").latest} cm
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-full bg-[#fceaea]">
                  <Weight className="w-6 h-6 text-[#e5989b]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Weight</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {getChartStats("weight").latest} kg
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-full bg-[#fceaea]">
                  <Brain className="w-6 h-6 text-[#e5989b]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    Current Head Circumference
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {getChartStats("headCircumference").latest} cm
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts */}
        {growthData.length > 0 ? (
          <div className="space-y-8">
            <ChartCard
              title="Height Growth"
              icon={Ruler}
              dataKey="height"
              unit="cm"
              stats={getChartStats("height")}
            />

            <ChartCard
              title="Weight Growth"
              icon={Weight}
              dataKey="weight"
              unit="kg"
              stats={getChartStats("weight")}
            />

            <ChartCard
              title="Head Circumference Growth"
              icon={Brain}
              dataKey="headCircumference"
              unit="cm"
              stats={getChartStats("headCircumference")}
            />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-[#fceaea] flex items-center justify-center">
              <Ruler className="w-12 h-12 text-[#e5989b]" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No growth records yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start tracking {childInfo?.firstname || "your child"}'s growth by
              adding measurement records.
            </p>
          </div>
        )}

        {error && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Add Record Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Growth Record</h2>
              
              <form onSubmit={handleSubmitRecord} className="space-y-4">
                {/* Date Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="recorded_at"
                    value={formData.recorded_at}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e5989b] focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                {/* Weight Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="weight"
                    step="0.1"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="e.g., 5.5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e5989b] focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                {/* Height Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height (cm) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="height"
                    step="0.1"
                    value={formData.height}
                    onChange={handleInputChange}
                    placeholder="e.g., 65.5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e5989b] focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                {/* Head Circumference Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Head Circumference (cm) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="head_circumference"
                    step="0.1"
                    value={formData.head_circumference}
                    onChange={handleInputChange}
                    placeholder="e.g., 41.5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e5989b] focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                {/* Milestone Notes Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Milestone Notes <span className="text-gray-500">(Optional)</span>
                  </label>
                  <textarea
                    name="milestone_notes"
                    value={formData.milestone_notes}
                    onChange={handleInputChange}
                    placeholder="Any notes about development or milestones..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e5989b] focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-[#e5989b] text-white py-2.5 rounded-lg font-medium hover:bg-[#d88a8d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Add Record</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ChildGrowthTracking;