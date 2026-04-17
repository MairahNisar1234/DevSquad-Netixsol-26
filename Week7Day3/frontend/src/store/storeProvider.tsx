'use client';
import { Provider } from 'react-redux';
import { store } from './index'; // Explicitly use index (the one with your reducers)

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}