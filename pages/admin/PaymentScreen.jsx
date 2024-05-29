import React, { useEffect } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";
import { useApi } from "../../utils/useApi";

const PaymentScreen = ({ navigation, route }) => {
  const { snap_token, pay_token } = route.params;
  const clientKey = "SB-Mid-client-6nVp9w_Xc4Ghak7I";
  const {
    data: statusPay,
    error,
    isLoading,
    mutate,
  } = useApi(`${BASE_API_URL}get-pay/${pay_token}`);

  const injectScript = `
    document.addEventListener("DOMContentLoaded", function() {
      var script = document.createElement("script");
      script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
      script.setAttribute("data-client-key", "${clientKey}");
      document.head.appendChild(script);
    });
  `;

  useEffect(() => {
    const interval = setInterval(() => {
      mutate(); // Revalidate the data every 5 seconds
    }, 3000);

    return () => clearInterval(interval);
  }, [mutate]);

  useEffect(() => {
    if (statusPay && statusPay !== "pending") {
      navigation.reset({
        index: 0,
        routes: [{ name: "MainAdmin" }],
      });
    }
  }, [statusPay]);

  return (
    <View style={{ flex: 1 }}>
      <WebView
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        javaScriptCanOpenWindowsAutomatically={true}
        domStorageEnabled={true}
        cacheEnabled={true}
        allowFileAccessFromFileURLs={true}
        allowFileAccess={true}
        cacheMode="LOAD_NO_CACHE"
        injectedJavaScript={injectScript}
        source={{
          uri: `https://app.sandbox.midtrans.com/snap/v2/vtweb/${snap_token}`,
        }}
      />
    </View>
  );
};

export default PaymentScreen;
