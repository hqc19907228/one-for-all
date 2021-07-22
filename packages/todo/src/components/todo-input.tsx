import React from 'react';
import { useState } from 'react';

function ThirdPartyInput(props: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>): JSX.Element {
  return (<input {...props} />);
}

type Props = {
  onEnter: (value: string) => Promise<boolean>;
}

// clear value after enter key down
export default function TodoInput({ onEnter }: Props): JSX.Element {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false)

  function clearInputOnEnterDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter') {
      console.log(value);
      setLoading(true);
      onEnter(value).then((isSuccess) => {
        setLoading(false);

        if (isSuccess) {
          setValue('');
        }
      });
    }
  }

  return (
    <ThirdPartyInput
      autoFocus
      value={value}
      disabled={loading}
      onChange={(e) => setValue(e.target.value)}
      className="new-todo"
      placeholder="What needs to be done?"
      onKeyDown={clearInputOnEnterDown}
    />
  );
}
