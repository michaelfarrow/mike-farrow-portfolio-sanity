import type { AstroGlobal } from 'astro';

export async function hasSlot(slot: AstroGlobal['slots'], name: string) {
  const renderedContent = await slot.render(name);
  return !!renderedContent?.trim().length;
}
