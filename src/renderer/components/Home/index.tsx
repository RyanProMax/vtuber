import { HashRouter } from 'react-router-dom';
import { upperFirst } from 'lodash-es';

import usePackageJson from 'src/renderer/hooks/usePackageJson';
import useDarkMode from 'src/renderer/hooks/useDarkMode';

import MenuBar from '../MenuBar';
import Sidebar from './Sidebar';
import Content from './Content';

import './index.less';

export default () => {
  const { theme, toggleTheme, ThemeIcon } = useDarkMode();
  const packageJson = usePackageJson();
  const title = packageJson
    ? `${packageJson.name.split('-').map(upperFirst).join('')} Ver: ${packageJson.version}`
    : '';

  return (
    <HashRouter>
      <div className='home'>
        <MenuBar
          title={title}
          minimize={true}
          maximize={true}
          customIcon={(
            <div className={'home__custom-container'}>
              <ThemeIcon onClick={toggleTheme} className={'menu-icon__item'} />
            </div>
          )}
        />
        <div className='home__main'>
          <Sidebar
            theme={theme}
            className='home__sidebar'
          />
          <Content />
        </div>
      </div>
    </HashRouter>
  );
};
