import {
  VisualEditing as InternalVisualEditing,
  type HistoryAdapter,
  type HistoryAdapterNavigate,
  type VisualEditingOptions as InternalVisualEditingOptions,
} from '@sanity/visual-editing/react';
import { useEffect, useMemo, useState } from 'react';

export type VisualEditingOptions = Pick<InternalVisualEditingOptions, 'zIndex'>;

export function VisualEditingComponent(props: VisualEditingOptions) {
  const router = window.history;
  const [navigate, setNavigate] = useState<HistoryAdapterNavigate>();

  const history: HistoryAdapter = useMemo(
    () => ({
      subscribe: (_navigate) => {
        setNavigate(() => _navigate);
        return () => setNavigate(undefined);
      },

      update(update) {
        switch (update.type) {
          case 'push':
            router.pushState(update.url, '', update.url);
            break;
          case 'pop':
            router.back();
            break;
          case 'replace':
            router.replaceState(update.url, '', update.url);
            break;
          default:
            throw new Error(`Unknown update type: ${update.type}`);
        }

        if (router.state && typeof router.state === 'string')
          window.location.href = router.state;
      },
    }),
    []
  );

  useEffect(() => {
    if (navigate) {
      navigate({
        type: 'push',
        url: window.location.href,
      });
    }
  }, [navigate]);

  return (
    <InternalVisualEditing
      portal
      zIndex={props.zIndex}
      history={history}
      refresh={() => {
        return new Promise((resolve) => {
          window.location.reload();
          resolve();
        });
      }}
    />
  );
}
