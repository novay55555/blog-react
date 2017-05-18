import { combineReducers } from 'redux'
import { actionTypes as articleActionTypes } from '../actions/articles'
import { actionTypes as insideActionTypes } from '../actions/inside'

const lists = (state = { items: [] }, action) => {
  switch (action.type) {
    case articleActionTypes.GETTING_ARTICLES:
      return {
        ...state,
        isFetching: true,
        searchTitle: '',
        searchType: '',
        errMsg: ''
      };
    case articleActionTypes.GOT_ARTICLES:
      return {
        ...state,
        isFetching: false,
        items: action.items,
        total: action.total,
        page: action.page
      };
    case articleActionTypes.ERROR_GET_ARTICLES:
      return {
        ...state,
        isFetching: false,
        errMsg: action.errMsg
      };
    case articleActionTypes.GETTING_ARTICLES_BY_TITLE:
      return {
        ...state,
        isFetching: true,
        searchTitle: action.searchTitle,
        searchType: ''
      };
    case articleActionTypes.GETTING_ARTICLES_BY_TYPE:
      return {
        ...state,
        isFetching: true,
        searchTitle: '',
        searchType: action.searchType
      };
    case insideActionTypes.DELETING_ARTICLE:
      return {
        ...state,
        isUpdating: true
      };
    case insideActionTypes.DELETED_ARTICLE:
      return {
        ...state,
        isUpdating: false,
        items: action.getItems()
      };
    case insideActionTypes.ERROR_DELETE_ARTICLE:
      return {
        ...state,
        isUpdating: false
      };
    case insideActionTypes.EDITED_ARTICLE:
      return {
        ...state,
        items: action.getNewItems()
      };
    default:
      return state;
  }
};

const types = (state = { items: [] }, action) => {
  switch (action.type) {
    case articleActionTypes.GETTING_ARTICLE_TYPES:
      return {
        ...state,
        isFetching: true
      };
    case articleActionTypes.GOT_ARTICLE_TYPES:
      return {
        ...state,
        isFetching: false,
        items: action.items
      };
    case articleActionTypes.ERROR_GET_ARTICLE_TYPES:
      return {
        ...state,
        isFetching: false,
        errMsg: action.errMsg
      }
    default:
      return state;
  }
};

const current = (state = { item: {} }, action) => {
  switch (action.type) {
    case insideActionTypes.ADDING_ARTICLE:
      return {
        ...state,
        isUpdating: true,
        item: action.item
      };
    case insideActionTypes.ADDED_ARTICLE:
      return {
        ...state,
        isUpdating: false,
        item: action.item
      };
    case insideActionTypes.ERROR_ADD_ARTICLE:
      return {
        ...state,
        isUpdating: false
      };
    case insideActionTypes.EDITING_ARTICLE:
      return {
        ...state,
        isUpdating: true
      };
    case insideActionTypes.EDITED_ARTICLE:
      return {
        ...state,
        isUpdating: false,
        item: action.item
      };
    case insideActionTypes.ERROR_EDIT_ARTICLE:
      return {
        ...state,
        isUpdating: false
      };
    case articleActionTypes.GETTING_ARTICLE:
      return {
        ...state,
        isFetching: true,
        errMsg: ''
      };
    case articleActionTypes.GOT_ARTICLE:
      return {
        ...state,
        isFetching: false,
        item: action.item
      };
    case articleActionTypes.ERROR_GET_ARTICLE:
      return {
        ...state,
        isFetching: false,
        errMsg: action.errMsg
      };
    default:
      return state;
  }
}

export default combineReducers({
  lists,
  types,
  current
});