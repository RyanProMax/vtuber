import { useState } from 'react';

import { Channels } from 'src/common/constant';
import { ipcRenderer } from 'src/renderer/utils';

const defaultOption: TTS.IFlyTekSelectOptions = {};

export default ({ text }: TTS.HookProps) => {
  const [selectOptions] = useState(defaultOption);

  const onTriggerTTS = () => {
    const params: TTS.IFlyTekApiRequest = { text };
    return ipcRenderer.invoke(Channels.StartIFlyTekTTSApi, params) as Promise<TTS.OnTriggerTTSResponse>;
  };

  const onValuesChange = (value: Partial<TTS.IFlyTekSelectOptions>) => {
    console.log('onValuesChange', value);
  };

  return {
    onTriggerTTS, onValuesChange, selectOptions,
  };
};
