interface SearchAndSmartMatchCrontrolsProps {
  searchEnabled: boolean;
  setSearchEnabled: (searchEnabled: boolean) => void;
  smartMatchEnabled: boolean;
  setSmartMatchEnabled: (smartMatchEnabled: boolean) => void;
}
export default function SearchAndSmartMatchCrontrols({
  searchEnabled,
  setSearchEnabled,
  smartMatchEnabled,
  setSmartMatchEnabled,
}: SearchAndSmartMatchCrontrolsProps) {
  
  return (
    <div className="col-span-2 flex flex-wrap gap-6 mb-4 items-center">
      <label className="flex items-center gap-2 text-sm font-medium bg-gray-100 px-3 py-1 rounded-full shadow-sm transition border border-gray-200 hover:bg-gray-200 cursor-pointer">
        <input
          type="checkbox"
          checked={searchEnabled}
          onChange={(e) => {
            setSearchEnabled(e.target.checked);
            localStorage.setItem("searchEnabled", e.target.checked.toString());
          }}
          className="w-4 h-4 accent-blue-600 rounded focus:ring-2 focus:ring-blue-400 transition"
          style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
        />
        <span className="select-none">Enable Search</span>
      </label>
      <label className="flex items-center gap-2 text-sm font-medium bg-gray-100 px-3 py-1 rounded-full shadow-sm transition border border-gray-200 hover:bg-gray-200 cursor-pointer">
        <input
          type="checkbox"
          checked={smartMatchEnabled}
          onChange={(e) => {
            setSmartMatchEnabled(e.target.checked);
            localStorage.setItem(
              "smartMatchEnabled",
              e.target.checked.toString()
            );
          }}
          className="w-4 h-4 accent-green-600 rounded focus:ring-2 focus:ring-green-400 transition"
          style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
        />
        <span className="select-none">Smart Match</span>
      </label>
    </div>
  );
}
