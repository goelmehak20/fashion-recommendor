// src/features/FashionRecommender.tsx
import React, { useState, useRef, useCallback } from 'react';
import { Camera, RotateCw } from 'lucide-react';
import { motion } from 'framer-motion';
import Webcam from 'react-webcam';
import { toast } from 'react-hot-toast';
import api from '../api';
import ToolCard from '../components/ToolCard';
import ImageUpload from '../components/ImageUpload';

type Gender = 'male' | 'female';
type Occasion = 'casual' | 'formal';

const FashionRecommender: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'webcam' | 'upload'>('webcam');
  const [gender, setGender] = useState<Gender>('male');
  const [occasion, setOccasion] = useState<Occasion>('casual');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const webcamRef = useRef<Webcam>(null);

  const handleCapture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      setUploadedImage(null);
    }
  };

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
    setCapturedImage(null);
  };

  const toBlob = (dataUrl: string): Blob => {
    const [, base64] = dataUrl.split(',');
    const binary = atob(base64);
    const len = binary.length;
    const buffer = new Uint8Array(len);
    for (let i = 0; i < len; i++) buffer[i] = binary.charCodeAt(i);
    return new Blob([buffer], { type: 'image/jpeg' });
  };

  const handleRecommend = useCallback(async () => {
    if (activeTab === 'webcam' && !capturedImage) {
      return toast.error('Please capture an image first');
    }
    if (activeTab === 'upload' && !uploadedImage) {
      return toast.error('Please upload an image first');
    }

    setIsLoading(true);
    setRecommendations([]);

    try {
      const form = new FormData();
      if (activeTab === 'webcam' && capturedImage) {
        form.append('file', toBlob(capturedImage), 'capture.jpg');
      } else if (uploadedImage) {
        form.append('file', uploadedImage, uploadedImage.name);
      }
      form.append('gender', gender);
      form.append('occasion', occasion);

      // Call your real backend endpoint:
      const res = await api.post<{ recommendations: string[] }>('/recommendations', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setRecommendations(res.data.recommendations);
      toast.success('Recommendations generated!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch recommendations');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, capturedImage, uploadedImage, gender, occasion]);

  const resetImage = () => {
    setCapturedImage(null);
    setUploadedImage(null);
    setRecommendations([]);
  };

  return (
    <ToolCard title="Fashion Recommender" icon={<Camera size={24} />}>
      <div className="space-y-6">
        {/* Tab selector */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-1 flex">
          {(['webcam','upload'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${activeTab === tab
                  ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'}
              `}
            >
              {tab === 'webcam' ? 'Use Webcam' : 'Upload Image'}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Webcam or Upload */}
          <div>
            {activeTab === 'webcam' ? (
              <div className="rounded-lg overflow-hidden bg-gray-900">
                {!capturedImage ? (
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="relative">
                    <img
                      src={capturedImage}
                      alt="Captured"
                      className="w-full h-64 object-cover"
                    />
                    <button
                      onClick={resetImage}
                      className="absolute top-2 right-2 p-2 rounded-full bg-gray-800/80 text-white hover:bg-gray-900/80 transition-colors"
                    >
                      <RotateCw size={16} />
                    </button>
                  </div>
                )}
                {!capturedImage && (
                  <button
                    onClick={handleCapture}
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-b-lg transition-colors"
                  >
                    Capture
                  </button>
                )}
              </div>
            ) : (
              <ImageUpload onImageUpload={handleImageUpload} />
            )}

            {/* Gender & Occasion selectors */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value as Gender)}
                  className="input-field"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Occasion
                </label>
                <select
                  value={occasion}
                  onChange={e => setOccasion(e.target.value as Occasion)}
                  className="input-field"
                >
                  <option value="casual">Casual</option>
                  <option value="formal">Formal</option>
                </select>
              </div>
            </div>

            {/* Recommend button */}
            <button
              onClick={handleRecommend}
              disabled={isLoading}
              className="mt-4 w-full btn btn-primary flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Capture & Recommend'
              )}
            </button>
          </div>

          {/* Right: Recommendations */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
              Recommendations
            </h3>
            {isLoading && recommendations.length === 0 ? (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Generating your fashion recommendations...
                </p>
              </div>
            ) : recommendations.length === 0 ? (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Capture or upload an image, then click “Capture & Recommend” to get personalized fashion advice
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recommendations.map((rec, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <p className="text-gray-800 dark:text-gray-200">{rec}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolCard>
  );
};

export default FashionRecommender;
