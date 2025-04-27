import React, { useState } from 'react';
import { Layers, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import ToolCard from '../components/ToolCard';
import ImageUpload from '../components/ImageUpload';
import api from '../api'; // Correct import of api

const BackgroundRemover: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
    // Reset processed image when new image is uploaded
    setProcessedImage(null);
  };

  const handleRemoveBackground = async () => {
    if (!uploadedImage) {
      toast.error('Please upload an image first');
      return;
    }

    setIsLoading(true);

    // Prepare the FormData for the API call
    const formData = new FormData();
    formData.append('file', uploadedImage);

    try {
      // Make the API call to remove background
      const response = await api.post('/remove_background', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob', // Expect a binary blob as the response
      });

      // Create an object URL for the processed image
      const imageUrl = URL.createObjectURL(response.data);

      // Set the processed image URL
      setProcessedImage(imageUrl);
      setIsLoading(false);
      toast.success('Background removed successfully!');
    } catch (error) {
      setIsLoading(false);
      toast.error('Failed to remove background, please try again.');
    }
  };

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = 'removed-background.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <ToolCard title="Background Remover" icon={<Layers size={24} />}>
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <ImageUpload onImageUpload={handleImageUpload} />
            </div>

            <button
              onClick={handleRemoveBackground}
              disabled={isLoading}
              className="w-full btn btn-primary flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Removing Background...
                </>
              ) : (
                'Remove Background'
              )}
            </button>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
              Result
            </h3>

            {!processedImage ? (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  {isLoading
                    ? 'Processing your image...'
                    : 'Upload an image and click "Remove Background" to see the result'}
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==')] bg-center rounded-lg">
                  <img
                    src={processedImage}
                    alt="Processed"
                    className="w-full h-64 object-contain rounded-lg"
                  />
                </div>
                <button
                  onClick={handleDownload}
                  className="mt-3 btn btn-primary flex items-center mx-auto"
                >
                  <Download size={16} className="mr-2" />
                  Download
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </ToolCard>
  );
};

export default BackgroundRemover;
