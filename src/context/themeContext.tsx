import {createContext, useContext, useEffect, useState} from 'react';
import {
  SharedValue,
  interpolate,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {ColorBallI} from '../components/ColorPicker/colorsP';
import {getBestTextColorWorklet} from '../utils';
import {useRealm} from '@realm/react';
import {ThemeDB, ThemeDBI} from '../database/Theme';
import {BSON} from 'realm';

interface ThemeContextI {
  states: {
    colorBalls: ColorBallI[];
    colors: Readonly<SharedValue<string[]>>;
    openColorPicker: boolean;
    topTextColor: SharedValue<string>;
    middleTextColor: SharedValue<string>;
    bottomTextColor: SharedValue<string>;
    saturation: SharedValue<number>;
    lightness: SharedValue<number>;
    colorWhellColors: Readonly<SharedValue<string[]>>;
    statusStyle: 'light-content' | 'dark-content';
    realm: Realm;
  };

  setStatesFuncs: {
    setOpenColorPicker: React.Dispatch<React.SetStateAction<boolean>>;
    setStatusStyle: React.Dispatch<
      React.SetStateAction<'light-content' | 'dark-content'>
    >;
  };

  funcs: {
    saturateColors: (satu?: number) => void;
    updateBallColorFromMove: (
      index: number,
      ballColor: SharedValue<string>,
      last: {x: SharedValue<number>; y: SharedValue<number>},
      event?: {x: number; y: number},
    ) => {
      centerX: number;
      centerY: number;
      angle: number;
      distanceFromCenter: number;
      hsl: {h: number; s: number; l: number};
    };
    upThemeToDB: () => void;
    addImg: (img: string) => void;
    getTheme: () => ThemeDBI | null;
    deleteImg: (index: number) => void;
  };
}

const ThemeContext = createContext<ThemeContextI>({} as any);

function editHSL(color: string, edits: {h?: number; s?: number; l?: number}) {
  'worklet';
  const colorhsl = color.split(',');

  if (edits.h) colorhsl[0] = `hsl(${edits.h}`;
  if (edits.s) colorhsl[1] = `${edits.s}%`;
  if (edits.l) colorhsl[2] = `${edits.l}%)`;
  return colorhsl.join(',');
}

export const outersize = 280;
export const outerRadius = outersize / 2;
export const ballSize = 20;
export const radius = outerRadius - ballSize / 2; // Adjust for the size of the ball

export const ThemeProvider = ({children}: {children: any}) => {
  const [openColorPicker, setOpenColorPicker] = useState(false);
  const topTextColor = useSharedValue('rgba(0, 0, 0, 1)');
  const middleTextColor = useSharedValue('rgba(0, 0, 0, 1)');
  const bottomTextColor = useSharedValue('rgba(0, 0, 0, 1)');

  const [statusStyle, setStatusStyle] = useState<
    'light-content' | 'dark-content'
  >('light-content');

  const red = useSharedValue('hsl(0, 100%, 50%)');
  const green = useSharedValue('hsl(120, 100%, 50%)');
  const blue = useSharedValue('hsl(240, 100%, 50%)');
  const yellow = useSharedValue('hsl(60, 100%, 50%)');
  const cyan = useSharedValue('hsl(180, 100%, 50%)');
  const magenta = useSharedValue('hsl(300, 100%, 50%)');

  const colorWhellColors = useDerivedValue(() => {
    return [
      red.value,
      yellow.value,
      green.value,
      cyan.value,
      blue.value,
      magenta.value,
      red.value,
    ];
  });

  const saturation = useSharedValue(50);
  const lightness = useSharedValue(50);

  const balls = 3;

  const realm = useRealm();

  function getPositionFromColor(color: string) {
    const hsl = color
      .replace('hsl(', '')
      .replace(')', '')
      .replace(/%/g, '')
      .split(',')
      .map(v => parseInt(v));
    const angle = (hsl[0] / 360) * 2 * Math.PI;
    const centerX = outersize / 2 - ballSize / 2;
    const centerY = outersize / 2 - ballSize / 2;
    const distanceFromCenter = (hsl[2] / 100) * radius;
    const x = centerX + distanceFromCenter * Math.cos(angle);
    const y = centerY + distanceFromCenter * Math.sin(angle);

    return {x, y};
  }
  const colorBalls = Array.from({length: balls}, (_, i) => createColorBall(i));
  const [theme, setTheme] = useState<ThemeDBI | null>(null);

  function getTheme(): ThemeDBI | null {
    const t = realm.objects(ThemeDB);

    if (t[0])
      return {
        colors: t[0].colors,
        id: t[0]._id,
        PrevUsedImgs: t[0].PrevUsedImgs,
      };
    return null;
  }

  function createTheme() {
    const colors = [
      'hsl(0, 50%, 50%)',
      'hsl(120, 50%, 50%)',
      'hsl(240, 50%, 50%)',
    ];
    realm.write(() => {
      realm.create<ThemeDB>('Theme', {
        _id: new BSON.ObjectId(),
        colors,
      });
    });
  }

  function updateTheme({colors}: Partial<ThemeDBI>) {
    if (theme) {
      const toUpdate = realm.objectForPrimaryKey(ThemeDB, theme.id);
      if (toUpdate) {
        realm.write(() => {
          colors && (toUpdate.colors = colors);
        });
      }
    }
  }

  function addImg(img: string) {
    if (theme) {
      const toUpdate = realm.objectForPrimaryKey(ThemeDB, theme.id);
      if (toUpdate) {
        realm.write(() => {
          toUpdate.PrevUsedImgs.push(img);
        });
      }
    }
  }

  function deleteImg(index: number) {
    if (theme) {
      const toUpdate = realm.objectForPrimaryKey(ThemeDB, theme.id);
      if (toUpdate) {
        realm.write(() => {
          toUpdate.PrevUsedImgs = toUpdate.PrevUsedImgs.filter(
            (_, i) => i !== index,
          );
        });
      }
    }
  }

  useEffect(() => {
    const t = getTheme();
    if (t == null) {
      createTheme();
      const ct = getTheme();
      setTheme(ct);
    } else {
      setTheme(t);
    }
  }, []);

  useEffect(() => {
    if (theme) {
      theme.colors.forEach((color, i) => {
        colorBalls[i].ballColor.value = color;
        const {x, y} = getPositionFromColor(color);
        updateBallColorFromMove2(i, colorBalls[i].ballColor, {x, y});

        colorBalls[i].positionX.value = x;
        colorBalls[i].positionY.value = y;
      });
    }
  }, [theme]);

  function createColorBall(i: number, bColor?: string) {
    const ballColor = bColor ? bColor : `hsl(${(i * 360) / balls}, 50%, 50%)`;
    const {x, y} = getPositionFromColor(ballColor);
    return {
      ballColor: useSharedValue(ballColor),
      name: `ball_${i}`,
      positionX: useSharedValue(x),
      positionY: useSharedValue(y),
      block: useSharedValue(false),
      start: useSharedValue(true),
      borderColor: useSharedValue('rgba(0, 0, 0, 0.6)'),
      lastX: useSharedValue(0),
      lastY: useSharedValue(0),
      selectedScale: useSharedValue(1),
      index: i,
    };
  }

  const colors = useDerivedValue(() => {
    return colorBalls.map(ball => ball.ballColor.value);
  });

  function saturateColors(satu?: number) {
    'worklet';
    let sat = saturation.value;
    if (satu) {
      saturation.value = satu;
      sat = satu;
    }

    red.value = editHSL(red.value, {s: sat});
    green.value = editHSL(green.value, {s: sat});
    blue.value = editHSL(blue.value, {s: sat});
    yellow.value = editHSL(yellow.value, {s: sat});
    cyan.value = editHSL(cyan.value, {s: sat});
    magenta.value = editHSL(magenta.value, {s: sat});

    colorBalls.forEach(ball => {
      ball.ballColor.value = editHSL(ball.ballColor.value, {s: sat});
    });
  }

  function upThemeToDB() {
    updateTheme({
      colors: colorBalls.map(ball => ball.ballColor.value),
    });
  }

  function updateBallColorFromMove(
    index: number,
    ballColor: SharedValue<string>,
    last: {x: SharedValue<number>; y: SharedValue<number>},
    event?: {x: number; y: number},
  ) {
    'worklet';
    const x = event ? event.x : last.x.value;
    const y = event ? event.y : last.y.value;

    // Assuming the center of the circle and its radius
    const centerX = outersize / 2 - ballSize / 2;
    const centerY = outersize / 2 - ballSize / 2;

    const angle = Math.atan2(y - centerY, x - centerX);
    // Calculate the distance from the center to the event point
    const distanceFromCenter = Math.sqrt(
      Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2),
    );

    const h = (angle / (2 * Math.PI)) * 360;
    const s = saturation.value;
    const l = interpolate(
      distanceFromCenter <= radius ? distanceFromCenter : radius,
      [0, radius * 0.2, radius * 0.4, radius * 0.8, radius],
      [0, 10, 35, 60, 100],
    );

    const colorhsl = `hsl(${h}, ${s}%, ${l}%)`;
    ballColor.value = colorhsl;
    const bestTextColor = withTiming(getBestTextColorWorklet(h, s, l), {
      duration: 400,
    });
    if (index === 0) {
      topTextColor.value = bestTextColor;
    }
    if (index === 1) middleTextColor.value = bestTextColor;
    if (index === 2) bottomTextColor.value = bestTextColor;
    lightness.value = l;

    last.x.value = x;
    last.y.value = y;

    return {centerX, centerY, angle, distanceFromCenter, hsl: {h, s, l}};
  }
  function updateBallColorFromMove2(
    index: number,
    ballColor: SharedValue<string>,
    last: {x: number; y: number},
    event?: {x: number; y: number},
  ) {
    'worklet';
    const x = event ? event.x : last.x;
    const y = event ? event.y : last.y;

    // Assuming the center of the circle and its radius
    const centerX = outersize / 2 - ballSize / 2;
    const centerY = outersize / 2 - ballSize / 2;

    const angle = Math.atan2(y - centerY, x - centerX);
    // Calculate the distance from the center to the event point
    const distanceFromCenter = Math.sqrt(
      Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2),
    );

    const h = (angle / (2 * Math.PI)) * 360;
    const s = saturation.value;
    const l = interpolate(
      distanceFromCenter <= radius ? distanceFromCenter : radius,
      [0, radius * 0.2, radius * 0.4, radius * 0.8, radius],
      [0, 10, 35, 60, 100],
    );

    const colorhsl = `hsl(${h}, ${s}%, ${l}%)`;
    ballColor.value = colorhsl;
    const bestTextColor = withTiming(getBestTextColorWorklet(h, s, l), {
      duration: 400,
    });
    if (index === 0) {
      topTextColor.value = bestTextColor;
    }
    if (index === 1) middleTextColor.value = bestTextColor;
    if (index === 2) bottomTextColor.value = bestTextColor;
    lightness.value = l;

    return {centerX, centerY, angle, distanceFromCenter, hsl: {h, s, l}};
  }
  const states = {
    colorBalls,
    colors,
    openColorPicker,
    topTextColor,
    bottomTextColor,
    middleTextColor,
    saturation,
    lightness,
    colorWhellColors,
    statusStyle,
    realm,
  };

  const setStatesFuncs = {
    setOpenColorPicker,
    setStatusStyle,
  };

  const funcs = {
    saturateColors,
    updateBallColorFromMove,
    upThemeToDB,
    addImg,
    getTheme,
    deleteImg,
  };

  return (
    <ThemeContext.Provider
      value={{
        states,
        setStatesFuncs,
        funcs,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  return context;
};
