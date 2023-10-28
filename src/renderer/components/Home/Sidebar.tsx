import { useState } from 'react';
import { Link } from 'react-router-dom';
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

  return (
    <Menu
      collapse={false}
      theme={theme}
      selectedKeys={selectedKeys}
      onClickMenuItem={key => setSelectedKeys([key])}
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
