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
        <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-1">
          Loan Application System
        </h1>
        <p className="text-sm md:text-lg text-muted-foreground hidden sm:block">
          Professional project reports for loan approval requests
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-4">
      {accountSettings.logoUrl && (
        <div className="flex-shrink-0">
          <img 
            src={accountSettings.logoUrl} 
            alt={`${accountSettings.firmName} Logo`}
            className="h-12 w-12 md:h-16 md:w-16 object-cover rounded-full border-2 border-primary/20"
          />
        </div>
      )}
      <div className="text-center">
        <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-1">
          {accountSettings.firmName}
        </h1>
        <p className="text-sm md:text-lg text-muted-foreground hidden sm:block">
          Professional project reports for loan approval requests
        </p>
      </div>
    </div>
  );
};
