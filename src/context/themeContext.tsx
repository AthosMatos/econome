import { createContext, useContext, useEffect, useState } from "react";
import { SharedValue, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";

interface ThemeContextI {
    states: {
        colors: SharedValue<string[]>;
        color1: SharedValue<string>;
        color2: SharedValue<string>;
        openColorPicker: boolean;
    };
    funcs: {
        handleColorSelected: (ball1: string | null, ball2: string | null) => void;
    };
    setStatesFuncs: {
        setOpenColorPicker: React.Dispatch<React.SetStateAction<boolean>>;
    };

}

const ThemeContext = createContext<ThemeContextI>({} as any);

export const ThemeProvider = ({ children }: { children: any }) => {
    const color1 = useSharedValue('hsl(126, 100%, 8.627450980392156%)');
    const color2 = useSharedValue('hsl(240, 100%, 32.549019607843135%)');
    const [openColorPicker, setOpenColorPicker] = useState(false);

    const colors = useDerivedValue(() => {
        return [color1.value, color2.value];
    });


    const handleColorSelected = (ball1: string | null, ball2: string | null) => {
        'worklet'
        if (ball1) color1.value = withTiming(ball1);
        if (ball2) color2.value = withTiming(ball2);
    };




    const states = {
        colors,
        color1,
        color2,
        openColorPicker
    }

    const funcs = {
        handleColorSelected
    }

    const setStatesFuncs = {
        setOpenColorPicker
    }

    return (
        <ThemeContext.Provider value={{
            states,
            funcs,
            setStatesFuncs
        }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    return context;
}