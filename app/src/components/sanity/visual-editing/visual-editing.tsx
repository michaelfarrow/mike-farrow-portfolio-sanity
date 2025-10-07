import {
  VisualEditing as InternalVisualEditing,
  type HistoryAdapter,
  type HistoryAdapterNavigate,
  type VisualEditingOptions as InternalVisualEditingOptions,
} from '@sanity/visual-editing/react';
import { navigate as astroNavigate } from 'astro:transitions/client';
import { StyleSheetManager } from 'styled-components';
import { useEffect, useMemo, useState } from 'react';

export type VisualEditingOptions = Pick<InternalVisualEditingOptions, 'zIndex'>;

export function VisualEditingComponent(props: VisualEditingOptions) {
  const [navigate, setNavigate] = useState<HistoryAdapterNavigate>();
  const [currentPath, setCurrentPath] = useState<string>();
  const [style, setStyle] = useState<HTMLDivElement | undefined>(undefined);

  const history: HistoryAdapter = useMemo(
    () => ({
      subscribe: (_navigate) => {
        setNavigate(() => _navigate);
        return () => setNavigate(undefined);
      },

      update(update) {
        switch (update.type) {
          case 'push':
            astroNavigate(update.url, { history: 'push' });
            break;
          // case 'pop':
          //   astroNavigate();
          //   break;
          case 'replace':
            astroNavigate(update.url, { history: 'replace' });
            break;
          default:
            throw new Error(`Unknown update type: ${update.type}`);
        }
      },
    }),
    []
  );

  useEffect(() => {
    const onPageLoad = () => {
      setCurrentPath(window.location.href);
      if (navigate) {
        navigate({
          type: 'push',
          url: window.location.href,
        });
      }
    };

    document.addEventListener('astro:page-load', onPageLoad);
    onPageLoad();

    return () => {
      document.removeEventListener('astro:page-load', onPageLoad);
    };
  }, [navigate]);

  return (
    <>
      <div
        style={{ display: 'none' }}
        ref={(ref) => setStyle(ref || undefined)}
      ></div>
      <StyleSheetManager target={style} disableCSSOMInjection>
        <InternalVisualEditing
          key={currentPath}
          portal
          zIndex={props.zIndex}
          history={history}
          refresh={() => {
            return new Promise((resolve) => {
              location.reload();
              resolve();
            });
          }}
        />
      </StyleSheetManager>
    </>
  );
}
