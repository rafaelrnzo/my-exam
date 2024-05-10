import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import WebView from "react-native-webview";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_API_URL from "../../constant/ip";

const PaymentScreen = ({ navigation, route }) => {
  const {snap_token} = route.params
  const clientKey = 'SB-Mid-client-6nVp9w_Xc4Ghak7I';

  const injectScript = `
    document.addEventListener("DOMContentLoaded", function() {
      var script = document.createElement("script");
      script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
      script.setAttribute("data-client-key", "${clientKey}");
      document.head.appendChild(script);
    });
  `;
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
      <Button onPress={() => navigation.pop()} title="tes" />
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({});
