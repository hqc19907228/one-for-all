import ButtonElem from './button';
import ConfigForm from './config-form';
import type { SourceElement } from '@ofa/page-engine';

type Props = {
  name?: string
}

const defaultConfig: Props = {};

const elem: SourceElement<Props> = {
  name: 'button',
  icon: 'button-component',
  iconSize: 44,
  iconStyle: {
    width: '44px',
    height: '16px',
  },
  label: '按钮',
  category: 'basic',
  component: ButtonElem,
  configForm: ConfigForm,
  defaultConfig,
  order: 4,
  exportActions: ['onClick'],
};

export default elem;
