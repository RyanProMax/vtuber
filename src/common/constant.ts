export enum Pages {
  Home = 'home.html',
  About = 'about.html',
  Update = 'update.html',
}

export enum Channels {
  // main events
  Close = 'Close',
  Quit = 'Quit',
  Minimize = 'Minimize',
  Maximize = 'Maximize',
  GetPackageJson = 'GetPackageJson',
  OpenExternal = 'OpenExternal',
  Broadcast = 'Broadcast',
  ToggleTheme = 'ToggleTheme',
  Render = 'Render',

  // app updater
  AppUpdaterConfirm = 'AppUpdaterConfirm',
  AppUpdaterProgress = 'AppUpdaterProgress',
  AppUpdaterAbort = 'AppUpdaterAbort',

  // store
  GetUserStore = 'GetUserStore',
  SetUserStore = 'SetUserStore',

  // sub window
  AboutMe = 'AboutMe',

  // MSSpeech Api
  StartMSSpeechApi = 'StartMSSpeechApi',

  // IFlyTek Api
  StartIFlyTekTTSApi = 'StartIFlyTekTTSApi',
}

export enum Platforms {
  OpenAI = 'OpenAI',
  IFlyTek = 'IFlyTek',
}

export enum SettingTypes {
  AutoChat = 'AutoChat',
  TTS = 'TTS',
}
