import axios from "axios"
import { useRouter } from "next/router"
import { useState, useLayoutEffect, useEffect } from 'react'
import styles from '../styles/Home.module.css'
import { Post } from '../types/type'


export default function Home() {
  const songUrl = [
    "https://music.apple.com/jp/album/i-love/1492963534?i=1492963535",
    "https://music.apple.com/jp/album/%E8%8A%B1%E6%9D%9F/1451570468?i=1451570480",
    "https://youtu.be/Gbz2C2gQREI"
  ]
  const [posts, setPosts] = useState<Post[]>([])

  const [content, setContent] = useState<string>("")
  const router = useRouter();
  useLayoutEffect(() => {
    const authCheking = () => {
      if(localStorage.getItem("token") === null) {
        router.push("/Signup")
      }
    }
    authCheking()
  },[])

  useLayoutEffect(() => {
    async function getTimeline() {
        await axios.get("https://hajimete-hackathon-backend.onrender.com/api/v1/posts",{
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        })
        .then(res => setPosts(res.data))
        .catch(e => console.log(e))
    }
    getTimeline()
  },[])

  const handleSubmit = async () => {
    await axios.post("https://hajimete-hackathon-backend.onrender.com/api/v1/posts",
    {
      content: content
    },
    {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(res => setPosts([res.data, ...posts]))
    .catch(e => console.log(e))

    setContent("")
  }

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
              <li key={post.id} className={styles.postWrapper}>
                <p>{post.user.name}</p>
                <p>{post.created_at.toString()}</p>
                <p>{post.content}</p>
              </li>
            )
          })
        }
      </ul>
      <div>

      </div>
      {
        songUrl.map((url,index) => {
          return (
            <div className={styles.kasu} key={index}>
              <div className={styles.postDetails}>
                <div className={styles.NameDate}>
                  <p className={styles.postName}>name</p>
                  <p className={styles.postDate}>2022-11-19</p>
                </div>
                <p className={styles.postContent}>この曲聞いてみて！！</p>
              </div>
              <div className={styles.aho}>
                <iframe className={styles.gaki} src={`https://odesli.co/embed/?url=${url}&theme=dark`} frameBorder={0} allowFullScreen sandbox="allow-same-origin allow-scripts allow-presentation allow-popups allow-popups-to-escape-sandbox" allow="clipboard-read; clipboard-write">
                </iframe>
              </div>
            </div>
          )
        })
      }
      
    </div>
  )
}
