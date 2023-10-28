import { ipcMain } from 'electron';
import axios from 'axios';
import { logger } from '../utils/logger';
import { Channels } from '../../common/constant';

export enum TTSInputType {
  Text,
  SSML,
}

export default class TTS {
  logger = logger.scope('TTS');

  private buffer = Buffer.alloc(0);

  register() {
    ipcMain.handle(Channels.StartTTS, (_, params: TTSRequest) => {
      return this.start(params);
    });
  }

  private resetBuffer() {
    this.buffer = Buffer.alloc(0);
  }

  async start(params: TTSRequest) {
    this.resetBuffer();
    const _buffer = await this.getAudio(params);
    if (_buffer?.length > 0) {
      this.buffer = Buffer.concat([this.buffer, _buffer]);
    }
    return this.buffer;
    // if (this.buffer.length > 0) {
    //   const audioBlob = new Blob([this.buffer]);
    //   const url = URL.createObjectURL(audioBlob);
    //   this.logger.info('url', url);
    //   return url;
    // }
    // return null;
  }

  async getAudio({
    retryCount = 0, retryInterval = 1000, ...params
  }: TTSRequest) {
    try {
      const SSML = this.convertToSSML(params);
      console.log(SSML, retryCount, retryInterval);
      const result = await this.fetchMSSpeechAPI(SSML);
      this.logger.info('fetch MSSpeech API success');
      return result;
    } catch (e) {
      this.logger.error('Failed', e);
      if (retryCount > 0) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(this.getAudio({
              retryCount: retryCount - 1,
              retryInterval,
              ...params,
            }));
          }, retryInterval);
        });
      } else {
        return null;
      }
    }
  }

  private convertToSSML({
    text, voice, express, role = '',
    rate = 0, pitch = 0,
  }: SSMLConvertRequest) {
    return `
      <speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US">
        <voice name="${voice}">
          <mstts:express-as ${express != '' ? 'style="' + express + '"' : ''} ${role != '' ? 'role="' + role + '"' : ''}>
            <prosody rate="${rate}%" pitch="${pitch}%">
              ${text}
            </prosody>
          </mstts:express-as>
        </voice>
      </speak>
    `;
  }

  private async fetchMSSpeechAPI(SSML: string) {
    const result = await axios({
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
