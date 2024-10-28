'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'

interface DataTableProps<T> {
  data: T[]                         
  columns: { label: string, key: keyof T }[] 
  actions: (item: T) => React.ReactNode 
}


export function DataTable<T>({ data, columns, actions }: DataTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key as string}>{column.label}</TableHead>
          ))}
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, idx) => (
          <TableRow key={idx}>
            {columns.map((column) => (
              <TableCell key={column.key as string}>{item[column.key] as React.ReactNode}</TableCell>
            ))}
            <TableCell className="text-right">{actions(item)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
