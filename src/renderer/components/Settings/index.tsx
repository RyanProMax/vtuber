import { useMemo } from 'react';
import { Form, Radio } from '@arco-design/web-react';

import { Platforms } from 'src/common/constant';
import useSettings from 'src/renderer/hooks/useSettings';

import OpenAIForm from './OpenAIForm';
import IFlyTekForm from './IFlyTekForm';

import './index.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

export default () => {
  const [form] = Form.useForm();

  const {
    platformOptions, selectOptions, options, onChangePlatformOptions,
    setPlatformSettings,
  } = useSettings({ form });

  const loadPlatformForm = useMemo(() => {
    switch (platformOptions.platform) {
      case Platforms.OpenAI: {
        return <OpenAIForm />;
      }
      case Platforms.IFlyTek: {
        return <IFlyTekForm />;
      }
      default: return null;
    }
  }, [platformOptions.platform]);

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
        {loadPlatformForm}
      </Form>
    </div>
  );
};
