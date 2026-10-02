import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchSettings } from "@/lib/api";
import { FALLBACK_SETTINGS } from "@/lib/site";

const SettingsContext = createContext({
  settings: FALLBACK_SETTINGS,
  ready: false,
});

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(FALLBACK_SETTINGS);

  useEffect(() => {
    let active = true;
    fetchSettings()
      .then((data) => {
        if (active) setSettings({ ...FALLBACK_SETTINGS, ...data });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(() => ({ settings }), [settings]);
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
