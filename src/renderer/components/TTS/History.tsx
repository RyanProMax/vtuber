import classnames from 'classnames';

export default ({ text, cost, status }: TTS.HistoryItem) => {
  return (
    <p className={classnames(
      'tts__history-item',
      `tts__history-item--${status}`
    )}>
      {text}
      <span className='tts__history-item__cost'>({cost}ms)</span>
    </p>
  );
};
