import { TTSStatus } from '../hooks/useTTS';

declare global {
  namespace TTS {
    type SSMLConvertRequest = {
      text: string
      voice: string
      express: string
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
  }
}
