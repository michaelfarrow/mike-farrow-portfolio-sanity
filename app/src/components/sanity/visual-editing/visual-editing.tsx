import {
  VisualEditing as InternalVisualEditing,
  type HistoryAdapter,
  type HistoryAdapterNavigate,
  type VisualEditingOptions as InternalVisualEditingOptions,
} from '@sanity/visual-editing/react';
import {
  navigate as astroNavigate,
  swapFunctions,
  type TransitionBeforeSwapEvent,
} from 'astro:transitions/client';
import { StyleSheetManager } from 'styled-components';
import { useEffect, useMemo, useState } from 'react';

export type VisualEditingOptions = Pick<InternalVisualEditingOptions, 'zIndex'>;

export function VisualEditingComponent(props: VisualEditingOptions) {
  const [navigate, setNavigate] = useState<HistoryAdapterNavigate>();
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
    function swap(newDoc: Document) {
      swapFunctions.deselectScripts(newDoc);
      swapFunctions.swapRootAttributes(newDoc);
      swapFunctions.swapHeadElements(newDoc);
      const restoreFocusFunction = swapFunctions.saveFocus();

      const tempEl = document.createElement('div');
      tempEl.append(...document.body.children);

      document.body.innerHTML = '';
      document.body.appendChild(tempEl);

      swapFunctions.swapBodyElement(newDoc.body, tempEl);

      const newBody = document.body.children[0];

      document.body.append(...newBody.children);
      newBody.remove();

      restoreFocusFunction();
    }

    const onPageLoad = () => {
      if (navigate) {
        navigate({
          type: 'push',
          url: window.location.href,
        });
      }
    };

    const onBeforeSwap = (event: TransitionBeforeSwapEvent) => {
      event.swap = () => swap(event.newDocument);
    };

    document.addEventListener('astro:page-load', onPageLoad);
    document.addEventListener('astro:before-swap', onBeforeSwap);
    onPageLoad();

    return () => {
      document.removeEventListener('astro:page-load', onPageLoad);
      document.removeEventListener('astro:before-swap', onBeforeSwap);
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
          portal={false}
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
