import { useEffect, useMemo, useState } from 'react';
import { getUserStore, setUserStore } from '../utils';

export enum Platforms {
  IFlyTek = 'IFlyTek',
}

export enum SettingTypes {
  TTS = 'TTS',
}

const defaultOptions: Settings.SelectOptions = {
  platform: Platforms.IFlyTek,
  settingType: SettingTypes.TTS,
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

const getPlatformSettings = (key: string) => {
  return getUserStore(key);
};

const setPlatformSettings = async (key: string, value: Partial<Settings.SelectOptions>) => {
  const oldValue = await getPlatformSettings(key);
  return setUserStore(key, { ...oldValue, ...value });
};

export default () => {
  const [selectOptions, setSelectOptions] = useState(defaultOptions);
  const storeKey = `${selectOptions.platform}_${selectOptions.settingType}`;
  const options = useMemo(() => {
    return {
      platforms: Object.entries(Platforms).map(([key, value]) => ({
        key, value, label: value,
      })),
      types: getSettingTypes(selectOptions.platform),
    };
  }, [selectOptions.platform]);

  const onChangePlatform = (value: Platforms) => {
    console.log('onChangePlatform', value);
  };

  const onChangeFields = (value: Partial<Settings.SelectOptions>) => {
    if (['platform', 'settingType'].includes(Object.keys(value)[0])) {
      return;
    }
    setPlatformSettings(storeKey, value);
    setSelectOptions(oldV => ({ ...oldV, ...value }));
  };

  useEffect(() => {
    (async () => {
      const settings = await getPlatformSettings(storeKey);
      setSelectOptions(oldV => ({ ...oldV, ...settings }));
    })();
  }, [selectOptions.platform]);

  return {
    selectOptions, onChangeFields, options, onChangePlatform,
  };
};
