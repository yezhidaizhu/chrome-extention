import { useEffect, useState } from "react";

const SettingKey = "searchGeneralSetting";

export default function useSetting() {
  const [openSetting, setOpenSetting] = useState(false);

  const toggleOpenSetting = (open?: boolean) => {
    setOpenSetting(open ?? !openSetting);
  };

  const [setting, setSetting] = useState({
    theme: "light",
    mask: false,
    searchTypes: [],
  });

  const onSettingChange = (data: { field: string; value: any }) => {
    const { field, value } = data;
    const newSetting = { ...setting, [field]: value };

    setSetting(newSetting);
    chrome.storage.local.set({ [SettingKey]: newSetting });
  };

  const initSetting = async () => {
    const _setting = await getDefaultSetting();
    if (_setting) {
      await setSetting((s) => ({ ...s, ...(_setting ?? {}) }));
    }
  };

  useEffect(() => {
    initSetting();
  }, []);

  return { setting, onSettingChange, openSetting, toggleOpenSetting };
}

export async function getDefaultSetting() {
  const data = await chrome.storage.local.get(SettingKey);
  return data?.[SettingKey];
}
