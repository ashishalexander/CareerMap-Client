import { useState, useEffect } from 'react'
import api from '../../../lib/axios-config'
import { Iuser } from '@/const/Iuser'

interface UseRecruiterTableDataParams {
  searchTerm: string
  pageSize: number
  currentPage: number
  sortColumn: keyof Iuser | null
  sortDirection: 'asc' | 'desc'
}

interface RecruiterListResponse {
  
    data?: Iuser[]
    total?: number
    page?: string
    totalPages?: string
  
  
}
  
export function useRecruiterTableData({
  searchTerm,
  pageSize,
  currentPage,
  sortColumn,
  sortDirection
}: UseRecruiterTableDataParams) {
  const [recruiters, setRecruiters] = useState<Iuser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalRecruiters, setTotalRecruiters] = useState(0)

  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await api.get<RecruiterListResponse>('/api/admin/fetchUsers', {
          params: {
            role: "recruiter",
            search: searchTerm,
            page: currentPage,
            pageSize,
            sortBy: sortColumn || 'firstName',
            sortOrder: sortDirection, 
          }
        })

        const responseData = response.data?.data || []
        const total = response.data.total || 0

        if (Array.isArray(responseData)) {
          const filteredRecruiters = responseData.filter((user: Iuser) => 
            user && user.role === "recruiter" && user._id
          )

          setRecruiters(filteredRecruiters)
          setTotalRecruiters(Number(total))
        } else {
          setRecruiters([])
          setTotalRecruiters(0)
        }
      } catch (err) {
        const errorMessage = err instanceof Error 
          ? err.message 
          : 'Failed to fetch recruiters'
        
        console.error('Fetch Recruiters Error:', err)
        setError(errorMessage)
        setRecruiters([])
        setTotalRecruiters(0)
      } finally {
        setLoading(false)
      }
    }

    fetchRecruiters()
  }, [searchTerm, pageSize, currentPage, sortColumn, sortDirection])

  const handleToggle = async (recruiterId: string) => {
    try {
      await api.patch(`/api/admin/blockUser/${recruiterId}`)
      setRecruiters((prevRecruiters) =>
        prevRecruiters.map((recruiter) =>
          recruiter._id === recruiterId ? { ...recruiter, isblocked: !recruiter.isblocked } : recruiter
        )
      )
    } catch (err) {
      console.error("Failed to block recruiter:", err)
      setError("Failed to block recruiter")
    }
  }

  return { 
    recruiters, 
    loading, 
    error, 
    totalRecruiters, 
    handleToggle 
  }
}