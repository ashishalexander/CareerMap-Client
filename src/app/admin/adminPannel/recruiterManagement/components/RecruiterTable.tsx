'use client'
import { useState } from 'react'
import { DataTable } from '../../../components/DataTable/Table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Iuser } from '@/const/Iuser'
import { useRecruiterTableData } from './Hooks/useRecuriterTableData'
import useDebounce from '../../../components/Hooks/useDebounce'

export function RecruiterTable() {
  const [searchInput, setSearchInput] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState<keyof Iuser | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Use debounced search term for API calls
  const debouncedSearchTerm = useDebounce(searchInput, 500)

  const { 
    recruiters, 
    loading, 
    error, 
    totalRecruiters, 
    handleToggle 
  } = useRecruiterTableData({
    searchTerm: debouncedSearchTerm,
    pageSize, 
    currentPage, 
    sortColumn, 
    sortDirection
  })

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      Loading recruiters...
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input 
          placeholder="Search recruiters..." 
          value={searchInput} 
          onChange={(e) => {
            setSearchInput(e.target.value)
            setCurrentPage(1) // Reset to first page on new search
          }}
          className="max-w-sm"
        />
      </div>
      
      <DataTable
        data={recruiters}
        columns={[
          { 
            label: 'Name', 
            key: 'firstName',
            sortable: true
          },
          { 
            label: 'Email', 
            key: 'email',
            sortable: true 
          },
          { 
            label: 'Role', 
            key: 'role',
            sortable: true 
          }
        ]}
        actions={(recruiter) => (
          <Button
            variant="destructive"
            size="sm"
            style={{ 
              width: '100px', 
              backgroundColor: recruiter.isblocked ? 'green' : 'red' 
            }} 
            onClick={() => handleToggle(recruiter._id)}
          >
            {recruiter.isblocked ? "Unblock" : "Block"}
          </Button>
        )}
        pagination={{
          pageSize,
          currentPage,
          totalItems: totalRecruiters,
          onPageChange: setCurrentPage,
          onPageSizeChange: setPageSize
        }}
        sorting={{
          sortColumn,
          sortDirection,
          onSortChange: (column, direction) => {
            setSortColumn(column)
            setSortDirection(direction)
          }
        }}
      />
    </div>
  )
}