import { createContext, useRef, useState } from 'react';
import log from 'electron-log/renderer';
import { v4 } from 'uuid';

const TTSLogger = log.scope('TTS');

export enum TTSStatus {
  Ready = 'ready',
  Loading = 'loading',
  Playing = 'playing',
  Done = 'done',
}

export enum TTSPlatforms {
  IFlyTek = 'IFlyTek',
  MicrosoftSpeechAPI = 'Microsoft Speech API',
}

export const TTSContext = createContext<TTS.Context>(null);

export default () => {
  const childRef = useRef<TTS.ChildRef>();
  const audioRef = useRef<HTMLAudioElement>();

  // status
  const [status, setStatus] = useState(TTSStatus.Ready);
  const [messages, setMessages] = useState<TTS.Message[]>([]);
  const isReady = status === TTSStatus.Ready;
  const isLoading = status === TTSStatus.Loading;
  const isPlaying = status === TTSStatus.Playing;

  // config
  const [text, setText] = useState('你好呀旅行者');
  const [platform, onChangePlatform] = useState(TTSPlatforms.IFlyTek);

  const onStart = async () => {
    if (status !== TTSStatus.Ready) {
      return false;
    }

    try {
      TTSLogger.info('onStart');
      setStatus(TTSStatus.Loading);

      if (!childRef.current?.onTriggerTTS) {
        throw new Error('onTriggerTTS not define');
      }

      const result = await childRef.current.onTriggerTTS();
      TTSLogger.info('onTriggerTTS result', result);
      const { cost, data, error } = result;

      if (error) {
        throw new Error(error);
      }

      if (!data) {
        throw new Error('result is empty');
      }

      const audioBlob = new Blob([data]);
      const audioUrl = URL.createObjectURL(audioBlob);
      TTSLogger.info('audioUrl', audioUrl);

      setStatus(TTSStatus.Playing);
      const id = v4();
      setMessages(h => ([...h, {
        id, text, cost,
        status: TTSStatus.Playing,
      }]));
      await playAudio(audioUrl);

      setMessages(h => {
        const _h = [...h];
        const i = _h.find(x => x.id === id);
        if (i) {
          i.status = TTSStatus.Done;
        }
        return _h;
      });

      return true;
    } catch (e) {
      TTSLogger.error('start error', e);
      return false;
    } finally {
      setStatus(TTSStatus.Ready);
    }
  };

  const playAudio = (url: string) => new Promise((resolve, reject) => {
    if (!audioRef.current) {
      audioRef.current = document.createElement('audio');
    }
    const audio = audioRef.current;
    audio.src = url;
    audio.onended = () => {
      resolve(null);
    };
    audio.onerror = () => {
      reject(new Error('fail to play audio'));
    };
    audio.play();
  });

  return {
    isReady, isLoading, isPlaying, platform, text, setText, messages,
    onStart, onChangePlatform, TTSContext, childRef,
  };
};
