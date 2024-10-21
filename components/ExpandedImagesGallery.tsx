import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { useTranslation } from 'next-i18next';

interface ExpandedImagesGalleryProps {
  images: string[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ExpandedImagesGallery: React.FC<ExpandedImagesGalleryProps> = ({
  images,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const { t } = useTranslation('common');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${t('expandedImagesGallery.downloadFileName')}-${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(t('expandedImagesGallery.downloadError'), error);
    }
  };

  return (
    <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{t('expandedImagesGallery.title')}</h2>
      {images.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((imageUrl: string, index: number) => (
              <motion.div
                key={index}
                className="relative group touch-manipulation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onTouchStart={() => setActiveIndex(index)}
                onTouchEnd={() => setActiveIndex(null)}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <img
                  src={imageUrl}
                  alt={t('expandedImagesGallery.imageAlt', { index: index + 1 })}
                  className="w-full h-auto rounded-lg shadow-md transition duration-300"
                />
                <div className={`absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center transition-opacity duration-300 ${activeIndex === index ? 'opacity-100' : 'opacity-0'}`}>
                  <button
                    onClick={() => handleDownload(imageUrl, index)}
                    className="bg-white text-gray-800 px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-gray-100 transition duration-300"
                  >
                    <Download size={20} />
                    <span>{t('expandedImagesGallery.downloadButton')}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center space-x-4">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {t('expandedImagesGallery.previousButton')}
              </button>
              <span className="text-gray-700">
                {t('expandedImagesGallery.pageInfo', { current: currentPage, total: totalPages })}
              </span>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {t('expandedImagesGallery.nextButton')}
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500">{t('expandedImagesGallery.noImages')}</p>
      )}
    </div>
  );
};

export default ExpandedImagesGallery;