import { actionTypes } from '../actions/account'

const account = (state = { isLogin: false }, action) => {
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
        username: action.username
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
    default:
      return state;
  }
};

export default account