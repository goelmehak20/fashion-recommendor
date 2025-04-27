import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Camera,
  Shirt,
  Tag,
  Layers,
  Images,
  CloudSun,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

const sidebarItems = [
  {
    path: '/dashboard/recommender',
    icon: <Camera size={20} />,
    label: 'Fashion Recommender'
  },
  {
    path: '/dashboard/styleprediction',
    icon: <Shirt size={20} />,
    label: 'Style Predictor'
  },
  {
    path: '/dashboard/featureextractor',
    icon: <Tag size={20} />,
    label: 'Feature Extractor'
  },
  {
    path: '/dashboard/backgroundremover',
    icon: <Layers size={20} />,
    label: 'Background Remover'
  },
  {
    path: '/dashboard/similarityfinder',
    icon: <Images size={20} />,
    label: 'Similarity Finder'
  },
  {
    path: '/dashboard/weathersuggestion',
    icon: <CloudSun size={20} />,
    label: 'Weather Suggestion'
  }
];

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`${
          isCollapsed ? 'w-16' : 'w-64'
        } hidden md:block transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}
      >
        <div className="h-full flex flex-col justify-between py-4">
          <nav className="flex-1 px-2">
            <ul className="space-y-1">
              {sidebarItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center ${
                        isCollapsed ? 'justify-center' : ''
                      } px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`
                    }
                  >
                    <span className="flex items-center justify-center">
                      {item.icon}
                    </span>
                    {!isCollapsed && <span className="ml-3">{item.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="px-2">
            <button
              onClick={() => setIsCollapsed((prev) => !prev)}
              className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              {!isCollapsed && <span className="ml-2">Collapse</span>}
            </button>
          </div>
        </div>
      </motion.aside>
      
      {/* Mobile navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-10">
        <ul className="flex justify-around p-2">
          {sidebarItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center px-2 py-1 rounded-md ${
                    isActive
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`
                }
              >
                <span className="text-[18px]">{item.icon}</span>
                <span className="text-xs mt-1">{item.label.split(' ')[0]}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;