import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getOptions } from '../services';

interface Options {
  trueId?: {
    client_id: number | null;
    redirect_uri: string | null;
  };
  [key: string]: any;
}

interface OptionsContextType {
  options: Options;
  isLoading: boolean;
  error: Error | null;
  refreshOptions: () => Promise<void>;
}

const OptionsContext = createContext<OptionsContextType>({
  options: {},
  isLoading: true,
  error: null,
  refreshOptions: async () => {}
});

interface OptionsProviderProps {
  children: ReactNode;
}

export function OptionsProvider({ children }: OptionsProviderProps) {
  const [options, setOptions] = useState<Options>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);


  const loadOptions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getOptions();
      setOptions(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load options'));
      console.error('Error loading options:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOptions();
  }, []);

  const refreshOptions = async () => {
    await loadOptions();
  };

  return (
    <OptionsContext.Provider value={{ options, isLoading, error, refreshOptions }}>
  {children}
  </OptionsContext.Provider>
);
}

export function useOptions() {
  const context = useContext(OptionsContext);

  if (context === undefined) {
    throw new Error('useOptions must be used within an OptionsProvider');
  }

  return context;
}
