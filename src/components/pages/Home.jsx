import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "@/components/molecules/SearchBar";
import PropertyCard from "@/components/molecules/PropertyCard";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { propertyService } from "@/services/api/propertyService";
import { wishlistService } from "@/services/api/wishlistService";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFeaturedProperties = async () => {
    try {
      setLoading(true);
      setError("");
      await new Promise(resolve => setTimeout(resolve, 300));
      const properties = await propertyService.getAll();
      setFeaturedProperties(properties.slice(0, 8));
    } catch (err) {
      setError("Failed to load featured properties. Please try again.");
      console.error("Error loading properties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeaturedProperties();
  }, []);

  const handleSearch = (searchQuery) => {
    const queryParams = new URLSearchParams({
      location: searchQuery.location || "",
      checkIn: searchQuery.checkIn || "",
      checkOut: searchQuery.checkOut || "",
      guests: searchQuery.guests || 1
    });
    navigate(`/search?${queryParams.toString()}`);
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

  const categories = [
    { name: "Beach", icon: "Waves", description: "Oceanfront properties" },
    { name: "Mountain", icon: "Mountain", description: "Scenic highland retreats" },
    { name: "City", icon: "Building", description: "Urban accommodations" },
    { name: "Countryside", icon: "Trees", description: "Rural getaways" },
    { name: "Lake", icon: "Droplets", description: "Lakeside properties" },
    { name: "Desert", icon: "Sun", description: "Desert landscapes" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 text-balance">
              Find your perfect
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block">
                stay anywhere
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto text-balance">
              Discover unique places to stay, from cozy homes to luxury villas, 
              all around the world.
            </p>
          </div>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Browse by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse by category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => navigate(`/search?category=${category.name.toLowerCase()}`)}
              className="p-6 bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all transform hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center mb-4 group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors">
                <ApperIcon name={category.icon} size={24} className="text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-sm text-gray-600">{category.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured stays</h2>
          <Button 
            variant="outline" 
            onClick={() => navigate("/search")}
            className="hidden sm:flex"
          >
            View all properties
          </Button>
        </div>

        {loading && <Loading type="properties" />}
        
        {error && (
          <Error 
            message={error} 
            onRetry={loadFeaturedProperties}
          />
        )}

        {!loading && !error && featuredProperties.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard
                key={property.Id}
                property={property}
                onWishlistToggle={handleWishlistToggle}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-8 sm:hidden">
          <Button onClick={() => navigate("/search")}>
            View all properties
          </Button>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why choose StayFinder?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join millions of travelers who trust us for their perfect stay
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-primary/30 group-hover:to-primary/20 transition-colors">
                <ApperIcon name="Shield" size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Safe</h3>
              <p className="text-gray-600">
                Your safety is our priority. All bookings are protected with secure payments and verified hosts.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-secondary/30 group-hover:to-secondary/20 transition-colors">
                <ApperIcon name="HeartHandshake" size={32} className="text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Trusted Community</h3>
              <p className="text-gray-600">
                Connect with verified hosts and join a community of travelers sharing authentic experiences.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-accent/30 group-hover:to-accent/20 transition-colors">
                <ApperIcon name="Clock" size={32} className="text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Get help anytime, anywhere. Our support team is always ready to assist with your travel needs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;