import { Platforms, SettingTypes } from 'src/common/constant';

declare global {
  namespace Settings {
    type PlatformOptions = {
      platform: Platforms
      settingType: SettingTypes
    };

    type IFlyTekSelectOptions = {
      appid: string
      apiSecret: string
      apiKey: string
    };

    type SelectOptions = IFlyTekSelectOptions;

    type Options = {
      platforms: Platforms[]
      types: SettingTypes[]
    }
  }
}
