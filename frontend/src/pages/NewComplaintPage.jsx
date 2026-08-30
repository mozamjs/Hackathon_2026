import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle, ArrowLeft, Send, Sparkles, MapPin, Layers, FileText, AlertCircle } from 'lucide-react';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Textarea from '../components/common/Textarea';
import Button from '../components/common/Button';
import DuplicateWarning from '../components/complaints/DuplicateWarning';
import useToast from '../hooks/useToast';
import useDebounce from '../hooks/useDebounce';
import complaintService from '../services/complaintService';
import { CATEGORIES } from '../utils/constants';

export const NewComplaintPage = () => {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('road');
  const [area, setArea] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Duplicate detection state
  const [duplicates, setDuplicates] = useState([]);
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);

  const debouncedArea = useDebounce(area, 400);

  useEffect(() => {
    const checkDuplicates = async () => {
      if (!category || !debouncedArea || debouncedArea.trim().length < 2) {
        setDuplicates([]);
        return;
      }

      setCheckingDuplicates(true);
      try {
        const res = await complaintService.detectDuplicates(category, debouncedArea.trim());
        if (res?.data?.duplicates) {
          setDuplicates(res.data.duplicates);
        }
      } catch (err) {
        console.warn('Duplicate check skipped:', err.message);
      } finally {
        setCheckingDuplicates(false);
      }
    };

    checkDuplicates();
  }, [category, debouncedArea]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Please enter a clear title for the complaint.');
      return;
    }
    if (!category) {
      setErrorMessage('Please select a category.');
      return;
    }
    if (!area.trim()) {
      setErrorMessage('Please enter the area or location name.');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('Please provide a description of the issue.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      const res = await complaintService.createComplaint({
        title: title.trim(),
        category,
        area: area.trim(),
        description: description.trim(),
      });

      success('Your complaint has been submitted successfully to municipal dispatch!');
      if (res?.data?._id) {
        navigate(`/complaints/${res.data._id}`);
      } else {
        navigate('/complaints/mine');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit complaint. Please check your inputs.';
      setErrorMessage(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = CATEGORIES.filter((c) => c.id !== 'all').map((c) => ({
    value: c.id,
    label: c.label,
  }));

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
            <PlusCircle className="w-4 h-4" />
            <span>Public Civic Grievance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-sans">
            Report a Municipal Issue
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Provide details about the issue. Our system will check for existing community reports in real time.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <Input
            label="Complaint Title"
            type="text"
            icon={FileText}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Deep pothole causing tire damage near University Gate"
            helperText="Summarize the core problem in one concise sentence"
            required
          />

          {/* Category & Area Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Municipal Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={categoryOptions}
              required
            />

            <Input
              label="Area / Neighborhood / Street"
              type="text"
              icon={MapPin}
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g., University Road"
              helperText={
                checkingDuplicates
                  ? 'Checking area for existing reports...'
                  : 'Specify neighborhood or street name'
              }
              required
            />
          </div>

          {/* Real-Time Duplicate Warning Alert */}
          {duplicates.length > 0 && (
            <DuplicateWarning
              duplicates={duplicates}
              onUpvoted={(updated) => {
                setDuplicates((prev) =>
                  prev.map((d) => (d._id === updated._id ? updated : d))
                );
              }}
            />
          )}

          {/* Description */}
          <Textarea
            label="Detailed Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the exact location landmarks, severity, hazard level, and how long the issue has persisted..."
            rows={5}
            helperText="Clear details help municipal dispatchers send the right equipment"
            required
          />

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              size="lg"
              loading={loading}
              icon={Send}
            >
              Submit Complaint
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewComplaintPage;
