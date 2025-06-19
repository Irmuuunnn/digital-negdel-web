import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
// useState
import { useEffect, ReactNode } from "react";
import LoginScreen from "./screens/Login";
import UserScreen from "./screens/Users";
import SidebarMenu from "./components/SidebarMenu/SidebarMenu";
import RegisterScreen from "./screens/Register";
import SignupScreen from "./screens/Signup";
import HomeScreen from "./screens/Home";
import StartTripScreen from "./screens/Starttrip";
import TripDetailsScreen from "./screens/TripDetail";
// import { GlobalProvider, useGlobalContext } from "skywhale-api";

interface PrivateRouteProps {
  children: ReactNode;
  permission?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, permission }) => {
  const getUserPermissions = () => {
    const userData = localStorage.getItem("permission");
    return userData ? JSON.parse(userData) : {};
  };

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const expiresAt = localStorage.getItem("expires_at");
    return token && expiresAt && new Date(expiresAt).getTime() > Date.now();
  };

  const permissions = getUserPermissions();

  if (!checkAuth()) return <Navigate to="/login" />;
  if (permission && !permissions[permission]) return <Navigate to="/" />;

  return <>{children}</>;
};

const ProtectedLayout = () => {
  // const { request, notification } = useGlobalContext();

  // const handleApiCall = async () => {
  //   try {
  //     const response = await request({
  //       url: '/users',
  //       method: 'GET',
  //       model: 'users'
  //     });

  //     if (response.status) {
  //       notification({
  //         type: 'success',
  //         message: 'Data loaded successfully'
  //       });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <SidebarMenu>
      <div style={{ padding: '10px' }}>
        {/* <button onClick={handleApiCall}>Load Users</button> */}
      </div>
      <Outlet />
    </SidebarMenu>
  );
};

const App = () => {
  // const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
  //   const token = localStorage.getItem("token");
  //   const expiresAt = localStorage.getItem("expires_at");
  //   return !!(token && expiresAt && new Date(expiresAt).getTime() > Date.now());
  // });

  useEffect(() => {
    // const checkAuth = () => {
    //   const token = localStorage.getItem("token");
    //   const expiresAt = localStorage.getItem("expires_at");

    //   if (token && expiresAt && new Date(expiresAt).getTime() > Date.now()) {
    //     setIsAuthenticated(true);
    //   } else {
    //     logout();
    //   }
    // };

    // checkAuth();
  }, []);

  // const logout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("expires_at");
  //   setIsAuthenticated(false);
  // };

  return (
 
      <Router>
        <Routes>
          <Route
            path="/login"
            element={ <LoginScreen />}
          />
          <Route
            path="/home"
            element={ <HomeScreen />}
          />
          <Route
            path="/start-trip"
            element={ <StartTripScreen />}
          />
          <Route path="/trip-details" element={<TripDetailsScreen />} />
           <Route
              path="/register"
              element={
                  <RegisterScreen />
              }
            />
              <Route
              path="/signup"
              element={
                  <SignupScreen />
              }
            />
          <Route element={<ProtectedLayout />}>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <div>This is home</div>
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute permission="users">
                  <UserScreen />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<p>There's nothing here: 404!</p>} />
          </Route>
        </Routes>
      </Router>
  );
};

export default App;
