import axios from "axios"
import { useState, useLayoutEffect } from 'react'
import styles from '../styles/Home.module.css'
import { Post } from '../types/type'

export default function Home() {
    const [posts, setPosts] = useState<Post[]>([])
    const [content, setContent] = useState<string>("")
    useLayoutEffect(() => {
      async function getTimeline() {
          await axios.get("http://localhost:8000/api/v1/posts",{
            headers: {
              "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NjkyODcwODQsImlhdCI6MTY2ODY4MjI4NCwic3ViIjoiZjVkYTM1ZWUtNzU0Yy00MDcwLTk1ZmEtMTQxNDA3ZmNjMDIyIn0.Xf_B8Mtw63Zhdq0v7H-nR3bQyAatLxhwJDGNNF5IT14"
            }
          })
          .then(res => setPosts(res.data))
          .catch(e => console.log(e))
      }
      getTimeline()
    },[])

    const handleSubmit = async () => {
      await axios.post("http://localhost:8000/api/v1/posts",
      {
        content: content
      },
      {
        headers: {
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NjkyODcwODQsImlhdCI6MTY2ODY4MjI4NCwic3ViIjoiZjVkYTM1ZWUtNzU0Yy00MDcwLTk1ZmEtMTQxNDA3ZmNjMDIyIn0.Xf_B8Mtw63Zhdq0v7H-nR3bQyAatLxhwJDGNNF5IT14"
        }
      })
      .then(res => console.log(res))
      .catch(e => console.log(e))

      setContent("")
    }
  return (
    <div className={styles.container}>
      <h1>Hajimete_Hackthon</h1>
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
        <h1>Add New Post</h1>
        <label>content</label>
        <input 
          type="text" 
          value={content} 
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={handleSubmit}>Add!</button>
      </div>
    </div>
  )
}
