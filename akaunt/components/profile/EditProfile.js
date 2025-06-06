import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { updateProfileUser } from '../../redux/actions/profileAction';
import { checkImage } from '../../utils/imageUpload';

const EditProfile = ({ setOnEdit }) => {
  const initState = {
    fullname: '', mobile: '', address: '', website: '', story: '', gender: 'male'
  };

  const [userData, setUserData] = useState(initState);
  const [avatar, setAvatar] = useState(null);

  const { fullname, mobile, address, website, story, gender } = userData;
  const auth = useSelector(state => state.auth);
  const theme = useSelector(state => state.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    setUserData(auth.user);
  }, [auth.user]);

  const changeAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert('Permission required to access photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const file = result.assets[0];
      const err = checkImage(file);
      if (err) {
        return dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } });
      }
      setAvatar(file);
    }
  };

  const handleChange = (name, value) => {
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = () => {
    dispatch(updateProfileUser({ userData, avatar, auth }));
    setOnEdit(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => setOnEdit(false)}>
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.avatarWrapper} onPress={changeAvatar}>
        <Image
          source={{ uri: avatar ? avatar.uri : auth.user.avatar }}
          style={[styles.avatar, { tintColor: theme ? '#fff' : undefined }]}
        />
        <Text style={styles.changeText}>Change Avatar</Text>
      </TouchableOpacity>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={fullname}
          onChangeText={(val) => handleChange('fullname', val)}
        />
        <Text style={styles.charCount}>{fullname.length}/25</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Mobile</Text>
        <TextInput
          style={styles.input}
          value={mobile}
          onChangeText={(val) => handleChange('mobile', val)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={(val) => handleChange('address', val)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Website</Text>
        <TextInput
          style={styles.input}
          value={website}
          onChangeText={(val) => handleChange('website', val)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Story</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          multiline
          value={story}
          onChangeText={(val) => handleChange('story', val)}
        />
        <Text style={styles.charCount}>{story.length}/200</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Gender</Text>
        <Picker
          selectedValue={gender}
          onValueChange={(val) => handleChange('gender', val)}
          style={[styles.picker, { color: theme ? '#fff' : '#000' }]}
          itemStyle={{ color: theme ? '#fff' : '#000' }} // iOS only
        >
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
          <Picker.Item label="Other" value="other" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  closeText: {
    color: 'crimson',
    fontSize: 16,
    fontWeight: '600',
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  changeText: {
    marginTop: 5,
    color: '#007bff',
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  charCount: {
    marginTop: 4,
    fontSize: 12,
    textAlign: 'right',
    color: 'gray',
  },
  picker: {
    backgroundColor: '#f9f9f9',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});