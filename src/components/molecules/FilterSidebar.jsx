import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const FilterSidebar = ({ filters, onFiltersChange, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose?.();
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      priceRange: { min: 0, max: 1000 },
      propertyTypes: [],
      amenities: []
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const propertyTypes = [
    "House", "Apartment", "Villa", "Condo", "Townhouse", "Loft"
  ];

  const amenityOptions = [
    "WiFi", "Pool", "Gym", "Parking", "Kitchen", "Air conditioning",
    "Washer", "TV", "Hot tub", "Fireplace", "Balcony", "Pet friendly"
  ];

  return (
    <div className="bg-white p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <ApperIcon name="X" size={20} />
          </button>
        )}
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Price Range</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm text-gray-600 block mb-2">Min price</label>
              <input
                type="number"
                placeholder="0"
                value={localFilters.priceRange?.min || ""}
                onChange={(e) => handleFilterChange("priceRange", {
                  ...localFilters.priceRange,
                  min: parseInt(e.target.value) || 0
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm text-gray-600 block mb-2">Max price</label>
              <input
                type="number"
                placeholder="1000"
                value={localFilters.priceRange?.max || ""}
                onChange={(e) => handleFilterChange("priceRange", {
                  ...localFilters.priceRange,
                  max: parseInt(e.target.value) || 1000
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            step="25"
            value={localFilters.priceRange?.max || 1000}
            onChange={(e) => handleFilterChange("priceRange", {
              ...localFilters.priceRange,
              max: parseInt(e.target.value)
            })}
            className="w-full accent-primary"
          />
        </div>
      </div>

      {/* Property Type */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Property Type</h3>
        <div className="space-y-2">
          {propertyTypes.map(type => (
            <label key={type} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.propertyTypes?.includes(type) || false}
                onChange={(e) => {
                  const types = localFilters.propertyTypes || [];
                  if (e.target.checked) {
                    handleFilterChange("propertyTypes", [...types, type]);
                  } else {
                    handleFilterChange("propertyTypes", types.filter(t => t !== type));
                  }
                }}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/20"
              />
              <span className="text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Amenities</h3>
        <div className="space-y-2">
          {amenityOptions.map(amenity => (
            <label key={amenity} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.amenities?.includes(amenity) || false}
                onChange={(e) => {
                  const amenities = localFilters.amenities || [];
                  if (e.target.checked) {
                    handleFilterChange("amenities", [...amenities, amenity]);
                  } else {
                    handleFilterChange("amenities", amenities.filter(a => a !== amenity));
                  }
                }}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/20"
              />
              <span className="text-sm text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={handleClearFilters} className="flex-1">
          Clear all
        </Button>
        <Button onClick={handleApplyFilters} className="flex-1">
          Apply filters
        </Button>
      </div>
    </div>
  );
};

export default FilterSidebar;