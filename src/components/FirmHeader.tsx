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
      <div className="text-center flex-1">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Loan Application System
        </h1>
        <p className="text-lg text-muted-foreground">
          Professional project reports for loan approval requests
        </p>
      </div>
    );
  }

  return (
    <div className="text-center flex-1">
      {accountSettings.logoUrl && (
        <div className="flex justify-center mb-3">
          <img 
            src={accountSettings.logoUrl} 
            alt={`${accountSettings.firmName} Logo`}
            className="h-16 w-auto object-contain"
          />
        </div>
      )}
      <h1 className="text-4xl font-bold text-foreground mb-2">
        {accountSettings.firmName}
      </h1>
      <p className="text-lg text-muted-foreground">
        Professional project reports for loan approval requests
      </p>
    </div>
  );
};
