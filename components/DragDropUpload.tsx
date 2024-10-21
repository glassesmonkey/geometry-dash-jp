import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'next-i18next';

interface DragDropUploadProps {
  onFileChange: (file: File) => void;
}

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB in bytes

const DragDropUpload: React.FC<DragDropUploadProps> = ({ onFileChange }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useTranslation('ai-expand-image');

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    if (acceptedFiles.length > 0) {
      onFileChange(acceptedFiles[0]);
      setErrorMessage(null);
    } else if (fileRejections.length > 0) {
      setErrorMessage(t('dragDropUpload.fileTooLarge'));
    }
  }, [onFileChange, t]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {'image/*': []},
    multiple: false,
    maxSize: MAX_FILE_SIZE
  });

  return (
    <div>
      <div 
        {...getRootProps()} 
        className={`w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-300 ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
        } ${isDragReject || errorMessage ? 'border-red-500 bg-red-50' : ''}`}
      >
        <input {...getInputProps()} />
        <p className="text-lg font-semibold mb-2">{t('dragDropUpload.dragDropText')}</p>
        <p className="text-sm text-gray-500 mb-4">{t('dragDropUpload.orClickText')}</p>
        <p className="text-xs text-gray-400">{t('dragDropUpload.supportedFormats')}</p>
        <p className="text-xs text-gray-400 font-semibold mt-2">{t('dragDropUpload.maxFileSize')}</p>
      </div>
      {errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}
    </div>
  );
};

export default DragDropUpload;