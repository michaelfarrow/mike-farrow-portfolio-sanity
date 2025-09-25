'use client';

import { useDraftModeEnvironment } from 'next-sanity/hooks';

import { useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { disableDraftMode } from '@app/lib/actions';

export function DisableDraftMode() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const environment = useDraftModeEnvironment();

  if (environment !== 'live' && environment !== 'unknown') {
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
