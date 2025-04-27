import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ToolCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}

const ToolCard: React.FC<ToolCardProps> = ({ title, icon, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card"
    >
      <div className="flex items-center mb-4">
        <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
          {icon}
        </div>
        <h2 className="ml-3 text-xl font-semibold text-gray-800 dark:text-white">{title}</h2>
      </div>
      <div>{children}</div>
    </motion.div>
  );
};

export default ToolCard;