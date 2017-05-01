import {combineReducers} from 'redux'
import { actionTypes } from '../actions/articles'

const lists = (state = { items: [], page: 1, total: 0 }, action) => {
  switch (action.type) {
    case actionTypes.GETTING_ARTICLES:
      return {
        ...state,
        isFetching: true
      };
    case actionTypes.GOT_ARTICLES:
      return {
        ...state,
        isFetching: false,
        items: action.items,
        total: action.items.length
      };
    case actionTypes.ERROR_GET_ARTICLES:
      return {
        ...state,
        isFetching: false,
        errMsg: action.errMsg
      };
    default:
      return state;
  }
};

const types = (state = { items: [] }, action) => {
  switch (action.type) {
    case actionTypes.GETTING_ARTICLE_TYPES:
      return {
        ...state,
        isFetching: true
      };
    case actionTypes.GOT_ARTICLE_TYPES:
      return {
        ...state,
        isFetching: false,
        items: action.items
      };
    case actionTypes.ERROR_GET_ARTICLE_TYPES:
      return {
        ...state,
        isFetching: false,
        errMsg: action.errMsg
      }
    default:
      return state;
  }
};

export default combineReducers({
  lists,
  types
});