import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import BookingPanel from "@/components/organisms/BookingPanel";
import PropertyCard from "@/components/molecules/PropertyCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { propertyService } from "@/services/api/propertyService";
import { wishlistService } from "@/services/api/wishlistService";
import { reviewService } from "@/services/api/reviewService";
import { toast } from "react-toastify";

// Amenities Section Component
const AmenitiesSection = ({ amenities }) => {
  const [showAll, setShowAll] = useState(false);
  const displayAmenities = showAll ? amenities : amenities.slice(0, 10);

  return (
    <div className="pb-8 border-b border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">What this place offers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {displayAmenities.map((amenity, index) => (
          <div key={index} className="flex items-center gap-3">
            <ApperIcon name="Check" size={16} className="text-secondary flex-shrink-0" />
            <span className="text-gray-700">{amenity}</span>
          </div>
        ))}
      </div>
      {amenities.length > 10 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          {showAll ? 'Show less' : `Show all ${amenities.length} amenities`}
        </button>
      )}
    </div>
  );
};

// Location Section Component
const LocationSection = ({ location }) => (
  <div className="pb-8 border-b border-gray-200">
    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Where you'll be</h2>
    <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center mb-4">
      <div className="text-center">
        <ApperIcon name="MapPin" size={48} className="text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 font-medium">{location.city}, {location.country}</p>
        <p className="text-gray-500 text-sm">Interactive map coming soon</p>
      </div>
    </div>
    <p className="text-gray-700">{location.neighborhood} • Great location with easy access to local attractions and amenities</p>
  </div>
);

// House Rules Section Component
const HouseRulesSection = () => (
  <div className="pb-8 border-b border-gray-200">
    <h2 className="text-2xl font-semibold text-gray-900 mb-6">House rules</h2>
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <ApperIcon name="Clock" size={20} className="text-gray-600" />
        <span className="text-gray-700">Check-in: 3:00 PM - 10:00 PM</span>
      </div>
      <div className="flex items-center gap-3">
        <ApperIcon name="Clock" size={20} className="text-gray-600" />
        <span className="text-gray-700">Check-out: 11:00 AM</span>
      </div>
      <div className="flex items-center gap-3">
        <ApperIcon name="Users" size={20} className="text-gray-600" />
        <span className="text-gray-700">Maximum occupancy strictly enforced</span>
      </div>
      <div className="flex items-center gap-3">
        <ApperIcon name="Ban" size={20} className="text-gray-600" />
        <span className="text-gray-700">No smoking inside</span>
      </div>
      <div className="flex items-center gap-3">
        <ApperIcon name="Volume2" size={20} className="text-gray-600" />
        <span className="text-gray-700">Quiet hours: 10:00 PM - 8:00 AM</span>
      </div>
    </div>
  </div>
);

// Reviews Section Component
const ReviewsSection = ({ propertyId, rating, reviewCount }) => {
  const [reviews, setReviews] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewFormData, setReviewFormData] = useState({
    rating: 0,
    title: '',
    comment: '',
    userName: 'Guest User'
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  // Load reviews for this property
  const loadReviews = async () => {
    try {
      setReviewsLoading(true);
      const reviewData = await reviewService.getByPropertyId(propertyId);
      setReviews(reviewData.reviews);
    } catch (error) {
      console.error('Failed to load reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (propertyId) {
      loadReviews();
    }
  }, [propertyId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (reviewFormData.rating === 0) {
      toast.warn('Please select a star rating');
      return;
    }
    
    if (reviewFormData.comment.trim().length < 10) {
      toast.warn('Please write at least 10 characters for your review');
      return;
    }

    try {
      setSubmittingReview(true);
      await reviewService.create({
        propertyId: propertyId,
        rating: reviewFormData.rating,
        title: reviewFormData.title.trim(),
        comment: reviewFormData.comment.trim(),
        userName: reviewFormData.userName.trim() || 'Guest User'
      });

      toast.success('Review submitted successfully!');
      
      // Reset form
      setReviewFormData({
        rating: 0,
        title: '',
        comment: '',
        userName: 'Guest User'
      });
      setShowReviewForm(false);
      
      // Reload reviews
      await loadReviews();
    } catch (error) {
      console.error('Failed to submit review:', error);
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const StarRating = ({ rating, onRatingChange, interactive = false }) => {
    const [hoverRating, setHoverRating] = useState(0);
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
          >
            <ApperIcon 
              name="Star" 
              size={interactive ? 20 : 12} 
              className={`transition-colors ${
                star <= (interactive ? (hoverRating || rating) : rating)
                  ? 'text-accent fill-current' 
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        {interactive && rating > 0 && (
          <span className="ml-2 text-sm text-gray-600">
            {rating} star{rating !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const displayReviews = showAll ? reviews : reviews.slice(0, 3);

  if (reviewsLoading) {
    return (
      <div className="pb-8 border-b border-gray-200">
        <div className="flex items-center justify-center py-8">
          <Loading type="reviews" />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-8 border-b border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ApperIcon name="Star" size={24} className="text-accent fill-current" />
          <h2 className="text-2xl font-semibold text-gray-900">
            {rating} · {reviewCount} review{reviewCount !== 1 ? 's' : ''}
          </h2>
        </div>
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={16} />
          Write a review
        </button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Write your review</h3>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your rating *
              </label>
              <StarRating
                rating={reviewFormData.rating}
                onRatingChange={(rating) => setReviewFormData(prev => ({ ...prev, rating }))}
                interactive={true}
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your name
              </label>
              <input
                type="text"
                value={reviewFormData.userName}
                onChange={(e) => setReviewFormData(prev => ({ ...prev, userName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter your name"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review title (optional)
              </label>
              <input
                type="text"
                value={reviewFormData.title}
                onChange={(e) => setReviewFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Summarize your experience"
                maxLength={100}
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your review *
              </label>
              <textarea
                value={reviewFormData.comment}
                onChange={(e) => setReviewFormData(prev => ({ ...prev, comment: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary h-24 resize-none"
                placeholder="Tell others about your experience at this property"
                maxLength={1000}
                required
              />
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">
                  Minimum 10 characters
                </span>
                <span className="text-xs text-gray-500">
                  {reviewFormData.comment.length}/1000
                </span>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={submittingReview || reviewFormData.rating === 0 || reviewFormData.comment.trim().length < 10}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submittingReview ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Send" size={16} />
                    Submit Review
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReviewForm(false);
                  setReviewFormData({
                    rating: 0,
                    title: '',
                    comment: '',
                    userName: 'Guest User'
                  });
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {displayReviews.map((review) => (
              <div key={review.Id} className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center overflow-hidden">
                    {review.userAvatar ? (
                      <img 
                        src={review.userAvatar} 
                        alt={review.userName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold text-sm">
                        {review.userName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                      {review.verified && (
                        <ApperIcon name="BadgeCheck" size={16} className="text-secondary" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{formatDate(review.date)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <StarRating rating={review.rating} />
                  </div>
                </div>
                {review.title && (
                  <h5 className="font-medium text-gray-900">{review.title}</h5>
                )}
                <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
          
          {reviews.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              {showAll ? 'Show less' : `Show all ${reviewCount} reviews`}
            </button>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <ApperIcon name="MessageSquare" size={48} className="text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-600 mb-4">Be the first to share your experience!</p>
          <button
            onClick={() => setShowReviewForm(true)}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Write the first review
          </button>
        </div>
      )}
    </div>
  );
};
const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviewsKey, setReviewsKey] = useState(0); // Force reviews refresh

const loadProperty = async () => {
    try {
      setLoading(true);
      setError("");
      await new Promise(resolve => setTimeout(resolve, 300));
      const propertyData = await propertyService.getById(parseInt(id));
      
      if (!propertyData) {
        setError("Property not found");
        return;
      }

      setProperty(propertyData);

      // Load similar properties
      const allProperties = await propertyService.getAll();
      const similar = allProperties
        .filter(p => p.Id !== propertyData.Id && p.location.city === propertyData.location.city)
        .slice(0, 4);
      setSimilarProperties(similar);
      
      // Force reviews to refresh when property changes
      setReviewsKey(prev => prev + 1);
    } catch (err) {
      setError("Failed to load property details. Please try again.");
      console.error("Error loading property:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadProperty();
    }
  }, [id]);

  const handleWishlistToggle = async () => {
    try {
      if (isWishlisted) {
        await wishlistService.removeItem(property.Id);
        toast.info("Removed from wishlist");
      } else {
        await wishlistService.addItem(property.Id);
        toast.success("Added to wishlist");
      }
      setIsWishlisted(!isWishlisted);
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  };

  const handleSimilarPropertyWishlist = async (propertyId, isAdded) => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading type="detail" />
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Error message={error} onRetry={loadProperty} />
        </div>
      </div>
    );
  }

  return (
<div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Image Gallery */}
        <div className="mb-8">
          <div className="relative rounded-xl overflow-hidden">
            <div className="aspect-[16/9] bg-gray-200">
              <img 
                src={property.images[currentImageIndex]} 
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Image Navigation */}
            {property.images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex(prev => 
                    prev === 0 ? property.images.length - 1 : prev - 1
                  )}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                >
                  <ApperIcon name="ChevronLeft" size={20} className="text-gray-700" />
                </button>
                <button
                  onClick={() => setCurrentImageIndex(prev => 
                    prev === property.images.length - 1 ? 0 : prev + 1
                  )}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                >
                  <ApperIcon name="ChevronRight" size={20} className="text-gray-700" />
                </button>
                
                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {property.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            
            {/* Show All Photos Button */}
            <button
              onClick={() => setShowAllPhotos(true)}
              className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <ApperIcon name="Grid3X3" size={16} className="text-gray-700" />
              <span className="text-sm font-medium text-gray-700">
                Show all {property.images.length} photos
              </span>
            </button>
          </div>
        </div>

        {/* Photo Gallery Modal */}
        {showAllPhotos && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
            <div className="max-w-6xl w-full mx-4 relative">
              <button
                onClick={() => setShowAllPhotos(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <ApperIcon name="X" size={24} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[80vh] overflow-y-auto">
                {property.images.map((image, index) => (
                  <div key={index} className="aspect-square">
                    <img 
                      src={image} 
                      alt={`${property.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ApperIcon name="ArrowLeft" size={20} />
          <span>Back to search</span>
        </button>

        {/* Property Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-1">
                <ApperIcon name="Star" size={16} className="text-accent fill-current" />
                <span className="font-semibold">{property.rating}</span>
                <span>({property.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <ApperIcon name="MapPin" size={16} />
                <span>{property.location.address}, {property.location.city}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <button
              onClick={handleWishlistToggle}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                isWishlisted 
                  ? "border-primary bg-primary/5 text-primary" 
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <ApperIcon 
                name="Heart" 
                size={16} 
                className={isWishlisted ? "fill-current" : ""} 
              />
              <span>{isWishlisted ? "Saved" : "Save"}</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
              <ApperIcon name="Share" size={16} />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-xl overflow-hidden">
            <div className="md:col-span-2 aspect-[4/3] md:aspect-[2/1] relative">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setShowAllPhotos(true)}
              />
            </div>
            <div className="hidden md:grid grid-cols-1 gap-2">
              {property.images.slice(1, 3).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${property.title} ${index + 2}`}
                  className="w-full aspect-[4/3] object-cover cursor-pointer hover:brightness-75 transition-all"
                  onClick={() => setShowAllPhotos(true)}
                />
              ))}
            </div>
            <div className="hidden md:grid grid-cols-1 gap-2">
              {property.images.slice(3, 5).map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`${property.title} ${index + 4}`}
                    className="w-full aspect-[4/3] object-cover cursor-pointer hover:brightness-75 transition-all"
                    onClick={() => setShowAllPhotos(true)}
                  />
                  {index === 1 && property.images.length > 5 && (
                    <button
                      onClick={() => setShowAllPhotos(true)}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold hover:bg-black/60 transition-colors"
                    >
                      +{property.images.length - 5} more
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => setShowAllPhotos(true)}
            className="mt-4 md:hidden w-full flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ApperIcon name="Grid3X3" size={16} />
            View all {property.images.length} photos
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Host Info */}
            <div className="flex items-center gap-4 pb-8 border-b border-gray-200">
              <img
                src={property.host.avatar}
                alt={property.host.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-900">
                  Hosted by {property.host.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  Joined {property.host.joinDate}
                  {property.host.verified && (
                    <span className="inline-flex items-center gap-1 ml-2">
                      <ApperIcon name="BadgeCheck" size={14} className="text-secondary" />
                      <span className="text-secondary text-xs">Verified</span>
                    </span>
                  )}
                </p>
              </div>
            </div>

{/* Property Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">About this place</h2>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>

              {/* Host Info */}
              <div className="flex items-center gap-4 py-6 border-y border-gray-200">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {property.host.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Hosted by {property.host.name}</h3>
                  <p className="text-gray-600 text-sm">
                    {property.host.yearsHosting} years hosting • {property.host.responseRate} response rate
                  </p>
                </div>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <ApperIcon name="Users" size={20} className="text-gray-600" />
                  <span className="text-gray-700">{property.capacity.guests} guests</span>
                </div>
                <div className="flex items-center gap-3">
                  <ApperIcon name="Bed" size={20} className="text-gray-600" />
                  <span className="text-gray-700">{property.capacity.bedrooms} bedrooms</span>
                </div>
                <div className="flex items-center gap-3">
                  <ApperIcon name="Bath" size={20} className="text-gray-600" />
                  <span className="text-gray-700">{property.capacity.bathrooms} bathrooms</span>
                </div>
              </div>
            </div>

            {/* Amenities - Expandable */}
            <AmenitiesSection amenities={property.amenities} />

            {/* Location Map */}
            <LocationSection location={property.location} />

            {/* House Rules */}
            <HouseRulesSection />

            {/* Reviews Section */}
<ReviewsSection rating={property.rating} reviewCount={property.reviewCount} propertyId={property.Id} />
          </div>

          {/* Booking Panel */}
          <div>
            <BookingPanel property={property} />
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">
              Similar places in {property.location.city}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProperties.map((similarProperty) => (
                <PropertyCard
                  key={similarProperty.Id}
                  property={similarProperty}
                  onWishlistToggle={handleSimilarPropertyWishlist}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Photo Modal */}
      {showAllPhotos && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 text-white">
            <h2 className="text-lg font-semibold">
              {currentImageIndex + 1} / {property.images.length}
            </h2>
            <button
              onClick={() => setShowAllPhotos(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ApperIcon name="X" size={24} />
            </button>
          </div>
          <div className="flex-1 relative">
            <img
              src={property.images[currentImageIndex]}
              alt={`${property.title} ${currentImageIndex + 1}`}
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setCurrentImageIndex(prev => 
                prev === 0 ? property.images.length - 1 : prev - 1
              )}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
            >
              <ApperIcon name="ChevronLeft" size={24} />
            </button>
            <button
              onClick={() => setCurrentImageIndex(prev => 
                prev === property.images.length - 1 ? 0 : prev + 1
              )}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
            >
              <ApperIcon name="ChevronRight" size={24} />
            </button>
          </div>
          <div className="p-4 flex gap-2 overflow-x-auto">
            {property.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                  index === currentImageIndex ? "border-white" : "border-transparent"
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;