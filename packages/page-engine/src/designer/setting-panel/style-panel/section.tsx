import React, { useState } from 'react';
import cs from 'classnames';

import { Icon } from '@ofa/ui';

import styles from './index.m.scss';

interface Props {
  title: string;
  className?: string;
  children?: React.ReactNode;
}

function Section({ title, className, children }: Props): JSX.Element {
  const [expand, setExpand] = useState(false);

  return (
    <div className={cs(styles.section, { [styles.expand]: expand }, className)}>
      <div className={cs('flex justify-between items-center px-8 py-4', styles.header)}>
        <span>{title}</span>
        <Icon name={expand ? 'expand_less' : 'expand_more'} clickable onClick={() => setExpand((exp) => !exp)} />
      </div>
      <div className={styles.body}>
        {children}
      </div>
    </div>
  );
}

export default Section;
