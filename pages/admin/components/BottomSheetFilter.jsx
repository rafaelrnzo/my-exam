import React from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

const BottomSheetFilter = ({ isVisible, onClose, filters, setFilters, classes }) => {
  const toggleFilter = (classId) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [classId]: !prevFilters[classId],
    }));
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      swipeDirection="down"
      onSwipeComplete={onClose}
      backdropColor="black"
      backdropOpacity={0.2}
    >
      <View style={styles.modalContent}>
        <Text style={styles.title}>Filter by Class</Text>
        {classes.map(cls => (
          <View key={cls.id} style={styles.filterItem}>
            <Switch
              value={filters[cls.id] || false}
              onValueChange={() => toggleFilter(cls.id)}
            />
            <Text style={styles.filterText}>{cls.name}</Text>
          </View>
        ))}
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterText: {
    marginLeft: 8,
  },
  closeButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: 'blue',
  },
});

export default BottomSheetFilter;
