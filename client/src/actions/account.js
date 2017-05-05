import { Defer } from '../lib/common'
import md5 from 'blueimp-md5'
import config from '../lib/config'

const accountApi = config.api.account;
const { get, post } = Defer($);

export const actionTypes = {
  POSTING_SIGNIN: 'POSTING_SIGNIN',
  POSTED_SIGNIN: 'POSTED_SIGNIN',
  ERROR_POST_SIGNIN: 'ERROR_POST_SIGNIN',
  POSTING_REGISTER: 'POSTING_REGISTER',
  POSTED_REGISTER: 'POSTED_REGISTER',
  ERROR_POST_REGISTER: 'ERROR_POST_REGISTER',
  SHOW_MODAL: 'SHOW_MODAL',
  HIDE_MODAL: 'HIDE_MODAL',
  GETTING_SIGNOUT: 'GETTING_SIGNOUT',
  GOT_SIGNOUT: 'GOT_SIGNOUT',
  ERROR_GET_SIGNOUT: 'ERROR_GET_SIGNOUT'
};

const gettingSignout = () => ({
  type: actionTypes.GETTING_SIGNOUT
});

const gotSignout = () => ({
  type: actionTypes.GOT_SIGNOUT
});

const errorGetSignout = () => ({
  type: actionTypes.ERROR_GET_SIGNOUT
});

export const showModal = modalName => ({
  type: actionTypes.SHOW_MODAL,
  modalName
});

export const hideModal = () => ({
  type: actionTypes.HIDE_MODAL
});

const postingSignin = () => ({
  type: actionTypes.POSTING_SIGNIN
});

const postedSignin = (username, isAdmin) => ({
  type: actionTypes.POSTED_SIGNIN,
  username,
  isAdmin
});

const errorPostSignin = () => ({
  type: actionTypes.ERROR_POST_SIGNIN
});

const postingRegister = () => ({
  type: actionTypes.POSTING_REGISTER
});

const postedRegister = () => ({
  type: actionTypes.POSTED_REGISTER
});

const errorPostRegister = () => ({
  type: actionTypes.ERROR_POST_REGISTER
});

export const fetchSignin = (username, password, callback) => dispatch => {
  dispatch(postingSignin());
  post(`${accountApi.signin}`, { name: username, password: md5(password) })
    .done(data => {
      dispatch(postedSignin(data.username, data.isAdmin));
      alert('登录成功')
      callback && callback();
    })
    .fail(errMsg => {
      dispatch(errorPostSignin());
      alert(errMsg);
    });
};

export const fetchRegister = (username, password, email, callback) => dispatch => {
  dispatch(postingRegister());
  post(`${accountApi.register}`, { name: username, password: md5(password), email })
    .done(() => {
      dispatch(postedRegister());
      alert('注册成功')
      callback && callback();
    })
    .fail(errMsg => {
      dispatch(errorPostSignin());
      alert(errMsg);
    });
};

export const fetchSignout = () => dispatch => {
  dispatch(gettingSignout());
  get(`${accountApi.signout}`)
    .done(() => dispatch(gotSignout()))
    .fail(() => errorGetSignout());
};