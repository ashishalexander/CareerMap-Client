import { Iuser } from '@/const/Iuser'
export interface UseUserTableDataParams {
  searchTerm: string
  pageSize: number
  currentPage: number
  sortColumn: keyof Iuser | null
  sortDirection: 'asc' | 'desc'
}

export interface UserListResponse {
  
    data?: Iuser[]  // It's an array of Iuser, can be undefined
    total?: number
    page?: string
    totalPages?: string

}
  