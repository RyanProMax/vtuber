import { useEffect, useMemo, useState } from 'react';
import { FormInstance } from '@arco-design/web-react';

import { Platforms, SettingTypes } from 'src/common/constant';
import { getUserStore, setUserStore } from 'src/renderer/utils';

const getSettingTypes = (platform: Platforms) => {
  switch (platform) {
    case Platforms.OpenAI: return [SettingTypes.AutoChat];
    case Platforms.IFlyTek: return [SettingTypes.TTS];
    default: return [];
  }
};

const getDefaultFormData = ({
  platform
}: Settings.PlatformOptions): Settings.SelectOptions => {
  if (platform === Platforms.OpenAI) {
    return {
      apiKey: '',
    };
  } else {
    return {
      appid: '',
      apiKey: '',
      apiSecret: '',
    };
  }
};

export default ({ form }: {
  form: FormInstance<any>
}) => {
  const [platformOptions, setPlatformOptions] = useState({
    platform: Platforms.OpenAI,
    settingType: SettingTypes.AutoChat,
  });
  const [selectOptions, setSelectOptions] = useState(getDefaultFormData(platformOptions));
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
    setPlatformOptions(oldV => ({ ...oldV, ...value }));
    if (Object.keys(value)[0] === 'platform') {
      const settingTypes = getSettingTypes(value.platform!);
      if (!settingTypes.includes(platformOptions.settingType)) {
        setPlatformOptions(oldV => ({
          ...oldV,
          settingType: settingTypes[0],
        }));
      }
    }
  };

  const getPlatformSettings = async () => {
    return getUserStore(storeKey) as Promise<Settings.SelectOptions | undefined>;
  };

  const setPlatformSettings = async (value: Partial<Settings.SelectOptions>) => {
    setSelectOptions(oldV => ({ ...oldV, ...value }));
    const oldValue = await getPlatformSettings();
    return setUserStore(storeKey, { ...oldValue, ...value });
  };

  const refreshFormData = async () => {
    const formData = await getPlatformSettings() || getDefaultFormData(platformOptions);
    console.log('formData', formData, storeKey);
    setSelectOptions(formData);
    form.setFieldsValue(formData);
  };

  useEffect(() => {
    refreshFormData();
  }, [platformOptions]);

  return {
    platformOptions, selectOptions, options, onChangePlatformOptions,
    setPlatformSettings,
  };
};
