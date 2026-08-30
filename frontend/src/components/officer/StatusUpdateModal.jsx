import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Select from '../common/Select';
import Textarea from '../common/Textarea';
import useToast from '../../hooks/useToast';
import complaintService from '../../services/complaintService';

export const StatusUpdateModal = ({
  isOpen,
  onClose,
  complaint,
  onUpdated,
}) => {
  const { success, error } = useToast();
  const [status, setStatus] = useState('pending');
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (complaint) {
      setStatus(complaint.status || 'pending');
      setRemark(complaint.officerRemark || '');
    }
  }, [complaint]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!complaint?._id) return;

    setLoading(true);
    try {
      const res = await complaintService.updateComplaintStatus(complaint._id, {
        status,
        remark,
      });
      success(`Complaint status updated to "${status}".`);
      if (onUpdated && res?.data) {
        onUpdated(res.data);
      }
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update complaint status.';
      error(msg);
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending Review' },
    { value: 'in-progress', label: 'In Progress (Field Team Dispatched)' },
    { value: 'resolved', label: 'Resolved (Issue Solved)' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Status & Officer Remark"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Target Complaint
          </span>
          <p className="mt-0.5 line-clamp-1 text-sm font-semibold text-slate-900">
            {complaint?.title}
          </p>
          <p className="mt-0.5 text-xs text-slate-600">
            Area: <span className="text-slate-800">{complaint?.area}</span> | Category:{' '}
            <span className="capitalize text-slate-800">{complaint?.category}</span>
          </p>
        </div>

        <Select
          label="New Operational Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={statusOptions}
        />

        <Textarea
          label="Official Officer Remark / Dispatch Note"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder="e.g., Road repair team unit #4 dispatched with asphalt leveling equipment."
          rows={3}
          helperText="This note will be visible to the citizen author and community on the timeline."
        />

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-3">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Save Status & Remarks
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default StatusUpdateModal;
