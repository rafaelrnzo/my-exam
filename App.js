import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "./pages/LoginPage";
import HomePageUser from "./pages/user/HomePageUser";
import HomePageAdmin from "./pages/admin/HomePageAdmin";
import UjianPageUser from "./pages/user/UjianPageUser";
import CreateLinkAdmin from "./pages/admin/action/CreateLinkAdmin";
import UpdateLinkAdmin from "./pages/admin/action/UpdateLinkAdmin";
import ProfilePageUser from "./pages/user/ProfilePageUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef } from "react";
import BlankScreen from "./components/BlankScreen";

export default function App() {
  const Stack = createNativeStackNavigator();
  const navigationRef = useRef();

  const checkAuth = async() => {
    const role = await AsyncStorage.getItem('role')
    const token = await AsyncStorage.getItem('token')
    if(token && role !== null){
      switch (role) {
        case 'admin':
          navigationRef.current?.navigate('HomePageAdmin')
          break;
        case 'siswa':
          navigationRef.current?.navigate('HomePageUser')
        default:
          navigationRef.current?.navigate('HomePageUser')
          break;
      }
      navigationRef.current?.reset({ index: 0, routes: [{ name: role === 'admin' ? 'HomePageAdmin' : 'HomePageUser' }] });
    } else {
      navigationRef.current?.navigate('LoginPage')
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])
  
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="BlankScreen">
        <Stack.Screen name="BlankScreen" component={BlankScreen} options={{ headerShown:false }} />
        <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown:false }} />
        <Stack.Screen name="HomePageUser" component={HomePageUser} />
        <Stack.Screen name="UjianPageUser" component={UjianPageUser} />
        <Stack.Screen name="ProfilePageUser" component={ProfilePageUser} />
        <Stack.Screen name="HomePageAdmin" component={HomePageAdmin} />
        <Stack.Screen name="CreateLinkAdmin" component={CreateLinkAdmin} />
        <Stack.Screen name="UpdateLinkAdmin" component={UpdateLinkAdmin} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
