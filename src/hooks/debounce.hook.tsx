import { useCallback, useState } from 'react';
import _ from 'lodash';

export const useDebounce = function useDebounce<T>(
  obj: T,
  wait = 1000,
): [T, React.Dispatch<any>] {
  const [state, setState] = useState(obj);

  const setDebouncedState = (_val: any) => {
    debounce(_val);
  };

  const debounce = useCallback(
    _.debounce((_prop: T) => {
      setState(_prop);
    }, wait),
    [],
  );

  return [state, setDebouncedState];
};
