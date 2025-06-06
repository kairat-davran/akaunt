import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '../Avatar';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';

const Status = () => {
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const handleOpenStatus = () => {
    dispatch({ type: GLOBALTYPES.STATUS, payload: true });
  };

  return (
    <View style={styles.status}>
      <Avatar src={auth.user.avatar} size="big-avatar" />
      <TouchableOpacity style={styles.statusBtn} onPress={handleOpenStatus}>
        <Text style={styles.statusText}>
          {auth.user.username}, what are you thinking?
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Status;

const styles = StyleSheet.create({
  status: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 5,
    borderColor: 'rgba(0, 0, 0, 0.125)',
    borderWidth: 1,
    elevation: 2,
    marginVertical: 10,
  },
  statusBtn: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginLeft: 10,
    justifyContent: 'center',
  },
  statusText: {
    color: '#555',
  },
});