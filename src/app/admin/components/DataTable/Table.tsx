'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { ArrowUp, ArrowDown } from 'lucide-react'

interface PaginationConfig {
  pageSize: number
  currentPage: number
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

interface SortingConfig<T> {
  sortColumn: keyof T | null
  sortDirection: 'asc' | 'desc'
  onSortChange: (column: keyof T, direction: 'asc' | 'desc') => void
}

interface DataTableProps<T> {
  data: T[]
  columns: { 
    label: string, 
    key: keyof T, 
    sortable?: boolean 
  }[]
  actions: (item: T) => React.ReactNode
  pagination?: PaginationConfig
  sorting?: SortingConfig<T>
}

export function DataTable<T>({ 
  data, 
  columns, 
  actions, 
  pagination,
  sorting 
}: DataTableProps<T>) {
  const renderSortIcon = (column: keyof T) => {
    if (!sorting || column !== sorting.sortColumn) return null
    return sorting.sortDirection === 'asc' 
      ? <ArrowUp className="inline w-4 h-4 ml-1" /> 
      : <ArrowDown className="inline w-4 h-4 ml-1" />
  }

  const handleColumnSort = (column: keyof T) => {
    if (!sorting) return
    const newDirection = 
      sorting.sortColumn === column && sorting.sortDirection === 'asc' 
        ? 'desc' 
        : 'asc'
    sorting.onSortChange(column, newDirection)
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead 
                key={column.key as string}
                onClick={() => column.sortable && handleColumnSort(column.key)}
                className={column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}
              >
                {column.label}
                {column.sortable && renderSortIcon(column.key)}
              </TableHead>
            ))}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, idx) => (
            <TableRow key={idx}>
              {columns.map((column) => (
                <TableCell key={column.key as string}>
                  {item[column.key] as React.ReactNode}
                </TableCell>
              ))}
              <TableCell className="text-right">{actions(item)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pagination && (
        <div className="flex justify-between items-center mt-4">
          <div>
            <Select 
              value={pagination.pageSize.toString()}
              onValueChange={(value) => pagination.onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Rows per page" />
              </SelectTrigger>
              <SelectContent>
                {[5,10, 20, 50, 100].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size} rows
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              Previous
            </Button>
            <span>
              Page {pagination.currentPage} of{' '}
              {Math.ceil(pagination.totalItems / pagination.pageSize)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={
                pagination.currentPage >= 
                Math.ceil(pagination.totalItems / pagination.pageSize)
              }
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}