import React, { ReactElement, ReactNode } from 'react';
import {
  Tab as BaseTab,
  TabList as BaseTabList,
  TabPanel as BaseTabPanel,
  useTabState,
} from 'reakit';

import styles from './TabList.module.scss';

interface TabProps {
  title: string;
  children: ReactNode;
}

const Tab = ({ children }: TabProps) => <>{children}</>;

interface TabListProps {
  children: ReactElement<TabProps> | ReactElement<TabProps>[];
}

const TabList = ({ children, ...props }: TabListProps) => {
  const tab = useTabState();

  return (
    <>
      <BaseTabList {...tab} {...props} className={styles.tabList}>
        {React.Children.map(children, (child) => (
          <BaseTab {...tab} className={styles.tab}>
            {child.props.title}
          </BaseTab>
        ))}
      </BaseTabList>
      {React.Children.map(children, (child) => (
        <BaseTabPanel {...tab} className={styles.panel}>
          {child.props.children}
        </BaseTabPanel>
      ))}
    </>
  );
};

export { Tab, TabList };
export type { TabProps as ITabProps, TabListProps as ITabListProps };
