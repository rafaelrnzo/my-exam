import { Button, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import WebView from "react-native-webview";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_API_URL from "../../constant/ip";

const PaymentScreen = ({ navigation, route }) => {
  const {snap_token, pay_token} = route.params
  const clientKey = 'SB-Mid-client-6nVp9w_Xc4Ghak7I';
  const [statusPay, setStatusPay] = useState('');
  const [prevStatusPay, setPrevStatusPay] = useState('');

  const injectScript = `
    document.addEventListener("DOMContentLoaded", function() {
      var script = document.createElement("script");
      script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
      script.setAttribute("data-client-key", "${clientKey}");
      document.head.appendChild(script);
    });
  `;

  const getStatusPay = async() => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.get(`${BASE_API_URL}get-pay/${pay_token}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStatusPay(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (statusPay !== prevStatusPay) {
      getStatusPay();
      setPrevStatusPay(statusPay);
    }
  }, [statusPay]);

  useEffect(() => {
    if (statusPay && statusPay !== 'pending') {
      navigation.replace('MainAdmin');
    }
  }, [statusPay]);
  
  return (
    <View style={{ flex:1 }}>
      <WebView
      style={{ flex:1 }}
        javaScriptEnabled={true}
        javaScriptCanOpenWindowsAutomatically={true}
        domStorageEnabled={true}
        cacheEnabled={true}
        allowFileAccessFromFileURLs={true}
        allowFileAccess={true}
        cacheMode="LOAD_NO_CACHE"
        injectedJavaScript={injectScript}
        source={{ uri: `https://app.sandbox.midtrans.com/snap/v2/vtweb/${snap_token}` }}
        />
    </View>
  );
};

export default PaymentScreen;
