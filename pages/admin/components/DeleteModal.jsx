import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';

const DeleteConfirmationModal = ({ visible, onCancel, onConfirm, onDelete }) => {
  return (
    <Modal
      isVisible={visible}
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center' }}>
          <Text style={{ marginBottom: 20 }}>Are you sure you want to delete?</Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={onCancel} style={{ marginRight: 20 }}>
              <Text style={{ color: 'blue' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm}>
              <Text style={{ color: 'red' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteConfirmationModal;
