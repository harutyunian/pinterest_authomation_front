export const CONTINUITY_VEO_MODEL_IDS = [
  'veo-3.1-generate-preview',
  'veo-3.1-fast-generate-preview',
] as const;

export function isContinuityCapableModel(model: string): boolean {
  const normalized = model.trim().toLowerCase();
  return CONTINUITY_VEO_MODEL_IDS.some(
    (id) => normalized === id || normalized.includes(id),
  );
}

export function pickContinuityModel(
  models: { id: string }[],
  currentModel: string,
): string {
  if (currentModel && isContinuityCapableModel(currentModel)) {
    return currentModel;
  }
  const match = models.find((m) => isContinuityCapableModel(m.id));
  return match?.id ?? '';
}

export function hasImageCharacter(
  characters: { inputMode?: string; imageBase64?: string }[],
): boolean {
  return characters.some(
    (c) => c.inputMode === 'image' && Boolean(c.imageBase64?.trim()),
  );
}
