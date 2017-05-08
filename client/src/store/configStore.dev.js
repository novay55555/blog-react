import { createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import rootReducer from '../reduces'

const enhancer = compose(
  applyMiddleware(thunk, createLogger({ collapsed: true }))
);

const configStore = initialState => {
  const store = createStore(rootReducer, initialState, enhancer);
  if (module.hot) {
    module.hot.accept('../reduces', () => {
      store.replaceReducer(require('../reduces').default);
    });
  }
  return store;
};

export default configStore