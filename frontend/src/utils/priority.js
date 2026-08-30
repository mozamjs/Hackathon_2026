/**
 * Dynamic priority calculation for complaints.
 * Formula: score = (upvotes * 2) + daysSinceCreated
 *
 * Rules:
 *   score < 5   -> low
 *   5 - 15      -> medium
 *   16 - 30     -> high
 *   > 30        -> critical
 */
export const calculatePriority = (complaint) => {
  const now = new Date();
  const createdAt = complaint && complaint.createdAt ? new Date(complaint.createdAt) : now;
  const diffTime = Math.max(0, now.getTime() - createdAt.getTime());
  const daysSinceCreated = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const upvotes = (complaint && typeof complaint.upvotes === 'number') ? complaint.upvotes : 0;
  const score = (upvotes * 2) + daysSinceCreated;

  let priority = 'low';
  if (score > 30) {
    priority = 'critical';
  } else if (score >= 16) {
    priority = 'high';
  } else if (score >= 5) {
    priority = 'medium';
  } else {
    priority = 'low';
  }

  return {
    priority: complaint?.priority || priority,
    priorityScore: complaint?.priorityScore !== undefined ? complaint.priorityScore : score,
    daysSinceCreated,
    upvotes,
  };
};

export const getPriorityTheme = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'critical':
      return {
        bg: 'bg-rose-500/15',
        border: 'border-rose-500/30',
        text: 'text-rose-400',
        badge: 'bg-rose-500 text-white',
        dot: 'bg-rose-500',
        glow: 'shadow-rose-500/20',
        label: 'Critical',
      };
    case 'high':
      return {
        bg: 'bg-orange-500/15',
        border: 'border-orange-500/30',
        text: 'text-orange-400',
        badge: 'bg-orange-500 text-white',
        dot: 'bg-orange-500',
        glow: 'shadow-orange-500/20',
        label: 'High',
      };
    case 'medium':
      return {
        bg: 'bg-amber-500/15',
        border: 'border-amber-500/30',
        text: 'text-amber-400',
        badge: 'bg-amber-500 text-white',
        dot: 'bg-amber-500',
        glow: 'shadow-amber-500/20',
        label: 'Medium',
      };
    case 'low':
    default:
      return {
        bg: 'bg-emerald-500/15',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400',
        badge: 'bg-emerald-500 text-white',
        dot: 'bg-emerald-500',
        glow: 'shadow-emerald-500/20',
        label: 'Low',
      };
  }
};
