import { useState, useEffect } from 'react'
import api from '../../../../lib/axios-config'
import { Iuser } from '@/const/Iuser'

interface UseUserTableDataParams {
  searchTerm: string
  pageSize: number
  currentPage: number
  sortColumn: keyof Iuser | null
  sortDirection: 'asc' | 'desc'
}

interface UserListResponse {
  data?: {
    data?: Iuser[]  // It's an array of Iuser, can be undefined
    total?: number
    page?: string
    totalPages?: string
  }
  message?: string
}
  
export function useUserTableData({
  searchTerm,
  pageSize,
  currentPage,
  sortColumn,
  sortDirection
}: UseUserTableDataParams) {
  const [users, setUsers] = useState<Iuser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalUsers, setTotalUsers] = useState(0)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        setError(null)  // Reset error state before new fetch

        const response = await api.get<UserListResponse>('/api/admin/fetchUsers', {
          params: {
            search: searchTerm,
            page: currentPage,
            pageSize,
            sortBy: sortColumn,
            sortDirection
          }
        })

        // Add comprehensive null checks
        const responseData = response.data?.data || []
        const total = response.data?.data?.total || 0

        // Ensure responseData is an array of Iuser
        if (Array.isArray(responseData)) {
          // Filter users with comprehensive null checks and type safety
          const filteredUsers = responseData.filter((user: Iuser) => 
            user && user.role === "user" && user._id
          )

          setUsers(filteredUsers)
          setTotalUsers(Number(total))
        } else {
          // Handle case where responseData is not an array
          setUsers([])
          setTotalUsers(0)
        }
      } catch (err) {
        const errorMessage = err instanceof Error 
          ? err.message 
          : 'Failed to fetch users'
        
        console.error('Fetch Users Error:', err)
        setError(errorMessage)
        setUsers([])
        setTotalUsers(0)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [searchTerm, pageSize, currentPage, sortColumn, sortDirection])

  const handleTogle = async (userId: string) => {
    try {
      await api.patch(`/api/admin/blockUser/${userId}`)
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isblocked: !user.isblocked } : user
        )
      )
    } catch (err) {
      console.error("Failed to block user:", err)
      setError("Failed to block user")
    }
  }

  return { 
    users, 
    loading, 
    error, 
    totalUsers, 
    handleTogle 
  }
}