import React from "react";
import PropertyCard from "@/components/molecules/PropertyCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { toast } from 'react-toastify';

const PropertyGrid = ({ 
  properties, 
  loading, 
  error, 
  onRetry,
  onWishlistToggle,
  onClearFilters,
  selectedProperties = [],
  onPropertySelect,
  showCompareButton = false,
  onCompare
}) => {
  if (loading) {
    return <Loading type="properties" />;
  }

  if (error) {
    return <Error message={error} onRetry={onRetry} />;
  }

  if (!properties || properties.length === 0) {
    return (
      <Empty 
        title="No properties found"
        description="Try adjusting your search criteria or explore different locations."
        actionText="Clear filters"
        onAction={onClearFilters}
      />
    );
  }

return (
    <div className="space-y-6">
      {showCompareButton && selectedProperties.length > 0 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              {selectedProperties.length} {selectedProperties.length === 1 ? 'property' : 'properties'} selected for comparison
            </span>
            {selectedProperties.length >= 3 && (
              <span className="text-xs bg-accent text-white px-2 py-1 rounded-full">
                Max reached
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPropertySelect && onPropertySelect([])}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear selection
            </button>
            <button
              onClick={onCompare}
              disabled={selectedProperties.length === 0}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ApperIcon name="GitCompare" size={16} />
              Compare ({selectedProperties.length})
            </button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.map((property) => (
          <div key={property.Id} className="relative">
            {showCompareButton && onPropertySelect && (
              <div className="absolute top-3 left-3 z-10">
                <label className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedProperties.includes(property.Id)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      const currentSelected = selectedProperties;
                      
                      if (isChecked) {
                        if (currentSelected.length >= 3) {
                          toast.warn('You can compare up to 3 properties at once');
                          return;
                        }
                        onPropertySelect([...currentSelected, property.Id]);
                      } else {
                        onPropertySelect(currentSelected.filter(id => id !== property.Id));
                      }
                    }}
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className="text-xs font-medium text-gray-700">Compare</span>
                </label>
              </div>
            )}
            <PropertyCard
              property={property}
              onWishlistToggle={onWishlistToggle}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyGrid;