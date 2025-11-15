export function validateAvatarRequest(body: any): { 
  isValid: boolean; 
  error?: string;
  validated?: {
    gender: 'male' | 'female';
    skinTone: string;
    hijab?: string;
    beard?: string;
    outfit: string;
  };
} {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  const { gender, skinTone, hijab, beard, outfit } = body;

  // Validate gender
  if (!gender || !['male', 'female'].includes(gender)) {
    return { isValid: false, error: 'Invalid gender' };
  }

  // Validate skin tone - accept both simple and detailed skin tone values
  const validSkinTones = [
    'light', 'medium', 'tan', 'deep',
    'warm-brown', 'light-olive', 'fair', 'olive', 'brown', 'dark'
  ];
  if (!skinTone || !validSkinTones.includes(skinTone)) {
    return { isValid: false, error: 'Invalid skin tone' };
  }

  // Validate hijab for female
  if (gender === 'female' && hijab) {
    const validHijabs = ['classic', 'draped', 'none'];
    if (!validHijabs.includes(hijab)) {
      return { isValid: false, error: 'Invalid hijab style' };
    }
  }

  // Validate beard for male
  if (gender === 'male' && beard) {
    const validBeards = ['short', 'trimmed', 'full', 'none'];
    if (!validBeards.includes(beard)) {
      return { isValid: false, error: 'Invalid beard style' };
    }
  }

  // Validate outfit - accept both simple and detailed outfit values
  const validOutfits = [
    'casual', 'formal', 'traditional',
    'teal-abaya', 'lavender-dress', 'sand-abaya', 'olive-shirt',
    'abaya', 'dress', 'shirt', 'thobe', 'tunic'
  ];
  if (!outfit || !validOutfits.includes(outfit)) {
    return { isValid: false, error: 'Invalid outfit' };
  }

  return {
    isValid: true,
    validated: { gender, skinTone, hijab, beard, outfit }
  };
}
