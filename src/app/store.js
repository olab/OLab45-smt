import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../components/counter/reducers';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});
