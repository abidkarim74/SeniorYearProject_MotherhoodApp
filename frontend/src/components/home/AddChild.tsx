import { Link } from "react-router-dom";
import { Plus } from "lucide-react";


const AddChildCard = () => (
  <Link
    to="/add-child"
    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-3 border-2 border-dashed border-gray-300 hover:border-[#e5989b] hover:from-[#fff1f1] hover:to-[#fceaea] transition-all duration-300 group flex items-center justify-center min-h-[72px]"
  >
    <div className="text-center">
      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#e5989b] to-[#d88a8d] rounded-xl flex items-center justify-center mx-auto mb-1 group-hover:scale-110 transition-transform duration-300">
        <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      </div>
      <span className="text-[#e5989b] font-medium text-xs">Add Child</span>
    </div>
  </Link>
);

export default AddChildCard;