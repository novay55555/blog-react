import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reduces'

const enhancer = compose(
  applyMiddleware(thunk)
);

const configStore = initialState => createStore(rootReducer, initialState, enhancer);

export default configStore