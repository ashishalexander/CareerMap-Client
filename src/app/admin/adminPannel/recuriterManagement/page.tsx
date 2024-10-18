'use client'
import { useState } from 'react'
import { RecruiterTable } from './components/RecuriterTable'


export default function RecruitersPage() {
  const [showAddRecruiter, setShowAddRecruiter] = useState(false)

  return (
    <div className="p-6 space-y-6">
      <div className="flex  items-center">
        <h1 className="text-3xl font-bold">Recruiter Management</h1>
      </div>

      <RecruiterTable />
      
      
    </div>
  )
}