import { useEffect, useState } from "react";

const SettingKey = "generalSetting";

export default function useSetting() {
  const [openSetting, setOpenSetting] = useState(false);

  const toggleOpenSetting = (open?: boolean) => {
    setOpenSetting(open ?? !openSetting);
  };

  const [setting, setSetting] = useState({
    isDarkTheme: false,
    mask: false,
  });

  const onSettingChange = (data: { field: string; value: any }) => {
    const { field, value } = data;
    setSetting((d) => ({ ...d, [field]: value }));
  };

  const initSetting = async () => {
    const data = await chrome.storage.local.get(SettingKey);
    if (data?.[SettingKey]) {
      await setSetting((s) => ({ ...s, ...(data?.[SettingKey] ?? {}) }));
    }
  };

  useEffect(() => {
    initSetting();
  }, []);

  return { setting, onSettingChange, openSetting, toggleOpenSetting };
}