import { combineReducers } from 'redux'
import articles from './articles'
import account from './account'

export default combineReducers({
  articles,
  account
});