'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { useIsMaybePresentation } from '@app/hooks/sanity';
import { disableDraftMode } from '@app/lib/actions';

export function DisableDraftMode() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const presentation = useIsMaybePresentation();

  if (presentation) {
    return null;
  }

  const disable = () =>
    startTransition(async () => {
      await disableDraftMode();
      router.refresh();
    });

  return (
    <div>
      {pending ? (
        'Disabling draft mode...'
      ) : (
        <button type='button' onClick={disable}>
          Disable draft mode
        </button>
      )}
    </div>
  );
}
