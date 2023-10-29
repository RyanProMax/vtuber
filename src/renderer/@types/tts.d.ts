import Languages from 'src/common/langs';
import Voices from 'src/common/voices';
import { TTSStatus } from 'src/renderer/hooks/useTTS';

declare global {
  namespace TTS {
    type SSMLConvertRequest = {
      text: string
      voice: string
      style?: string
      role?: string
      rate?: number
      pitch?: number
    }

    type StartRequest = SSMLConvertRequest & {
      startTime?: number
      retryCount?: number
      retryInterval?: number
    };

    type StartResponse = {
      cost: number
      data: AudioData
    } | null

    type AudioData = Buffer;
    type MSSpeechAPIResponse = {
      data: AudioData
    };

    type GetAudioResult = {
      cost: number
      data: AudioData
    } | null

    type HistoryItem = {
      id: string,
      cost: number
      text: string
      status: TTSStatus
    }

    type SelectOptions = {
      language: Languages
      voiceId: string,
      styleName: string,
      roleName: string,
      rate: number,
      pitch: number,
    }

    type Options = {
      languages: { key: string, value: string }[]
      voices: typeof Voices
    }
  }
}
