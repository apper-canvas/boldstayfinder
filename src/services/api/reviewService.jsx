import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Error from "@/components/ui/Error";

// Mock review data - in production this would come from a database
const mockReviews = [
  {
    Id: 1,
    propertyId: 1,
    userId: 'u1',
    userName: "Sarah M.",
    userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    title: "Amazing property with stunning views!",
    comment: "Amazing property with stunning views! The host was incredibly responsive and the location was perfect for exploring the city. Would definitely stay again.",
    date: "2024-12-15T10:30:00Z",
    verified: true,
    helpful: 8
  },
  {
    Id: 2,
    propertyId: 1,
    userId: 'u2',
    userName: "James L.",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    title: "Clean and comfortable",
    comment: "Clean, comfortable, and exactly as described. Great amenities and the neighborhood felt very safe. Easy check-in process too.",
    date: "2024-11-28T14:15:00Z",
    verified: true,
    helpful: 12
  },
  {
    Id: 3,
    propertyId: 1,
    userId: 'u3',
    userName: "Maria K.",
    userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    rating: 4,
    title: "Lovely place with great attention to detail",
    comment: "Lovely place with great attention to detail. Minor issue with WiFi but host resolved it quickly. Overall excellent experience!",
    date: "2024-10-22T16:45:00Z",
    verified: true,
    helpful: 6
  },
  {
    Id: 4,
    propertyId: 1,
    userId: 'u4',
    userName: "David R.",
    userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    title: "Exceeded expectations!",
    comment: "Exceeded expectations! Beautiful space, perfect location, and the host provided excellent local recommendations. Highly recommend.",
    date: "2024-10-18T09:20:00Z",
    verified: true,
    helpful: 15
  },
  {
    Id: 5,
    propertyId: 1,
    userId: 'u5',
    userName: "Emma T.",
    userAvatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop&crop=face",
    rating: 4,
    title: "Great value for money",
    comment: "Great value for money. The apartment was spotless and had everything we needed. Would stay here again on our next visit.",
    date: "2024-09-30T11:10:00Z",
    verified: true,
    helpful: 9
  },
  {
    Id: 6,
    propertyId: 1,
    userId: 'u6',
    userName: "Alex P.",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    title: "Perfect for our weekend getaway",
    comment: "Perfect for our weekend getaway. The photos don't do it justice - it's even better in person! Great communication from the host.",
    date: "2024-09-15T13:30:00Z",
    verified: true,
    helpful: 11
  }
];

class ReviewService {
  constructor() {
    // Load existing reviews or initialize with mock data
    const savedReviews = localStorage.getItem('reviews');
    this.reviews = savedReviews ? JSON.parse(savedReviews) : [...mockReviews];
  }

  // Save reviews to localStorage (simulating database persistence)
  _saveReviews() {
    localStorage.setItem('reviews', JSON.stringify(this.reviews));
  }

  // Get all reviews for a specific property
// Get all reviews for a specific property
  async getByPropertyId(propertyId, options = {}) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    let propertyReviews = this.reviews
      .filter(review => review.propertyId === propertyId)
      .map(review => ({ ...review })); // Return copies

    // Sort by date (newest first) by default
    const sortBy = options.sortBy || 'date';
    const sortOrder = options.sortOrder || 'desc';
    
    propertyReviews.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      } else if (sortBy === 'rating') {
        return sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating;
      } else if (sortBy === 'helpful') {
        return sortOrder === 'desc' ? b.helpful - a.helpful : a.helpful - b.helpful;
      }
      return 0;
    });

    return {
      reviews: propertyReviews,
      totalCount: propertyReviews.length,
      averageRating: this._calculateAverageRating(propertyReviews)
    };
  }

// Get reviews summary for a property (used in ReviewsSection)
  async getReviewsSummary(propertyId) {
    const result = await this.getByPropertyId(propertyId);
    return result;
  }

  // Create a new review
  async create(reviewData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Validate required fields
    if (!reviewData.propertyId || !reviewData.rating || !reviewData.comment) {
      throw new Error('Property ID, rating, and comment are required');
    }

    if (reviewData.rating < 1 || reviewData.rating > 5) {
      throw new Error('Rating must be between 1 and 5 stars');
    }

    if (reviewData.comment.length < 10) {
      throw new Error('Review comment must be at least 10 characters long');
    }

    if (reviewData.comment.length > 1000) {
      throw new Error('Review comment must be less than 1000 characters');
    }

    const newId = Math.max(...this.reviews.map(r => r.Id), 0) + 1;
    const newReview = {
      Id: newId,
      propertyId: reviewData.propertyId,
      userId: reviewData.userId || 'anonymous',
      userName: reviewData.userName || 'Anonymous User',
      userAvatar: reviewData.userAvatar || '',
      rating: reviewData.rating,
      title: reviewData.title || '',
      comment: reviewData.comment,
      date: new Date().toISOString(),
      verified: reviewData.verified || false,
      helpful: 0
    };

    this.reviews.push(newReview);
    this._saveReviews();
    return { ...newReview };
  }

  // Update an existing review
  async update(id, reviewData) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const reviewIndex = this.reviews.findIndex(r => r.Id === id);
    if (reviewIndex === -1) {
      throw new Error('Review not found');
    }

    // Validate fields if they're being updated
    if (reviewData.rating !== undefined && (reviewData.rating < 1 || reviewData.rating > 5)) {
      throw new Error('Rating must be between 1 and 5 stars');
    }

    if (reviewData.comment !== undefined) {
      if (reviewData.comment.length < 10) {
        throw new Error('Review comment must be at least 10 characters long');
      }
      if (reviewData.comment.length > 1000) {
        throw new Error('Review comment must be less than 1000 characters');
      }
    }

    const updatedReview = {
      ...this.reviews[reviewIndex],
      ...reviewData,
      Id: id // Ensure ID cannot be changed
    };

    this.reviews[reviewIndex] = updatedReview;
    this._saveReviews();
    return { ...updatedReview };
  }

  // Delete a review
  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const reviewIndex = this.reviews.findIndex(r => r.Id === id);
    if (reviewIndex === -1) {
      throw new Error('Review not found');
    }

    this.reviews.splice(reviewIndex, 1);
    this._saveReviews();
    return true;
  }

  // Calculate average rating for a set of reviews
  _calculateAverageRating(reviews) {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10; // Round to 1 decimal place
  }
}

export const reviewService = new ReviewService();

// Review Form Component

function ReviewForm({ propertyId, onSubmit, onCancel, loading }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (rating === 0) {
      newErrors.rating = 'Please select a rating';
    }
    
    if (comment.trim().length < 10) {
      newErrors.comment = 'Review must be at least 10 characters long';
    }
    
    if (comment.trim().length > 1000) {
      newErrors.comment = 'Review must be less than 1000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const reviewData = {
      propertyId: propertyId,
      rating: rating,
      title: title.trim(),
      comment: comment.trim(),
userId: 'current-user', // In real app, get from auth
      userName: '', // Empty by default - user must enter name
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    };

    await onSubmit(reviewData);
  };

  const handleRatingClick = (value) => {
    setRating(value);
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: '' }));
    }
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
    if (errors.comment) {
      setErrors(prev => ({ ...prev, comment: '' }));
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-card p-6 mt-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Your Review</h3>
      
      <form onSubmit={handleSubmit}>
        {/* Rating */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating *
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="p-1 transition-colors"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => handleRatingClick(star)}
              >
                <ApperIcon
                  name="Star"
                  size={24}
                  className={`${
                    star <= (hoveredRating || rating)
                      ? 'text-accent fill-current'
                      : 'text-gray-300'
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
          {errors.rating && (
            <p className="text-error text-sm mt-1">{errors.rating}</p>
          )}
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review Title (optional)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your review a title"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
            maxLength="100"
          />
        </div>

        {/* Comment */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review Comment *
          </label>
          <textarea
            value={comment}
            onChange={handleCommentChange}
            placeholder="Share your experience with this property..."
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors resize-none"
            maxLength="1000"
          />
          <div className="flex justify-between items-center mt-1">
            <div>
              {errors.comment && (
                <p className="text-error text-sm">{errors.comment}</p>
              )}
            </div>
            <span className="text-sm text-gray-500">
              {comment.length}/1000
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <ApperIcon name="Loader2" size={16} className="animate-spin" />
                Submitting...
              </div>
            ) : (
              'Submit Review'
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

// Enhanced Reviews Section Component
function ReviewsSection({ rating, reviewCount, propertyId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddReview, setShowAddReview] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const reviewData = await reviewService.getReviewsSummary(propertyId);
      setReviews(reviewData.reviews);
    } catch (err) {
      setError('Failed to load reviews');
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      setSubmittingReview(true);
      await reviewService.create(reviewData);
      toast.success('Review submitted successfully!');
      setShowAddReview(false);
      await loadReviews(); // Refresh reviews
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  React.useEffect(() => {
    if (propertyId) {
      loadReviews();
    }
  }, [propertyId]);

  if (loading) {
    return (
      <div className="mt-12">
        <div className="flex items-center justify-center py-12">
          <ApperIcon name="Loader2" size={32} className="animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12">
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <p className="text-error">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Reviews ({reviewCount || reviews.length})
          </h2>
          {rating && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <ApperIcon
                    key={star}
                    name="Star"
                    size={16}
                    className={`${
                      star <= Math.round(rating) 
                        ? 'text-accent fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">{rating} average</span>
            </div>
          )}
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowAddReview(!showAddReview)}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={16} />
          Add Review
        </Button>
      </div>

      {showAddReview && (
        <ReviewForm
          propertyId={propertyId}
          onSubmit={handleSubmitReview}
          onCancel={() => setShowAddReview(false)}
          loading={submittingReview}
        />
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-card">
          <ApperIcon name="MessageCircle" size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No reviews yet. Be the first to review this property!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.Id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="flex items-start gap-4">
                <img
                  src={review.userAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'}
                  alt={review.userName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <ApperIcon
                              key={star}
                              name="Star"
                              size={14}
                              className={`${
                                star <= review.rating 
                                  ? 'text-accent fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {new Date(review.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        {review.verified && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-success/10 text-success text-xs rounded-full">
                            <ApperIcon name="CheckCircle" size={12} />
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {review.title && (
                    <h5 className="font-medium text-gray-900 mt-3">{review.title}</h5>
                  )}
                  
                  <p className="text-gray-700 mt-2 leading-relaxed">{review.comment}</p>
                  
                  <div className="flex items-center gap-4 mt-4">
                    <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      <ApperIcon name="ThumbsUp" size={14} />
                      <span>Helpful ({review.helpful})</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { ReviewForm, ReviewsSection };