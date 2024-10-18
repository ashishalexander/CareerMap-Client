// app/admin/users/page.tsx
'use client'
import { useState } from 'react'
import { UserTable } from './components/userTable'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

export default function UsersPage() {
  const [showAddUser, setShowAddUser] = useState(false)

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>  
      </div>
      <UserTable />
    </div>
  )
}