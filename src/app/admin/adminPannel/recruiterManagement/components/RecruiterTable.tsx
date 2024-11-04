'use client'
import { useEffect, useState } from 'react'
import { DataTable } from '../../../components/DataTable/Table'
import { Button } from '@/components/ui/button'
import { Iuser } from '@/const/Iuser'
import api from '../../../lib/axios-config'

export function RecruiterTable() {
  const [recruiters, setRecruiters] = useState<Iuser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        const response = await api.get<Iuser[]>('/api/admin/fetchUsers')
        console.log(response.data)
        const recruiters = response.data.filter((user: Iuser) => user.role === 'recruiter')
        setRecruiters(recruiters)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch recruiters'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }
    fetchRecruiters()
  }, [])

  const handleToggle = async (recruiterId: string) => {
    try {
      await api.patch(`/api/admin/blockUser/${recruiterId}`)
      setRecruiters((prevRecruiters) =>
        prevRecruiters.map((recruiter) =>
          recruiter._id === recruiterId ? { ...recruiter, isblocked: !recruiter.isblocked } : recruiter
        )
      )
    } catch (err) {
      console.error('Failed to block recruiter:', err)
      setError('Failed to block recruiter')
    }
  }

  if (loading) {
    return <div>Loading recruiters...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <DataTable
      data={recruiters}
      columns={[
        { label: 'Name', key: 'firstName' },
        { label: 'Email', key: 'email' },
        { label: 'Role', key: 'role' },
      ]}
      actions={(recruiter) => (
        <Button
          variant="destructive"
          size="sm"
          style={{
            width: '100px',
            backgroundColor: recruiter.isblocked ? 'green' : 'red',
          }}
          onClick={() => handleToggle(recruiter._id)}
        >
          {recruiter.isblocked ? 'Unblock' : 'Block'}
        </Button>
      )}
    />
  )
}
