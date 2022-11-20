import axios from "axios"
import { useRouter } from "next/router"
import { useState, useLayoutEffect, useEffect } from 'react'
import styles from '../styles/Home.module.css'
import { Post } from '../../types/type'

export default function Signin() {
  const [content, setContent] = useState<string>("")
  const [postUrl, setPostUrl] = useState<string>("")
  const [posts, setPosts] = useState<Post[]>([])
  const handleSubmit = async () => {
    await axios.post("https://hajimete-hackathon-backend.onrender.com/api/v1/posts",
    {
      content: content,
      song_url: postUrl
    },
    {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(res => setPosts([res.data, ...posts]))
    .catch(e => console.log(e))

    setContent("")
    setPostUrl("")
  }
  return (
    <div>
      <h1>Add New Post</h1>
      <label>content</label>
      <div>
        <input 
        type="text" 
        value={content} 
        onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <label>URL</label>
      <div>
        <input 
        type="text" 
        value={postUrl} 
        onChange={(e) => setPostUrl(e.target.value)}
        />
      </div>
      <button onClick={handleSubmit}>Add!</button>
    </div>
  );
}