import React, { useRef, useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5001/api/qr/generate";

const FaceScanQR = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [status, setStatus] = useState("Idle");
  const [loading, setLoading] = useState(false);
  const [qrImage, setQrImage] = useState(null);
  const [user, setUser] = useState(null);

  // 🎥 Start camera on load
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }
      });
      videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Camera access denied");
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) stream.getTracks().forEach(t => t.stop());
  };

  // 📸 Capture + API Call
  const scanFace = async () => {
    setLoading(true);
    setStatus("Scanning face...");
    setQrImage(null);
    setUser(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("face_image", blob, "face.jpg");

      try {
        const res = await axios.post(API_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        if (res.data.success) {
          setQrImage(res.data.data.qr_image);
          setUser(res.data.data.user);
          setStatus("✅ QR Generated");
        } else {
          setStatus(res.data.message || "❌ Failed");
        }
      } catch (err) {
        setStatus(err.response?.data?.message || "❌ Face not recognized");
      }

      setLoading(false);
    }, "image/jpeg");
  };

  return (
    <div className="face-scan-page">
      <div className="scan-card">
        <h2>Face Scan</h2>
        <p className="subtitle">Position your face within the frame to generate your Meal QR</p>

        <div className="video-container">
          <video ref={videoRef} autoPlay className="video-feed" playsInline muted />
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <div className={`scan-overlay ${loading ? "active" : ""}`}></div>
        </div>

        {status !== "Idle" && (
          <div className={`status-badge ${status.includes("✅") ? "success" : status.includes("❌") ? "error" : "scanning"}`}>
            {status}
          </div>
        )}

        {!qrImage && (
          <button onClick={scanFace} disabled={loading} className="scan-btn">
            {loading ? "Scanning..." : "Scan My Face"}
          </button>
        )}

        {qrImage && user && (
          <div className="qr-result-card">
            <h3>Scan Successful!</h3>
            <img src={qrImage} alt="Staff QR Code" className="qr-image" />

            <div className="user-info">
              <div className="info-row">
                <span className="info-label">Name</span>
                <span className="info-value">{user.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Mobile</span>
                <span className="info-value">{user.mobile}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Role</span>
                <span className="info-value">{user.role}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setQrImage(null);
                setUser(null);
                setStatus("Idle");
              }}
              className="btn btn-secondary"
              style={{ marginTop: '15px' }}
            >
              Scan Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceScanQR;
