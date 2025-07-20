import { HiStar, HiPlay, HiArrowRight } from "react-icons/hi2";
import AttendoLogo from "/AttendoLogo.svg";
import { Link } from "react-router";

export default function HomePage() {
  return (
    <div className=" bg-gradient-to-b from-white to-gray-50 ">
      <div className=" mx-auto container px-4 sm:px-6 max-w-5xl py-6 sm:py-8 flex flex-col justify-evenly gap-8 sm:gap-12 min-h-screen">
        {/* Hero Section */}
        <div className="text-center space-y-6 sm:space-y-8">
          {/* Trust Banner */}
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
            <HiStar className="text-yellow-500" />
            Trusted
          </div>

          {/* Headline */}
          <div className="space-y-4 sm:space-y-6">
            <img
              src={AttendoLogo}
              alt="Attendo Logo"
              className="w-24 sm:w-36 mx-auto"
            />
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900">
              Attendo
            </h1>
            <h2 className="text-xl sm:text-3xl md:text-5xl font-bold text-emerald-600 font-alegreya px-4">
              do it once, we handle it forever
            </h2>
          </div>
        </div>
        {/* CTA Buttons */}
        <div className="space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/groups"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-4 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors text-base sm:text-lg min-h-[48px] sm:min-h-[56px]"
            >
              Get Started
              <HiArrowRight className="text-lg sm:text-xl" />
            </Link>
            <a
              href="https://drive.google.com/drive/folders/19gnQlTyZMjUjc4NpoX76Is3ymf0ThTcA?usp=sharing"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-4 sm:py-4 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium transition-colors hover:bg-gray-50 text-base sm:text-lg min-h-[48px] sm:min-h-[56px]"
            >
              <HiPlay className="text-lg sm:text-xl" />
              Watch Demo
            </a>
          </div>

          {/* Feature Highlights */}
          <div className="hidden md:flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center text-sm sm:text-base text-gray-600">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              Save time
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              Save money
            </div>
          </div>
        </div>
        {/* Statistics Section */}
        <div className="bg-gray-100 p-3 sm:p-4 md:p-6 rounded-2xl shadow-sm">
          <div className="grid grid-cols-3 sm:grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
            {/* Today's Attendance Card */}
            <StatisticsCard
              title="Today's Attendance"
              value={94}
              description="%"
            />

            {/* Active Students Card */}
            <StatisticsCard
              title="Active Students"
              value={1247}
              description="across 5 groups"
            />

            {/* Time Saved Card */}
            <StatisticsCard title="Time Saved" value={15} description="hrs" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatisticsCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number;
  description: string;
}) {
  return (
    <div className="bg-white p-2 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border border-gray-200 shadow-sm aspect-square sm:aspect-auto flex flex-col justify-between sm:justify-start">
      <div className="flex items-center justify-between mb-0 sm:mb-3 md:mb-4">
        <h3 className="text-gray-700 font-medium text-xs sm:text-sm md:text-base truncate sm:truncate-none">
          {title}
        </h3>
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
      </div>
      <div className="text-center sm:text-left">
        <div className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 mb-0 sm:mb-1">
          {value}
        </div>
        <div className="text-xs sm:text-sm text-gray-500">{description}</div>
      </div>
    </div>
  );
}
