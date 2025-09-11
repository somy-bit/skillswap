// ImageUploader.tsx
"use client";

import React, { useRef, useState } from "react";
import { FilePlus } from "lucide-react";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/getCroppedImg"; // helper function to crop image
import { DARK_BG, LIGHT_BG } from "@/lib/utils";

interface ImageUploaderProps {
  onImageSelected?: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const cropped = await getCroppedImg(imageSrc, croppedAreaPixels);
    setCroppedImage(cropped);

    // Convert base64 to File if needed
    const response = await fetch(cropped);
    const blob = await response.blob();
    const file = new File([blob], "cropped-image.png", { type: blob.type });
    onImageSelected?.(file);

    // Hide cropper
    setImageSrc(null);
  };

  return (
    <div>
      {!imageSrc && !croppedImage && (
        <div
          className={`w-80 h-80 border-2 border-dashed ${DARK_BG} dark:${LIGHT_BG} border-gray-400 flex items-center justify-center cursor-pointer`}
          onClick={handleClick}
        >
          <FilePlus className="w-24 h-24 text-gray-400 dark:text-gray-300" />
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Cropper */}
      {imageSrc && (
        <div className="relative w-80 h-80 bg-gray-200">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1} // square
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
          <button
            onClick={handleCropSave}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded"
          >
            Save
          </button>
        </div>
      )}

      {/* Preview */}
      {croppedImage && (
        <div className="w-80 h-80  mt-2">
          <img src={croppedImage} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
