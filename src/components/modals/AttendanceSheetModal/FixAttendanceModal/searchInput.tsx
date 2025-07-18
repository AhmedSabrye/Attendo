import { FiX } from "react-icons/fi";

export default function SearchInput({
  search,
  setSearch,
  placeholder,
}: {
  search: string;
  setSearch: (search: string) => void;
  placeholder: string;
}) {
  return (
    <div className="mb-2 relative w-full max-w-xs mx-auto">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-full transition placeholder-gray-400 bg-gray-50 hover:bg-white pr-8"
        style={{
          fontSize: "0.92rem",
          minHeight: 34,
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
      />
      {search && (
        <button
          type="button"
          onClick={() => setSearch("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 focus:outline-none p-0.5 rounded"
          tabIndex={-1}
          aria-label="Clear search"
        >
          <FiX size={20} />
        </button>
      )}
    </div>
  );
}
