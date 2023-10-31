import { ipcMain } from 'electron';
import axios from 'axios';
import { logger } from '../utils/logger';
import { Channels } from '../../common/constant';
import { sleep } from '../utils';

export default class MSSpeech {
  logger = logger.scope('MSSpeech');

  private buffer = Buffer.alloc(0);

  register() {
    ipcMain.handle(Channels.StartMSSpeechApi, (_, params: TTS.MSSpeechApiRequest) => {
      return this.start(params);
    });
  }

  private resetBuffer() {
    this.buffer = Buffer.alloc(0);
  }

  async start(params: TTS.MSSpeechApiRequest): Promise<TTS.MSSpeechApiResponse> {
    this.resetBuffer();
    const result = await this.getAudio(params);
    if (result?.data.length) {
      this.buffer = Buffer.concat([this.buffer, result.data]);
    }
    if (this.buffer.length > 0) {
      return {
        cost: result!.cost,
        data: this.buffer,
      };
    }
    return null;
  }

  async getAudio({
    startTime = Date.now(), retryCount = 0, retryInterval = 1000,
    ...params
  }: TTS.MSSpeechApiRequest): Promise<TTS.GetAudioResult> {
    try {
      const SSML = this.convertToSSML(params);
      console.log(SSML, retryCount, retryInterval);
      const buffer = await this.fetchMSSpeechAPI(SSML);
      this.logger.info('fetch MSSpeech API success', buffer.length);

      return {
        cost: Date.now() - startTime,
        data: buffer
      };
    } catch (e) {
      this.logger.error('fetch MSSpeech API failed', e, retryCount);
      if (retryCount > 0) {
        await sleep(retryInterval);
        return this.getAudio({
          startTime,
          retryCount: retryCount - 1,
          retryInterval,
          ...params,
        });
      } else {
        return null;
      }
    }
  }

  private convertToSSML({
    text, voice, style = '', role = '',
    rate = 100, pitch = 100,
  }: TTS.SSMLConvertRequest) {
    return `
      <speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US">
        <voice name="${voice}">
          <mstts:express-as ${style ? `style="${style}"` : ''} ${role ? `role="${role}"` : ''}>
            <prosody rate="${rate - 100}%" pitch="${pitch - 100}%">
              ${text}
            </prosody>
          </mstts:express-as>
        </voice>
      </speak>
    `;
  }

  private async fetchMSSpeechAPI(SSML: string) {
    const result: TTS.MSSpeechApiRawResponse = await axios({
      url: 'https://southeastasia.api.speech.microsoft.com/accfreetrial/texttospeech/acc/v3.0-beta1/vcg/speak',
      method: 'post',
      responseType: 'arraybuffer',
      headers: {
        authority: 'southeastasia.api.speech.microsoft.com',
        accept: '*/*',
        'accept-language': 'zh-CN,zh;q=0.9',
        customvoiceconnectionid: 'uuidv4()',
        origin: 'https://speech.microsoft.com',
        'sec-ch-ua':
          '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
        'content-type': 'application/json',
      },
      data: JSON.stringify({
        ssml: SSML,
        ttsAudioFormat: 'audio-24khz-160kbitrate-mono-mp3',
        offsetInPlainText: 0,
        properties: {
          SpeakTriggerSource: 'AccTuningPagePlayButton',
        },
      }),
    });

    return result.data;
  }
}
