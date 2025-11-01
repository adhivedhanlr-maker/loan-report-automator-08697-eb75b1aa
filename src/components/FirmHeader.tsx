import { useEffect, useState } from 'react';

interface AccountSettings {
  firmName: string;
  logoUrl: string;
}

export const FirmHeader = () => {
  const [accountSettings, setAccountSettings] = useState<AccountSettings>({
    firmName: '',
    logoUrl: ''
  });

  useEffect(() => {
    const loadSettings = () => {
      const saved = localStorage.getItem('accountSettings');
      if (saved) {
        setAccountSettings(JSON.parse(saved));
      }
    };

    loadSettings();
    
    // Listen for storage changes
    window.addEventListener('storage', loadSettings);
    return () => window.removeEventListener('storage', loadSettings);
  }, []);

  // If no firm name is set, show default
  if (!accountSettings.firmName) {
    return (
      <div className="text-center">
        <h1 className="text-lg sm:text-2xl lg:text-4xl font-bold text-foreground mb-0.5 lg:mb-1">
          Loan Application System
        </h1>
        <p className="text-xs sm:text-sm lg:text-base text-muted-foreground hidden sm:block">
          Professional project reports for loan approval requests
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 lg:gap-4">
      {accountSettings.logoUrl && (
        <div className="flex-shrink-0">
          <img 
            src={accountSettings.logoUrl} 
            alt={`${accountSettings.firmName} Logo`}
            className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 object-cover rounded-full border-2 border-primary/20"
          />
        </div>
      )}
      <div className="text-center">
        <h1 className="text-lg sm:text-2xl lg:text-4xl font-bold text-foreground mb-0.5 lg:mb-1 truncate max-w-[200px] sm:max-w-md lg:max-w-2xl">
          {accountSettings.firmName}
        </h1>
        <p className="text-xs sm:text-sm lg:text-base text-muted-foreground hidden sm:block">
          Professional project reports for loan approval requests
        </p>
      </div>
    </div>
  );
};
