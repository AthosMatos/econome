import Home from "./src/Pages/Home";
import { AppProvider } from "./src/context/appContext";


export const App = () => {
    return (
        <AppProvider>

            <Home />

        </AppProvider>
    );
}