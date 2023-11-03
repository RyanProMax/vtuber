import { Form, Select, Slider } from '@arco-design/web-react';
import { useContext, useEffect, useImperativeHandle } from 'react';

import { TTSContext } from 'src/renderer/hooks/useTTS';
import useIFlyTek from 'src/renderer/hooks/useIFlyTek';

const FormItem = Form.Item;

export default ({ form }: TTS.ChildFormProps) => {
  const { text, childRef } = useContext(TTSContext)!;
  const {
    onTrigger, onValuesChange, selectOptions, roles
  } = useIFlyTek({ text, form });

  useImperativeHandle(childRef as any, () => ({
    onTrigger, onValuesChange,
  }));

  useEffect(() => {
    form.setFieldsValue(selectOptions);
  }, []);

  return (
    <>
      <FormItem label='Role' field='role'>
        <Select options={roles} />
      </FormItem>
      <FormItem label='Speed' field='speed'>
        <Slider showInput max={100} />
      </FormItem>
      <FormItem label='Volume' field='volume'>
        <Slider showInput max={100} />
      </FormItem>
      <FormItem label='Pitch' field='pitch'>
        <Slider showInput max={100} />
      </FormItem>
    </>
  );
};
