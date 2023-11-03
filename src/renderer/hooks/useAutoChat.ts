import { createContext, useRef, useState } from 'react';
import log from 'electron-log/renderer';
import { v4 } from 'uuid';

const AutoChatLogger = log.scope('AutoChat');

export enum AutoChatStatus {
  Ready = 'ready',
  Question = 'question',
  Loading = 'loading',
  Playing = 'playing',
  Done = 'done',
  Error = 'error',
}

export enum AutoChatPlatforms {
  OpenAI = 'OpenAI',
}

export const AutoChatContext = createContext<AutoChat.Context>(null);

export default () => {
  const childRef = useRef<AutoChat.ChildRef>();

  // status
  const [status, setStatus] = useState(AutoChatStatus.Ready);
  const [messages, setMessages] = useState<Message.Item[]>([]);
  const isReady = status === AutoChatStatus.Ready;
  const isLoading = status === AutoChatStatus.Loading;
  const isPlaying = status === AutoChatStatus.Playing;

  // config
  const [text, setText] = useState('你好呀旅行者');
  const [platform, onChangePlatform] = useState(AutoChatPlatforms.OpenAI);

  const onStart = async () => {
    if (status !== AutoChatStatus.Ready) {
      return false;
    }

    const startTime = Date.now();
    try {
      AutoChatLogger.info('onStart');
      setMessages(h => ([...h, {
        id: v4(),
        text,
        status: AutoChatStatus.Question,
      }]));

      setStatus(AutoChatStatus.Loading);

      if (!childRef.current?.onTrigger) {
        throw new Error('onTrigger not define');
      }

      const result = await childRef.current.onTrigger();
      AutoChatLogger.info('onTrigger result', result);

      const { cost, data, error } = result;
      if (error) {
        throw new Error(error);
      }
      if (!data) {
        throw new Error('result is empty');
      }

      setMessages(h => ([...h, {
        id: v4(), text, cost,
        status: AutoChatStatus.Done,
      }]));

      return true;
    } catch (e) {
      AutoChatLogger.error('start error', e);

      setMessages(h => ([...h, {
        id: v4(),
        text: (e as any).message || '服务异常，请稍后再试',
        cost: Date.now() - startTime,
        status: AutoChatStatus.Error,
      }]));

      return false;
    } finally {
      setStatus(AutoChatStatus.Ready);
    }
  };

  return {
    isReady, isLoading, isPlaying, platform, text, setText, messages,
    onStart, onChangePlatform, AutoChatContext, childRef,
  };
};
