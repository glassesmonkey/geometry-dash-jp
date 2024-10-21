import React from 'react';
import { useTranslation } from 'next-i18next';

interface LoadingOverlayProps {
  progress: number;
  operation: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ progress, operation }) => {
  const { t } = useTranslation('ai-expand-image');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <div className="mb-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-center mt-2 text-sm text-gray-600">{Math.round(progress)}% {t('loadingOverlay.complete')}</p>
        </div>
        <p className="text-center text-sm text-gray-700 mb-2">
          {t(`loadingOverlay.${operation}`)}
        </p>
        <p className="text-center text-xs text-gray-500">
          {t('loadingOverlay.warning')}
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;