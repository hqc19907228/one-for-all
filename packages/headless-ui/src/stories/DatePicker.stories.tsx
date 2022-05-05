import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import DatePicker from '../shared/date-picker';

const Meta: ComponentMeta<typeof DatePicker> = {}

export default {
  title: 'headless-ui/DatePicker',
  component: DatePicker,
  argTypes: {
    
  },
} as ComponentMeta<typeof DatePicker>;

const Template: ComponentStory<typeof DatePicker> = (args) => <DatePicker {...args} />;

export const Normal = Template.bind({});
Normal.args = {
  defaultValue: '2019-10-02',
  showToday: false,
}

export const Date = Template.bind({});
Date.args = {
  defaultValue: '2019-10-02',
  mode: 'date',
}

export const DateTime = Template.bind({});
DateTime.args = {
  defaultValue: '2019-10-02 09:12:21',
  mode: 'date',
  timeScope: 'second',
}

export const Month = Template.bind({});
Month.args = {
  defaultValue: '2019-10',
  mode: 'month',
}

export const Quarter = Template.bind({});
Quarter.args = {
  defaultValue: '2019-Q1',
  mode: 'quarter',
}

export const Year = Template.bind({});
Year.args = {
  defaultValue: '2019',
  mode: 'year',
}

export const Time = Template.bind({});
Time.args = {
  defaultValue: '10:09:10',
  mode: 'time',
  showNow: false,
}

export const formatCustom = Template.bind({});
formatCustom.args = {
  timeScope: 'minute',
  format: 'YY/MM-DD HH:mm',
  // format: (date: Date) => `custom: ${date.getFullYear()}-----${date.getMonth()}`
}

export const CustomIcon = Template.bind({});
CustomIcon.args = {
  suffixIcon: <span>c</span>,
  nextIcon: <span style={{ margin: '0 5px' }}>&gt;</span>,
  prevIcon: <span style={{ margin: '0 5px' }}>&lt;</span>,
  superNextIcon: <span>&gt;&gt;</span>,
  superPrevIcon: <span>&lt;&lt;</span>
}

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
}
