'use client'
import { store } from '../store/store'
import { Provider } from 'react-redux'
import { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

const Providers: React.FC<ProvidersProps> = ({ children }) => (
  <Provider store={store}>
    {children}
  </Provider>
)

export default Providers
