import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/actions/authAction';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [userData, setUserData] = useState({ email: '', password: '' });
  const { email, password } = userData;
  const [typePass, setTypePass] = useState(false);

  useEffect(() => {
    if (auth.token) {
      navigation.replace('Home');
    }
  }, [auth.token]);

  const handleChangeInput = (name, value) => {
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = () => {
    dispatch(login(userData));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>akaunt</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        keyboardType="email-address"
        value={email}
        onChangeText={text => handleChangeInput('email', text)}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>
      <View style={styles.passContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Enter password"
          secureTextEntry={!typePass}
          value={password}
          onChangeText={text => handleChangeInput('password', text)}
        />
        <TouchableOpacity onPress={() => setTypePass(!typePass)}>
          <Text style={styles.toggle}>{typePass ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, !(email && password) && styles.disabled]}
        onPress={handleSubmit}
        disabled={!(email && password)}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerLink}>
          You don't have an account? <Text style={styles.registerNow}>Register Now</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

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
    marginBottom: 40
  },
  label: {
    marginBottom: 5,
    fontSize: 14,
    fontWeight: '600'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15
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
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  disabled: {
    backgroundColor: '#888'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  registerLink: {
    marginTop: 20,
    textAlign: 'center'
  },
  registerNow: {
    color: 'crimson',
    fontWeight: '600'
  }
});