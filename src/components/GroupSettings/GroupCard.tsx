import { HiPencil } from "react-icons/hi";

interface GroupCardProps {
  text: string;
  onClick?: () => void;
  children: React.ReactNode;
  title: string;
}

export default function GroupCard({ text, onClick, children, title }: GroupCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-emerald-100 rounded-lg">
          {children}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold text-gray-900 truncate">
          {text}
        </span>
        {onClick && (
          <button
            onClick={onClick}
            className="p-1 text-gray-400 cursor-pointer hover:text-gray-600"
          >
            <HiPencil className="text-lg" />
          </button>
        )}
      </div>
    </div>
  );
}
