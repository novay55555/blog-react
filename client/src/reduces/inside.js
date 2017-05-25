import { combineReducers } from 'redux'
import { actionTypes } from '../actions/inside'

const articles = (state = { activeIndex: 0, articleMode: 'add' }, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_ARTICLE_TABS:
      return {
        ...state,
        activeIndex: action.tabIndex,
        articleMode: action.mode
      };
    default:
      return state;
  }
};

const admin = (state = { hasEntered: false }, action) => {
  switch (action.type) {
    case actionTypes.ENTERED_INSIDE:
      return {
        ...state,
        hasEntered: true
      };
    default:
      return state;
  }
};

const users = (state = { items: [], page: 1, total: 0 }, action) => {
  switch (action.type) {
    case actionTypes.GETTING_USERS:
      return {
        ...state,
        isFetching: true,
        errMsg: ''
      };
    case actionTypes.GOT_USERS:
      return {
        ...state,
        isFetching: false,
        items: action.items,
        page: action.page,
        total: action.total
      };
    case actionTypes.ERROR_GET_USERS:
      return {
        ...state,
        isFetching: false,
        errMsg: action.errMsg
      };
    case actionTypes.EDITTING_USER:
      return {
        ...state,
        isEditing: true
      };
    case actionTypes.EDITED_USER:
      return {
        ...state,
        isEditing: false,
        items: action.updateItems()
      };
    case actionTypes.ERROR_DELETE_USER:
      return {
        ...state,
        isEditing: false
      };
    case actionTypes.DELETING_USER:
      return {
        ...state,
        isDeleting: true
      };
    case actionTypes.DELETED_USER:
      return {
        ...state,
        isDeleting: false,
        items: action.updateItems()
      };
    case actionTypes.ERROR_DELETE_USER:
      return {
        ...state,
        isDeleting: false
      };
    default:
      return state;
  }
};

export default combineReducers({
  articles,
  admin,
  users
});