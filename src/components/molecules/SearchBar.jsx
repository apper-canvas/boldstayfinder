import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { format } from "date-fns";

const SearchBar = ({ onSearch, initialQuery = {} }) => {
  const [query, setQuery] = useState({
    location: initialQuery.location || "",
    checkIn: initialQuery.checkIn || "",
    checkOut: initialQuery.checkOut || "",
    guests: initialQuery.guests || 1,
    ...initialQuery
  });

  const handleSearch = () => {
    onSearch(query);
  };

  const handleInputChange = (field, value) => {
    setQuery(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-full shadow-lg p-2 flex flex-col md:flex-row gap-2 md:gap-0 max-w-4xl mx-auto">
      <div className="flex-1 px-4 py-3 border-r border-gray-200 last:border-r-0">
        <div className="flex items-center gap-3">
          <ApperIcon name="MapPin" size={20} className="text-gray-400" />
          <div className="flex-1">
            <label className="text-xs font-medium text-gray-600 block mb-1">Where</label>
            <input
              type="text"
              placeholder="Search destinations"
              value={query.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="w-full border-none outline-none text-sm text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-3 border-r border-gray-200 last:border-r-0">
        <div className="flex items-center gap-3">
          <ApperIcon name="Calendar" size={20} className="text-gray-400" />
          <div className="flex-1">
            <label className="text-xs font-medium text-gray-600 block mb-1">Check in</label>
            <input
              type="date"
              value={query.checkIn}
              onChange={(e) => handleInputChange("checkIn", e.target.value)}
              className="w-full border-none outline-none text-sm text-gray-900"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-3 border-r border-gray-200 last:border-r-0">
        <div className="flex items-center gap-3">
          <ApperIcon name="Calendar" size={20} className="text-gray-400" />
          <div className="flex-1">
            <label className="text-xs font-medium text-gray-600 block mb-1">Check out</label>
            <input
              type="date"
              value={query.checkOut}
              onChange={(e) => handleInputChange("checkOut", e.target.value)}
              className="w-full border-none outline-none text-sm text-gray-900"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-3 border-r border-gray-200 last:border-r-0">
        <div className="flex items-center gap-3">
          <ApperIcon name="Users" size={20} className="text-gray-400" />
          <div className="flex-1">
            <label className="text-xs font-medium text-gray-600 block mb-1">Guests</label>
            <select
              value={query.guests}
              onChange={(e) => handleInputChange("guests", parseInt(e.target.value))}
              className="w-full border-none outline-none text-sm text-gray-900 bg-transparent"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>
                  {num} guest{num > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <Button
        onClick={handleSearch}
        className="rounded-full p-4 md:p-3 flex items-center justify-center min-w-[50px]"
      >
        <ApperIcon name="Search" size={20} />
      </Button>
    </div>
  );
};

export default SearchBar;