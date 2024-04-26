import { View, Text } from 'react-native'
import React,{useState, useEffect} from 'react'
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_API_URL from '../../constant/ip';

const MonitoringPage = () => {
  const [users, setUsers] = useState([])
  const [links, setLinks] = useState([])
  const [status, setStatus] = useState([]);
  const getUserProgress = async() => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${BASE_API_URL}progress`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const responseData = response.data.data;
      const userProgress = responseData.map(item => item.user);
      const linkProgress = responseData.map(item => item.link);
      const status = responseData.map(item => item.status_progress);
      setUsers(userProgress)
      setLinks(linkProgress)
      setStatus(status);
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getUserProgress()
  }, [])
  
  return (
    <View>
      {users.map((item, index) => (
        <View style={{ flexDirection:'row' }}>
        <Text>{item.name}</Text>
        <Text>{status[index]}</Text>
        <Text>{links[index]}</Text>
        </View>
      ))}
    </View>
  )
}

export default MonitoringPage