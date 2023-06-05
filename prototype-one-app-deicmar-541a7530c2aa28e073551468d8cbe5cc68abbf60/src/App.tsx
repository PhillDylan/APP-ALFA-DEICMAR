import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import { AppDrawerProvider, AppThemeProvider, AuthProvider } from "./shared/contexts";
import { MenuLateral, Login } from "./shared/components";
import { Provider } from "react-redux";
import store from "./pages/dashboard/store";




export const App = () => {
  return (
    <AuthProvider>
      <Provider store={store}>
        <AppThemeProvider>
          <Login> {}
            <AppDrawerProvider>
              <BrowserRouter>
                <MenuLateral>
                  <AppRoutes />
                </MenuLateral>
              </BrowserRouter>
            </AppDrawerProvider>
          </Login>
        </AppThemeProvider>
      </Provider>
    </AuthProvider>
  );
};
