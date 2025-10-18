import { VisualEditing } from 'next-sanity/visual-editing';

import { DisableDraftMode } from '@app/components/studio/disable-draft-mode';

export interface DraftModeProps {
  enabled?: boolean;
}

export function DraftMode({ enabled }: DraftModeProps) {
  return (
    enabled && (
      <>
        <VisualEditing />
        <DisableDraftMode />
      </>
    )
  );
}
