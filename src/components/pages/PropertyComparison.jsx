import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { propertyService } from '@/services/api/propertyService';
import { toast } from 'react-toastify';

const PropertyComparison = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true);
        const ids = searchParams.get('ids')?.split(',').map(id => parseInt(id)).filter(Boolean) || [];
        
        if (ids.length === 0) {
          setError('No properties selected for comparison');
          return;
        }

        const propertyPromises = ids.map(id => propertyService.getById(id));
        const loadedProperties = await Promise.all(propertyPromises);
        
        const validProperties = loadedProperties.filter(Boolean);
        if (validProperties.length === 0) {
          setError('Selected properties could not be loaded');
          return;
        }

        setProperties(validProperties);
      } catch (err) {
        setError('Failed to load properties for comparison');
        console.error('Error loading comparison properties:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, [searchParams]);

  const handleBackToSearch = () => {
    navigate('/search');
  };

  const handleViewProperty = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getAmenityIcon = (amenity) => {
    const icons = {
      'WiFi': 'Wifi',
      'Kitchen': 'ChefHat',
      'Parking': 'Car',
      'Pool': 'Waves',
      'Gym': 'Dumbbell',
      'Pet friendly': 'Heart',
      'Air conditioning': 'Snowflake',
      'Washer/Dryer': 'Shirt',
      'TV': 'Tv',
      'Balcony': 'Building'
    };
    return icons[amenity] || 'Check';
  };

  if (loading) {
    return <Loading type="properties" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-7xl mx-auto">
          <Error message={error} onRetry={handleBackToSearch} />
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-7xl mx-auto">
          <Empty
            title="No properties to compare"
            description="Please select properties from the search page to compare."
            actionText="Back to Search"
            onAction={handleBackToSearch}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleBackToSearch}
              className="flex items-center gap-2"
            >
              <ApperIcon name="ArrowLeft" size={16} />
              Back to Search
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Property Comparison</h1>
              <p className="text-gray-600">Compare {properties.length} selected {properties.length === 1 ? 'property' : 'properties'}</p>
            </div>
          </div>
        </div>

        {/* Mobile View - Stack cards */}
        <div className="lg:hidden space-y-6">
          {properties.map((property) => (
            <Card key={property.Id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 pr-4">{property.title}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewProperty(property.Id)}
                >
                  View Details
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="aspect-video bg-gray-200 rounded-lg mb-4"></div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Price per night:</span>
                    <p className="text-lg font-bold text-primary">{formatPrice(property.pricing?.nightlyRate || 0)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Property Type:</span>
                    <p className="capitalize">{property.propertyType || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Guests:</span>
                    <p>{property.capacity?.guests || 0}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Bedrooms:</span>
                    <p>{property.capacity?.bedrooms || 0}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Bathrooms:</span>
                    <p>{property.capacity?.bathrooms || 0}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Rating:</span>
                    <p className="flex items-center gap-1">
                      <ApperIcon name="Star" size={14} className="text-accent" />
                      {property.rating || 'N/A'} ({property.reviewCount || 0})
                    </p>
                  </div>
                </div>

                <div>
                  <span className="font-medium text-gray-700">Location:</span>
                  <p className="text-sm text-gray-600">{property.location?.address}, {property.location?.city}, {property.location?.country}</p>
                </div>

                {property.amenities && property.amenities.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">Amenities:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {property.amenities.slice(0, 6).map((amenity, idx) => (
                        <span key={idx} className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded">
                          <ApperIcon name={getAmenityIcon(amenity)} size={12} />
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Desktop View - Comparison Table */}
        <div className="hidden lg:block">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 w-48 bg-gray-50 font-medium text-gray-700">Property Details</th>
                    {properties.map((property) => (
                      <th key={property.Id} className="p-4 text-center min-w-80">
                        <div className="space-y-2">
                          <div className="aspect-video bg-gray-200 rounded-lg"></div>
                          <h3 className="font-semibold text-gray-900 text-left">{property.title}</h3>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewProperty(property.Id)}
                            className="w-full"
                          >
                            View Details
                          </Button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 bg-gray-50 font-medium text-gray-700">Price per night</td>
                    {properties.map((property) => (
                      <td key={property.Id} className="p-4 text-center">
                        <span className="text-xl font-bold text-primary">
                          {formatPrice(property.pricing?.nightlyRate || 0)}
                        </span>
                      </td>
                    ))}
                  </tr>
                  
                  <tr className="border-b">
                    <td className="p-4 bg-gray-50 font-medium text-gray-700">Property Type</td>
                    {properties.map((property) => (
                      <td key={property.Id} className="p-4 text-center capitalize">
                        {property.propertyType || 'N/A'}
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b">
                    <td className="p-4 bg-gray-50 font-medium text-gray-700">Max Guests</td>
                    {properties.map((property) => (
                      <td key={property.Id} className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <ApperIcon name="Users" size={16} />
                          {property.capacity?.guests || 0}
                        </div>
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b">
                    <td className="p-4 bg-gray-50 font-medium text-gray-700">Bedrooms</td>
                    {properties.map((property) => (
                      <td key={property.Id} className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <ApperIcon name="Bed" size={16} />
                          {property.capacity?.bedrooms || 0}
                        </div>
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b">
                    <td className="p-4 bg-gray-50 font-medium text-gray-700">Bathrooms</td>
                    {properties.map((property) => (
                      <td key={property.Id} className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <ApperIcon name="Bath" size={16} />
                          {property.capacity?.bathrooms || 0}
                        </div>
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b">
                    <td className="p-4 bg-gray-50 font-medium text-gray-700">Rating</td>
                    {properties.map((property) => (
                      <td key={property.Id} className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <ApperIcon name="Star" size={16} className="text-accent" />
                          <span className="font-medium">{property.rating || 'N/A'}</span>
                          <span className="text-gray-500 text-sm">({property.reviewCount || 0})</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b">
                    <td className="p-4 bg-gray-50 font-medium text-gray-700">Location</td>
                    {properties.map((property) => (
                      <td key={property.Id} className="p-4 text-center text-sm">
                        <div className="flex items-start justify-center gap-1">
                          <ApperIcon name="MapPin" size={14} className="mt-0.5" />
                          <div>
                            <p>{property.location?.city}</p>
                            <p className="text-gray-500">{property.location?.country}</p>
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b">
                    <td className="p-4 bg-gray-50 font-medium text-gray-700">Total Fees</td>
                    {properties.map((property) => (
                      <td key={property.Id} className="p-4 text-center text-sm">
                        <div className="space-y-1">
                          <p>Cleaning: {formatPrice(property.pricing?.cleaningFee || 0)}</p>
                          <p>Service: {formatPrice(property.pricing?.serviceFee || 0)}</p>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {properties.some(p => p.amenities && p.amenities.length > 0) && (
                    <tr>
                      <td className="p-4 bg-gray-50 font-medium text-gray-700">Top Amenities</td>
                      {properties.map((property) => (
                        <td key={property.Id} className="p-4">
                          <div className="flex flex-wrap gap-1 justify-center">
                            {(property.amenities || []).slice(0, 6).map((amenity, idx) => (
                              <span key={idx} className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded">
                                <ApperIcon name={getAmenityIcon(amenity)} size={12} />
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyComparison;