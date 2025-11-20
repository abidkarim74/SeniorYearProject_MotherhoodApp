import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Baby, Syringe, MapPin, User } from "lucide-react";

const AddVaccination = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    childName: "",
    vaccine: "",
    description: "",
    dueDate: "",
    administeredDate: "",
    doctor: "",
    location: "",
    category: "",
    importance: "",
    status: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e: any) => {
    e.preventDefault();

    const existing = JSON.parse(localStorage.getItem("vaccinations") || "[]");
    const updated = [...existing, { id: Date.now(), ...form }];
    localStorage.setItem("vaccinations", JSON.stringify(updated));

    navigate("/vaccinations");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff6f6] to-[#fceaea] py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Add New Vaccination
        </h2>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Child Name */}
          <div>
            <label className="font-medium text-gray-700">Child Name</label>
            <div className="flex items-center mt-2 bg-gray-100 rounded-xl px-4">
              <Baby className="w-5 h-5 text-gray-500 mr-2" />
              <input
                type="text"
                name="childName"
                onChange={handleChange}
                className="w-full py-3 bg-transparent outline-none"
                placeholder="Enter child's full name"
                required
              />
            </div>
          </div>

          {/* Vaccine Name */}
          <div>
            <label className="font-medium text-gray-700">Vaccine</label>
            <div className="flex items-center mt-2 bg-gray-100 rounded-xl px-4">
              <Syringe className="w-5 h-5 text-gray-500 mr-2" />
              <input
                type="text"
                name="vaccine"
                onChange={handleChange}
                className="w-full py-3 bg-transparent outline-none"
                placeholder="Enter vaccine name"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              onChange={handleChange}
              className="w-full mt-2 bg-gray-100 rounded-xl px-4 py-3 outline-none"
              placeholder="Short description of vaccine"
              rows={3}
            />
          </div>

          {/* Dates Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Due Date */}
            <div>
                <label className="font-medium text-gray-700">Due Date</label>
                <div className="flex items-center mt-2 bg-gray-100 rounded-xl px-4">
                <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                <input
                    type="date"
                    name="dueDate"
                    onChange={handleChange}
                    className="w-full py-3 bg-transparent outline-none"
                />
                </div>
            </div>

            {/* Administered Date */}
            <div>
                <label className="font-medium text-gray-700">Administered Date</label>
                <div className="flex items-center mt-2 bg-gray-100 rounded-xl px-4">
                <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                <input
                    type="date"
                    name="administeredDate"
                    onChange={handleChange}
                    className="w-full py-3 bg-transparent outline-none"
                />
                </div>
            </div>
            </div>


          {/* Doctor */}
          <div>
            <label className="font-medium text-gray-700">Doctor</label>
            <div className="flex items-center mt-2 bg-gray-100 rounded-xl px-4">
              <User className="w-5 h-5 text-gray-500 mr-2" />
              <input
                type="text"
                name="doctor"
                onChange={handleChange}
                className="w-full py-3 bg-transparent outline-none"
                placeholder="Doctor's name"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="font-medium text-gray-700">Location</label>
            <div className="flex items-center mt-2 bg-gray-100 rounded-xl px-4">
              <MapPin className="w-5 h-5 text-gray-500 mr-2" />
              <input
                type="text"
                name="location"
                onChange={handleChange}
                className="w-full py-3 bg-transparent outline-none"
                placeholder="Hospital / Clinic"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="font-medium text-gray-700">Category</label>
            <select
              name="category"
              onChange={handleChange}
              className="w-full mt-2 bg-gray-100 rounded-xl px-4 py-3 outline-none"
            >
              <option value="">Select category</option>
              <option value="routine">Routine</option>
              <option value="seasonal">Seasonal</option>
              <option value="recommended">Recommended</option>
            </select>
          </div>

          {/* Importance */}
          <div>
            <label className="font-medium text-gray-700">Importance</label>
            <select
              name="importance"
              onChange={handleChange}
              className="w-full mt-2 bg-gray-100 rounded-xl px-4 py-3 outline-none"
            >
              <option value="">Select importance</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="font-medium text-gray-700">Status</label>
            <select
              name="status"
              onChange={handleChange}
              className="w-full mt-2 bg-gray-100 rounded-xl px-4 py-3 outline-none"
            >
              <option value="">Select status</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="scheduled">Scheduled</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white py-4 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            Save Vaccination
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVaccination;
