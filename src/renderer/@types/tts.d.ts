type SSMLConvertRequest = {
  text: string
  voice: string
  express: string
  role?: string
  rate?: number
  pitch?: number
}

type TTSRequest = SSMLConvertRequest & {
  retryCount?: number
  retryInterval?: number
};
