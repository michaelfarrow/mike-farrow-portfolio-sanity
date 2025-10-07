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
import { useEffect, useMemo, useState } from 'react';

export type VisualEditingOptions = Pick<InternalVisualEditingOptions, 'zIndex'>;

export function VisualEditingComponent(props: VisualEditingOptions) {
  const [navigate, setNavigate] = useState<HistoryAdapterNavigate>();
  const [currentPath, setCurrentPath] = useState<string>();

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

    // const onBeforeSwap = (event: TransitionBeforeSwapEvent) => {
    //   function mySwap(newDoc: Document) {
    //     const styled = Array.from(
    //       document.querySelectorAll('head style[data-styled]')
    //     ).map((style) => style.cloneNode(true));
    //     styled.forEach((style) => {
    //       newDoc.querySelector('head')?.appendChild(style);
    //     });
    //     swapFunctions.deselectScripts(newDoc);
    //     swapFunctions.swapRootAttributes(newDoc);
    //     swapFunctions.swapHeadElements(newDoc);
    //     const restoreFocusFunction = swapFunctions.saveFocus();
    //     swapFunctions.swapBodyElement(newDoc.body, document.body);
    //     restoreFocusFunction();
    //   }
    //   event.swap = () => mySwap(event.newDocument);
    // };

    document.addEventListener('astro:page-load', onPageLoad);
    // document.addEventListener('astro:before-swap', onBeforeSwap);

    onPageLoad();

    return () => {
      document.removeEventListener('astro:page-load', onPageLoad);
      // document.removeEventListener('astro:before-swap', onBeforeSwap);
    };
  }, [navigate]);

  return (
    <InternalVisualEditing
      key={currentPath}
      portal
      zIndex={props.zIndex}
      history={history}
      refresh={() => {
        return new Promise((resolve) => {
          astroNavigate(window.location.href, { history: 'replace' });
          resolve();
        });
      }}
    />
  );
}
