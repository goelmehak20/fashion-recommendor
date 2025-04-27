import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import FashionRecommender from '../features/FashionRecommender';
import StylePredictor from '../features/StylePredictor';
import FeatureExtractor from '../features/FeatureExtractor';
import BackgroundRemover from '../features/BackgroundRemover';
import SimilarityFinder from '../features/SimilarityFinder';
import WeatherSuggestion from '../features/WeatherSuggestion';

const Dashboard: React.FC = () => {
  const location = useLocation();

  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, x: -20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: 20 },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
            className="max-w-6xl mx-auto"
          >
            <Routes>
              <Route path="recommender" element={<FashionRecommender />} />
              <Route path="styleprediction" element={<StylePredictor />} />
              <Route path="featureextractor" element={<FeatureExtractor />} />
              <Route path="backgroundremover" element={<BackgroundRemover />} />
              <Route path="similarityfinder" element={<SimilarityFinder />} />
              <Route path="weathersuggestion" element={<WeatherSuggestion />} />
              <Route path="*" element={<Navigate to="/dashboard/recommender" replace />} />
            </Routes>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;