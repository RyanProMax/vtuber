import { FormInstance } from '@arco-design/web-react';
import Languages from 'src/common/langs';
import { TTSStatus } from 'src/renderer/hooks/useTTS';

declare global {
  namespace TTS {
    type Context = {
      text: string
      childRef: React.MutableRefObject<ChildRef | undefined>
    } | null

    type ChildRef = {
      onTriggerTTS: () => Promise<MSSpeechApiResponse>
      onValuesChange: (value: Partial<SelectOptions>) => void
    }

    type SSMLConvertRequest = {
      text: string
      voice: string
      style?: string
      role?: string
      rate?: number
      pitch?: number
    }

    type AudioData = Buffer;
    type MSSpeechAPIResponse = {
      data: AudioData
    };

    type GetAudioResult = {
      cost: number
      data: AudioData
    } | null

    type Message = {
      id: string,
      cost: number
      text: string
      status: TTSStatus
    }

    type MSSpeechApiProps = {
      text: string
      form: FormInstance<any>
    }

    type MSSpeechApiSelectOptions = {
      language: Languages
      voiceId: string,
      styleName: string,
      roleName: string,
      rate: number,
      pitch: number,
    }

    type MSSpeechApiRequest = SSMLConvertRequest & {
      startTime?: number
      retryCount?: number
      retryInterval?: number
    }

    type MSSpeechApiResponse = {
      cost: number
      data: AudioData
    } | null

    type SelectOptions = MSSpeechApiSelectOptions
  }
}
