import { Form } from '@arco-design/web-react';
import { useContext, useEffect, useImperativeHandle } from 'react';

import { TTSContext } from 'src/renderer/hooks/useTTS';
import useIFlyTek from 'src/renderer/hooks/useIFlyTek';

const FormItem = Form.Item;

export default ({ form }: TTS.ChildFormProps) => {
  const { text, childRef } = useContext(TTSContext)!;
  const {
    onTriggerTTS, onValuesChange, selectOptions
  } = useIFlyTek({ text, form });

  useImperativeHandle(childRef, () => ({
    onTriggerTTS, onValuesChange,
  }));

  useEffect(() => {
    form.setFieldsValue(selectOptions);
  }, []);

  return (
    <>
      <FormItem label='Language' field='language'>
        {/* <Select options={Object.values(languages)} /> */}
      </FormItem>
    </>
  );
};
