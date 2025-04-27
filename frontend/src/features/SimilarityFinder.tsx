// src/features/SimilarityFinder.tsx

import React, { useState } from 'react';
import { Images, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import ToolCard from '../components/ToolCard';
import ImageUpload from '../components/ImageUpload';
import api from '../api';

interface Outfit {
  id: string;
  imageUrl: string;
  similarity?: number;
}

const SimilarityFinder: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading]       = useState(false);
  const [similarOutfits, setSimilarOutfits] = useState<Outfit[]>([]);

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
    setSimilarOutfits([]);
  };

  const handleFindSimilar = async () => {
    if (!uploadedImage) {
      toast.error('Please upload an image first');
      return;
    }

    const form = new FormData();
    form.append('file', uploadedImage);

    setIsLoading(true);
    try {
      const res = await api.post('/recommend', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // our backend returns { imageBased: [ { id, imageUrl, ... }, ... ] }
      const items: any[] = res.data.imageBased || [];
      const outfits: Outfit[] = items.map((item, idx) => ({
        id: item.id?.toString() ?? `outfit-${idx}`,
        imageUrl: item.imageUrl ?? item.image_name ?? item.url,
        similarity: item.similarity,
      }));

      setSimilarOutfits(outfits);
      toast.success('Similar outfits found!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch similar outfits');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ToolCard title="Similarity Finder" icon={<Images size={24} />}>
      <div className="space-y-6">
        
        {/* Image Upload */}
        <div>
          <ImageUpload onImageUpload={handleImageUpload} />
        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={handleFindSimilar}
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
                Finding Similar Outfits...
              </>
            ) : (
              'Find Similar Outfits'
            )}
          </button>
        </div>

        {/* Results */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
            Similar Outfits
          </h3>

          {isLoading ? (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Searching for similar outfits...
              </p>
            </div>
          ) : similarOutfits.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Upload an outfit image to find similar styles
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similarOutfits.map((outfit, index) => (
                <motion.div
                  key={outfit.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className="aspect-w-2 aspect-h-3 rounded-lg overflow-hidden">
                    <img
                      src={outfit.imageUrl}
                      alt={`Similar outfit ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  {outfit.similarity != null && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                      <div className="flex items-center">
                        <Sparkles className="h-4 w-4 text-yellow-400" />
                        <span className="ml-1 text-xs font-medium text-white">
                          {(outfit.similarity * 100).toFixed(0)}% Match
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ToolCard>
  );
};

export default SimilarityFinder;
