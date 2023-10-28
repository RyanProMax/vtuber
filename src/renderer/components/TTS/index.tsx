import { useState } from 'react';
import { Button } from '@arco-design/web-react';

import { ipcRenderer } from 'src/renderer/utils';
import { Channels } from 'src/common/constant';

export default () => {
  const [url, setUrl] = useState('');

  const onStart = async () => {
    const buffer = await ipcRenderer.invoke(Channels.StartTTS, {
      text: '你好呀，旅行者111',
      voice: 'zh-CN-XiaoxiaoNeural',
      express: 'affectionate',
      retryCount: 10,
    } as TTSRequest);
    console.log('buffer', buffer);
    if (buffer.length > 0) {
      const audioBlob = new Blob([buffer]);
      console.log('audioBlob', audioBlob);
      const _url = URL.createObjectURL(audioBlob);
      console.log('onstart', _url);
      setUrl(_url);
    }
  };

  console.log('url', url);

  return (
    <div className='home__content'>
      {url ? (
        <audio
          src={url}
          controls
        />
      ) : null}
      <Button onClick={onStart}>
        Start
      </Button>
    </div>
  );
};
