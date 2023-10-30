import { Platforms, SettingTypes } from '../hooks/useSettings';

declare global {
  namespace Settings {
    type IFlyTekSelectOptions = {
      platform: Platforms
      settingType: SettingTypes
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
