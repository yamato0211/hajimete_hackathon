import axios from "axios"
import { useRouter } from "next/router"
import { useState, useLayoutEffect, useEffect } from 'react'
import styles from '../styles/Home.module.css'
import { Post } from '../types/type'
import ReviewCard from "../Components/ReviewCard"
import Link from "next/link"


export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const router = useRouter();

  // useLayoutEffect(() => {
  //   const authCheking = () => {
  //     if(localStorage.getItem("token") === null) {
  //       router.push("/Signup")
  //     }
  //   }
  //   authCheking()
  // },[])

  useLayoutEffect(() => {
    async function getTimeline() {
        const token = localStorage.getItem("token")
        if(token){
          await axios.get("https://hajimete-hackathon-backend.onrender.com/api/v1/users/@me",{
            headers: {
              "Authorization": `Bearer ${token}`
            }
          })
          .then((res) => {
            localStorage.setItem("user_id", res.data.id)
          })
          .catch(e => console.log(e))
          await axios.get("https://hajimete-hackathon-backend.onrender.com/api/v1/posts",{
            headers: {
              "Authorization": `Bearer ${token}`
            }
          })
          .then(res => {
            console.log(res.data)
            setPosts(res.data)
          })
          .catch(e => console.log(e))
        }
    }
    getTimeline()
  },[])

  return (
    <div className={styles.container}>
      <ul className={styles.postsWrapper}>
        {
          posts.map((post) => {
            return(
              <li key={post.id} className={styles.cardWrapper}>
                <ReviewCard post={post} setPosts={setPosts} posts={posts}/>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}
