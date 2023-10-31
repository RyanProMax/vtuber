import { ipcMain } from 'electron';
import WebSocket from 'ws';
import CryptoJS from 'crypto-js';

import { Controller } from './Controller';
import { logger } from '../utils/logger';
import { Channels, Platforms, SettingTypes } from '../../common/constant';

export default class IFlyTek {
  logger = logger.scope('IFlyTek');
  controller: Controller;

  ttsKey = `${Platforms.IFlyTek}_${SettingTypes.TTS}`;
  private ws?: WebSocket;
  private config?: TTS.IFlyTekConfig;

  constructor(controller: Controller) {
    this.controller = controller;
  }

  register() {
    ipcMain.handle(Channels.StartIFlyTekTTSApi, (_, params: TTS.IFlyTekApiRequest) => {
      return this.start(params);
    });
  }

  // auth sign
  getAuthStr() {
    if (!this.config) {
      throw new Error('IFlyTek options not define');
    }
    const { host, uri, apiKey, apiSecret } = this.config;
    const date = new Date().toUTCString();
    const signatureOrigin = `host: ${host}\ndate: ${date}\nGET ${uri} HTTP/1.1`;
    const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret);
    const signature = CryptoJS.enc.Base64.stringify(signatureSha);
    const authorizationOrigin = `api_key="${apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;
    const authStr = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(authorizationOrigin));
    return `${authStr}&date=${date}&host=${host}`;
  }

  async start(params: TTS.IFlyTekApiRequest): Promise<TTS.OnTriggerTTSResponse> {
    const startTime = Date.now();
    try {
      if (!this.ws) {
        const { appid, apiKey, apiSecret }: Settings.IFlyTekSelectOptions =
          this.controller?.store?.userStore.get(this.ttsKey) as Settings.IFlyTekSelectOptions || {};
        if (!appid || !apiKey || !apiSecret) {
          throw new Error('IFlyTek options not define');
        }
        // https://www.xfyun.cn/doc/tts/online_tts/API.html
        this.config = {
          hostUrl: 'wss://tts-api.xfyun.cn/v2/tts',
          host: 'tts-api.xfyun.cn',
          uri: '/v2/tts',
          appid,
          apiSecret,
          apiKey,
        };
        const wssUrl = `${this.config.hostUrl}?authorization=${this.getAuthStr()}`;
        this.ws = new WebSocket(wssUrl);

        this.ws.on('open', () => {
          this.logger.info('websocket connect');
        });

        this.ws.on('close', () => {
          this.logger.info('connect close');
          this.ws = undefined;
        });

        this.ws.on('error', (err) => {
          this.logger.error('ws error', err);
        });
      }

      const p: Promise<TTS.OnTriggerTTSResponse> = new Promise(resolve => {
        if (!this.ws) {
          resolve({ cost: Date.now() - startTime, error: 'ws not define' });
          return;
        }
        this.ws.on('message', (data, err) => {
          try {
            this.logger.info('message', data, err);

            if (err) {
              throw new Error('ws message error');
            }

            const res = JSON.parse(data as unknown as string);

            if (res.code != 0) {
              this.ws?.close();
              throw new Error(`${res.code}: ${res.message}`);
            }

            const audio = res.data.audio;
            const audioBuffer = Buffer.from(audio, 'base64');
            resolve({
              cost: Date.now() - startTime,
              data: audioBuffer,
            });

            if (res.code == 0 && res.data.status == 2) {
              this.ws?.close();
            }
          } catch (e) {
            this.logger.error('message error', e);
            resolve({ cost: Date.now() - startTime, error: (e as any).message });
          }
        });
      });

      this.ws.send(JSON.stringify({
        common: {
          app_id: this.config!.appid
        },
        business: {
          aue: 'raw',
          auf: 'audio/L16;rate=16000',
          vcn: 'xiaoyan',
          tte: 'UTF8'
        },
        data: {
          text: Buffer.from(params.text).toString('base64'),
          status: 2
        }
      }));

      return p;
    } catch (err) {
      this.logger.error('start ws error', err);

      return {
        cost: Date.now() - startTime,
        error: (err as any).message
      };
    }
  }
}
