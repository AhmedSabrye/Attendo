import { HiUserGroup, HiClipboardDocumentList, HiArrowRight } from "react-icons/hi2";
import { Link } from "react-router";

export default function HomePage() {

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HiClipboardDocumentList className="text-3xl text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Attendance Tracker</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple and efficient attendance management for groups and classes. Create groups, track attendance, and monitor participation
              effortlessly.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <HiUserGroup className="text-2xl text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Group Management</h3>
              <p className="text-gray-600 mb-4">
                Create groups with specific schedules, instructors, and time slots. Organize by days (Mon-Sun) and manage multiple sessions
                efficiently.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• Flexible scheduling system</li>
                <li>• Instructor assignment</li>
                <li>• Time slot management</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <HiClipboardDocumentList className="text-2xl text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Effortless Attendance Tracking</h3>
              <p className="text-gray-600 mb-4">
                Mark attendance quickly and accurately. Keep detailed records of student participation and monitor attendance patterns.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• Quick attendance marking</li>
                <li>• Detailed session records</li>
                <li>• Attendance history tracking</li>
              </ul>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-emerald-50 p-8 rounded-2xl border border-emerald-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to streamline your attendance management?</h2>
              <p className="text-gray-600 mb-6">Start organizing your groups and tracking attendance with our intuitive platform.</p>
              <Link
                to="/groups"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
              >
                Get Started
                <HiArrowRight className="text-lg" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
