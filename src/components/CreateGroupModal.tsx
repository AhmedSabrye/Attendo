import { useState, useEffect } from "react";
import { HiX } from "react-icons/hi";
const days = [
  { full: "Saturday", short: "sat" },
  { full: "Sunday", short: "sun" },
  { full: "Monday", short: "mon" },
  { full: "Tuesday", short: "tue" },
  { full: "Wednesday", short: "wed" },
  { full: "Thursday", short: "thu" },
  { full: "Friday", short: "fri" },
];

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
];

export default function CreateGroupModal({
  isOpen,
  onClose,
  onCreateGroup,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (group: any) => void;
}) {
  const [newGroup, setNewGroup] = useState({
    days: [] as string[],
    instructor: "",
    startTime: "",
    endTime: "",
  });

  // forcing the user to select 2 days .
  const handleDayToggle = (day: string) => {
    setNewGroup((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : prev.days.length === 2
        ? [...prev.days.slice(1), day]
        : [...prev.days, day],
    }));
  };
  let startTimeIndex = timeSlots.indexOf(newGroup.startTime);
  let filteredTimeSlots = timeSlots.slice(startTimeIndex + 1);

  const generateGroupName = () => {
    const { days, instructor, startTime, endTime } = newGroup;
    if (days.length && instructor && startTime && endTime) {
      const dayStr = days.length === 1 ? days[0] : `${days[0]}-${days[1]}`;
      return `${dayStr} - ${instructor} (${startTime}-${endTime})`;
    }
    return "";
  };

  const handleSubmit = () => {
    const groupName = generateGroupName();
    if (groupName) {
      onCreateGroup({
        name: groupName,
        days: newGroup.days,
        instructor: newGroup.instructor,
        startTime: newGroup.startTime,
        endTime: newGroup.endTime,
      });
      handleClose();
    }
  };

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if ((e.target as HTMLElement).classList.contains("fixed")) {
        handleClose();
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const handleClose = () => {
    setNewGroup({
      days: [],
      instructor: "",
      startTime: "",
      endTime: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Create New Group</h2>
          <button onClick={handleClose} className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">
            <HiX className="text-xl cursor-pointer" />
          </button>
        </div>

        {/* Day Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Days</label>
          <div className="flex flex-wrap gap-2">
            {days.map((day) => (
              <button
                key={day.full}
                onClick={() => handleDayToggle(day.short)}
                className={`px-3 py-2 text-sm rounded-lg transition-colors capitalize ${
                  newGroup.days.includes(day.short)
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {day.short}
              </button>
            ))}
          </div>
        </div>

        {/* Instructor Name */}
        <div className="mb-4">
          {/* <label className="block text-sm font-medium text-gray-700 mb-1">Instructor Name</label> */}
          <input
            type="text"
            placeholder="Enter instructor name"
            value={newGroup.instructor}
            onChange={(e) => setNewGroup((prev) => ({ ...prev, instructor: e.target.value }))}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Time Selection */}
        <div className=" mb-5 grid grid-cols-2 gap-3 ">
          <div>
            {/* <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label> */}
            <select
              value={newGroup.startTime}
              onChange={(e) =>
                setNewGroup((prev) => ({
                  ...prev,
                  startTime: e.target.value,
                }))
              }
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2  focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="" disabled>
                Start Time
              </option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          <div>
            {/* <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label> */}
            <select
              value={newGroup.endTime}
              onChange={(e) => setNewGroup((prev) => ({ ...prev, endTime: e.target.value }))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="" disabled>
                End Time
              </option>
              {filteredTimeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Preview */}
        {generateGroupName() && (
          <div className="mb-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <p className="text-sm text-emerald-800">
              <span className="font-medium">Preview:</span> {generateGroupName()}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button onClick={handleClose} className="flex-1 py-2 px-4 text-sm bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!generateGroupName()}
            className="flex-1 py-2 px-4 text-sm bg-emerald-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer hover:bg-emerald-700 transition-colors"
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
}
