import axios from "axios"
import { useRouter } from "next/router"
import { useState, useLayoutEffect, useEffect } from 'react'
import styles from '../../styles/Home.module.css'
import { TextField } from "@mui/material"
import {Box} from "@mui/material"
import {Button} from "@mui/material"

export default function Post() {
  const  router = useRouter()
  const [content, setContent] = useState<string>("")
  const [postUrl, setPostUrl] = useState<string>("")
  const handleSubmit = async () => {
    if(content === "" || postUrl === "") {
      alert("ContentとpostUrlの両方を入力してください")
      return 
    }
    try{
      const res = await axios.post("https://hajimete-hackathon-backend.onrender.com/api/v1/posts",
      {
        content: content,
        song_url: postUrl
      },
      {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })
      console.log(res.data)
      setContent("")
      setPostUrl("")
      router.push("/")
    }catch{
      alert("投稿に失敗しました。")
    }
  }
  return (
    <div className={styles.container} style={{textAlign: "center",minHeight:"100vh", width:"100%", height:"100%"}}>
      <h1 style={{padding: "50px 0", color:"#EEEEEE"}}>Add New Post</h1>
      <Box
        component="div"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}
      >
        <TextField
          required
          id="outlined-required"
          label="SongUrl"
          defaultValue={postUrl}
          value={postUrl}
          onChange={(e) => setPostUrl(e.target.value)}
          style={{width:"50%", paddingBottom:"30px"}}
        />
        <TextField
            id="outlined-multiline-flexible"
            label="Content"
            required
            multiline
            maxRows={8}
            defaultValue={content}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{width:"50%", paddingBottom:"30px"}}
        />
      </Box>
      <Button 
        onClick={handleSubmit} 
        style={{width:"10%", color:"#EEEEEE", background:"#EEEEEEE"}}
        size="large"
      >
        Post!
      </Button>
    </div>
  );
}