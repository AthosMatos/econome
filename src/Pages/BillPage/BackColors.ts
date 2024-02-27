import ImageColors from 'react-native-image-colors';

interface ColorsType {
  average: string;
  darkMuted: string;
  darkVibrant: string;
  dominant: string;
  lightMuted: string;
  lightVibrant: string;
  muted: string;
  platform: string;
  vibrant: string;
}

export async function getBackColors(img: string) {
  const col = (await ImageColors.getColors(img, {
    fallback: '#228B22',
    cache: true,
    key: img,
  })) as any;
  const colors: ColorsType = {
    average: col.average,
    darkMuted: col.darkMuted,
    darkVibrant: col.darkVibrant,
    dominant: col.dominant,
    lightMuted: col.lightMuted,
    lightVibrant: col.lightVibrant,
    muted: col.muted,
    platform: col.platform,
    vibrant: col.vibrant,
  };
  return colors;
}
