import { useContext, useMemo } from 'react';
import { Form, Select } from '@arco-design/web-react';

import { AutoChatContext, AutoChatPlatforms } from 'src/renderer/hooks/useAutoChat';

const FormItem = Form.Item;

export default ({
  platform, onChangePlatform, className,
}: {
  platform: AutoChatPlatforms
  onChangePlatform: (platform: AutoChatPlatforms) => void
  className?: string
}) => {
  const { childRef } = useContext(AutoChatContext)!;
  const [form] = Form.useForm();

  const loadPlatform = useMemo(() => {
    switch (platform) {
      case AutoChatPlatforms.OpenAI: {
        return null;
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
        <Select value={platform} onChange={onChangePlatform} options={Object.values(AutoChatPlatforms)} />
      </FormItem>
      {/* different platform hook */}
      {loadPlatform}
    </Form>
  );
};
