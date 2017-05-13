import { combineReducers } from 'redux'
import articles from './articles'
import account from './account'
import inside from './inside'

export default combineReducers({
  articles,
  account,
  inside
});