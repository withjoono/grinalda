import {useState} from 'react';

export const useInput = (initialVlaue, condition, interceptors) => {
  const [value, setValue] = useState(initialVlaue);

  const onChange = e => {
    let _value = e.target.value;
    let willUpdate = true;

    if (typeof interceptors === 'function' && typeof _value === 'string') {
      _value = interceptors(_value);
    }

    if (typeof condition === 'function') {
      willUpdate = condition(_value);
    }

    willUpdate && setValue(_value);
  };

  return {value, onChange, setValue};
};
