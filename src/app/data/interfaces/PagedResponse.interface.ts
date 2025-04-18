export interface PagedResponse<T>{
    data: T[],
    currentPage: number,
    pageSize: number,
    totalItems: number,
    totalPages: number
}