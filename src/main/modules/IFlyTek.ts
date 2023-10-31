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
      let buffer = Buffer.alloc(0);
      await new Promise((_resolve, reject) => {
        if (!this.ws) {
          const { appid, apiKey, apiSecret }: Settings.IFlyTekSelectOptions =
            this.controller?.store?.userStore.get(this.ttsKey) as Settings.IFlyTekSelectOptions || {};
          if (!appid || !apiKey || !apiSecret) {
            reject(new Error('IFlyTek options not define'));
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
            _resolve(null);
          });

          this.ws.on('close', () => {
            this.logger.info('connect close');
            this.ws = undefined;
          });

          this.ws.on('error', (err) => {
            this.logger.error('ws error', err);
          });
        }
      });

      return new Promise((resolve, reject) => {
        if (!this.ws) {
          reject(new Error('ws not define'));
          return;
        }
        this.ws.on('message', (data, err) => {
          this.logger.info('message', data, err);

          if (err) {
            reject(new Error('ws message error'));
            return;
          }

          const res = JSON.parse(data as unknown as string);

          if (res.code != 0) {
            this.ws?.close();
            reject(new Error(`${res.code}: ${res.message}`));
            return;
          }

          const audio = res.data.audio;
          buffer = Buffer.concat([buffer, Buffer.from(audio, 'base64')]);

          if (res.code == 0 && res.data.status == 2) {
            this.ws?.close();
            resolve({
              cost: Date.now() - startTime,
              data: buffer,
            });
          }
        });

        const {
          text, role, speed = 50, volume = 50,
          pitch = 50,
        } = params;
        this.ws.send(JSON.stringify({
          common: {
            app_id: this.config!.appid
          },
          business: {
            // raw: unzip pcm or wav, can not use audio to play
            // lame: mp3 format
            aue: 'lame',
            auf: 'audio/L16;rate=16000',
            tte: 'UTF8',
            vcn: role,
            speed, // [0-100], default: 50
            volume, // [0-100], default: 50
            pitch, // [0-100], default: 50
            // engine_type: 'intp65',
          },
          data: {
            text: Buffer.from(text).toString('base64'),
            status: 2
          }
        }));
      });
    } catch (err) {
      this.logger.error('start ws error', err);

      return {
        cost: Date.now() - startTime,
        error: (err as any).message
      };
    }
  }
}
