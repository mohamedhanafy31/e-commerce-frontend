"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface ReviewFormProps {
  productId: number;
  onSubmit: (reviewData: {
    rating: number;
    review_text: string;
    reviewer_name: string;
  }) => void;
}

export function ReviewForm({ productId, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    
    if (!reviewerName.trim()) {
      alert("Please enter your name");
      return;
    }

    setSubmitting(true);
    
    try {
      await onSubmit({
        rating,
        review_text: reviewText.trim(),
        reviewer_name: reviewerName.trim()
      });
      
      // Reset form
      setRating(0);
      setReviewText("");
      setReviewerName("");
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => setRating(i)}
          onMouseEnter={() => setHoverRating(i)}
          onMouseLeave={() => setHoverRating(0)}
          className="focus:outline-none"
        >
          <Star
            className={`h-6 w-6 transition-colors ${
              i <= (hoverRating || rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 hover:text-yellow-400"
            }`}
          />
        </button>
      );
    }
    return stars;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Rating *
            </label>
            <div className="flex items-center space-x-1">
              {renderStars()}
              {rating > 0 && (
                <span className="ml-2 text-sm text-muted-foreground">
                  {rating} out of 5 stars
                </span>
              )}
            </div>
          </div>

          {/* Reviewer Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Your Name *
            </label>
            <Input
              type="text"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Review (Optional)
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your thoughts about this product..."
              rows={4}
              className="w-full px-3 py-2 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <div className="text-sm text-muted-foreground mt-1">
              {reviewText.length}/500 characters
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={submitting || rating === 0 || !reviewerName.trim()}
            className="w-full"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>

        <div className="mt-4 text-xs text-muted-foreground">
          <p>
            By submitting a review, you agree to our terms and conditions.
            Reviews are moderated and may take some time to appear.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
