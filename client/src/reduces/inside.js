import { combineReducers } from 'redux'
import { actionTypes } from '../actions/inside'

const articles = (state = { activeIndex: 0, item: {} }, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_ARTICLE_TABS:
      return {
        ...state,
        activeIndex: action.tabIndex
      };
    case actionTypes.ADDED_ARTICLE:
      return {
        ...state,
        isAdding: true
      };
    case actionTypes.ADDED_ARTICLE:
      return {
        ...state,
        isAdding: false
      };
    case actionTypes.ERROR_ADD_ARTICLE:
      return {
        ...state,
        isAdding: false
      };
    case actionTypes.GETTING_EDIT_ARTICLE:
      return {
        ...state,
        isFetching: true
      };
    case actionTypes.GOT_EDIT_ARTICLE:
      return {
        ...state,
        isFetching: false,
        item: action.item
      };
    case actionTypes.ERROR_GET_EDIT_ARTICLE:
      return {
        ...state,
        isFetching: false,
        item: {}
      };
    default:
      return state;
  }
};

export default combineReducers({
  articles
});