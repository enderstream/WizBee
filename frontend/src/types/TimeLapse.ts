// types/TimeLapse.ts
export interface TimeLapseVideo {
    id: number
    title: string
    date: string
    time: string
    thumbnail: string
    description: string
    videoUrl?: string
}

export interface TimeLapseListResponse {
    videos: TimeLapseVideo[]
    totalPages: number
    currentPage: number
    totalVideos: number
}