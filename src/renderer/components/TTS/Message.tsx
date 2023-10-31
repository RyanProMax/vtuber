import classnames from 'classnames';

export default ({ text, cost, status }: TTS.Message) => {
  return (
    <p className={classnames(
      'tts__message-item',
      `tts__message-item--${status}`
    )}>
      {text}
      <span className='tts__message-item__cost'>({cost}ms)</span>
    </p>
  );
};
