import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getRequest, putRequest, deleteRequest } from "../api/requests";
import { ArrowLeft, Calendar, Edit3, Save, X, Trash2 } from "lucide-react";

const THEME_COLOR = "#e5989b";

const ChildDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [child, setChild] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editPersonal, setEditPersonal] = useState(false);
  const [editPhysical, setEditPhysical] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch child details
  useEffect(() => {
    const fetchChildDetail = async () => {
      try {
        const response = await getRequest(`/child/detail/${id}`);
        setChild(response);
        setFormData(response);
      } catch (error) {
        console.error("Error fetching child detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChildDetail();
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handlePersonalSubmit = async () => {
    try {
      await putRequest(`/child/update-personal-info/${id}`, {
        firstname: formData.firstname,
        lastname: formData.lastname,
        profile_pic: formData.profile_pic,
        gender: formData.gender,
        date_of_birth: formData.date_of_birth,
      });
      setEditPersonal(false);
      const updated = await getRequest(`/child/detail/${id}`);
      setChild(updated);
    } catch (err) {
      console.error("Error updating personal info:", err);
    }
  };

  const handlePhysicalSubmit = async () => {
    try {
      await putRequest(`/child/update-physical-info/${id}`, {
        blood_type: formData.blood_type,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        head_circumference: parseFloat(formData.head_circumference),
      });
      setEditPhysical(false);
      const updated = await getRequest(`/child/detail/${id}`);
      setChild(updated);
    } catch (err) {
      console.error("Error updating physical info:", err);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteRequest(`/child/delete/${id}`);
      setShowConfirm(false);
      alert("Child deleted successfully.");
      navigate("/children");
    } catch (err) {
      console.error("Error deleting child:", err);
      alert("Failed to delete child. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading child details...
      </div>
    );
  }

  if (!child) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
        <p>Child details not found.</p>
        <Link
          to="/"
          className="mt-4 text-[${THEME_COLOR}] hover:underline flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff8f8] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-[#f3d0d2] p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <Link
            to="/children"
            className="inline-flex items-center text-[#e5989b] hover:text-[#c97d81] font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Link>

          <button
            onClick={() => setShowConfirm(true)}
            disabled={deleting}
            className="flex items-center text-white bg-[#e5989b] hover:bg-[#d28386] px-4 py-2 rounded-lg shadow transition duration-200"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {deleting ? "Deleting..." : "Delete Child"}
          </button>
        </div>

        {/* Personal Info */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Personal Info
            </h2>
            {!editPersonal ? (
              <button
                onClick={() => setEditPersonal(true)}
                className="text-[#e5989b] hover:text-[#c97d81] flex items-center"
              >
                <Edit3 className="w-4 h-4 mr-1" /> Edit
              </button>
            ) : (
              <button
                onClick={() => setEditPersonal(false)}
                className="text-gray-500 hover:text-gray-700 flex items-center"
              >
                <X className="w-4 h-4 mr-1" /> Cancel
              </button>
            )}
          </div>

          {!editPersonal ? (
            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6">
              <img
                src={
                  child.profile_pic ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt={`${child.firstname} ${child.lastname}`}
                className="w-28 h-28 rounded-full object-cover border-4 border-[#f3d0d2]"
              />
              <div className="mt-4 sm:mt-0 text-center sm:text-left">
                <p className="text-lg font-semibold text-gray-900">
                  {child.firstname} {child.lastname}
                </p>
                <p className="text-gray-600">{child.gender}</p>
                <p className="text-gray-600">
                  <Calendar className="inline w-4 h-4 mr-1 text-[#e5989b]" />
                  {new Date(child.date_of_birth).toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 mt-3">
              {["firstname", "lastname", "profile_pic", "gender"].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  placeholder={field.replace("_", " ").toUpperCase()}
                  className="w-full border border-[#f3d0d2] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#e5989b]"
                />
              ))}
              <input
                type="date"
                name="date_of_birth"
                value={
                  formData.date_of_birth
                    ? formData.date_of_birth.split("T")[0]
                    : ""
                }
                onChange={handleChange}
                className="w-full border border-[#f3d0d2] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#e5989b]"
              />
              <button
                onClick={handlePersonalSubmit}
                className="bg-[#e5989b] text-white px-5 py-2 rounded-lg flex items-center justify-center w-full sm:w-auto shadow hover:bg-[#d28386]"
              >
                <Save className="w-4 h-4 mr-2" /> Save
              </button>
            </div>
          )}
        </section>

        {/* Physical Info */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Physical Info
            </h2>
            {!editPhysical ? (
              <button
                onClick={() => setEditPhysical(true)}
                className="text-[#e5989b] hover:text-[#c97d81] flex items-center"
              >
                <Edit3 className="w-4 h-4 mr-1" /> Edit
              </button>
            ) : (
              <button
                onClick={() => setEditPhysical(false)}
                className="text-gray-500 hover:text-gray-700 flex items-center"
              >
                <X className="w-4 h-4 mr-1" /> Cancel
              </button>
            )}
          </div>

          {!editPhysical ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Blood Type", value: child.blood_type },
                { label: "Height", value: `${child.height} cm` },
                { label: "Weight", value: `${child.weight} kg` },
                { label: "Head Circumference", value: `${child.head_circumference} cm` },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#fff0f0] border border-[#f3d0d2] p-4 rounded-xl text-center"
                >
                  <p className="text-gray-600">{item.label}</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 mt-3">
              {["blood_type", "height", "weight", "head_circumference"].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  placeholder={field.replace("_", " ").toUpperCase()}
                  className="w-full border border-[#f3d0d2] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#e5989b]"
                />
              ))}
              <button
                onClick={handlePhysicalSubmit}
                className="bg-[#e5989b] text-white px-5 py-2 rounded-lg flex items-center justify-center w-full sm:w-auto shadow hover:bg-[#d28386]"
              >
                <Save className="w-4 h-4 mr-2" /> Save
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 animate-fadeIn">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-5">
              Are you sure you want to delete{" "}
              <b>
                {child.firstname} {child.lastname}
              </b>
              ?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-[#e5989b] hover:bg-[#d28386] text-white rounded-lg"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChildDetail;
