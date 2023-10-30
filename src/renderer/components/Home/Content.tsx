import { Routes, Route } from 'react-router-dom';
import { IconSound, IconSettings } from '@arco-design/web-react/icon';

import TTS from 'src/renderer/components/TTS';
import Settings from 'src/renderer/components/Settings';

export const Menus = [
  {
    path: '/',
    MenuElement: <>
      <IconSound /> TTS
    </>,
    Component: <TTS />,
  },
  {
    path: '/settings',
    MenuElement: <>
      <IconSettings /> Settings
    </>,
    Component: <Settings />,
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
