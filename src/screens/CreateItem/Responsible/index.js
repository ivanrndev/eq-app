import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Keyboard,
} from 'react-native';
import {CreateItemContainer} from '../CreateItemContainer';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {getUserList} from '../../../actions/actions';
import T from '../../../i18n';

import {roles, width} from '../../../constants/dimentionsAndUnits';
import {Button, Menu, TextInput} from 'react-native-paper';
import {validateEmail} from '../../../utils/validation';
import Arrow from '../../../assets/svg/arrow-down.svg';
import {saveResponsible} from '../../../actions/createItem';
import {AutocompleteDropdown} from 'react-native-autocomplete-dropdown';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

const initialValues = {
  firstName: '',
  email: '',
  role: {item: T.t('employee')},
};
const initialErrors = {
  firstName: '',
  email: '',
};
const Responsible = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [users, responsible] = useSelector(({give, createItem}) => [
    give.userList,
    createItem.responsible,
  ]);
  const [responsibleUser, setResponsibleUser] = useState({title: ''});
  const [errorSelectedUser, seteErrorSelectedUser] = useState('');
  const [visible, setVisible] = useState(false);
  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setError] = useState(initialErrors);

  useEffect(() => {
    if (
      !responsible.firstName &&
      !responsible.email &&
      !responsible.id &&
      !responsible.role
    ) {
      setFormValues(initialValues);
      setResponsibleUser({title: ''});
      seteErrorSelectedUser('');
      setError(initialErrors);
    }
  }, [responsible]);
  useEffect(() => {
    dispatch(getUserList(navigation, '', 'CreateItemResponsible'));
  }, []);
  /*  useEffect(() => {
    formValues.firstName &&
      (setResponsibleUser({title: ''}) && seteErrorSelectedUser(''));
  }, [formValues.firstName]);*/

  const handleSelectTextChange = text => {
    setResponsibleUser({title: text});
    const selectedUser = users.find(user => user.firstName === text);
    selectedUser
      ? seteErrorSelectedUser('')
      : seteErrorSelectedUser(T.t('error_user_not_exist'));
  };
  const handleTextChange = (text, name) => {
    setFormValues({...formValues, [name]: text});
    setResponsibleUser({title: ''});
    seteErrorSelectedUser('');
    if (name === 'firstName') {
      text.length <= 2
        ? setError({...errors, firstName: T.t('error_required')})
        : setError({...errors, firstName: ''});
    }
    if (name === 'email') {
      !validateEmail(text)
        ? setError({...errors, email: T.t('error_valid_email')})
        : setError({...errors, email: ''});
    }
  };
  const handleSelectResp = item => {
    setResponsibleUser(item);
    setFormValues(initialValues);
    seteErrorSelectedUser('');
  };
  const handleChooseRole = item => {
    setFormValues({...formValues, role: item});
    setVisible(false);
  };
  const renderItem = item => (
    <Menu.Item
      onPress={() => handleChooseRole(item)}
      title={
        item.item === 'admin'
          ? T.t('administrator')
          : item.item === 'stockman'
          ? T.t('stockman')
          : T.t('employee')
      }
    />
  );
  const newUser =
    !!formValues.firstName && !!formValues.email && errors.email.length === 0;

  const handleSave = () => {
    if (newUser) {
      dispatch(saveResponsible(formValues));
    } else {
      const data = !!responsibleUser
        ? {firstName: responsibleUser.title ?? '', id: responsibleUser.id}
        : formValues;
      if (
        !!responsibleUser ||
        (formValues.firstName &&
          formValues.email &&
          !errors.firstName &&
          !errors.email)
      ) {
        dispatch(saveResponsible(data));
      }
    }
    navigation.navigate('CreateItem');
  };
  const isSaveBtnEnabled =
    newUser || !!users.find(user => user.firstName === responsibleUser.title);

  return (
    <CreateItemContainer
      handleSave={handleSave}
      isSaveBtnEnabled={isSaveBtnEnabled}>
      <TouchableWithoutFeedback
        style={styles.inputWrap}
        contantContainerStyle={styles.contentStyle}
        onPress={Keyboard.dismiss}>
        <>
          <Text style={styles.left}>{T.t('choose_user')}:</Text>
          <AutocompleteDropdown
            clearOnFocus={false}
            closeOnBlur={false}
            closeOnSubmit={true}
            showClear={false}
            onChangeText={text => handleSelectTextChange({title: text})}
            onSelectItem={item => handleSelectResp(item)}
            dataSet={() =>
              users.map(item => ({
                title: item.lastName ? `${item.firstName} ${item.lastName}` : item.firstName,
                id: item._id,
              }))
            }
            textInputProps={{
              placeholder: T.t('choose_user'),
              autoCorrect: false,
              autoCapitalize: 'none',
              style: styles.inputDropdown,
              placeholderTextColor: 'gray',
              defaultValue: responsible,
              value: responsibleUser.title,
            }}
            rightButtonsContainerStyle={styles.inputBtn}
            suggestionsListContainerStyle={styles.dropdown}
          />
          <Text style={styles.errFirst}>{errorSelectedUser}</Text>
          <Text style={styles.center}>{T.t('or')}</Text>
          <Text style={styles.left}>{T.t('or_create_new_user')}:</Text>
          <View style={styles.createWrap}>
            <TextInput
              value={formValues.firstName}
              style={styles.input}
              label={`${T.t('name')}`}
              mode="outlined"
              error={errors.type}
              onChangeText={text => handleTextChange(text, 'firstName')}
            />
            <Text style={styles.err}>{errors.firstName}</Text>
            <TextInput
              value={formValues.email}
              style={[styles.input, styles.secondInput]}
              label={T.t('email')}
              mode="outlined"
              onChangeText={text => handleTextChange(text, 'email')}
            />
            <Text style={styles.err}>{errors.email}</Text>
          </View>
        </>
      </TouchableWithoutFeedback>
      <View style={styles.itemWrap}>
        <Menu
          visible={visible}
          anchor={
            <Button onPress={() => setVisible(true)}>
              {formValues.role.item === 'admin'
                ? T.t('administrator')
                : formValues.role.item === 'stockman'
                ? T.t('stockman')
                : T.t('employee')}{' '}
              <View style={styles.arrowWrap}>
                <Arrow width={15} height={15} />
              </View>
            </Button>
          }>
          <FlatList
            data={roles}
            keyExtractor={item => item}
            renderItem={renderItem}
          />
        </Menu>
      </View>
    </CreateItemContainer>
  );
};
export default Responsible;

const styles = StyleSheet.create({
  left: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'left',
    margin: 5,
    width: width / 1.1,
    alignSelf: 'center',
  },
  center: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 5,
    width: width / 1.1,
    marginBottom: 20,
  },
  inputWrap: {
    width: width,
    marginVertical: 5,
    position: 'relative',
  },
  contentStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  createWrap: {
    alignItems: 'center',
    width: width,
  },
  input: {
    width: width / 1.1,
    height: 50,
  },
  item: {
    padding: 5,
    marginTop: 2,
    backgroundColor: '#EDF6FF',
    borderColor: '#bbb',
    borderWidth: 1,
    borderRadius: 5,
  },
  textInput: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 5,
  },
  arrowWrap: {
    marginBottom: -1.5,
  },

  itemWrap: {
    width: width / 1.3,
    marginBottom: 30,
    alignSelf: 'center',
    marginTop: -10,
  },
  err: {
    height: 15,
    color: '#8c231f',
    marginTop: 5,
    fontSize: 10,
    textAlign: 'left',
    width: width / 1.1,
  },
  errFirst: {
    height: 15,
    color: '#8c231f',
    marginTop: 5,
    fontSize: 10,
    position: 'absolute',
    top: 95,
    left: 20,
    width: width / 1.1,
    textAlign: 'left',
    zIndex: -1,
  },
  inputDropdown: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 5,
    width: Dimensions.get('window').width / 1.1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#929394',
    height: 55,
    borderRadius: 5,
    padding: 15,
  },
  inputBtn: {
    right: 10,
    height: 55,
    top: 10,
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  dropdown: {
    top: 0,
    width: Dimensions.get('window').width / 1.1,
    alignSelf: 'center',
    backgroundColor: '#C5CDD5',
    position: 'relative',
    zIndex: 2,
  },
});
