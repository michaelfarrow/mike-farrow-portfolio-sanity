import { useEffect, useState } from 'react';

export function isMaybePreviewIframe(): boolean {
  return window.self !== window.top;
}
export function isMaybePreviewWindow(): boolean {
  return Boolean(window.opener);
}
export function isMaybePresentation(): boolean {
  return isMaybePreviewIframe() || isMaybePreviewWindow();
}

export function useIsMaybePresentation() {
  const [current, setCurrent] = useState<boolean>();
  useEffect(() => {
    setCurrent(isMaybePresentation());
  }, []);
  return current;
}
