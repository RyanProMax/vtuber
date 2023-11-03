import { Button, Input, Empty } from '@arco-design/web-react';
import { IconMusic } from '@arco-design/web-react/icon';

import useAutoChat from 'src/renderer/hooks/useAutoChat';

import Message from '../Message';
import SettingForm from './SettingForm';

import './index.less';

export default () => {
  const {
    isReady, isLoading, isPlaying, platform, text, setText, messages,
    onStart, onChangePlatform, AutoChatContext, childRef,
  } = useAutoChat();

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.code === 'Enter') {
      onStart();
    }
  };

  return (
    <AutoChatContext.Provider value={{
      text, childRef,
    }}>
      <div className='tts'>
        <div className='tts__left'>
          <div className='tts__content'>
            {messages.length ? messages.map(msg => (
              <Message key={msg.id} {...msg} />
            )) : (
              <Empty className={'tts__content-empty'} />
            )}
          </div>
          <Input.Group compact className={'tts__input-group'}>
            <Input
              value={text}
              onChange={setText}
              onKeyDown={onKeyDown}
              placeholder='Please enter'
              className={'tts__input'}
              disabled={!isReady}
            />
            <Button
              type='primary'
              loading={isLoading}
              onClick={onStart}
              disabled={!isReady}
            >
              {isPlaying ? (
                <IconMusic />
              ) : isLoading ? 'Loading' : 'Send'}
            </Button>
          </Input.Group>
        </div>
        <SettingForm
          platform={platform}
          onChangePlatform={onChangePlatform}
          className='tts__right'
        />
      </div>
    </AutoChatContext.Provider>
  );
};
