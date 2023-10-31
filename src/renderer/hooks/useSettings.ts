import { useMemo, useState } from 'react';
import { getUserStore, setUserStore } from '../utils';

export enum Platforms {
  IFlyTek = 'IFlyTek',
}

export enum SettingTypes {
  TTS = 'TTS',
}

const defaultPlatformOptions: Settings.PlatformOptions = {
  platform: Platforms.IFlyTek,
  settingType: SettingTypes.TTS,
};

const defaultOptions: Settings.IFlyTekSelectOptions = {
  appID: '',
  apiKey: '',
  apiSecret: '',
};

const getSettingTypes = (platform: Platforms) => {
  switch (platform) {
    case Platforms.IFlyTek: return [SettingTypes.TTS];
    default: return [];
  }
};

export default () => {
  const [platformOptions] = useState(defaultPlatformOptions);
  const [selectOptions, setSelectOptions] = useState<Settings.SelectOptions>(defaultOptions);
  const storeKey = `${platformOptions.platform}_${platformOptions.settingType}`;
  const options = useMemo(() => {
    return {
      platforms: Object.entries(Platforms).map(([key, value]) => ({
        key, value, label: value,
      })),
      types: getSettingTypes(platformOptions.platform),
    };
  }, [platformOptions.platform]);

  const onChangePlatformOptions = (value: Partial<Settings.PlatformOptions>) => {
    console.log('onChangePlatformOptions', value);
  };

  const getPlatformSettings = () => {
    return getUserStore(storeKey) as Promise<Settings.SelectOptions>;
  };

  const setPlatformSettings = async (value: Partial<Settings.SelectOptions>) => {
    setSelectOptions(oldV => ({ ...oldV, ...value }));
    const oldValue = await getPlatformSettings();
    return setUserStore(storeKey, { ...oldValue, ...value });
  };

  return {
    platformOptions, selectOptions, options, onChangePlatformOptions,
    getPlatformSettings, setPlatformSettings,
  };
};
