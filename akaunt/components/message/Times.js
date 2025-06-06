import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Times = ({ total }) => {
  const hours = parseInt(total / 3600);
  const minutes = parseInt(total / 60);
  const seconds = total % 60;

  return (
    <View style={styles.row}>
      <Text style={styles.time}>
        {hours.toString().padStart(2, '0')}
      </Text>
      <Text style={styles.separator}>:</Text>
      <Text style={styles.time}>
        {minutes.toString().padStart(2, '0')}
      </Text>
      <Text style={styles.separator}>:</Text>
      <Text style={styles.time}>
        {seconds.toString().padStart(2, '0')}s
      </Text>
    </View>
  );
};

export default Times;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  separator: {
    fontSize: 16,
    marginHorizontal: 2,
  },
});