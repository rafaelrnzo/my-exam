// BottomSheetModal.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { textTitle } from '../../../assets/style/basic';

const BottomSheetModal = ({ isVisible, onClose, text, onDelete, onEdit }) => {
  return (
    <Modal
      isVisible={isVisible}
      className="flex justify-end m-0"
      onBackdropPress={onClose}
      swipeDirection="down"
      onSwipeComplete={onClose}
      backdropColor="black"
      backdropOpacity={0.2}  // Set the opacity here
    >
      <View className=" bg-slate-50 py-6 rounded-t-xl px-4 ">
        {/* <Text style={styles.title}>{text}</Text> */}
        <TouchableOpacity className=" p-3 px-5 border-b-[0.5px] items-center flex border-slate-400" onPress={onDelete}>
          <Text className={`${textTitle} font-medium text-red-500`}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity className=" p-3 px-5 border-b-[0.5px] items-center flex border-slate-400" onPress={onEdit}>
          <Text className={`${textTitle} font-medium`}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity className=" p-3 px-5 border-b-[0.5px] items-center flex border-slate-400" onPress={onClose}>
          <Text className={`${textTitle} font-medium`}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#03A9F4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default BottomSheetModal;
