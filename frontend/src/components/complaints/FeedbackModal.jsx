import React, { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Textarea from '../common/Textarea';
import useToast from '../../hooks/useToast';
import complaintService from '../../services/complaintService';

export const FeedbackModal = ({ isOpen, onClose, complaint, onFeedbackSubmitted }) => {
  const { success, error } = useToast();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!complaint?._id) return;

    setLoading(true);
    try {
      const res = await complaintService.submitFeedback(complaint._id, {
        rating,
        comment,
      });
      success('Thank you! Your feedback on this resolution has been submitted.');
      if (onFeedbackSubmitted && res?.data) {
        onFeedbackSubmitted(res.data);
      }
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit feedback.';
      error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Rate Resolution Quality"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="text-sm text-slate-300">
          <p className="font-semibold text-slate-100 mb-1">{complaint?.title}</p>
          <p className="text-xs text-slate-400">
            Your complaint was marked resolved by the municipal team. How satisfied are you with the resolution?
          </p>
        </div>

        {/* Star Rating Selector */}
        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950/60 border border-slate-800 gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Rating (1 to 5 Stars)
          </span>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 rounded-lg hover:scale-125 transition-transform text-slate-600 focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    star <= (hoverRating || rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-700'
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-xs font-bold text-amber-400">
            {rating === 5 && '⭐️⭐️⭐️⭐️⭐️ Outstanding & Fast'}
            {rating === 4 && '⭐️⭐️⭐️⭐️ Very Good Resolution'}
            {rating === 3 && '⭐️⭐️⭐️ Satisfactory'}
            {rating === 2 && '⭐️⭐️ Subpar / Incomplete'}
            {rating === 1 && '⭐️ Poor / Not Solved Properly'}
          </span>
        </div>

        {/* Comments */}
        <Textarea
          label="Resolution Feedback Comment (Optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts on the repair quality, timeliness, or officer response..."
          rows={3}
        />

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="accent" loading={loading}>
            Submit Feedback
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default FeedbackModal;
