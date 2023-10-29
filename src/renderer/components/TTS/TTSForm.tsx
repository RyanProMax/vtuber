import { Form, Select, Slider } from '@arco-design/web-react';

import { getVoice } from 'src/renderer/hooks/useTTS';

const FormItem = Form.Item;
const Option = Select.Option;

export default ({
  form, initialValues, options, onValuesChange,
  className,
}: {
  form: any,
  initialValues: TTS.SelectOptions
  options: TTS.Options
  onValuesChange: (
    value: Partial<TTS.SelectOptions>,
    values: Partial<TTS.SelectOptions>
  ) => void
  className?: string
}) => {
  const voice = getVoice(initialValues.voiceId);
  const { roleSamples, styleSamples } = voice?.samples || {};

  return (
    <Form
      form={form}
      initialValues={initialValues}
      onValuesChange={onValuesChange}
      layout='vertical'
      autoComplete='off'
      className={className}
    >
      <FormItem label='Language' field='language'>
        <Select placeholder='Please select'>
          {options.languages.map((item) => (
            <Option key={item.key} value={item.value}>
              {item.value}
            </Option>
          ))}
        </Select>
      </FormItem>
      <FormItem label='Voice' field='voiceId'>
        <Select placeholder='Please select'>
          {options.voices.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.properties.LocalName}
            </Option>
          ))}
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
    </Form>
  );
};
