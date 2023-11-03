import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from '@arco-design/web-react';

import { THEME } from 'src/renderer/hooks/useDarkMode';

import { Menus } from './Content';

const MenuItem = Menu.Item;

type Props = {
  theme: THEME
  className?: string
};

export default ({ theme, className }: Props) => {
  const [selectedKeys, setSelectedKeys] = useState([Menus[0].path]);
  const location = useLocation();

  useEffect(() => {
    console.log('location', location);
    if (location.pathname !== selectedKeys[0]) {
      setSelectedKeys([location.pathname]);
    }
  }, [location]);

  return (
    <Menu
      collapse={false}
      theme={theme}
      selectedKeys={selectedKeys}
      className={className}
    >
      {Menus.map(({ path, MenuElement }) => (
        <Link key={path} to={path}>
          <MenuItem key={path}>
            {MenuElement}
          </MenuItem>
        </Link>
      ))}
    </Menu>
  );
};
