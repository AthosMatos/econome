import { createContext, useContext, useEffect, useState } from "react";

interface ToolBarContextI {
    states: {
        extendedCards: boolean;
    };

    stateFuncs: {
        setExtendedCards: React.Dispatch<React.SetStateAction<boolean>>;
    };
}

const ToolBarContext = createContext<ToolBarContextI>({} as any);

export const ToolBarProvider = ({ children }: { children: any }) => {
    const [extendedCards, setExtendedCards] = useState(false);

    const states = {
        extendedCards
    }

    const stateFuncs = {
        setExtendedCards
    }


    return (
        <ToolBarContext.Provider value={{
            states,
            stateFuncs
        }}>
            {children}
        </ToolBarContext.Provider>
    )
}

export const useToolBarContext = () => {
    const context = useContext(ToolBarContext);
    return context;
}