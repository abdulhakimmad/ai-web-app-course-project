"use client";

import { useState, useEffect, ChangeEvent } from "react";

interface DetectedObject {
  class: string;
  confidence: number;
}

export function DetectionPanel() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [detections, setDetections] = useState<DetectedObject[]>([]);
  const [hasAnalyzed, setHasAnalyzed] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // จัดการการเลือกไฟล์
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setDetections([]);
      setHasAnalyzed(false);
      setError("");
    }
  };

  // สร้าง Object URL สำหรับ Preview รูปภาพ
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  // ฟังก์ชันยิง API ไปยัง Flask
  const detectObjects = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setDetections(data.detected_objects || []);
        setHasAnalyzed(true);
      } else {
        setError(data.error || "เกิดข้อผิดพลาดในการตรวจจับ");
      }
    } catch (err) {
      setError("ไม่สามารถเชื่อมต่อกับ Flask API ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="ux-card ux-detection">
      <div className="ux-section-heading">
        <p className="ux-eyebrow">AI IMAGE ANALYSIS</p>
        <h2>Object Detection</h2>
        <p className="ux-muted">
          Upload an image to identify objects using the YOLO model.
        </p>
      </div>

      {/* Upload & Controls */}
      <div className="ux-upload">
        <label className="ux-file-button">
          <input
            className="ux-file-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
          />
          <span>Choose Image</span>
        </label>
        <span className="ux-file-name">
          {selectedFile ? selectedFile.name : "No image selected"}
        </span>
      </div>

      {/* Image Preview */}
      {previewUrl && (
        <div className="ux-preview" style={{ marginTop: "15px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Selected image preview"
            style={{ maxWidth: "100%", borderRadius: "8px" }}
          />
        </div>
      )}

      {/* Button & Error Message */}
      <div style={{ marginTop: "15px" }}>
        <button
          type="button"
          className="ux-button"
          onClick={detectObjects}
          disabled={!selectedFile || loading}
        >
          {loading ? "Detecting..." : "Detect Objects"}
        </button>

        {error && (
          <div className="ux-error-message" style={{ color: "red", marginTop: "10px" }}>
            {error}
          </div>
        )}
      </div>

      {/* Detection Results (ส่วนที่คุณส่งมา) */}
      {hasAnalyzed && (
        <div style={{ marginTop: "20px" }}>
          <h3>Detection Result</h3>
          {detections.length > 0 ? (
            <div className="ux-results">
              {detections.map((item, index) => (
                <article className="ux-result-item" key={index}>
                  <strong>{item.class}</strong>
                  <p>Confidence: {item.confidence}%</p>
                  <div className="ux-confidence-track">
                    <div
                      className="ux-confidence-fill"
                      style={{
                        width: `${Math.max(
                          0,
                          Math.min(100, item.confidence)
                        )}%`,
                      }}
                    />
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p>ไม่พบวัตถุในรูปภาพ</p>
          )}
        </div>
      )}
    </section>
  );
}