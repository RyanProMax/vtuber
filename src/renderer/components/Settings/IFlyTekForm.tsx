import { Form, Input } from '@arco-design/web-react';

const FormItem = Form.Item;

export default () => {
  return (
    <>
      <FormItem label='AppID' field='appid'>
        <Input.Password placeholder='Please Input Your AppID' />
      </FormItem>
      <FormItem label='APISecret' field='apiSecret'>
        <Input.Password placeholder='Please Input Your APISecret' />
      </FormItem>
      <FormItem label='APIKey' field='apiKey'>
        <Input.Password placeholder='Please Input Your APIKey' />
      </FormItem>
    </>
  );
};
