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

export default combineReducers({
  articles,
  admin
});