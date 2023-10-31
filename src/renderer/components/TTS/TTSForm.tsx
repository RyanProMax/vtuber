import { useContext, useMemo } from 'react';
import { Form, Select } from '@arco-design/web-react';

import { Platforms, TTSContext } from 'src/renderer/hooks/useTTS';

import MSSpeechAPIForm from './MSSpeechAPIForm';

const FormItem = Form.Item;

export default ({
  platform, onChangePlatform, className,
}: {
  platform: Platforms
  onChangePlatform: (platform: Platforms) => void
  className?: string
}) => {
  const { childRef } = useContext(TTSContext)!;
  const [form] = Form.useForm();

  const loadPlatform = useMemo(() => {
    switch (platform) {
      case Platforms.MicrosoftSpeechAPI: {
        return (
          <MSSpeechAPIForm
            form={form}
          />
        );
      }
      default: return null;
    }
  }, [platform]);

  return (
    <Form
      form={form}
      onValuesChange={value => childRef.current?.onValuesChange(value)}
      layout='vertical'
      autoComplete='off'
      className={className}
    >
      <FormItem label='Platform'>
        <Select value={platform} onChange={onChangePlatform} options={Object.values(Platforms)} />
      </FormItem>
      {/* different platform hook */}
      {loadPlatform}
    </Form>
  );
};
