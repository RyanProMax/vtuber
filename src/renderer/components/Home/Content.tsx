import { Routes, Route } from 'react-router-dom';
import { IconSound } from '@arco-design/web-react/icon';

import TTS from './TTS';

export const Menus = [
  {
    path: '/',
    MenuElement: <>
      <IconSound /> TTS
    </>,
    Component: <TTS />,
  },
];

export default () => {
  return (
    <Routes>
      {Menus.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={Component}
        />
      ))}
      <Route path='*' element={'non match'} />
    </Routes>
  );
};
