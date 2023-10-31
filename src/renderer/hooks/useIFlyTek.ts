import { useState } from 'react';

import { Channels } from 'src/common/constant';
import { ipcRenderer } from 'src/renderer/utils';

export enum RoleValue {
  xiaoyan = 'xiaoyan',
  aisjiuxu = 'aisjiuxu',
  aisxping = 'aisxping',
  aisjinger = 'aisjinger',
  aisbabyxu = 'aisbabyxu',
}

export const Roles = [
  { label: '讯飞小燕', value: RoleValue.xiaoyan },
  { label: '讯飞许久', value: RoleValue.aisjiuxu },
  { label: '讯飞小萍', value: RoleValue.aisxping },
  { label: '讯飞小婧', value: RoleValue.aisjinger },
  { label: '讯飞许小宝', value: RoleValue.aisbabyxu },
];

const defaultOption: TTS.IFlyTekSelectOptions = {
  role: RoleValue.xiaoyan,
  speed: 50,
  volume: 50,
  pitch: 50,
};

export default ({ text }: TTS.HookProps) => {
  const [selectOptions, setSelectOptions] = useState(defaultOption);

  const onTriggerTTS = () => {
    const params: TTS.IFlyTekApiRequest = {
      text,
      role: selectOptions.role,
      speed: selectOptions.speed,
      volume: selectOptions.volume,
      pitch: selectOptions.pitch,
    };
    return ipcRenderer.invoke(Channels.StartIFlyTekTTSApi, params) as Promise<TTS.OnTriggerTTSResponse>;
  };

  const onValuesChange = (value: Partial<TTS.IFlyTekSelectOptions>) => {
    setSelectOptions(oldV => ({ ...oldV, ...value }));
  };

  return {
    onTriggerTTS, onValuesChange, selectOptions,
    roles: Roles,
  };
};
