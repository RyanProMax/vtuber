import { Form, Select } from '@arco-design/web-react';

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
      <FormItem label='Voice' field='voice'>
        <Select placeholder='Please select'>
          {options.voices.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.properties.LocalName}
            </Option>
          ))}
        </Select>
      </FormItem>
    </Form>
  );
};
