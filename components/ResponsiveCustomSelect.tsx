import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Option {
  value: string;
  label: string;
}

interface ResponsiveCustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  label: string;
  description?: string;
}

const ResponsiveCustomSelect: React.FC<ResponsiveCustomSelectProps> = ({
  value,
  onChange,
  options,
  label,
  description
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const touchStartTimeRef = useRef<number | null>(null);

  const toggleOpen = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen(prev => !prev);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartTimeRef.current = Date.now();
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartTimeRef.current && Date.now() - touchStartTimeRef.current < 300) {
      toggleOpen(e);
    }
    touchStartTimeRef.current = null;
  }, [toggleOpen]);

  const handleSelect = useCallback((selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
  }, [onChange]);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchend', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchend', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find(option => option.value === value);

  const SelectButton = React.memo(() => (
    <button
      className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      onClick={toggleOpen}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
    >
      {selectedOption ? selectedOption.label : 'Select an option'}
    </button>
  ));

  const DesktopSelect = () => (
    <div className="relative" ref={selectRef}>
      <SelectButton />
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              onClick={() => handleSelect(option.value)}
              onTouchEnd={(e) => {
                e.preventDefault();
                handleSelect(option.value);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const MobileModal = () => (
    <>
      <SelectButton />
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50">
          <div className="w-full max-h-[50vh] bg-white rounded-t-lg overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                className="w-full px-4 py-4 text-left border-b border-gray-200 focus:outline-none focus:bg-gray-100"
                onClick={() => handleSelect(option.value)}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleSelect(option.value);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {description && <p className="text-xs text-gray-500 mt-1 mb-2">{description}</p>}
      {isMobile ? <MobileModal /> : <DesktopSelect />}
    </div>
  );
};

export default React.memo(ResponsiveCustomSelect);