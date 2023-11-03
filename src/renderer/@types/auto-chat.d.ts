import { FormInstance } from '@arco-design/web-react';

declare global {
  namespace AutoChat {
    type Context = {
      text: string
      childRef: React.MutableRefObject<ChildRef | undefined>
    } | null

    type ChildRef = {
      onTrigger: () => Promise<OnTriggerResponse>
      onValuesChange: (value: Partial<SelectOptions>) => void
    }

    type ChildFormProps = {
      form: FormInstance<any>
    }

    type ChatGPTSelectOptions = unknown

    type SelectOptions = ChatGPTSelectOptions

    type OnTriggerResponse = {
      cost: number
      data?: unknown
      error?: string
    }
  }
}
