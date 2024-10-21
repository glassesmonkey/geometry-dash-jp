import React, { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { LogOut, CreditCard } from 'lucide-react';
import { useTranslation } from 'next-i18next';

interface UserDropdownMenuProps {
  onClose: () => void;
}

const UserDropdownMenu: React.FC<UserDropdownMenuProps> = ({ onClose }) => {
  const [credit, setCredit] = useState<number | null>(null);
  const { t } = useTranslation('ai-expand-image');

  useEffect(() => {
    const fetchCredit = async () => {
      try {
        const response = await fetch('/api/get-user-credit');
        const data = await response.json();
        setCredit(data.credit);
      } catch (error) {
        console.error('Failed to fetch user credit:', error);
      }
    };

    fetchCredit();
  }, []);

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
      <div className="py-1">
        <div className="px-4 py-2 text-sm text-gray-700 flex items-center">
          <CreditCard className="mr-2 h-4 w-4" />
          {t('userDropdownMenu.credits')}: {credit !== null ? credit : t('userDropdownMenu.loading')}
        </div>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t('userDropdownMenu.logout')}
        </button>
      </div>
    </div>
  );
};

export default UserDropdownMenu;