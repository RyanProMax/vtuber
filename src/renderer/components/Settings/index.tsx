import { Form, Input, Radio } from '@arco-design/web-react';
import { useEffect } from 'react';

import useSettings from 'src/renderer/hooks/useSettings';

import './index.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

export default () => {
  const [form] = Form.useForm();

  const {
    platformOptions, selectOptions, options, onChangePlatformOptions,
    getPlatformSettings, setPlatformSettings,
  } = useSettings();

  console.log('selectOptions', selectOptions);
  console.log('options', options);

  useEffect(() => {
    (async () => {
      const formData = await getPlatformSettings();
      form.setFieldsValue(formData);
    })();
  }, []);

  return (
    <div className='settings'>
      <Form
        form={form}
        initialValues={selectOptions}
        onValuesChange={setPlatformSettings}
        autoComplete='off'
        className={'settings__form'}
      >
        <FormItem label='Platform'>
          <RadioGroup value={platformOptions.platform} options={options.platforms} onChange={v => onChangePlatformOptions({ platform: v })} />
        </FormItem>
        <FormItem label='Type'>
          <RadioGroup value={platformOptions.settingType} options={options.types} onChange={v => onChangePlatformOptions({ settingType: v })} />
        </FormItem>
        <FormItem label='AppID' field='appid'>
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
