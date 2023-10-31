import { useContext, useMemo } from 'react';
import { Form, Select } from '@arco-design/web-react';

import { TTSPlatforms, TTSContext } from 'src/renderer/hooks/useTTS';

import MSSpeechAPIForm from './MSSpeechAPIForm';
import IFlyTekForm from './IFlyTekForm';

const FormItem = Form.Item;

export default ({
  platform, onChangePlatform, className,
}: {
  platform: TTSPlatforms
  onChangePlatform: (platform: TTSPlatforms) => void
  className?: string
}) => {
  const { childRef } = useContext(TTSContext)!;
  const [form] = Form.useForm();

  const loadPlatform = useMemo(() => {
    switch (platform) {
      case TTSPlatforms.MicrosoftSpeechAPI: {
        return <MSSpeechAPIForm form={form} />;
      }
      case TTSPlatforms.IFlyTek: {
        return <IFlyTekForm form={form} />;
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
        <Select value={platform} onChange={onChangePlatform} options={Object.values(TTSPlatforms)} />
      </FormItem>
      {/* different platform hook */}
      {loadPlatform}
    </Form>
  );
};
