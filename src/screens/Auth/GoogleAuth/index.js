import React, {useEffect} from 'react';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import {useDispatch} from 'react-redux';
import {authWithGoogleAccount} from '../../../actions/actions';
import {Dimensions, StyleSheet} from 'react-native';

const GoogleAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '753194651551-aaktfmil1qvflej2usc24t65d7r4fk67.apps.googleusercontent.com',

      accountName: 'EqMan',
      iosClientId:
        '753194651551-4kve0pmjfbacv0n67gps9da8jkt3quc1.apps.googleusercontent.com',
    });
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      dispatch(authWithGoogleAccount(userInfo.idToken));
    } catch (error) {
      if (error) {
        console.log('ERR1', error);
      }
    }
  };

  return (
    <GoogleSigninButton
      style={styles.btn}
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Light}
      onPress={signIn}
    />
  );
};
const styles = StyleSheet.create({
  btn: {
    height: 50,
    width: Dimensions.get('window').width / 1.3,
    maxWidth: 230,
    alignSelf: 'center',
    borderRadius: 10,
  },
});

export default GoogleAuth;
