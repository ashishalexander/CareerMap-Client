'use client'
import { useState, useEffect } from 'react'
// import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
// import StatusBadge from '@/app/admin/components/shared/StatusBadge'
import axios from 'axios'

interface User {
  _id: string // Change to _id based on your API
  firstName: string
  lastName: string
  email: string
  role: string
//   status: 'active' | 'inactive'
  createdAt: string
}

export function UserTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      const token = sessionStorage.getItem('adminAccessToken') // Retrieve token from sessionStorage

      if (!token) {
        setError('No access token found')
        setLoading(false)
        return
      }

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/fetchUsers`, {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        })
        console.log(response.data) // Check the structure of the response
        setUsers(response.data.users) // Set users from the API response
      } catch (err) {
        setError('Failed to fetch users')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleBlock = (id: string) => {
    // Optionally, send a request to the backend to block the user
    setUsers(users.filter(user => user._id !== id)) // Update this line to match the user ID structure
  }

  if (loading) {
    return <div>Loading users...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            {/* <TableHead>Status</TableHead> */}
            {/* <TableHead>Created</TableHead> */}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              {/* <TableCell>
                <StatusBadge status={user.status} />
              </TableCell> */}
              {/* <TableCell>  {user.createdAt ? format(new Date(user.createdAt), 'MMMM dd, yyyy') : 'N/A'}
              </TableCell> */}
              <TableCell className="text-right space-x-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleBlock(user._id)} // Update this line to match the user ID structure
                >
                  Block
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
