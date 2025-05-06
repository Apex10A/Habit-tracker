"use client"
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { BarChart2, Bell, Settings2 } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";


// Type definitions
interface Habit {
  id: string;
  name: string;
  icon: string;
  unit: string;
  goal: number;
  current: number;
  color: string;
  streak: number;
  history: { date: string; value: number }[];
}

interface Notification {
  id: string;
  message: string;
  type: "reminder" | "achievement" | "info";
  timestamp: Date;
  read: boolean;
}

interface DailyStats {
  date: string;
  sleep: number;
  water: number;
  screenTime: number;
  steps: number;
  meditation: number;
  reading: number;
}



// Mock data
const mockHabits: Habit[] = [
  {
    id: "sleep",
    name: "Sleep",
    icon: "🌙",
    unit: "hours",
    goal: 8,
    current: 7.5,
    color: "#8B5CF6",
    streak: 5,
    history: [
      { date: "Mon", value: 7 },
      { date: "Tue", value: 7.5 },
      { date: "Wed", value: 8 },
      { date: "Thu", value: 6.5 },
      { date: "Fri", value: 7.5 },
      { date: "Sat", value: 9 },
      { date: "Sun", value: 7.5 },
    ],
  },
  {
    id: "water",
    name: "Water",
    icon: "💧",
    unit: "glasses",
    goal: 8,
    current: 6,
    color: "#3B82F6",
    streak: 3,
    history: [
      { date: "Mon", value: 5 },
      { date: "Tue", value: 7 },
      { date: "Wed", value: 6 },
      { date: "Thu", value: 8 },
      { date: "Fri", value: 6 },
      { date: "Sat", value: 4 },
      { date: "Sun", value: 6 },
    ],
  },
  {
    id: "screenTime",
    name: "Screen Time",
    icon: "📱",
    unit: "hours",
    goal: 4,
    current: 5.5,
    color: "#EC4899",
    streak: 0,
    history: [
      { date: "Mon", value: 6 },
      { date: "Tue", value: 5 },
      { date: "Wed", value: 4.5 },
      { date: "Thu", value: 5 },
      { date: "Fri", value: 5.5 },
      { date: "Sat", value: 3 },
      { date: "Sun", value: 5.5 },
    ],
  },
  {
    id: "steps",
    name: "Steps",
    icon: "👣",
    unit: "steps",
    goal: 10000,
    current: 8500,
    color: "#10B981",
    streak: 4,
    history: [
      { date: "Mon", value: 9000 },
      { date: "Tue", value: 10200 },
      { date: "Wed", value: 8700 },
      { date: "Thu", value: 9500 },
      { date: "Fri", value: 8500 },
      { date: "Sat", value: 12000 },
      { date: "Sun", value: 8500 },
    ],
  },
  {
    id: "meditation",
    name: "Meditation",
    icon: "🧘",
    unit: "minutes",
    goal: 20,
    current: 15,
    color: "#F59E0B",
    streak: 7,
    history: [
      { date: "Mon", value: 15 },
      { date: "Tue", value: 20 },
      { date: "Wed", value: 15 },
      { date: "Thu", value: 20 },
      { date: "Fri", value: 15 },
      { date: "Sat", value: 25 },
      { date: "Sun", value: 15 },
    ],
  },
  {
    id: "reading",
    name: "Reading",
    icon: "📚",
    unit: "minutes",
    goal: 30,
    current: 20,
    color: "#6366F1",
    streak: 2,
    history: [
      { date: "Mon", value: 0 },
      { date: "Tue", value: 15 },
      { date: "Wed", value: 20 },
      { date: "Thu", value: 0 },
      { date: "Fri", value: 10 },
      { date: "Sat", value: 45 },
      { date: "Sun", value: 20 },
    ],
  },
];

const mockNotifications: Notification[] = [
  {
    id: "1",
    message: "Don't forget to log your sleep hours for today!",
    type: "reminder",
    timestamp: new Date(Date.now() - 30 * 60000),
    read: false,
  },
  {
    id: "2",
    message: "Congratulations! You've achieved your water intake goal for 3 days in a row!",
    type: "achievement",
    timestamp: new Date(Date.now() - 2 * 3600000),
    read: false,
  },
  {
    id: "3",
    message: "You've been exceeding your screen time goal. Consider adjusting it?",
    type: "info",
    timestamp: new Date(Date.now() - 8 * 3600000),
    read: true,
  },
  {
    id: "4",
    message: "New feature: You can now set reminders for your habits!",
    type: "info",
    timestamp: new Date(Date.now() - 24 * 3600000),
    read: true,
  },
];

const weeklyProgress: DailyStats[] = [
  {
    date: "Mon",
    sleep: 7,
    water: 5,
    screenTime: 6,
    steps: 9000,
    meditation: 15,
    reading: 0,
  },
  {
    date: "Tue",
    sleep: 7.5,
    water: 7,
    screenTime: 5,
    steps: 10200,
    meditation: 20,
    reading: 15,
  },
  {
    date: "Wed",
    sleep: 8,
    water: 6,
    screenTime: 4.5,
    steps: 8700,
    meditation: 15,
    reading: 20,
  },
  {
    date: "Thu",
    sleep: 6.5,
    water: 8,
    screenTime: 5,
    steps: 9500,
    meditation: 20,
    reading: 0,
  },
  {
    date: "Fri",
    sleep: 7.5,
    water: 6,
    screenTime: 5.5,
    steps: 8500,
    meditation: 15,
    reading: 10,
  },
  {
    date: "Sat",
    sleep: 9,
    water: 4,
    screenTime: 3,
    steps: 12000,
    meditation: 25,
    reading: 45,
  },
  {
    date: "Sun",
    sleep: 7.5,
    water: 6,
    screenTime: 5.5,
    steps: 8500,
    meditation: 15,
    reading: 20,
  },
];

// Components
export default function PersonalHabitTracker() {
  // State variables
  const [habits, setHabits] = useState<Habit[]>(mockHabits);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAddHabitModal, setShowAddHabitModal] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitGoal, setNewHabitGoal] = useState(0);
  const [newHabitUnit, setNewHabitUnit] = useState("");
  const [newHabitIcon, setNewHabitIcon] = useState("📊");
  const [newHabitColor, setNewHabitColor] = useState("#3B82F6");
  const [dateRange, setDateRange] = useState<"week" | "month" | "year">("week");
  const [showHabitDetail, setShowHabitDetail] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Calculate unread notifications count
  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.read).length);
  }, [notifications]);

  // Get current date
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Calculate overall progress
  const overallProgress = habits.reduce(
    (sum, habit) => sum + (habit.current / habit.goal > 1 ? 1 : habit.current / habit.goal),
    0
  ) / habits.length;

  // Handle habit update
  const updateHabit = (id: string, value: number) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              current: value,
              streak: value >= habit.goal ? habit.streak + 1 : 0,
              history: [
                ...habit.history.slice(0, 6),
                { date: "Today", value },
              ],
            }
          : habit
      )
    );
  };

  // Handle notification click
  const markNotificationAsRead = (id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const HabitDetailModal = () => (
  <AnimatePresence>
    {showHabitDetail && selectedHabit && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        onClick={() => setShowHabitDetail(false)}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md bg-white rounded-lg shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span
                  className="flex items-center justify-center w-12 h-12 mr-3 rounded-full"
                  style={{ backgroundColor: selectedHabit.color + "20", color: selectedHabit.color }}
                >
                  {selectedHabit.icon}
                </span>
                <h2 className="text-xl font-bold text-gray-800">{selectedHabit.name}</h2>
              </div>
              <button
                onClick={() => setShowHabitDetail(false)}
                className="p-1 text-gray-500 rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
  
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-500">Today's Progress</span>
                <span className="text-sm font-medium text-gray-700">
                  {Math.round((selectedHabit.current / selectedHabit.goal) * 100)}%
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full">
                <div
                  className="h-3 rounded-full"
                  style={{
                    width: `${(selectedHabit.current / selectedHabit.goal) * 100}%`,
                    backgroundColor: selectedHabit.color,
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">0 {selectedHabit.unit}</span>
                <span className="text-xs text-gray-500">{selectedHabit.goal} {selectedHabit.unit}</span>
              </div>
            </div>
  
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <span className="mr-2 text-lg">🔥</span>
                <div>
                  <p className="text-sm font-medium text-gray-700">{selectedHabit.streak} day streak</p>
                  <p className="text-xs text-gray-500">
                    {selectedHabit.streak > 0
                      ? `Keep it up! ${7 - selectedHabit.streak} more days for a weekly achievement.`
                      : "Start a new streak today!"}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => updateHabit(selectedHabit.id, selectedHabit.current + 1)}
                  className="flex items-center justify-center w-10 h-10 text-white bg-green-500 rounded-full hover:bg-green-600"
                >
                  +
                </button>
                <button
                  onClick={() => updateHabit(selectedHabit.id, Math.max(0, selectedHabit.current - 1))}
                  className="flex items-center justify-center w-10 h-10 text-white bg-red-500 rounded-full hover:bg-red-600"
                >
                  -
                </button>
              </div>
            </div>
  
            <h3 className="mb-3 text-lg font-semibold text-gray-800">Weekly Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={selectedHabit.history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                  formatter={(value) => [`${value} ${selectedHabit.unit}`, selectedHabit.name]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={selectedHabit.color}
                  strokeWidth={2}
                  dot={{ r: 4, fill: selectedHabit.color }}
                  activeDot={{ r: 6, stroke: selectedHabit.color, strokeWidth: 2, fill: "white" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
  );
  
 const Dashboard = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      <div className="p-6 bg-white rounded-lg shadow-sm md:col-span-2 lg:col-span-3">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Today's Overview</h2>
          <span className="px-3 py-1 text-sm bg-indigo-100 rounded-full text-indigo-700">
            {Math.round(overallProgress * 100)}% Complete
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {habits.map((habit) => {
            const progressPercentage = (habit.current / habit.goal) * 100;
            return (
              <motion.div
                key={habit.id}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="p-4 bg-white border-[0.2px]  border-[#d3caca] rounded-lg cursor-pointer"
                onClick={() => {
                  setSelectedHabit(habit);
                  setShowHabitDetail(true);
                }}
              >
                <div className="flex items-center mb-2">
                  <span
                    className="flex items-center justify-center w-8 h-8 mr-2 rounded-full"
                    style={{ backgroundColor: habit.color + "20", color: habit.color }}
                  >
                    {habit.icon}
                  </span>
                  <h3 className="text-sm font-semibold text-gray-700">{habit.name}</h3>
                </div>
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Progress</span>
                    <span className="text-xs font-medium text-gray-700">
                      {progressPercentage > 100 ? 100 : Math.round(progressPercentage)}%
                    </span>
                  </div>
                  <div className="w-full h-1 bg-gray-200 rounded-full">
                    <div
                      className="h-1 rounded-full"
                      style={{
                        width: `${progressPercentage > 100 ? 100 : progressPercentage}%`,
                        backgroundColor: habit.color,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {habit.current} / {habit.goal} {habit.unit}
                  </span>
                  {habit.streak > 0 && (
                    <div className="flex items-center">
                      <span className="mr-1 text-xs">🔥</span>
                      <span className="text-xs font-medium text-orange-500">{habit.streak}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Weekly Progress</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={weeklyProgress}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip
              contentStyle={{ backgroundColor: "white", borderRadius: "8px", border: "none", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
            />
            <Line
              type="monotone"
              dataKey="sleep"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, stroke: "#8B5CF6", strokeWidth: 2, fill: "white" }}
            />
            <Line
              type="monotone"
              dataKey="water"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, stroke: "#3B82F6", strokeWidth: 2, fill: "white" }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex justify-center mt-4">
          <div className="flex items-center mr-4">
            <div className="w-3 h-3 mr-1 rounded-full bg-indigo-600"></div>
            <span className="text-xs text-gray-600">Sleep</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 mr-1 rounded-full bg-blue-500"></div>
            <span className="text-xs text-gray-600">Water</span>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-sm lg:col-span-2">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Habit Streaks</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {habits
            .filter((habit) => habit.streak > 0)
            .slice(0, 4)
            .map((habit) => (
              <div key={habit.id} className="flex items-center p-3 border-[0.2px]  border-[#d3caca] rounded-lg">
                <span
                  className="flex items-center justify-center w-10 h-10 mr-3 rounded-full"
                  style={{ backgroundColor: habit.color + "20", color: habit.color }}
                >
                  {habit.icon}
                </span>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-700">{habit.name}</h3>
                  <div className="flex items-center">
                    <span className="mr-1 text-sm text-orange-500">🔥</span>
                    <span className="mr-2 text-sm font-medium text-orange-500">{habit.streak}</span>
                    <span className="text-xs text-gray-500">
                      day{habit.streak > 1 ? "s" : ""} streak
                    </span>
                  </div>
                </div>
              </div>
            ))}
          {habits.filter((habit) => habit.streak > 0).length === 0 && (
            <div className="p-4 text-center text-gray-500 col-span-2">
              No active streaks. Start building consistency!
            </div>
          )}
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Today's Reminders</h2>
        <ul className="space-y-3">
          {habits
            .filter((habit) => habit.current < habit.goal)
            .slice(0, 3)
            .map((habit) => (
              <li key={habit.id} className="flex p-3 border-[0.2px]  border-[#d3caca] rounded-lg">
                <span
                  className="flex items-center justify-center w-8 h-8 mr-3 rounded-full"
                  style={{ backgroundColor: habit.color + "20", color: habit.color }}
                >
                  {habit.icon}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    You still need {habit.goal - habit.current} {habit.unit} of {habit.name.toLowerCase()} today
                  </p>
                </div>
              </li>
            ))}
          {habits.filter((habit) => habit.current < habit.goal).length === 0 && (
            <div className="p-4 text-center text-gray-500">
              All goals completed for today. Great job!
            </div>
          )}
        </ul>
      </div>
    </motion.div>
  );

  const HabitsTab = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">My Habits</h2>
        <button
          onClick={() => setShowAddHabitModal(true)}
          className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          Add New Habit
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {habits.map((habit) => {
          const progressPercentage = (habit.current / habit.goal) * 100;
          return (
            <motion.div
              key={habit.id}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="p-5 bg-white border-[0.2px]  border-[#d3caca] rounded-lg shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span
                    className="flex items-center justify-center w-10 h-10 mr-3 rounded-full"
                    style={{ backgroundColor: habit.color + "20", color: habit.color }}
                  >
                    {habit.icon}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-800">{habit.name}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  {habit.streak > 0 && (
                    <div className="flex items-center px-2 py-1 bg-orange-100 rounded-full">
                      <span className="mr-1 text-sm">🔥</span>
                      <span className="text-sm font-medium text-orange-600 ">{habit.streak}</span>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setSelectedHabit(habit);
                      setShowHabitDetail(true);
                    }}
                    className="p-1 text-gray-500 rounded-full hover:bg-gray-100 cursor-pointer"
                  >
                    <span className="text-lg">📊</span>
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-500">Progress</span>
                  <span className="text-sm font-medium text-gray-700">
                    {progressPercentage > 100 ? 100 : Math.round(progressPercentage)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${progressPercentage > 100 ? 100 : progressPercentage}%`,
                      backgroundColor: habit.color,
                    }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">
                  {habit.current} / {habit.goal} {habit.unit}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateHabit(habit.id, habit.current + 1);
                    }}
                    className="flex items-center justify-center w-8 h-8 text-white bg-green-500 rounded-full hover:bg-green-600"
                  >
                    +
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateHabit(habit.id, Math.max(0, habit.current - 1));
                    }}
                    className="flex items-center justify-center w-8 h-8 text-white bg-red-500 rounded-full hover:bg-red-600"
                  >
                    -
                  </button>
                </div>
              </div>
              <button
                onClick={() => deleteHabit(habit.id)}
                className="w-full py-2 text-sm text-red-600 bg-red-100 rounded-lg hover:bg-red-200"
              >
                Delete Habit
              </button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );

  const AnalyticsTab = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Analytics</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setDateRange("week")}
            className={`px-3 py-1 text-sm rounded-lg ${
              dateRange === "week"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Week
          </button>
          <button
        onClick={() => setDateRange("month")}
        className={`px-3 py-1 text-sm rounded-lg ${
          dateRange === "month"
            ? "bg-indigo-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        Month
      </button>
      <button
        onClick={() => setDateRange("year")}
        className={`px-3 py-1 text-sm rounded-lg ${
          dateRange === "year"
            ? "bg-indigo-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        Year
      </button>
    </div>
  </div>

  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">Completion Rate</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={habits}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
          <YAxis stroke="#9CA3AF" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Bar
            dataKey={(habit) => (habit.current / habit.goal) * 100}
            name="Completion %"
            radius={[4, 4, 0, 0]}
          >
            {habits.map((habit) => (
              <Cell key={`cell-${habit.id}`} fill={habit.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>

    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">Consistency</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadialBarChart
          innerRadius="20%"
          outerRadius="100%"
          data={habits.map((habit) => ({
            name: habit.name,
            value: (habit.streak / 7) * 100,
            fill: habit.color,
          }))}
          startAngle={180}
          endAngle={-180}
        >
          <RadialBar
            label={{ position: "insideStart", fill: "#fff" }}
            background
            dataKey="value"
          />
          <Legend
            iconSize={10}
            layout="vertical"
            verticalAlign="middle"
            align="right"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value) => [`${value}%`, "Consistency"]}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>

    <div className="p-6 bg-white rounded-lg shadow-sm md:col-span-2">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">Habit Distribution</h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={habits}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="current"
            nameKey="name"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {habits.map((habit) => (
              <Cell key={`cell-${habit.id}`} fill={habit.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value, name, props) => [
              `${value} ${props.payload.unit}`,
              name,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
</motion.div>
);

const AchievementsTab = () => (
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
  className="space-y-6"
>
  <h2 className="text-xl font-bold text-gray-800">Achievements</h2>
  
  <div className="p-6 bg-white rounded-lg shadow-sm">
    <h3 className="mb-4 text-lg font-semibold text-gray-800">Completed</h3>
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      <div className="flex flex-col items-center p-4 border-[0.2px]  border-[#d3caca] rounded-lg">
        <div className="flex items-center justify-center w-16 h-16 mb-2 text-3xl bg-yellow-100 rounded-full">
          🏆
        </div>
        <h4 className="text-sm font-medium text-center text-gray-700">7-Day Streak</h4>
        <p className="text-xs text-center text-gray-500">Meditation</p>
      </div>
      <div className="flex flex-col items-center p-4 border-[0.2px]  border-[#d3caca] rounded-lg">
        <div className="flex items-center justify-center w-16 h-16 mb-2 text-3xl bg-blue-100 rounded-full">
          💧
        </div>
        <h4 className="text-sm font-medium text-center text-gray-700">Hydration Master</h4>
        <p className="text-xs text-center text-gray-500">3 perfect weeks</p>
      </div>
    </div>
  </div>

  <div className="p-6 bg-white rounded-lg shadow-sm">
    <h3 className="mb-4 text-lg font-semibold text-gray-800">In Progress</h3>
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      <div className="flex flex-col items-center p-4 border-[0.2px]  border-[#d3caca] rounded-lg">
        <div className="flex items-center justify-center w-16 h-16 mb-2 text-3xl bg-gray-100 rounded-full">
          🚶
        </div>
        <h4 className="text-sm font-medium text-center text-gray-700">10K Steps</h4>
        <p className="text-xs text-center text-gray-500">5/7 days this week</p>
        <div className="w-full h-1 mt-2 bg-gray-200 rounded-full">
          <div className="h-1 rounded-full bg-green-500" style={{ width: "71%" }}></div>
        </div>
      </div>
      <div className="flex flex-col items-center p-4 border-[0.2px]  border-[#d3caca] rounded-lg">
        <div className="flex items-center justify-center w-16 h-16 mb-2 text-3xl bg-gray-100 rounded-full">
          📚
        </div>
        <h4 className="text-sm font-medium text-center text-gray-700">Book Worm</h4>
        <p className="text-xs text-center text-gray-500">Read 20/30 days</p>
        <div className="w-full h-1 mt-2 bg-gray-200 rounded-full">
          <div className="h-1 rounded-full bg-green-500" style={{ width: "66%" }}></div>
        </div>
      </div>
    </div>
  </div>
</motion.div>
);
  const AddHabitModal = () => (
  <AnimatePresence>
    {showAddHabitModal && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        onClick={() => setShowAddHabitModal(false)}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md bg-white rounded-lg shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Add New Habit</h2>
              <button
                onClick={() => setShowAddHabitModal(false)}
                className="p-1 text-gray-500 rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
  
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Habit Name</label>
                <input
                  type="text"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Meditation"
                />
              </div>
  
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Daily Goal</label>
                  <input
                    type="number"
                    value={newHabitGoal}
                    onChange={(e) => setNewHabitGoal(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. 30"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Unit</label>
                  <input
                    type="text"
                    value={newHabitUnit}
                    onChange={(e) => setNewHabitUnit(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. minutes"
                  />
                </div>
              </div>
  
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Icon</label>
                <div className="flex space-x-2">
                  {["🧘", "💧", "📱", "👣", "📚", "🌙"].map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setNewHabitIcon(icon)}
                      className={`flex items-center justify-center w-10 h-10 text-2xl rounded-full ${
                        newHabitIcon === icon ? "bg-indigo-100" : "bg-gray-100"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
  
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Color</label>
                <div className="flex space-x-2">
                  {["#3B82F6", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B", "#6366F1"].map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewHabitColor(color)}
                      className={`w-8 h-8 rounded-full ${
                        newHabitColor === color ? "ring-2 ring-offset-2 ring-indigo-500" : ""
                      }`}
                      style={{ backgroundColor: color }}
                    ></button>
                  ))}
                </div>
              </div>
  
              <div className="flex justify-end pt-4 space-x-3">
                <button
                  onClick={() => setShowAddHabitModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={addNewHabit}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  Add Habit
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
  );
  
  const SettingsModal = () => (
  <AnimatePresence>
    {showSettingsModal && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        onClick={() => setShowSettingsModal(false)}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md bg-white rounded-lg shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Settings</h2>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1 text-gray-500 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                ✕
              </button>
            </div>
  
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-lg font-medium text-gray-800">Notifications</h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Enable reminders</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
  
              <div>
                <h3 className="mb-2 text-lg font-medium text-gray-800">Appearance</h3>
                <div className="flex items-center space-x-4">
                  <button className="flex items-center justify-center w-10 h-10 border rounded-lg">
                    🌞
                  </button>
                  <button className="flex items-center justify-center w-10 h-10 bg-gray-800 border rounded-lg">
                    🌙
                  </button>
                  <button className="flex items-center justify-center w-10 h-10 border rounded-lg">
                    🖥️
                  </button>
                </div>
              </div>
  
              <div>
                <h3 className="mb-2 text-lg font-medium text-gray-800">Data</h3>
                <button className="w-full px-4 py-2 text-sm text-left text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                  Export Data
                </button>
              </div>
  
              <div className="pt-4 border-t">
                <button className="w-full px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
  );
  

  const MobileNav = () => (
    <div className="fixed bottom-0 left-0 right-0 z-10 flex items-center justify-around p-2 bg-white border-t md:hidden">
      <button
        onClick={() => setActiveTab("dashboard")}
        className={`flex flex-col items-center justify-center flex-1 p-2 ${
          activeTab === "dashboard" ? "text-indigo-600" : "text-gray-500"
        }`}
      >
        <span className="text-lg">📊</span>
        <span className="text-xs">Dashboard</span>
      </button>
      <button
        onClick={() => setActiveTab("habits")}
        className={`flex flex-col items-center justify-center flex-1 p-2 ${
          activeTab === "habits" ? "text-indigo-600" : "text-gray-500"
        }`}
      >
        <span className="text-lg">📝</span>
        <span className="text-xs">Habits</span>
      </button>
      <button
        onClick={() => setActiveTab("analytics")}
        className={`flex flex-col items-center justify-center flex-1 p-2 ${
          activeTab === "analytics" ? "text-indigo-600" : "text-gray-500"
        }`}
      >
        <span className="text-lg">📈</span>
        <span className="text-xs">Analytics</span>
      </button>
      <button
        onClick={() => setActiveTab("achievements")}
        className={`flex flex-col items-center justify-center flex-1 p-2 ${
          activeTab === "achievements" ? "text-indigo-600" : "text-gray-500"
        }`}
      >
        <span className="text-lg">🏆</span>
        <span className="text-xs">Awards</span>
      </button>
    </div>
  );

  const Sidebar = () => (
     <motion.div
       initial={{ x: -20, opacity: 0 }}
       animate={{ x: 0, opacity: 1 }}
       transition={{ duration: 0.5, delay: 0.2 }}
       className="hidden w-64 p-4 bg-white shadow-md md:block"
     >
       <div className="mb-6">
         <ul className="space-y-2">
           <li>
             <button
               onClick={() => setActiveTab("dashboard")}
               className={`flex items-center w-full px-4 py-2 text-left rounded-lg ${
                 activeTab === "dashboard"
                   ? "bg-indigo-100 text-indigo-700"
                   : "text-gray-600 hover:bg-gray-100"
               }`}
             >
               <span className="mr-3 text-lg">📊</span>
               <span>Dashboard</span>
             </button>
           </li>
           <li>
             <button
               onClick={() => setActiveTab("habits")}
               className={`flex items-center w-full px-4 py-2 text-left rounded-lg cursor-pointer ${
                 activeTab === "habits"
                   ? "bg-indigo-100 text-indigo-700"
                   : "text-gray-600 hover:bg-gray-100"
               }`}
             >
               <span className="mr-3 text-lg">📝</span>
               <span>My Habits</span>
             </button>
           </li>
           <li>
             <button
               onClick={() => setActiveTab("analytics")}
               className={`flex items-center w-full px-4 py-2 text-left rounded-lg cursor-pointer ${
                 activeTab === "analytics"
                   ? "bg-indigo-100 text-indigo-700"
                   : "text-gray-600 hover:bg-gray-100"
               }`}
             >
               <span className="mr-3 text-lg">📈</span>
               <span>Analytics</span>
             </button>
           </li>
           <li>
             <button
               onClick={() => setActiveTab("achievements")}
               className={`flex items-center w-full px-4 py-2 text-left rounded-lg cursor-pointer ${
                 activeTab === "achievements"
                   ? "bg-indigo-100 text-indigo-700"
                   : "text-gray-600 hover:bg-gray-100"
               }`}
             >
               <span className="mr-3 text-lg">🏆</span>
               <span>Achievements</span>
             </button>
           </li>
         </ul>
       </div>
 
       <div className="mb-6">
         <h2 className="mb-4 text-lg font-semibold text-gray-700">My Habits</h2>
         <ul className="space-y-2">
           {habits.map((habit) => (
             <li key={habit.id}>
               <button
                 onClick={() => {
                   setSelectedHabit(habit);
                   setShowHabitDetail(true);
                 }}
                 className="flex items-center w-full px-4 py-2 text-left text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
               >
                 <span
                   className="flex items-center justify-center w-6 h-6 mr-3 rounded-full"
                   style={{ backgroundColor: habit.color + "20", color: habit.color }}
                 >
                   {habit.icon}
                 </span>
                 <span>{habit.name}</span>
               </button>
             </li>
           ))}
           <li>
             <button
               onClick={() => setShowAddHabitModal(true)}
               className="flex items-center w-full px-4 py-2 text-left text-indigo-600 rounded-lg hover:bg-indigo-50 cursor-pointer"
             >
               <span className="mr-3">+</span>
               <span>Add New Habit</span>
             </button>
           </li>
         </ul>
       </div>
 
       <div className="p-4 bg-gray-50 rounded-lg">
         <div className="flex items-center justify-between mb-2">
           <h3 className="text-sm font-medium text-gray-700">Daily Progress</h3>
           <span className="text-lg">{Math.round(overallProgress * 100)}%</span>
         </div>
         <div className="w-full h-2 mb-4 bg-gray-200 rounded-full">
           <div
             className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
             style={{ width: `${overallProgress * 100}%` }}
           ></div>
         </div>
         <p className="text-xs text-gray-500">
           You're {overallProgress >= 0.5 ? "on track" : "falling behind"} today. 
           {overallProgress >= 0.8 ? "Great work!" : overallProgress >= 0.5 ? "Keep it up!" : "Let's catch up!"}
         </p>
       </div>
     </motion.div>
   );
 

  const Navbar = () => (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between p-4 bg-white shadow-xs"
    >
    <div className="flex items-end space-x-2">
  <div className="flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-lg">
    <BarChart2 className="w-5 h-5 text-white" /> 
  </div>
  <h1 className="text-2xl font-extrabold text-[#3c454c] dark:text-white hidden md:flex">Momentum</h1>
</div>
      <div className="text-sm text-gray-500">{formattedDate}</div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="flex items-center justify-center w-10 h-10 text-gray-600 bg-gray-100 cursor-pointer rounded-full hover:bg-gray-200 focus:outline-none"
          >
            {/* <span className="text-lg ">🔔</span> */}
            <Bell/>
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 z-10 w-80 mt-2 overflow-hidden bg-white rounded-lg shadow-lg border-[0.2px]  border-[#d3caca]"
            >
              <div className="p-3 bg-gray-50 border-b border-[0.2px]  border-[#d3caca]">
                <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => markNotificationAsRead(notification.id)}
                      className={`p-4 border-b border-[0.2px]  border-[#d3caca] cursor-pointer ${
                        notification.read ? "bg-white" : "bg-blue-50"
                      } hover:bg-gray-50`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          {notification.type === "reminder" && <span className="text-lg">⏰</span>}
                          {notification.type === "achievement" && <span className="text-lg">🏆</span>}
                          {notification.type === "info" && <span className="text-lg">ℹ️</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800">{notification.message}</p>
                          <p className="mt-1 text-xs text-gray-500">
                            {notification.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No notifications</div>
                )}
              </div>
              <div className="p-2 bg-gray-50 border-t border-[0.2px]  border-[#d3caca]">
                <button className="w-full px-3 py-1 text-xs text-indigo-600 bg-white border border-gray-200 rounded-md hover:bg-indigo-50">
                  Mark all as read
                </button>
              </div>
            </motion.div>
          )}
        </div>
        <button
          onClick={() => setShowSettingsModal(true)}
          className="flex items-center justify-center w-10 h-10 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none cursor-pointer"
        >
          {/* <span className="text-lg">⚙️</span> */}
          <Settings2/>
          
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 overflow-hidden rounded-full">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User profile" />
          </div>
          <span className="hidden text-sm font-medium text-gray-700 md:block">Sarah Johnson</span>
        </div>
      </div>
    </motion.nav>
  );


  const addNewHabit = () => {
    if (newHabitName && newHabitGoal && newHabitUnit) {
      const newHabit: Habit = {
        id: Date.now().toString(),
        name: newHabitName,
        icon: newHabitIcon,
        unit: newHabitUnit,
        goal: newHabitGoal,
        current: 0,
        color: newHabitColor,
        streak: 0,
        history: Array(7)
          .fill(0)
          .map((_, i) => ({ date: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i], value: 0 })),
      };
      setHabits((prevHabits) => [...prevHabits, newHabit]);
      setShowAddHabitModal(false);
      setNewHabitName("");
      setNewHabitGoal(0);
      setNewHabitUnit("");
      setNewHabitIcon("📊");
      setNewHabitColor("#3B82F6");
    }
  };
 

  const deleteHabit = (id: string) => {
    setHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== id));
    if (selectedHabit?.id === id) {
      setSelectedHabit(null);
      setShowHabitDetail(false);
    }
  };


  // Layout components



return (
<div className="flex flex-col min-h-screen bg-gray-50">
  <Navbar />
  <div className="flex flex-1">
    <Sidebar />
    <main className="flex-1 p-4 overflow-auto md:p-6">
      <AnimatePresence mode="wait">
        {activeTab === "dashboard" && <Dashboard key="dashboard" />}
        {activeTab === "habits" && <HabitsTab key="habits" />}
        {activeTab === "analytics" && <AnalyticsTab key="analytics" />}
        {activeTab === "achievements" && <AchievementsTab key="achievements" />}
      </AnimatePresence>
    </main>
  </div>
  <MobileNav />

  {/* Modals */}
  <HabitDetailModal />
  <AddHabitModal />
  <SettingsModal />
</div>
);
}