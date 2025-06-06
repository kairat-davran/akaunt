import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../redux/actions/authAction';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const auth = useSelector(state => state.auth);
  const alert = useSelector(state => state.alert);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const initialState = {
    fullname: '',
    username: '',
    email: '',
    password: '',
    cf_password: '',
    gender: 'male'
  };

  const [userData, setUserData] = useState(initialState);
  const [typePass, setTypePass] = useState(false);
  const [typeCfPass, setTypeCfPass] = useState(false);

  useEffect(() => {
    if (auth.token) {
      navigation.replace('Home');
    }
  }, [auth.token]);

  const handleChangeInput = (name, value) => {
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = () => {
    dispatch(register(userData));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>akaunt</Text>

      {[
        { label: 'Full Name', name: 'fullname', value: userData.fullname },
        {
          label: 'User Name', name: 'username',
          value: userData.username.toLowerCase().replace(/ /g, '')
        },
        { label: 'Email', name: 'email', value: userData.email }
      ].map((field, idx) => (
        <View key={idx}>
          <Text style={styles.label}>{field.label}</Text>
          <TextInput
            style={[
              styles.input,
              alert[field.name] && styles.inputAlert
            ]}
            placeholder={`Enter ${field.label}`}
            value={field.value}
            onChangeText={text => handleChangeInput(field.name, text)}
            autoCapitalize="none"
          />
          {alert[field.name] && <Text style={styles.error}>{alert[field.name]}</Text>}
        </View>
      ))}

      {/* Password */}
      <Text style={styles.label}>Password</Text>
      <View style={styles.passContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }, alert.password && styles.inputAlert]}
          placeholder="Enter password"
          secureTextEntry={!typePass}
          value={userData.password}
          onChangeText={text => handleChangeInput('password', text)}
        />
        <TouchableOpacity onPress={() => setTypePass(!typePass)}>
          <Text style={styles.toggle}>{typePass ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>
      {alert.password && <Text style={styles.error}>{alert.password}</Text>}

      {/* Confirm Password */}
      <Text style={styles.label}>Confirm Password</Text>
      <View style={styles.passContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }, alert.cf_password && styles.inputAlert]}
          placeholder="Confirm password"
          secureTextEntry={!typeCfPass}
          value={userData.cf_password}
          onChangeText={text => handleChangeInput('cf_password', text)}
        />
        <TouchableOpacity onPress={() => setTypeCfPass(!typeCfPass)}>
          <Text style={styles.toggle}>{typeCfPass ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>
      {alert.cf_password && <Text style={styles.error}>{alert.cf_password}</Text>}

      {/* Gender */}
      <View style={styles.genderContainer}>
        {['male', 'female', 'other'].map(g => (
          <TouchableOpacity key={g} onPress={() => handleChangeInput('gender', g)}>
            <Text style={styles.gender}>
              <Text style={{ fontWeight: userData.gender === g ? 'bold' : 'normal' }}>
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </Text>
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Submit */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLink}>
          Already have an account? <Text style={styles.loginNow}>Login Now</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10
  },
  inputAlert: {
    backgroundColor: '#fd2d6a14'
  },
  passContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  toggle: {
    marginLeft: 10,
    color: '#007AFF',
    fontWeight: '600'
  },
  error: {
    color: 'crimson',
    marginBottom: 8
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15
  },
  gender: {
    fontSize: 16
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  loginLink: {
    marginTop: 20,
    textAlign: 'center'
  },
  loginNow: {
    color: 'crimson',
    fontWeight: '600'
  }
});