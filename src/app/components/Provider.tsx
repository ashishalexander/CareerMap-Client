"use client";
import { store, persistor } from "../store/store";
import { Provider } from "react-redux";
import { ReactNode } from "react";
import { PersistGate } from "redux-persist/integration/react";

interface ProvidersProps {
  children: ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {children}
    </PersistGate>
  </Provider>
);

export default Providers;
