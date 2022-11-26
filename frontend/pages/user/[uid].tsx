import axios from "axios";
import { useRouter } from "next/router";
import { useLayoutEffect, useState } from "react";
import ReviewCard from "../../Components/ReviewCard";
import { Post, User } from "../../types/type";

export default function Users() {
    const router = useRouter()
    const [user, setUser] = useState<User>(Object)
    const [posts, setPosts] = useState<Post[]>([])
    const { uid } = router.query
    useLayoutEffect(() => {
        const token = localStorage.getItem("token")
        const getUser = async () => {
            await axios.get(`https://hajimete-hackathon-backend.onrender.com/api/v1/users/${uid}`,{
                headers: {"Authorization": `Bearer ${token}`}
            })
            .then(res => setUser(res.data))
            .catch(e => console.log(e))
        }
        const getMyPost = async() => {
            await axios.get(`https://hajimete-hackathon-backend.onrender.com/api/v1/users/${uid}/posts`,{
                headers: {"Authorization": `Bearer ${token}`}
            })
            .then((res) => setPosts(res.data))
            .catch(e => console.log(e))
        }

        try {
            getUser()
            getMyPost()
        } catch(e) {
            console.log(e)
        }
    },[])

    return (
        <div>
            <p>{user.name}</p>
            <br />
            <div>
                <ul>
                    {
                        posts.map((post) => {
                            return (
                                <li key={post.id}>
                                    <ReviewCard post={post} setPosts={setPosts} posts={posts}/>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    )
}