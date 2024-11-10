import React from 'react'
import Header from '../../components/header/Header'

interface UserLayoutProps {
    children: React.ReactNode
}

const UserLayout: React.FC<UserLayoutProps> = ({children}) => {
    return (
        <div className='flex flex-col min-h-screen '>
            <Header/>
            <main className='flex-1 pt-16'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    {children}
                </div>
            </main>
        </div>
    )
}

export default UserLayout  