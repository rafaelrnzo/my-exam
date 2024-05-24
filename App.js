import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "./pages/LoginPage";
import HomePageUser from "./pages/user/HomePageUser";
import HomePageAdmin from "./pages/admin/HomePageAdmin";
// import VerifyPage from "./pages/VerifyPage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef } from "react";
import BlankScreen from "./components/BlankScreen";
import UjianPageUser from "./pages/user/UjianPageUser";
import LoginAsAdmin from "./pages/LoginAsAdmin";
import MainAdmin from "./pages/admin/MainAdmin";
import CreateLinkAdmin from "./pages/admin/action-link/CreateLinkAdmin";
import UpdateLinkAdmin from "./pages/admin/action-link/UpdateLinkAdmin";
import CreateUser from "./pages/admin/action-user/CreateUser";
import UpdateUser from "./pages/admin/action-user/UpdateUser";
import SubsPage from "./pages/admin/SubsPage";
import PaymentScreen from "./pages/admin/PaymentScreen";
import ListUser from "./pages/admin/ListUser";
import MonitoringPage from "./pages/admin/MonitoringPage";
import ListKelas from "./pages/admin/ListKelas";
import RegisterPage from "./pages/RegisterPage";
import CreateKelas from "./pages/admin/action-kelas/CreateKelas";
import UpdateKelas from "./pages/admin/action-kelas/UpdateKelas";
import PortalPage from "./pages/PortalPage";
import { SWRConfig } from "swr";
import { fetcher } from "./utils/useApi";

export default function App() {
  const Stack = createNativeStackNavigator();
  const navigationRef = useRef();

  useEffect(() => {
    const checkAuth = async () => {
      const role = await AsyncStorage.getItem("role");
      const token = await AsyncStorage.getItem("token");
      console.log(role, token);
      if (token && role == "siswa") {
        navigationRef.current?.reset({
          index: 0,
          routes: [{ name: "HomePageUser" }],
        });
      } else if (token && role == "admin sekolah") {
        navigationRef.current?.reset({
          index: 0,
          routes: [{ name: "MainAdmin" }],
        });
      } else {
        navigationRef.current?.reset({
          index: 0,
          routes: [{ name: "PortalPage" }],
        });
      }
    };

    checkAuth();
  }, []);

  return (
    <SWRConfig value={{ fetcher, dedupingInterval:2000 }}>
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="PortalPage">
        <Stack.Screen
          name="BlankScreen"
          component={BlankScreen}
          options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PortalPage"
            component={PortalPage}
            options={{ headerShown: false }}
            />
        <Stack.Screen
          name="LoginPage"
          component={LoginPage}
          options={{ headerShown: false }}
          />
        <Stack.Screen
          name="LoginAsAdmin"
          component={LoginAsAdmin}
          options={{ headerShown: false }}
          />
        <Stack.Screen
          name="HomePageUser"
          component={HomePageUser}
          options={{ headerShown: false }}
          // options={{ headerBackVisible: true }}
        />
        <Stack.Screen
          name="MainAdmin"
          component={MainAdmin}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="CreateLinkAdmin" component={CreateLinkAdmin} />
        <Stack.Screen name="UpdateUser" component={UpdateUser} />
        <Stack.Screen name="CreateUser" component={CreateUser} />
        <Stack.Screen
          name="SubsPage"
          component={SubsPage}
          options={{ headerBackVisible: false }}
        />
        <Stack.Screen
          name="PaymentScreen"
          component={PaymentScreen}
          options={{ headerBackVisible: false }}
        />
        <Stack.Screen name="UpdateLinkAdmin" component={UpdateLinkAdmin} />
        <Stack.Screen name="HomePageAdmin" component={HomePageAdmin} />
        <Stack.Screen
          name="ListUser"
          component={ListUser}
          options={({ route }) => ({
            headerTitle: route.params.kelas_jurusan,
          })}
        />
        <Stack.Screen
          name="MonitoringPage"
          component={MonitoringPage}
          options={({ route }) => ({
            headerTitle: route.params.kelas_jurusan,
          })}
        />
        {/* <Stack.Screen
          name="VerifyPage"
          component={VerifyPage}
          options={{ headerBackVisible: false }}
        /> */}
        <Stack.Screen
          name="UjianPageUser"
          component={UjianPageUser}
          options={{ headerBackVisible: false }}
        />
        <Stack.Screen
          name="ListKelas"
          component={ListKelas}
        />
        <Stack.Screen name="RegisterPage" component={RegisterPage} />
        <Stack.Screen name="CreateKelas" component={CreateKelas} />
        <Stack.Screen name="UpdateKelas" component={UpdateKelas} />
      </Stack.Navigator>
    </NavigationContainer>
    </SWRConfig>
  );
}
