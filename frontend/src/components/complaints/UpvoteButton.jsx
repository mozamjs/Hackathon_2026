import React, { useState } from 'react';
import { ThumbsUp, Check } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import complaintService from '../../services/complaintService';
import { useNavigate } from 'react-router-dom';

export const UpvoteButton = ({
  complaint,
  onUpvoted,
  size = 'md',
  className = '',
}) => {
  const { user, isAuthenticated, isCitizen } = useAuth();
  const { success, error, info } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [upvotes, setUpvotes] = useState(complaint?.upvotes || 0);

  // Check if current user has already upvoted
  const userIdStr = user?._id || user?.id;
  const hasUpvoted = Boolean(
    complaint?.upvotedBy &&
      userIdStr &&
      complaint.upvotedBy.some(
        (id) => (typeof id === 'string' ? id : id?._id || id?.id || id?.toString()) === userIdStr?.toString()
      )
  );

  const [isUpvotedState, setIsUpvotedState] = useState(hasUpvoted);

  const handleUpvote = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      info('Please sign in as a citizen to upvote community issues.');
      navigate('/login');
      return;
    }

    if (!isCitizen) {
      info('Only citizens can upvote community complaints.');
      return;
    }

    if (isUpvotedState) {
      info('You have already upvoted this issue.');
      return;
    }

    setLoading(true);
    try {
      const res = await complaintService.upvoteComplaint(complaint._id);
      setIsUpvotedState(true);
      setUpvotes((prev) => prev + 1);
      success('Complaint upvoted! Priority recalculated.');
      if (onUpvoted && res?.data) {
        onUpvoted(res.data);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to upvote complaint.';
      error(msg);
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3.5 py-1.5 text-sm gap-2',
    lg: 'px-4 py-2 text-base gap-2.5',
  };

  return (
    <button
      type="button"
      onClick={handleUpvote}
      disabled={loading || isUpvotedState}
      title={
        isUpvotedState
          ? 'You upvoted this issue'
          : 'Upvote to raise issue urgency & municipal priority'
      }
      className={`inline-flex items-center rounded-xl border font-semibold transition-all duration-200 ${
        isUpvotedState
          ? 'cursor-default border-primary-200 bg-primary-50 text-primary-700'
          : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 active:scale-95'
      } ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      {isUpvotedState ? (
        <Check className="h-4 w-4 flex-shrink-0 text-primary-700" />
      ) : (
        <ThumbsUp
          className={`h-4 w-4 flex-shrink-0 transition-transform ${
            loading ? 'animate-bounce' : 'group-hover:-translate-y-0.5'
          }`}
        />
      )}
      <span>{upvotes}</span>
      <span className="text-xs opacity-75 font-normal hidden sm:inline">
        {upvotes === 1 ? 'upvote' : 'upvotes'}
      </span>
    </button>
  );
};

export default UpvoteButton;
