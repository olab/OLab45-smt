import { configureStore } from '@reduxjs/toolkit';
import homeReducer from '../components/Home/reducers';

export const store = configureStore({
  reducer: {
    counter: homeReducer,
  },
});
