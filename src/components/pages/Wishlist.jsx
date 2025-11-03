import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { wishlistService } from "@/services/api/wishlistService";
import { propertyService } from "@/services/api/propertyService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import PropertyCard from "@/components/molecules/PropertyCard";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWishlist = async () => {
    try {
      setLoading(true);
      setError("");
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const wishlist = await wishlistService.getWishlist();
      if (wishlist && wishlist.items && wishlist.items.length > 0) {
        // Get full property data for each wishlist item
        const properties = await Promise.all(
          wishlist.items.map(id => propertyService.getById(id))
        );
        setWishlistItems(properties.filter(Boolean)); // Filter out null results
      } else {
        setWishlistItems([]);
      }
    } catch (err) {
      setError("Failed to load your wishlist. Please try again.");
      console.error("Error loading wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

const handleWishlistToggle = async (propertyId, isAdded) => {
    try {
      if (!isAdded) {
        await wishlistService.removeItem(propertyId);
        setWishlistItems(prev => prev.filter(item => item.Id !== propertyId));
        toast.success("Removed from favorites");
      } else {
        // For guests, show temporary add with tooltip about login
        setWishlistItems(prev => [...prev, { Id: propertyId }]);
        toast.info("Added to temporary favorites. Log in to save permanently.");
      }
    } catch (err) {
      console.error("Wishlist error:", err);
      toast.error("Please log in to manage your favorites");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Your wishlist</h1>
            <p className="text-gray-600 mt-2">Your saved properties</p>
          </div>
          <Loading type="properties" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Your wishlist</h1>
            <p className="text-gray-600 mt-2">Your saved properties</p>
          </div>
          <Error message={error} onRetry={loadWishlist} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your wishlist</h1>
          <p className="text-gray-600 mt-2">
            {wishlistItems.length > 0 
              ? `${wishlistItems.length} saved propert${wishlistItems.length === 1 ? 'y' : 'ies'}`
              : "Your saved properties will appear here"
            }
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <Empty
            title="Your wishlist is empty"
            description="Start exploring and save places you'd love to visit. You'll find them all here."
            actionText="Start exploring"
            onAction={() => window.location.href = "/search"}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((property) => (
              <PropertyCard
                key={property.Id}
                property={property}
                onWishlistToggle={handleWishlistToggle}
              />
            ))}
          </div>
        )}

        {/* Explore More Section */}
        {wishlistItems.length > 0 && (
          <div className="mt-16 bg-white rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Search" size={32} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Keep exploring</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Discover more amazing places and add them to your wishlist for future trips.
            </p>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 text-white px-6 py-3 rounded-lg hover:from-primary/90 hover:to-primary transition-all transform hover:-translate-y-1 shadow-lg"
            >
              <ApperIcon name="Search" size={16} />
              Explore more properties
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;