import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "./pages/LoginPage";
import HomePageUser from "./pages/user/HomePageUser";
import HomePageAdmin from "./pages/admin/HomePageAdmin";
import VerifyPage from "./pages/VerifyPage";
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

export default function App() {
  const Stack = createNativeStackNavigator();
  const navigationRef = useRef();

  useEffect(() => {
    const checkAuth = async () => {
      const role = await AsyncStorage.getItem('role');
      const token = await AsyncStorage.getItem('token');
      if (token && role == 'siswa') {
        navigationRef.current?.reset({
          index: 0,
          routes: [{ name: 'HomePageUser' }]
        });
      } else {
        navigationRef.current?.navigate('MainAdmin');
      }
    };

    checkAuth();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="BlankScreen">
        <Stack.Screen name="BlankScreen" component={BlankScreen} options={{ headerShown:false }} />
        <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown:false }} />
        <Stack.Screen name="LoginAsAdmin" component={LoginAsAdmin} options={{ headerShown:false }} />
        <Stack.Screen name="HomePageUser" component={HomePageUser} options={{ headerBackVisible: false }} />
        <Stack.Screen name="MainAdmin" component={MainAdmin} options={{ headerShown:false }} />
        <Stack.Screen name="CreateLinkAdmin" component={CreateLinkAdmin} />
        <Stack.Screen name="UpdateUser" component={UpdateUser} />
        <Stack.Screen name="CreateUser" component={CreateUser} />
        <Stack.Screen name="SubsPage" component={SubsPage} options={{ headerBackVisible: false }} />
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} options={{ headerBackVisible: false }} />
        <Stack.Screen name="UpdateLinkAdmin" component={UpdateLinkAdmin} />
        <Stack.Screen name="HomePageAdmin" component={HomePageAdmin} />
        <Stack.Screen name="ListUser" component={ListUser} />
        <Stack.Screen name="MonitoringPage" component={MonitoringPage} />
        <Stack.Screen name="VerifyPage" component={VerifyPage} options={{ headerBackVisible: false }} />
        <Stack.Screen name="UjianPageUser" component={UjianPageUser} options={{ headerBackVisible: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
