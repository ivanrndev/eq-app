import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {CreateItemContainer} from '../CreateItemContainer';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {getUserList} from '../../../actions/actions';
import T from '../../../i18n';
import SearchableDropdown from 'react-native-searchable-dropdown';
import {roles, width} from '../../../constants/dimentionsAndUnits';
import {Button, Menu, TextInput} from 'react-native-paper';
import {validateEmail, validateFloatNumbers} from '../../../utils/validation';
import Arrow from '../../../assets/svg/arrow-down.svg';
import {saveResponsible} from '../../../actions/createItem';

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
  const [responsibleUser, setResponsibleUser] = useState({name: ''});
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
      setResponsibleUser({name: ''});
      seteErrorSelectedUser('');
      setError(initialErrors);
    }
  }, [responsible]);
  useEffect(() => {
    dispatch(getUserList(navigation, '', 'CreateItemResponsible'));
  }, []);
  useEffect(() => {
    formValues.firstName &&
      (setResponsibleUser({name: ''}) && seteErrorSelectedUser(''));
  }, [formValues.firstName]);

  const handleSelectTextChange = text => {
    setResponsibleUser({name: text});
    const selectedUser = users.find(user => user.firstName === text);
    selectedUser
      ? seteErrorSelectedUser('')
      : seteErrorSelectedUser(T.t('error_user_not_exist'));
  };
  const handleTextChange = (text, name) => {
    setFormValues({...formValues, [name]: text});
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
  };
  const handleChooseRole = item => {
    setFormValues({...formValues, role: item});
    setVisible(false);
  };
  const renderItem = item => (
    <Menu.Item onPress={() => handleChooseRole(item)} title={item.item} />
  );
  const newUser =
    !!formValues.firstName && !!formValues.email && errors.email.length === 0;

  const handleSave = () => {
    if (newUser) {
      dispatch(saveResponsible(formValues));
    } else {
      const data = !!responsibleUser
        ? {firstName: responsibleUser.name, id: responsibleUser.id}
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
  return (
    <CreateItemContainer handleSave={handleSave}>
      <View style={styles.inputWrap}>
        <Text style={styles.left}>{T.t('choose_user')}:</Text>
        <SearchableDropdown
          onItemSelect={item => handleSelectResp(item)}
          containerStyle={styles.inputContainer}
          onRemoveItem={() => setResponsibleUser('')}
          itemStyle={styles.item}
          textInputStyle={styles.input}
          itemsContainerStyle={styles.itemsContainer}
          items={users.map(item => ({
            name: item.firstName,
            id: item._id,
          }))}
          resetValue={false}
          textInputProps={{
            placeholder: T.t('choose_user'),
            underlineColorAndroid: 'transparent',
            style: [
              styles.textInput,
              !!errorSelectedUser
                ? {borderColor: '#8c231f'}
                : {borderColor: '#22215B'},
            ],
            value: responsibleUser.name ?? '',
            onTextChange: text => handleSelectTextChange(text),
          }}
          listProps={{
            nestedScrollEnabled: true,
          }}
        />
        <Text style={styles.errFirst}>{errorSelectedUser}</Text>
        <Text style={styles.center}>{T.t('or')}</Text>
        <Text style={styles.left}>{T.t('or_create_new_user')}:</Text>
        <View>
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
          <Menu
            visible={visible}
            style={styles.itemWrap}
            anchor={
              <Button onPress={() => setVisible(true)}>
                {formValues.role.item}{' '}
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
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    marginVertical: 30,
    position: 'relative',
  },
  inputContainer: {
    width: width / 1.1,
    height: 137,
    marginTop: 0,
  },
  itemsContainer: {
    maxHeight: 140,
    position: 'relative',
    zIndex: 1000,
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
    marginTop: 30,
  },
  err: {
    height: 15,
    color: '#8c231f',
    marginTop: 5,
    fontSize: 10,
  },
  errFirst: {
    height: 15,
    color: '#8c231f',
    marginTop: 5,
    fontSize: 10,
    position: 'absolute',
    top: 70,
    width: width / 1.1,
    textAlign: 'left',
    zIndex: -1,
  },
});
