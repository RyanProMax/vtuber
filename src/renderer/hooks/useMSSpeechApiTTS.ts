import { useMemo, useState } from 'react';
import { get } from 'lodash-es';

import { Channels } from 'src/common/constant';
import Languages from 'src/common/langs';
import MicrosoftSpeechVoices from 'src/common/ms_speech_voices';
import { ipcRenderer } from 'src/renderer/utils';

export const getFilterVoices = (language: Languages) => {
  return MicrosoftSpeechVoices.filter(x => x.properties.localeZH === language);
};

export const getVoice = (voiceId: string) => {
  return MicrosoftSpeechVoices.find(x => x.id === voiceId);
};

const msDefaultVoice = MicrosoftSpeechVoices.find(x => x.shortName === 'zh-CN-XiaoxiaoNeural');
const msDefaultOption: TTS.MSSpeechApiSelectOptions = {
  language: Languages.ZH_CN,
  voiceId: msDefaultVoice!.id,
  styleName: get(msDefaultVoice, 'samples.styleSamples[0].styleName', ''),
  roleName: get(msDefaultVoice, 'samples.roleSamples[0].roleName', ''),
  rate: 100,
  pitch: 100,
};

export default ({ text, form }: TTS.MSSpeechApiProps) => {
  const [selectOptions, setSelectOptions] = useState(msDefaultOption);
  const voices = useMemo(() => getFilterVoices(selectOptions.language), [selectOptions.language]);
  const selectVoice = useMemo(() => getVoice(selectOptions.voiceId), [selectOptions.voiceId]);

  const onTriggerTTS = async () => {
    const options: TTS.MSSpeechApiRequest = {
      text,
      voice: getVoice(selectOptions.voiceId)?.shortName || '',
      style: selectOptions.styleName,
      role: selectOptions.roleName,
      rate: selectOptions.rate,
      pitch: selectOptions.pitch,
      retryCount: 10,
      retryInterval: 1000,
    };
    const result: TTS.MSSpeechApiResponse = await ipcRenderer.invoke(Channels.StartTTS, options);
    return result;
  };

  const onValuesChange = (value: Partial<TTS.MSSpeechApiSelectOptions>) => {
    setSelectOptions(oldV => ({ ...oldV, ...value }));
    if (Object.keys(value)[0] === 'language') {
      const filterVoices = getFilterVoices(value.language!);
      form.setFieldValue('voiceId', filterVoices[0]?.id || '');
    }
    if (Object.keys(value)[0] === 'voiceId') {
      const voice = getVoice(value.voiceId!);
      const styleName = get(voice, 'samples.styleSamples[0].styleName', '');
      const roleName = get(voice, 'samples.roleSamples[0].roleName', '');
      form.setFieldsValue({ styleName, roleName });
    }
  };

  return {
    onTriggerTTS, onValuesChange, languages: Languages, voices,
    selectVoice, selectOptions, setSelectOptions,
  };
};
