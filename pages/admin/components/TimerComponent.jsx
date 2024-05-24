import { useEffect, useState } from "react";
import { Text } from "react-native";

const TimerComponent = ({ waktu_pengerjaan, onFinish }) => {
    const [timeLeft, setTimeLeft] = useState(waktu_pengerjaan * 60); // Convert minutes to seconds
  
    useEffect(() => {
      if (timeLeft <= 0) {
        onFinish();
        return;
      }
  
      const intervalId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
  
      return () => clearInterval(intervalId);
    }, [timeLeft, onFinish]);
  
    const formatTime = (seconds) => {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };
  
    return (
      <Text className="text-blue-500 text-lg">
        {formatTime(timeLeft)}
      </Text>
    );
  };
  export default TimerComponent