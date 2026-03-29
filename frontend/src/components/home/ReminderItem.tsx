import { useEffect, useState } from "react";
import { Calendar, Clock, AlertTriangle, Bell } from "lucide-react";


// interface Reminder {
//   id: number | string;
//   reminder: string;       
//   vaccine_name: string;  
//   patient_name?: string;  
// }

// interface ReminderItemProps {
//   reminder: Reminder;
// }


const getReminderStatus = (reminderDate: string) => {
  const date = new Date(reminderDate);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const reminderDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffDays = Math.ceil(
    (reminderDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

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
        timeColor: "text-red-600",
      };
    case "today":
      return {
        icon: Clock,
        bgColor: "bg-orange-50 border-orange-200",
        iconColor: "text-orange-600",
        iconBg: "bg-orange-100",
        timeColor: "text-orange-600",
      };
    case "upcoming":
      return {
        icon: Calendar,
        bgColor: "bg-blue-50 border-blue-200",
        iconColor: "text-blue-600",
        iconBg: "bg-blue-100",
        timeColor: "text-blue-600",
      };
    default:
      return {
        icon: Bell,
        bgColor: "bg-gray-50 border-gray-200",
        iconColor: "text-gray-600",
        iconBg: "bg-gray-100",
        timeColor: "text-gray-600",
      };
  }
};

const formatReminderDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
  return `In ${diffDays} days`;
};


const ReminderItem = () => {
  const styles = getNotificationStyle(reminder.reminder);
  const IconComponent = styles.icon;

  const formattedDate = new Date(reminder.reminder).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className={`flex items-start space-x-2 p-2 rounded-lg ${styles.bgColor} border transition-all duration-300 hover:shadow-sm`}
    >
      <div
        className={`w-6 h-6 ${styles.iconBg} rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5`}
      >
        <IconComponent className={`w-3 h-3 ${styles.iconColor}`} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900 truncate">
          {reminder.vaccine_name}
        </p>
        {reminder.patient_name && (
          <p className="text-xs text-gray-600 mt-0.5 truncate">
            For {reminder.patient_name}
          </p>
        )}
        <p className={`text-xs ${styles.timeColor} mt-0.5 font-medium`}>
          {formatReminderDate(reminder.reminder)} • {formattedDate}
        </p>
      </div>
    </div>
  );
};


interface ReminderListProps {
  accessToken: string | null;
  user: { id: string | number } | null;
  getRequest: (url: string) => Promise<Reminder[]>;
}

const ReminderList = ({ accessToken, user, getRequest }: ReminderListProps) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [remindersLoading, setRemindersLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [remindersData] = await Promise.all([
          getRequest("/vaccination-reminders/"),
        ]);

        setReminders(remindersData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setRemindersLoading(false);
      }
    };

    if (accessToken && user?.id) {
      fetchData();
    } else {
      setRemindersLoading(false);
    }
  }, [accessToken, user?.id]);

  if (remindersLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-start space-x-2 p-2 rounded-lg bg-gray-50 border border-gray-200 animate-pulse"
          >
            <div className="w-6 h-6 bg-gray-200 rounded-lg flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 bg-gray-200 rounded w-3/4" />
              <div className="h-2.5 bg-gray-200 rounded w-1/2" />
              <div className="h-2.5 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reminders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-3">
          <Bell className="w-5 h-5 text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-500">No reminders yet</p>
        <p className="text-xs text-gray-400 mt-1">
          Vaccination reminders will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {reminders.map((reminder) => (
        <ReminderItem key={reminder.id} reminder={reminder} />
      ))}
    </div>
  );
};

export default ReminderList;