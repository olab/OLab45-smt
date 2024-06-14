import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../components/Home/reducers';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});
