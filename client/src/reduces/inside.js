import { combineReducers } from 'redux'
import { actionTypes } from '../actions/inside'

const articles = (state = { activeIndex: 0 }, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_ARTICLE_TABS:
      return {
        ...state,
        activeIndex: action.tabIndex
      };
    case actionTypes.ADDED_ARTICLE:
      return {
        ...state,
        isUploading: true
      };
    case actionTypes.ADDED_ARTICLE:
      return {
        ...state,
        isUploading: false
      };
    case actionTypes.ERROR_ADD_ARTICLE:
      return {
        ...state,
        isUploading: false
      };
    default:
      return state;
  }
};

export default combineReducers({
  articles
});