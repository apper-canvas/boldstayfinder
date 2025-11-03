import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "@/components/molecules/SearchBar";
import FilterSidebar from "@/components/molecules/FilterSidebar";
import PropertyGrid from "@/components/organisms/PropertyGrid";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { propertyService } from "@/services/api/propertyService";
import { wishlistService } from "@/services/api/wishlistService";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const [searchQuery, setSearchQuery] = useState({
    location: searchParams.get("location") || "",
    checkIn: searchParams.get("checkIn") || "",
    checkOut: searchParams.get("checkOut") || "",
    guests: parseInt(searchParams.get("guests")) || 1
  });

  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 1000 },
    propertyTypes: [],
    amenities: []
  });

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError("");
      await new Promise(resolve => setTimeout(resolve, 300));
      const allProperties = await propertyService.getAll();
      
      // Apply search and filters
      let filteredProperties = allProperties;

      if (searchQuery.location) {
        filteredProperties = filteredProperties.filter(property =>
          property.location.city.toLowerCase().includes(searchQuery.location.toLowerCase()) ||
          property.location.country.toLowerCase().includes(searchQuery.location.toLowerCase()) ||
          property.title.toLowerCase().includes(searchQuery.location.toLowerCase())
        );
      }

      if (filters.priceRange.min > 0 || filters.priceRange.max < 1000) {
        filteredProperties = filteredProperties.filter(property =>
          property.pricing.nightlyRate >= filters.priceRange.min &&
          property.pricing.nightlyRate <= filters.priceRange.max
        );
      }

      if (filters.propertyTypes.length > 0) {
        filteredProperties = filteredProperties.filter(property =>
          filters.propertyTypes.includes(property.propertyType)
        );
      }

      if (filters.amenities.length > 0) {
        filteredProperties = filteredProperties.filter(property =>
          filters.amenities.every(amenity =>
            property.amenities.includes(amenity)
          )
        );
      }

      if (searchQuery.guests > 1) {
        filteredProperties = filteredProperties.filter(property =>
          property.capacity.guests >= searchQuery.guests
        );
      }

      setProperties(filteredProperties);
    } catch (err) {
      setError("Failed to load properties. Please try again.");
      console.error("Error loading properties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [searchQuery, filters]);

  const handleSearch = (newQuery) => {
    setSearchQuery(newQuery);
    
    // Update URL params
    const params = new URLSearchParams();
    if (newQuery.location) params.set("location", newQuery.location);
    if (newQuery.checkIn) params.set("checkIn", newQuery.checkIn);
    if (newQuery.checkOut) params.set("checkOut", newQuery.checkOut);
    if (newQuery.guests) params.set("guests", newQuery.guests.toString());
    
    setSearchParams(params);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      priceRange: { min: 0, max: 1000 },
      propertyTypes: [],
      amenities: []
    };
    setFilters(clearedFilters);
  };

  const handleWishlistToggle = async (propertyId, isAdded) => {
    try {
      if (isAdded) {
        await wishlistService.addItem(propertyId);
      } else {
        await wishlistService.removeItem(propertyId);
      }
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  };

  const activeFilterCount = 
    (filters.propertyTypes?.length || 0) + 
    (filters.amenities?.length || 0) +
    (filters.priceRange?.min > 0 || filters.priceRange?.max < 1000 ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />
          
          {/* Results Summary & Controls */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-gray-900">
                {loading ? "Searching..." : `${properties.length} stays`}
                {searchQuery.location && (
                  <span className="text-gray-600 font-normal"> in {searchQuery.location}</span>
                )}
              </h1>
              {searchQuery.checkIn && searchQuery.checkOut && (
                <span className="text-sm text-gray-600">
                  {searchQuery.checkIn} - {searchQuery.checkOut}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(true)}
                className="lg:hidden relative"
              >
                <ApperIcon name="Filter" size={16} className="mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
              
              <Button
                variant={showMap ? "primary" : "outline"}
                onClick={() => setShowMap(!showMap)}
                className="hidden md:flex"
              >
                <ApperIcon name={showMap ? "List" : "Map"} size={16} className="mr-2" />
                {showMap ? "Show list" : "Show map"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-32">
              <FilterSidebar
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {showMap ? (
              <div className="bg-gray-100 rounded-xl h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <ApperIcon name="Map" size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Interactive map coming soon</p>
                </div>
              </div>
            ) : (
              <PropertyGrid
                properties={properties}
                loading={loading}
                error={error}
                onRetry={loadProperties}
                onWishlistToggle={handleWishlistToggle}
                onClearFilters={handleClearFilters}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden">
          <div className="bg-white h-full overflow-y-auto">
            <FilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClose={() => setShowFilters(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;