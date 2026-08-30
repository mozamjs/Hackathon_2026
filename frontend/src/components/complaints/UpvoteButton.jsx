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
      className={`inline-flex items-center font-semibold rounded-xl transition-all duration-200 border ${
        isUpvotedState
          ? 'bg-brand-600/20 text-brand-400 border-brand-500/40 cursor-default'
          : 'bg-slate-800/90 hover:bg-brand-600 text-slate-200 hover:text-white border-slate-700 hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-500/20 active:scale-95'
      } ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      {isUpvotedState ? (
        <Check className="w-4 h-4 text-brand-400 flex-shrink-0" />
      ) : (
        <ThumbsUp
          className={`w-4 h-4 flex-shrink-0 transition-transform ${
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
