export interface User {
    id: string
    created_at: Date
    updated_at: Date
    name: string
    email: string
}

export interface Post {
    id: string
    created_at: Date
    updated_at: Date
    content: string
    user: User
}