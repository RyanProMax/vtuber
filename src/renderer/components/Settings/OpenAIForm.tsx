import { Form, Input } from '@arco-design/web-react';

const FormItem = Form.Item;

export default () => {
  return (
    <>
      <FormItem label='APIKey' field='apiKey'>
        <Input.Password placeholder='Please Input Your APIKey' />
      </FormItem>
    </>
  );
};
