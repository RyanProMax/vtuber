import { TTSStatus } from '../hooks/useTTS';
import { AutoChatStatus } from '../hooks/useAutoChat';

declare global {
  namespace Message {
    type Status = TTSStatus | AutoChatStatus

    type Item = {
      id: string,
      cost?: number
      text: string
      status: Status
    }
  }
}
