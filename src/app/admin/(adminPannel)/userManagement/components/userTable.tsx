'use client'
import { useState } from 'react'
import { DataTable } from '../../../components/DataTable/Table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Iuser } from '@/const/Iuser'
import { useUserTableData } from './Hooks/useUserTableData'
import useDebounce from '../../../components/Hooks/useDebounce'

export function UserTable() {
  const [searchInput, setSearchInput] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState<keyof Iuser | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Use debounced search term for API calls
  const debouncedSearchTerm = useDebounce(searchInput, 500)

  const { 
    users, 
    loading, 
    error, 
    totalUsers, 
    handleTogle 
  } = useUserTableData({
    searchTerm: debouncedSearchTerm,
    pageSize, 
    currentPage, 
    sortColumn, 
    sortDirection
  })

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      Loading users...
    </div>
  )

  // Remove the error display logic
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input 
          placeholder="Search users..." 
          value={searchInput} 
          onChange={(e) => {
            setSearchInput(e.target.value)
            setCurrentPage(1) // Reset to first page on new search
          }}
          className="max-w-sm"
        />
      </div>
      
      <DataTable
        data={users}
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
        actions={(user) => (
          <Button
            variant="destructive"
            size="sm"
            style={{ 
              width: '100px', 
              backgroundColor: user.isblocked ? 'green' : 'red' 
            }} 
            onClick={() => handleTogle(user._id)}
          >
            {user.isblocked ? "Unblock" : "Block"}
          </Button>
        )}
        pagination={{
          pageSize,
          currentPage,
          totalItems: totalUsers,
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