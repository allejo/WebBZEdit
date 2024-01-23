import React, { ReactElement, ReactNode } from 'react';
import {
  Tab as BaseTab,
  TabList as BaseTabList,
  TabPanel as BaseTabPanel,
  useTabState,
} from 'reakit';

import { classList } from '../Utilities/cssClasses';

import styles from './TabList.module.scss';

interface TabProps {
  title: string;
  children: ReactNode;
}

const Tab = ({ children }: TabProps) => <>{children}</>;

interface TabListProps {
  className?: string;
  vertical?: boolean;
  children: ReactElement<TabProps> | ReactElement<TabProps>[];
}

const TabList = ({
  className,
  vertical = false,
  children,
  ...props
}: TabListProps) => {
  const tab = useTabState();

  return (
    <div
      className={classList([styles.container, className])}
      data-vertical={vertical}
    >
      <BaseTabList
        {...tab}
        {...props}
        className={styles.tabList}
        data-role="tab-list"
      >
        {React.Children.map(children, (child) => (
          <BaseTab {...tab} className={styles.tab}>
            {child.props.title}
          </BaseTab>
        ))}
      </BaseTabList>
      <div className={styles.panelContainer} data-role="tab-panel">
        {React.Children.map(children, (child) => (
          <BaseTabPanel {...tab} className={styles.panel}>
            {child.props.children}
          </BaseTabPanel>
        ))}
      </div>
    </div>
  );
};

export { Tab, TabList };
export type { TabProps as ITabProps, TabListProps as ITabListProps };
