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
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
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

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setImageFile(null);
      setImagePreview('');
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Only JPG, JPEG, PNG, and WEBP images are allowed.');
      setImageFile(null);
      setImagePreview('');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image must be 5MB or smaller.');
      setImageFile(null);
      setImagePreview('');
      return;
    }

    setErrorMessage('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

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
        image: imageFile || undefined,
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

      <div className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-10">
        <div>
          <div className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
            <PlusCircle className="h-4 w-4" />
            <span>Public Civic Grievance</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            Report a Municipal Issue
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Provide details about the issue. Our system will check for existing community reports in real time.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
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

          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">
              Optional complaint image
            </label>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageChange}
              className="block w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-primary-600 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-primary-500"
            />
            <p className="text-xs text-slate-500">JPG, JPEG, PNG, WEBP only • Max 5MB</p>

            {imagePreview && (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2">
                <img
                  src={imagePreview}
                  alt="Complaint preview"
                  className="h-52 w-full rounded-xl object-cover"
                />
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
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
