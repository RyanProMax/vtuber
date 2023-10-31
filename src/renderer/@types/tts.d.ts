import { FormInstance } from '@arco-design/web-react';
import Languages from 'src/common/langs';
import { TTSStatus } from 'src/renderer/hooks/useTTS';
import { RoleValue } from 'src/renderer/hooks/useIFlyTek';

declare global {
  namespace TTS {
    type Context = {
      text: string
      childRef: React.MutableRefObject<ChildRef | undefined>
    } | null

    type ChildRef = {
      onTriggerTTS: () => Promise<OnTriggerTTSResponse>
      onValuesChange: (value: Partial<SelectOptions>) => void
    }

    type ChildFormProps = {
      form: FormInstance<any>
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

    type HookProps = {
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
      data: AudioData
    }

    type IFlyTekSelectOptions = {
      role: RoleValue
      speed: number
      volume: number
      pitch: number
    }

    type IFlyTekConfig = {
      hostUrl: string
      host: string
      uri: string
      appid: string
      apiSecret: string
      apiKey: string
    }

    type IFlyTekApiRequest = {
      text: string
    } & IFlyTekSelectOptions

    type OnTriggerTTSResponse = {
      cost: number
      data?: AudioData
      error?: string
    }

    type SelectOptions = MSSpeechApiSelectOptions | IFlyTekSelectOptions
  }
}
