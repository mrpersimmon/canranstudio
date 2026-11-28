import {useLayoutEffect,useRef} from 'react';
import {presentNavigationStatus} from './navigation-status';

export function NavigationNotice({kind,detail,error=false,heading=false,onCancel,onRetry}) {
  const actions=useRef();
  actions.current={onCancel,onRetry};
  const cancelable=!!onCancel, retryable=!!onRetry;
  useLayoutEffect(()=>presentNavigationStatus(document,{
    kind,detail,error,heading,
    onCancel:cancelable?()=>actions.current.onCancel():undefined,
    onRetry:retryable?()=>actions.current.onRetry():undefined
  }),[kind,detail,error,heading,cancelable,retryable]);
  return null;
}
