import {useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

export const useUserData = () => {
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState();
  const [lastName, setLastName] = useState();
  const [firstName, setFirstName] = useState();

  AsyncStorage.getItem('role').then(myRole => setRole(myRole));
  AsyncStorage.getItem('email').then(myEmail => setEmail(myEmail));
  AsyncStorage.getItem('lastName').then(myLastName => setLastName(myLastName));
  AsyncStorage.getItem('firstName').then(myFirstName =>
    setFirstName(myFirstName),
  );
  AsyncStorage.getItem('userId').then(resp => setUserId(resp));
  AsyncStorage.getItem('role').then(resp => setRole(resp));
  return {role, userId, email, lastName, firstName};
};
