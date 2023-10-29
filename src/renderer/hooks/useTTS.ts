import { useRef, useState } from 'react';
import { v4 } from 'uuid';

import { Channels } from 'src/common/constant';
import { ipcRenderer } from 'src/renderer/utils';

export enum TTSStatus {
  Ready = 'ready',
  Loading = 'loading',
  Playing = 'playing',
  Done = 'done',
}

export default () => {
  const audioRef = useRef<HTMLAudioElement>();
  const [status, setStatus] = useState(TTSStatus.Ready);
  const [history, setHistory] = useState<TTS.HistoryItem[]>([]);
  const isReady = status === TTSStatus.Ready;
  const isLoading = status === TTSStatus.Loading;
  const isPlaying = status === TTSStatus.Playing;

  const onStart = async ({ text }: TTS.SSMLConvertRequest) => {
    if (status !== TTSStatus.Ready) {
      return false;
    }

    setStatus(TTSStatus.Loading);
    const result: TTS.StartResponse = await ipcRenderer.invoke(Channels.StartTTS, {
      text,
      voice: 'zh-CN-XiaoxiaoNeural',
      express: 'affectionate',
      retryCount: 10,
    } as TTS.StartRequest);

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
      setStatus(TTSStatus.Ready);
      return play_result;
    }
    return false;
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
    history, status, isReady, isLoading, isPlaying,
    onStart,
  };
};
