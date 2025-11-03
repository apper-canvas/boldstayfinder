import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Error from "@/components/ui/Error";

class ReviewService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'review_c';
  }

  async getByPropertyId(propertyId, options = {}) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "property_id_c"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "user_name_c"}},
          {"field": {"Name": "user_avatar_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "comment_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "verified_c"}},
          {"field": {"Name": "helpful_c"}}
        ],
        where: [
          {
            "FieldName": "property_id_c",
            "Operator": "EqualTo",
            "Values": [propertyId.toString()]
          }
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": options.sortOrder === 'asc' ? 'ASC' : 'DESC'}],
        pagingInfo: {"limit": 50, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return {
          reviews: [],
          totalCount: 0,
          averageRating: 0
        };
      }

      const reviews = response.data.map(review => this._formatReview(review));
      
      return {
        reviews: reviews,
        totalCount: reviews.length,
        averageRating: this._calculateAverageRating(reviews)
      };
    } catch (error) {
      console.error("Error fetching reviews:", error?.response?.data?.message || error);
      return {
        reviews: [],
        totalCount: 0,
        averageRating: 0
      };
    }
  }

  async getReviewsSummary(propertyId) {
    const result = await this.getByPropertyId(propertyId);
    return result;
  }

  async create(reviewData) {
    try {
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

      const params = {
        records: [{
          Name: `Review for Property ${reviewData.propertyId}`,
          property_id_c: parseInt(reviewData.propertyId),
          user_id_c: reviewData.userId || 'guest',
          user_name_c: reviewData.userName || 'Guest User',
          user_avatar_c: reviewData.userAvatar || '',
          rating_c: parseInt(reviewData.rating),
          title_c: reviewData.title || '',
          comment_c: reviewData.comment,
          date_c: new Date().toISOString(),
          verified_c: reviewData.verified || false,
          helpful_c: 0
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create review:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to create review');
        }
        
        if (successful.length > 0) {
          return this._formatReview(successful[0].data);
        }
      }
      
      throw new Error('Failed to create review');
    } catch (error) {
      console.error("Error creating review:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, reviewData) {
    try {
      const updateData = {
        Id: parseInt(id)
      };

      // Only include updateable fields
      if (reviewData.rating !== undefined) {
        if (reviewData.rating < 1 || reviewData.rating > 5) {
          throw new Error('Rating must be between 1 and 5 stars');
        }
        updateData.rating_c = parseInt(reviewData.rating);
      }
      
      if (reviewData.title !== undefined) updateData.title_c = reviewData.title;
      
      if (reviewData.comment !== undefined) {
        if (reviewData.comment.length < 10) {
          throw new Error('Review comment must be at least 10 characters long');
        }
        if (reviewData.comment.length > 1000) {
          throw new Error('Review comment must be less than 1000 characters');
        }
        updateData.comment_c = reviewData.comment;
      }
      
      if (reviewData.verified !== undefined) updateData.verified_c = reviewData.verified;
      if (reviewData.helpful !== undefined) updateData.helpful_c = parseInt(reviewData.helpful);

      const params = {
        records: [updateData]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update review:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to update review');
        }
        
        if (successful.length > 0) {
          return this._formatReview(successful[0].data);
        }
      }
      
      throw new Error('Failed to update review');
    } catch (error) {
      console.error("Error updating review:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete review:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting review:", error?.response?.data?.message || error);
      return false;
    }
  }

  _calculateAverageRating(reviews) {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }

  _formatReview(dbReview) {
    return {
      Id: dbReview.Id,
      propertyId: parseInt(dbReview.property_id_c) || 0,
      userId: dbReview.user_id_c || 'guest',
      userName: dbReview.user_name_c || 'Guest User',
      userAvatar: dbReview.user_avatar_c || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: parseInt(dbReview.rating_c) || 0,
      title: dbReview.title_c || '',
      comment: dbReview.comment_c || '',
      date: dbReview.date_c || new Date().toISOString(),
      verified: dbReview.verified_c || false,
      helpful: parseInt(dbReview.helpful_c) || 0
    };
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