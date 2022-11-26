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
    song_url: string
    user: User
    like_users: User[]
    comments: Comment[]
}

export interface Comment {
    id: string
    post_id: string
    user: User
    created_at: Date
    updated_at: Date
    content: string
}