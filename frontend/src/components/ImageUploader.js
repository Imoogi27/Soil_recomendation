import React, { useState } from "react";

export function ImageUploader({
  onImageUpload,
  uploadedImage,
  isAnalyzing,
  onReset,
}) {
  const [localPreview, setLocalPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);

    // Tell App: here is the File + preview URL
    onImageUpload(file, previewUrl);
  };

  const handleResetClick = () => {
    setLocalPreview(null);
    onReset();
  };

  const preview = uploadedImage || localPreview;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg shadow-green-500/5 border border-green-100/70 flex flex-col gap-4">
      <div>
        <h2 className="text-green-900 text-xl font-semibold mb-1">
          Upload Soil Image
        </h2>
        <p className="text-green-700 text-sm">
          Upload a close-up image of your soil surface for AI analysis.
        </p>
      </div>

      <label className="mt-4 w-full cursor-pointer">
        <div className="upload-box">
          {preview ? (
            <div className="preview-wrapper">
              <img src={preview} alt="Soil preview" />
            </div>
          ) : (
            <span className="text-green-700 text-sm">
              Click or tap to choose an image
            </span>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      <div className="flex justify-between items-center mt-4">
        <button
          type="button"
          onClick={handleResetClick}
          className="reset-btn"
        >
          Reset
        </button>

        {isAnalyzing && (
          <span className="text-sm text-green-700 animate-pulse">
            Analyzing soil…
          </span>
        )}
      </div>
    </div>
  );
}
