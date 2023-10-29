import { useMemo, useRef, useState } from 'react';
import { get } from 'lodash-es';
import { v4 } from 'uuid';
import log from 'electron-log/renderer';

import { Channels } from 'src/common/constant';
import Languages from 'src/common/langs';
import AllVoices from 'src/common/voices';
import { ipcRenderer } from 'src/renderer/utils';

const TTSLogger = log.scope('TTS');

export enum TTSStatus {
  Ready = 'ready',
  Loading = 'loading',
  Playing = 'playing',
  Done = 'done',
}

export const getFilterVoices = (language: Languages) => {
  return AllVoices.filter(x => x.properties.localeZH === (language));
};

export const getVoice = (voiceId: string) => {
  return AllVoices.find(x => x.id === voiceId);
};

const defaultVoice = AllVoices.find(x => x.shortName === 'zh-CN-XiaoxiaoNeural');
const DefaultOption: TTS.SelectOptions = {
  language: Languages.ZH_CN,
  voiceId: defaultVoice!.id,
  styleName: get(defaultVoice, 'samples.styleSamples[0].styleName', ''),
  roleName: get(defaultVoice, 'samples.roleSamples[0].roleName', ''),
  rate: 100,
  pitch: 100,
};

export default () => {
  const audioRef = useRef<HTMLAudioElement>();

  // status
  const [status, setStatus] = useState(TTSStatus.Ready);
  const [history, setHistory] = useState<TTS.HistoryItem[]>([]);
  const isReady = status === TTSStatus.Ready;
  const isLoading = status === TTSStatus.Loading;
  const isPlaying = status === TTSStatus.Playing;

  // config
  const [text, setText] = useState('你好呀旅行者');
  const [selectOptions, setSelectOptions] = useState(DefaultOption);
  const options: TTS.Options = useMemo(() => {
    return {
      languages: Object.entries(Languages).map(([key, value]) => ({
        key, value,
      })),
      voices: getFilterVoices(selectOptions.language),
    };
  }, [selectOptions]);


  const onStart = async () => {
    if (status !== TTSStatus.Ready) {
      return false;
    }

    try {
      TTSLogger.info('onStart', selectOptions);

      setStatus(TTSStatus.Loading);
      const options: TTS.StartRequest = {
        text,
        voice: getVoice(selectOptions.voiceId)?.shortName || '',
        style: selectOptions.styleName,
        role: selectOptions.roleName,
        rate: selectOptions.rate,
        pitch: selectOptions.pitch,
        retryCount: 10,
        retryInterval: 1000,
      };
      const result: TTS.StartResponse = await ipcRenderer.invoke(Channels.StartTTS, options);

      if (result?.data) {
        const audioBlob = new Blob([result.data]);
        const audioUrl = URL.createObjectURL(audioBlob);
        setStatus(TTSStatus.Playing);
        const id = v4();
        setHistory(h => ([...h, {
          id, text, cost: result.cost,
          status: TTSStatus.Playing,
        }]));
        const play_result = await playAudio(audioUrl);
        setHistory(h => {
          const _h = [...h];
          const i = _h.find(x => x.id === id);
          if (i) {
            i.status = TTSStatus.Done;
          }
          return _h;
        });

        return play_result;
      }

      return false;
    } finally {
      setStatus(TTSStatus.Ready);
    }
  };

  const playAudio = (url: string): Promise<boolean> => new Promise(resolve => {
    if (!audioRef.current) {
      audioRef.current = document.createElement('audio');
    }
    const audio = audioRef.current;
    audio.src = url;
    audio.onended = () => {
      resolve(true);
    };
    audio.onerror = () => {
      resolve(false);
    };
    audio.play();
  });

  return {
    history, status, isReady, isLoading, isPlaying, onStart,
    selectOptions, setSelectOptions, options, text, setText,
  };
};
