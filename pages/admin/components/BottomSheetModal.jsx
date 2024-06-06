// BottomSheetModal.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { textBasic } from '../../../assets/style/basic';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

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
      <View className=" bg-slate-50 py-4 rounded-t-xl px-4 flex  ">
        <View className="bg-slate-200 h-[4px] w-1/4 rounded-full self-center"></View>
        <View >
          <TouchableOpacity className=" p-3 px-5 items-start flex" onPress={onDelete}>
            <View className="flex flex-row items-center gap-x-3">
              <FontAwesomeIcon
                icon={faTrash}
                color={"#0f172a"}
                size={18}
              />
              <Text className={`${textBasic} text-lg font-medium `}>Delete</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity className=" p-3 px-5 items-start flex" onPress={onEdit}>
            <View className="flex flex-row items-center gap-x-3 ">
              <FontAwesomeIcon
                icon={faPen}
                color={"#0f172a"}
                size={18}
              />
              <Text className={`${textBasic} text-lg font-medium text`}>Edit</Text>
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity className=" p-3 px-5 items-start flex" onPress={onClose}>
            <Text className={`${textBasic} text-lg font-medium`}>Close</Text>
          </TouchableOpacity> */}
        </View>
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
