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
import CreateLinkAdmin from "./pages/admin/action/CreateLinkAdmin";

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
          routes: [{ name: 'VerifyPage' }]
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
        <Stack.Screen name="HomePageAdmin" component={HomePageAdmin} />
        <Stack.Screen name="VerifyPage" component={VerifyPage} options={{ headerBackVisible: false }} />
        <Stack.Screen name="UjianPageUser" component={UjianPageUser} options={{ headerBackVisible: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
