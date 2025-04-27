// src/features/FeatureExtractor.tsx
import React, { useState } from 'react';
import { Tag, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import ToolCard from '../components/ToolCard';
import ImageUpload from '../components/ImageUpload';
import api from '../api'; 

// Define the shape of a single feature
interface ExtractedFeature {
  label: string;
  value: string;
  confidence: number;
}

const FeatureExtractor: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [features, setFeatures] = useState<ExtractedFeature[]>([]);

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
  };

  const handleExtract = async () => {
    if (!uploadedImage) {
      toast.error('Please upload an image first');
      return;
    }
    
    setIsLoading(true);
    setFeatures([]);

    try {
      const formData = new FormData();
      formData.append('file', uploadedImage);

      // ⚙️ Call your real endpoint here:
      const response = await api.post<{ features: ExtractedFeature[] }>(
        '/extract_features',         // or '/extract/' depending on your backend route
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setFeatures(response.data.features);
      toast.success('Features extracted successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to extract features');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ToolCard title="Feature Extractor" icon={<Tag size={24} />}>
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Upload + Button */}
          <div>
            <div className="mb-4">
              <ImageUpload onImageUpload={handleImageUpload} />
            </div>
            <button
              onClick={handleExtract}
              disabled={isLoading}
              className="w-full btn btn-primary flex items-center justify-center"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Extracting Features...
                </>
              ) : (
                'Extract Features'
              )}
            </button>
          </div>
          
          {/* Results Panel */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
              Extracted Features
            </h3>
            
            {features.length === 0 ? (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  {isLoading 
                    ? 'Analyzing garment features...' 
                    : 'Upload an image of clothing to extract features'}
                </p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="p-4"
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {feature.label}:
                        </div>
                        <div className="ml-2 text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                          {feature.value}
                          {feature.confidence > 0.9 && (
                            <Check className="ml-1 h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {(feature.confidence * 100).toFixed(0)}% confidence
                      </div>
                    </div>
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

export default FeatureExtractor;
