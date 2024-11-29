import React from 'react'
import Header from '../../components/header/Header'
import ProtectedLayout from '@/app/components/protectedLayout'

interface UserLayoutProps {
    children: React.ReactNode
}

const UserLayout: React.FC<UserLayoutProps> = ({children}) => {
    return (
        <ProtectedLayout>
            <div className='flex flex-col min-h-screen '>
                <Header/>
                <main className='flex-1 pt-16'>
                    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                        {children}
                    </div>
                </main>
            </div>
        </ProtectedLayout>
        
        
    )
}

export default UserLayout  