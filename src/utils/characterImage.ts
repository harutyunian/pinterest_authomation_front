export type CharacterImageMimeType =
  | 'image/jpeg'
  | 'image/png'
  | 'image/webp'
  | string;

export async function fileToCharacterImage(
  file: File,
): Promise<{
  imageBase64: string;
  imageMimeType: CharacterImageMimeType;
  previewUrl: string;
}> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });

  const base64 = dataUrl.split(',')[1];
  if (!base64) {
    throw new Error('Invalid image data.');
  }

  return {
    imageBase64: base64,
    imageMimeType: file.type || 'image/jpeg',
    previewUrl: dataUrl,
  };
}

export function toApiCharacter(character: {
  name: string;
  inputMode: 'description' | 'image';
  description?: string;
  imageBase64?: string;
  imageMimeType?: CharacterImageMimeType;
}) {
  if (character.inputMode === 'image') {
    return {
      name: character.name,
      inputMode: 'image' as const,
      imageBase64: character.imageBase64,
      imageMimeType: character.imageMimeType,
    };
  }

  return {
    name: character.name,
    inputMode: 'description' as const,
    description: character.description ?? '',
  };
}
