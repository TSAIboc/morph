"use client";
import './style.scss';
import dynamic from 'next/dynamic'
import { Provider } from 'react-redux';
import store from '@feature/store';
const Index = dynamic(() => import('./index'), {
  ssr: false,
})
export default function Home() {
  return (
    <Provider store={store}>
      <Index />
    </Provider >
  )
}