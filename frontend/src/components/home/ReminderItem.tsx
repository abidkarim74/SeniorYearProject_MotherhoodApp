import { Calendar, Clock, AlertTriangle, Bell } from "lucide-react";

interface ReminderItemProps {
  reminder: any;
  vaccineName: string;
}

const ReminderItem = ({ reminder, vaccineName}: ReminderItemProps) => {
  const getReminderStatus = (reminderDate: string) => {
    const date = new Date(reminderDate);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const reminderDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const diffTime = reminderDay.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "today";
    if (diffDays < 0) return "overdue";
    return "upcoming";
  };

  const getNotificationStyle = (reminderDate: string) => {
    const status = getReminderStatus(reminderDate);
    
    switch (status) {
      case "overdue":
        return {
          icon: AlertTriangle,
          bgColor: "bg-red-50 border-red-200",
          iconColor: "text-red-600",
          iconBg: "bg-red-100",
          timeColor: "text-red-600"
        };
      case "today":
        return {
          icon: Clock,
          bgColor: "bg-orange-50 border-orange-200",
          iconColor: "text-orange-600",
          iconBg: "bg-orange-100",
          timeColor: "text-orange-600"
        };
      case "upcoming":
        return {
          icon: Calendar,
          bgColor: "bg-blue-50 border-blue-200",
          iconColor: "text-blue-600",
          iconBg: "bg-blue-100",
          timeColor: "text-blue-600"
        };
      default:
        return {
          icon: Bell,
          bgColor: "bg-gray-50 border-gray-200",
          iconColor: "text-gray-600",
          iconBg: "bg-gray-100",
          timeColor: "text-gray-600"
        };
    }
  };

  const formatReminderDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    return `In ${diffDays} days`;
  };

  const styles = getNotificationStyle(reminder.reminder);
  const IconComponent = styles.icon;
  const formattedDate = new Date(reminder.reminder).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div
      className={`flex items-start space-x-2 p-2 rounded-lg ${styles.bgColor} border transition-all duration-300 hover:shadow-sm`}
    >
      <div className={`w-6 h-6 ${styles.iconBg} rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5`}>
        <IconComponent className="w-3 h-3" style={{ color: styles.iconColor }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900 truncate">
          {vaccineName}
        </p>
        <p className="text-xs text-gray-600 mt-0.5 truncate">
          For 
        </p>
        <p className={`text-xs ${styles.timeColor} mt-0.5 font-medium`}>
          {formatReminderDate(reminder.reminder)} • {formattedDate}
        </p>
      </div>
    </div>
  );
};

export default ReminderItem;