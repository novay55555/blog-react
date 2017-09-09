import { combineReducers } from 'redux';
import { actionTypes } from '../actions/account';
import { actionTypes as insideActionTypes } from '../actions/inside';

const user = (state = { isLogin: false }, action) => {
  switch (action.type) {
    case actionTypes.POSTING_SIGNIN:
      return {
        ...state,
        isFetching: true
      };
    case actionTypes.POSTED_SIGNIN:
      return {
        ...state,
        isFetching: false,
        isLogin: true,
        username: action.username,
        isAdmin: action.isAdmin
      };
    case actionTypes.ERROR_POST_SIGNIN:
      return {
        ...state,
        isFetching: false
      };
    case actionTypes.POSTING_REGISTER:
      return {
        ...state,
        isFetching: true
      };
    case actionTypes.POSTED_REGISTER:
      return {
        ...state,
        isFetching: false
      };
    case actionTypes.ERROR_POST_REGISTER:
      return {
        ...state,
        isFetching: false
      };
    case actionTypes.SHOW_MODAL:
      return {
        ...state,
        activeModal: action.modalName
      };
    case actionTypes.HIDE_MODAL:
      return {
        ...state,
        activeModal: undefined
      };
    case actionTypes.GETTING_SIGNOUT:
      return {
        ...state,
        isFetching: true
      };
    case actionTypes.GOT_SIGNOUT:
      return {
        ...state,
        isFetching: false,
        username: '',
        isAdmin: false,
        isLogin: false
      };
    case actionTypes.ERROR_GET_SIGNOUT:
      return {
        ...state,
        isFetching: false
      };
    case actionTypes.CHECKOUT_SESSION_ALIVE:
      return {
        ...state,
        username: action.username,
        isLogin: true,
        isAdmin: action.isAdmin
      };
    case actionTypes.CHECKOUT_SESSION_DEAD:
      return {
        ...state,
        username: '',
        isLogin: false,
        isAdmin: false
      };
    default:
      return state;
  }
};

const admin = (state = { photo: '', name: '', job: '', intro: '' }, action) => {
  switch (action.type) {
    case actionTypes.GETTING_ADMIN:
      return {
        ...state,
        isFetching: true,
        errMsg: ''
      };
    case actionTypes.GOT_ADMIN:
      return {
        ...state,
        photo: action.admin.photoUrl || '/img/kato.jpg',
        name: action.admin.name,
        job: action.admin.job,
        intro: action.admin.intro,
        isFetching: false
      };
    case actionTypes.ERROR_GET_ADMIN:
      return {
        ...state,
        isFetching: false,
        errMsg: action.errMsg
      };
    case insideActionTypes.POSTED_ADMIN_AVATAR:
      return {
        ...state,
        photo: action.avatar
      };
    default:
      return state;
  }
};

export default combineReducers({
  user,
  admin
});
