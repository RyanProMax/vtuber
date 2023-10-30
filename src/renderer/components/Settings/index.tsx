import { Form, Input, Radio } from '@arco-design/web-react';

import useSettings from 'src/renderer/hooks/useSettings';

import './index.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

export default () => {
  const [form] = Form.useForm();

  const {
    selectOptions, onChangeFields, options, onChangePlatform
  } = useSettings();

  console.log('selectOptions', selectOptions);
  console.log('options', options);

  return (
    <div className='settings'>
      <Form
        form={form}
        initialValues={selectOptions}
        onValuesChange={onChangeFields}
        autoComplete='off'
        className={'settings__form'}
      >
        <FormItem label='Platform'>
          <RadioGroup value={selectOptions.platform} options={options.platforms} onChange={onChangePlatform} />
        </FormItem>
        <FormItem label='Type' field='settingType'>
          <RadioGroup options={options.types} />
        </FormItem>
        <FormItem label='AppID' field='appID'>
          <Input placeholder='Please Input Your AppID' />
        </FormItem>
        <FormItem label='APISecret' field='apiSecret'>
          <Input placeholder='Please Input Your APISecret' />
        </FormItem>
        <FormItem label='APIKey' field='apiKey'>
          <Input placeholder='Please Input Your APIKey' />
        </FormItem>
      </Form>
    </div>
  );
};
