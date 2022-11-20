import axios from "axios"
import { useRouter } from "next/router"
import { useState, useLayoutEffect, useEffect } from 'react'
import styles from '../styles/Home.module.css'
import { Post } from '../types/type'
import ReviewCard from "../Components/ReviewCard"


export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const router = useRouter();
  useLayoutEffect(() => {
    const authCheking = () => {
      if(localStorage.getItem("token") === null) {
        router.push("/Signup")
      }
    }
    authCheking()
  },[])

  useEffect(() => {
    async function getTimeline() {
        await axios.get("https://hajimete-hackathon-backend.onrender.com/api/v1/posts",{
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        })
        .then(res => {
          console.log(res.data)
          setPosts(res.data)
        })
        .catch(e => console.log(e))
    }
    getTimeline()
  },[])

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/Signup")
  }

  return (
    <div className={styles.container}>
      <h1>Hajimete_Hackthon</h1>
      <button onClick={handleLogout}>logout</button>
      <ul className={styles.postsWrapper}>
        {
          posts.map((post) => {
            return(
              <li key={post.id} className={styles.cardWrapper}>
                <ReviewCard post={post} />
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}
