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

export default combineReducers({
  articles
});