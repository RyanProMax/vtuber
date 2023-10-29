import { Button, Input, Empty, Form } from '@arco-design/web-react';
import { IconMusic } from '@arco-design/web-react/icon';

import useTTS, { getFilterVoices } from 'src/renderer/hooks/useTTS';

import History from './History';
import TTSForm from './TTSForm';

import './index.less';

export default () => {
  const [form] = Form.useForm();
  const {
    history, isReady, isLoading, isPlaying, onStart,
    selectOptions, setSelectOptions, options, text, setText,
  } = useTTS();

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.code === 'Enter') {
      onStart();
    }
  };

  const onValuesChange = (value: Partial<TTS.SelectOptions>) => {
    setSelectOptions(oldV => ({
      ...oldV,
      ...value,
    }));
    if (Object.keys(value)[0] === 'language') {
      const filterVoices = getFilterVoices(value.language!);
      form.setFieldValue('voice', filterVoices[0]?.id || '');
    }
  };

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
            onClick={onStart}
            disabled={!isReady}
          >
            {isPlaying ? (
              <IconMusic />
            ) : isLoading ? 'Loading' : 'Send'}
          </Button>
        </Input.Group>
      </div>
      <TTSForm
        form={form}
        initialValues={selectOptions}
        onValuesChange={onValuesChange}
        options={options}
        className='tts__right'
      />
    </div>
  );
};
