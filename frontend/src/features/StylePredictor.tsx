import React, { useState } from 'react';
import { Shirt, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import ToolCard from '../components/ToolCard';
import ImageUpload from '../components/ImageUpload';
import api from '../api';                    

interface Prediction {
  style: string;
  confidence: number;
  description: string;
}

const StylePredictor: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading]           = useState(false);
  const [prediction, setPrediction]         = useState<Prediction | null>(null);

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
    setPrediction(null);
  };

  const handlePredict = async () => {
    if (!uploadedImage) {
      toast.error('Please upload an image first');
      return;
    }

    const form = new FormData();
    form.append('file', uploadedImage);

    try {
      setIsLoading(true);
      setPrediction(null);

      const res = await api.post<Prediction>(
        '/predict',
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      // TypeScript now knows res.data is Prediction
      setPrediction(res.data);
      toast.success('Style predicted successfully!');
    } catch (err) {
      console.error('Prediction error', err);
      toast.error('Failed to predict style');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ToolCard title="Style Predictor" icon={<Shirt size={24} />}>
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <ImageUpload onImageUpload={handleImageUpload} />

            <button
              onClick={handlePredict}
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373
                         0 0 5.373 0 12h4zm2 5.291A7.962 
                         7.962 0 014 12H0c0 3.042 1.135 
                         5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Predicting Style...
                </>
              ) : (
                'Predict Style'
              )}
            </button>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
              Style Prediction
            </h3>

            {!prediction ? (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  {isLoading
                    ? 'Analyzing your outfit style...'
                    : 'Upload an image of an outfit to predict its style'}
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center mb-4">
                  <Tag className="h-6 w-6 text-primary-500" />
                  <h4 className="ml-2 text-xl font-medium text-gray-800 dark:text-white">
                    {prediction.style}
                  </h4>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Confidence
                    </span>
                    <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                      {(prediction.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ width: `${prediction.confidence * 100}%` }}
                    />
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400">
                  {prediction.description}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </ToolCard>
  );
};

export default StylePredictor;
