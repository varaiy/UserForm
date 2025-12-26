import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Staff = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    department: ''
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9]{10,15}$/.test(formData.phoneNumber.replace(/[\s-()]/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    if (!photo) {
      newErrors.photo = 'Please upload your photo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Store staff data (in a real app, this would be sent to a backend)
      const staffData = {
        ...formData,
        photo: photoPreview,
        id: Date.now(),
        submittedAt: new Date().toISOString()
      };
      
      // Get existing staff entries or create new array
      const existingStaff = JSON.parse(localStorage.getItem('staffEntries') || '[]');
      existingStaff.push(staffData);
      localStorage.setItem('staffEntries', JSON.stringify(existingStaff));
      
      setSubmitted(true);
      setTimeout(() => {
        navigate('/selection');
      }, 2000);
    }
  };

  if (submitted) {
    return (
      <div className="page-container">
        <div className="success-message">
          Staff information submitted successfully!
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Staff Information</h1>
      <p className="page-subtitle">Please provide your staff details</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-input"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            className="form-input"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
          {errors.phoneNumber && <div className="error-message">{errors.phoneNumber}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="department">Department</label>
          <input
            type="text"
            id="department"
            name="department"
            className="form-input"
            value={formData.department}
            onChange={handleChange}
            placeholder="Enter your department"
          />
          {errors.department && <div className="error-message">{errors.department}</div>}
        </div>

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
                />
                <label htmlFor="photo" className="file-input-label">
                  {photo ? 'Change Photo (File)' : 'Choose Photo from File'}
                </label>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={startCamera}
              >
                Capture from Camera
              </button>
            </div>
          )}
          
          {cameraError && <div className="error-message">{cameraError}</div>}
          {errors.photo && <div className="error-message">{errors.photo}</div>}
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate('/selection')}
        >
          Back
        </button>
      </form>
    </div>
  );
};

export default Staff;

