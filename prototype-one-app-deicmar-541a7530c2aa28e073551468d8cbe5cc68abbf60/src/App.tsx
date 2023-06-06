import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import { AppDrawerProvider, AppThemeProvider, AuthProvider } from "./shared/contexts";
import { MenuLateral, Login } from "./shared/components";
import { Provider } from "react-redux";
import store from "./pages/dashboard/store";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';






export const App = () => {
  return (
    <AuthProvider>
      <Provider store={store}>
        <AppThemeProvider>
          <Login> {}
            <AppDrawerProvider>
            <ToastContainer />
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
