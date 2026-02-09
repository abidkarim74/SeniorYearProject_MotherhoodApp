import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import ReminderItem from "./ReminderItem";


interface RemindersSectionProps {
  reminders: any[];
  sortedReminders: any[];
  loading: boolean;
  getVaccineName: (vaccineId: string) => string;
}

const RemindersSection = ({
  sortedReminders,
  loading,
  getVaccineName,
}: RemindersSectionProps) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
    <div className="px-4 sm:px-5 py-3 sm:py-4 bg-gradient-to-r from-[#fceaea] to-[#f8d8d8] border-b border-[#e5989b]/20">
      <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
        <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-[#e5989b]" />
        Vaccination Reminders
      </h3>
    </div>
    <div className="p-4 sm:p-5">
      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#e5989b] mx-auto"></div>
          <p className="text-xs text-gray-500 mt-2">Loading reminders...</p>
        </div>
      ) : sortedReminders.length > 0 ? (
        <div className="space-y-3">
          {sortedReminders.slice(0, 5).map((reminder) => (
            <ReminderItem
              key={reminder.id}
              reminder={reminder}
              vaccineName={getVaccineName(reminder.vaccine_id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No vaccination reminders</p>
          <p className="text-xs text-gray-400 mt-1">
            Set reminders for pending vaccinations
          </p>
        </div>
      )}
      
      {sortedReminders.length > 5 && (
        <Link
          to="/vaccinations"
          className="w-full mt-3 text-center text-xs text-[#e5989b] font-medium hover:text-[#d88a8d] transition-colors py-1.5 block"
        >
          View All Reminders ({sortedReminders.length})
        </Link>
      )}
    </div>
  </div>
);

export default RemindersSection;