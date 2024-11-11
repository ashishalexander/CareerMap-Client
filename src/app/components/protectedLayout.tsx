"use client"
import React, {useEffect} from 'react'
import {useRouter} from 'next/navigation'

const ProtectedLayout:React.FC<React.PropsWithChildren> = ({children})=>{
    const router = useRouter()

    useEffect(()=>{
        const accessToken = sessionStorage.getItem('accessToken')

        if(!accessToken){
            router.push('/user/signIn')
        }
    },[router])

    return <>{children}</>;
}

export default ProtectedLayout