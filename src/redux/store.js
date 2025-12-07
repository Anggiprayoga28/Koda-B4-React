import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import productReducer from "./slices/productSlice";
import checkoutReducer from "./slices/checkoutSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
  version: 1,
};

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  product: productReducer,
  checkout: checkoutReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

store.subscribe(() => {
  console.log("📦 Redux State Changed:", store.getState().auth);
});
