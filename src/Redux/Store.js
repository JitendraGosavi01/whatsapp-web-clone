import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../Redux/Reducer/index'
import { logger } from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension'
export default createStore(rootReducer, composeWithDevTools(applyMiddleware(...[thunk, logger])))