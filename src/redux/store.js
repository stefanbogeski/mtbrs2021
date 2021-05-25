import { createStore, combineReducers } from 'redux';
import appReducer from './reducer';

const configureStore = () => {
    return createStore(
        combineReducers({
            appInfo: appReducer,
        })
    );
}

const store = configureStore();

export default store;