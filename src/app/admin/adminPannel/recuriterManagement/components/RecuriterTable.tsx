// app/admin/recruiters/components/RecruiterTable.tsx
'use client'
import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
// import { EditRecruiterForm } from './EditRecruiterForm'
// import { StatusBadge } from '@/components/shared/StatusBadge'

interface Recruiter {
  id: string
  name: string
  email: string
  company: string
  activeJobs: number
  status: 'active' | 'inactive'
  lastActive: string
}

export function RecruiterTable() {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([
    {
      id: '1',
      name: 'Jane Smith',
      email: 'jane@company.com',
      company: 'Tech Corp',
      activeJobs: 5,
      status: 'active',
      lastActive: '2024-01-15'
    },
    // Add more sample recruiters
  ])
  const [editingRecruiter, setEditingRecruiter] = useState<Recruiter | null>(null)

  const handleDelete = (id: string) => {
    setRecruiters(recruiters.filter(recruiter => recruiter.id !== id))
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Active Jobs</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recruiters.map((recruiter) => (
            <TableRow key={recruiter.id}>
              <TableCell>{recruiter.name}</TableCell>
              <TableCell>{recruiter.email}</TableCell>
              <TableCell>{recruiter.company}</TableCell>
              <TableCell>{recruiter.activeJobs}</TableCell>
              {/* <TableCell>
                <StatusBadge status={recruiter.status} />
              </TableCell> */}
              <TableCell>{new Date(recruiter.lastActive).toLocaleDateString()}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingRecruiter(recruiter)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(recruiter.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* {editingRecruiter && (
        <EditRecruiterForm 
          recruiter={editingRecruiter} 
          onClose={() => setEditingRecruiter(null)}
          onUpdate={(updatedRecruiter) => {
            setRecruiters(recruiters.map(r => r.id === updatedRecruiter.id ? updatedRecruiter : r))
            setEditingRecruiter(null)
          }}
        />
      )} */}
    </div>
  )
}