import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import WebView from 'react-native-webview';
import {useNavigation} from '@react-navigation/native';
import {Button} from 'react-native-paper';
import T from '../../../i18n';

const WebViewPage = () => {
  const webviewRef = useRef(null);
  const navigation = useNavigation();

  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  const backButtonHandler = () => {
    navigation.navigate('Auth');
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.flexContainer}>
        <Button
          icon="arrow-left-thick"
          color="#137CDF"
          onPress={backButtonHandler}
          style={{
            alignSelf: 'flex-start',
            backgroundColor: 'transparent',
            color: 'navy',
          }}>
          {T.t('back')}
        </Button>

        <WebView
          source={{uri: 'http://admin.eqman.co/auth/register'}}
          startInLoadingState={true}
          renderLoading={() => (
            <ActivityIndicator
              color="black"
              size="large"
              style={styles.flexContainer}
            />
          )}
          ref={webviewRef}
          onNavigationStateChange={navState => {
            setCanGoBack(navState.canGoBack);
            setCanGoForward(navState.canGoForward);
            setCurrentUrl(navState.url);
          }}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    position: 'relative',
  },
});

export default WebViewPage;
