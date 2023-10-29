import { useState } from 'react';
import { Button, Input, Empty } from '@arco-design/web-react';
import { IconMusic } from '@arco-design/web-react/icon';

import useTTS from 'src/renderer/hooks/useTTS';

import History from './History';

import './index.less';

export default () => {
  const [text, setText] = useState('你好呀旅行者');
  const {
    history, isReady, isLoading, isPlaying,
    onStart,
  } = useTTS();

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.code === 'Enter') {
      handleStart();
    }
  };

  const handleStart = () => onStart({
    text, voice: 'zh-CN-XiaoxiaoNeural',
    express: 'affectionate',
  });

  return (
    <div className='tts'>
      <div className='tts__left'>
        <div className='tts__content'>
          {history.length ? history.map(item => (
            <History key={item.id} {...item} />
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
            onClick={handleStart}
            disabled={!isReady}
          >
            {isPlaying ? (
              <IconMusic />
            ) : isLoading ? 'Loading' : 'Send'}
          </Button>
        </Input.Group>
      </div>

      <div className='tts__right'>

      </div>
    </div>
  );
};
