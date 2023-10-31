import { Platforms, SettingTypes } from '../hooks/useSettings';

declare global {
  namespace Settings {
    type PlatformOptions = {
      platform: Platforms
      settingType: SettingTypes
    };

    type IFlyTekSelectOptions = {
      appID: string
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
