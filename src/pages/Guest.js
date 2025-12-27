import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const Guest = () => {
  const [formData, setFormData] = useState({
    guestType: '',
    attendantName: '',
    patientName: '',
    phoneNumber: '',
    purpose: ''
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  // Cleanup camera stream on unmount or when navigating
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Stop camera when form is submitted
  useEffect(() => {
    if (submitted && streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCameraOpen(false);
    }
  }, [submitted]);

  // Handle video stream when camera opens
  useEffect(() => {
    if (isCameraOpen && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(err => {
        console.error('Error playing video:', err);
      });
    }
  }, [isCameraOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      // Clear patient name if guest type is not "attendant"
      if (name === 'guestType' && value !== 'attendant') {
        newData.patientName = '';
      }
      // Clear purpose if guest type is "attendant"
      if (name === 'guestType' && value === 'attendant') {
        newData.purpose = '';
      }
      return newData;
    });
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          photo: 'Photo size must be less than 5MB'
        }));
        return;
      }
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          photo: 'Please upload an image file'
        }));
        return;
      }
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      if (errors.photo) {
        setErrors(prev => ({
          ...prev,
          photo: ''
        }));
      }
    }
  };

  const startCamera = async () => {
    try {
      setCameraError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      streamRef.current = stream;
      setIsCameraOpen(true);
    } catch (err) {
      setCameraError('Unable to access camera. Please check permissions.');
      console.error('Error accessing camera:', err);
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
    setCameraError('');
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'captured-photo.jpg', { type: 'image/jpeg' });
          setPhoto(file);
          setPhotoPreview(canvas.toDataURL('image/jpeg'));
          stopCamera();
          if (errors.photo) {
            setErrors(prev => ({
              ...prev,
              photo: ''
            }));
          }
        }
      }, 'image/jpeg', 0.9);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.guestType) {
      newErrors.guestType = 'Please select a guest type';
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Mobile number is required';
    } else if (!/^[0-9]{10,15}$/.test(formData.phoneNumber.replace(/[\s-()]/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid mobile number';
    }

    if (formData.guestType === 'attendant') {
      if (!formData.attendantName.trim()) {
        newErrors.attendantName = 'Attendant name is required';
      }
      if (!formData.patientName.trim()) {
        newErrors.patientName = 'Patient name is required';
      }
    } else if (formData.guestType === 'other') {
      if (!formData.attendantName.trim()) {
        newErrors.attendantName = 'Name is required';
      }
      if (!formData.purpose.trim()) {
        newErrors.purpose = 'Description is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      setApiError('');

      // Prepare data for backend
      const guestTypeUpper = formData.guestType.toUpperCase(); // ATTENDANT or OTHER

      let guestData = {
        guestType: guestTypeUpper,
        mobile: formData.phoneNumber,
        photo: photoPreview,
        submittedAt: new Date().toISOString()
      };

      if (guestTypeUpper === 'ATTENDANT') {
        guestData.attendantName = formData.attendantName;
        guestData.patientToMeet = formData.patientName;
      } else if (guestTypeUpper === 'OTHER') {
        guestData.name = formData.attendantName; // Reusing attendantName field for generic Name
        guestData.description = formData.purpose;
      }

      console.log('Sending Guest Data:', guestData);

      try {
        await api.createGuest(guestData);

        // Backup to local storage
        const existingGuests = JSON.parse(localStorage.getItem('guestEntries') || '[]');
        existingGuests.push(guestData);
        localStorage.setItem('guestEntries', JSON.stringify(existingGuests));

        setSubmitted(true);
        setTimeout(() => {
          navigate('/selection');
        }, 2000);
      } catch (err) {
        setApiError(err.message || 'Failed to submit guest information');
        console.error('Submission Error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (submitted) {
    return (
      <div className="page-container">
        <div className="success-message">
          Guest information submitted successfully!
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Guest Information</h1>
      <p className="page-subtitle">Please provide your details</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="guestType">Guest Type</label>
          <select
            id="guestType"
            name="guestType"
            className="form-select"
            value={formData.guestType}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Select guest type</option>
            <option value="attendant">Attendant</option>
            <option value="other">Other</option>
          </select>
          {errors.guestType && <div className="error-message">{errors.guestType}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="attendantName">
            {formData.guestType === 'attendant' ? 'Attendant Name' : 'Name'}
          </label>
          <input
            type="text"
            id="attendantName"
            name="attendantName"
            className="form-input"
            value={formData.attendantName}
            onChange={handleChange}
            placeholder={formData.guestType === 'attendant' ? 'Enter attendant name' : 'Enter your name'}
            disabled={loading}
          />
          {errors.attendantName && <div className="error-message">{errors.attendantName}</div>}
        </div>

        {formData.guestType === 'attendant' && (
          <div className="form-group">
            <label className="form-label" htmlFor="patientName">Patient Name</label>
            <input
              type="text"
              id="patientName"
              name="patientName"
              className="form-input"
              value={formData.patientName}
              onChange={handleChange}
              placeholder="Enter patient name"
              disabled={loading}
            />
            {errors.patientName && <div className="error-message">{errors.patientName}</div>}
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="phoneNumber">Mobile Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            className="form-input"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Enter mobile number"
            disabled={loading}
          />
          {errors.phoneNumber && <div className="error-message">{errors.phoneNumber}</div>}
        </div>

        {formData.guestType === 'other' && (
          <div className="form-group">
            <label className="form-label" htmlFor="purpose">Description</label>
            <input
              type="text"
              id="purpose"
              name="purpose"
              className="form-input"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="Enter description"
              disabled={loading}
            />
            {errors.purpose && <div className="error-message">{errors.purpose}</div>}
          </div>
        )}

        <div className="form-group photo-upload-container">
          <label className="form-label">Upload Photo</label>
          {photoPreview && !isCameraOpen && (
            <img src={photoPreview} alt="Preview" className="photo-preview" />
          )}

          {isCameraOpen && (
            <div className="camera-preview-container">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-preview"
                style={{
                  display: 'block',
                  width: '100%',
                  maxWidth: '400px',
                  height: '300px',
                  backgroundColor: '#000'
                }}
              />
              <div className="camera-controls">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={capturePhoto}
                >
                  Capture Photo
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={stopCamera}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {!isCameraOpen && (
            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  accept="image/*"
                  className="file-input"
                  onChange={handlePhotoChange}
                  disabled={loading}
                />
                <label htmlFor="photo" className="file-input-label">
                  {photo ? 'Change Photo (File)' : 'Choose Photo from File'}
                </label>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={startCamera}
                disabled={loading}
              >
                Capture from Camera
              </button>
            </div>
          )}

          {cameraError && <div className="error-message">{cameraError}</div>}
          {errors.photo && <div className="error-message">{errors.photo}</div>}
          {apiError && <div className="error-message">{apiError}</div>}
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate('/selection')}
          disabled={loading}
        >
          Back
        </button>
      </form>
    </div>
  );
};

export default Guest;
