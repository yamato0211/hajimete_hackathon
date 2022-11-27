import axios from "axios"
import { useRouter } from "next/router"
import { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'
import { TextField } from "@mui/material"
import {Box} from "@mui/material"
import {Button} from "@mui/material"
import {Post} from "../types/type"

interface Props {
  post: Post
}

// 関数の宣言の仕方
export default function ModalCard({post}:Props) {
  // const  router = useRouter()
  const [content, setContent] = useState<string>(post.content)
  const [putUrl, setPutUrl] = useState<string>(post.song_url)

  useEffect(() => {
    console.log(putUrl)
    // async function handleOpen() {
    //   const token = localStorage.getItem("token")
    //       if(token){
    //         await axios.get("https://hajimete-hackathon-backend.onrender.com/api/v1/users/@me",{
    //           headers: {
    //             "Authorization": `Bearer ${token}`
    //           }
    //         })
    //         .then((res) => {
    //           localStorage.setItem("user_id", res.data.id)
    //         })
    //         .catch(e => console.log(e))
    //         await axios.get("https://hajimete-hackathon-backend.onrender.com/api/v1/posts",{
    //           headers: {
    //             "Authorization": `Bearer ${token}`
    //           }
    //         })
    //         .then(res => {
    //           console.log(res.data)
    //           setPutUrl(res.data)
    //         })
    //         .catch(e => console.log(e))
    //       }
    //   }
    //   handleOpen()
  },[])

  const handleClose = async (post_id: string) => {
    if(content === "" || putUrl === "") {
      alert("ContentとpostUrlの両方を入力してください")
      return 
    }
    try{
      const res = await axios.put(`https://hajimete-hackathon-backend.onrender.com/api/v1/posts/${post_id}`,
      {
        content: content,
        song_url: putUrl,
      },
      {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })
      console.log(res.data)
      // setContent("")
      // setPutUrl("")
    }catch (e){
      alert("更新に失敗しました。")
      console.log(e)
    }
  }
  

  return (
    <div style={{textAlign: "center", width:"100%", height:"100%",backgroundColor:"aquamarine"}}>
      <h1 style={{padding: "50px 0"}}>Edit Post</h1>
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
          value={putUrl}
          onChange={(e) => setPutUrl(e.target.value)}
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
        onClick={() => {handleClose(post.id)}} 
        variant="outlined" 
        style={{width:"10%"}}
        size="large"
      >
        Post!
      </Button>
    </div>
  );
}