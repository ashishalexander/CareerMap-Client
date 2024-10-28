'use client'
import { useEffect, useState } from 'react'
import { DataTable } from '../../../components/DataTable/Table'
import { Button } from '@/components/ui/button'
import { Iuser } from '@/const/Iuser'
import api from '../../../lib/axios-config'

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: string
}

export function UserTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get<Iuser[]>('/api/admin/fetchUsers')
        console.log(response.data)
        const users = response.data.filter((user:Iuser)=>user.role==="user")
        setUsers(users)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])
  const handleBlock = async (userId: string) => {
    try {
      await api.patch(`/api/admin/blockUser/${userId}`);  
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));  
    } catch (err) {
      console.error("Failed to block user:", err);
      setError("Failed to block user");
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <DataTable
      data={users}
      columns={[
        { label: 'Name', key: 'firstName' },
        { label: 'Email', key: 'email' },
        { label: 'Role', key: 'role' },
      ]}
      actions={(user) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleBlock(user._id)} 
        >
          Block
        </Button>
      )}
    />
  )
}