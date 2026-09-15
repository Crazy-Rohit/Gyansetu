import AppRouter from "./router/AppRouter";
import { UserProfileProvider } from "./context/UserProfileContext";
import { ThemeProvider } from "./context/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <UserProfileProvider>
        <AppRouter />
      </UserProfileProvider>
    </ThemeProvider>
  );
}
