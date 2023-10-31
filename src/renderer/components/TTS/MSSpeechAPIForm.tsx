import { Form, Select, Slider } from '@arco-design/web-react';
import { useContext, useEffect, useImperativeHandle } from 'react';

import { TTSContext } from 'src/renderer/hooks/useTTS';
import useMSSpeechApiTTS from 'src/renderer/hooks/useMSSpeechApiTTS';

const FormItem = Form.Item;
const Option = Select.Option;

export default ({ form }: TTS.ChildFormProps) => {
  const { text, childRef } = useContext(TTSContext)!;
  const {
    onTriggerTTS, onValuesChange, languages, voices,
    selectVoice, selectOptions,
  } = useMSSpeechApiTTS({ text, form });
  const { roleSamples, styleSamples } = selectVoice?.samples || {};

  useImperativeHandle(childRef, () => ({
    onTriggerTTS, onValuesChange,
  }));

  useEffect(() => {
    form.setFieldsValue(selectOptions);
  }, []);

  return (
    <>
      <FormItem label='Language' field='language'>
        <Select options={Object.values(languages)} />
      </FormItem>
      <FormItem label='Voice' field='voiceId'>
        <Select options={voices.map(item => ({
          label: item.properties.LocalName,
          value: item.id,
        }))}>
        </Select>
      </FormItem>
      {styleSamples?.length ? (
        <FormItem label='Style' field='styleName'>
          <Select placeholder='Please select'>
            {styleSamples.map((item) => (
              <Option key={item.styleName} value={item.styleName}>
                {item.styleName}
              </Option>
            ))}
          </Select>
        </FormItem>
      ) : null}
      {roleSamples?.length ? (
        <FormItem label='Role' field='roleName'>
          <Select placeholder='Please select'>
            {roleSamples.map((item) => (
              <Option key={item.roleName} value={item.roleName}>
                {item.roleName}
              </Option>
            ))}
          </Select>
        </FormItem>
      ) : null}
      <FormItem label='Rate' field='rate'>
        <Slider showInput max={300} />
      </FormItem>
      <FormItem label='Pitch' field='pitch'>
        <Slider showInput max={300} />
      </FormItem>
    </>
  );
};
