import React, {useEffect, useState} from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import CommentIcon from '@mui/icons-material/Comment';
import { TextField } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { pink } from '@mui/material/colors';
import { Post } from '../types/type';
import styles from "../styles/Home.module.css"
import axios from 'axios';
import Link from 'next/link';

interface Props {
  post: Post
  setPosts: (x:Post[]) => void
  posts: Post[]
}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const ReviewCard = ({post,setPosts,posts}: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [likeFlag, setLikeFlag] = useState<boolean>(false)
  const [likeCount, setLikeCount] = useState<number>(0)
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState(post.comments)

  useEffect(() => {
    const user_id = localStorage.getItem("user_id")
    post.like_users.forEach((u) => {
      if(u.id === user_id) {
        setLikeFlag(true)
      }
    }) 
    setLikeCount(post.like_users.length)
  },[])
  
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token")
    try{
      const res = await axios.delete(`https://hajimete-hackathon-backend.onrender.com/api/v1/posts/${id}`,{
      headers: {"Authorization": `Bearer ${token}`}
    })
      console.log(res.data)
      setPosts(posts.filter(p => p.id !== id))
    }catch{
      alert("削除に失敗しました")
    }
  }

  const postLike = async () => {
    const token = localStorage.getItem("token")
    await axios.post(`https://hajimete-hackathon-backend.onrender.com/api/v1/likes/${post.id}`,{}, {
      headers: {"Authorization": `Bearer ${token}`}
    })
    .then((res) => {
      console.log(res.data)
      setLikeFlag(true)
      setLikeCount(likeCount + 1)
    })
  }

  const deleteLike = async () => {
    const token = localStorage.getItem("token")
    await axios.delete(`https://hajimete-hackathon-backend.onrender.com/api/v1/likes/${post.id}`,{
      headers: {"Authorization": `Bearer ${token}`}
    })
    .then((res) => {
      console.log(res.data)
      setLikeFlag(false)
      setLikeCount(likeCount - 1)
    })
  }

  const formatDate = (date: string) => {
    const dateInfo = new Date(date);
    const year = dateInfo.getFullYear();
    const month = `0${dateInfo.getMonth() + 1}`.slice(-2);
    const dates = `0${dateInfo.getDate()}`.slice(-2);
    const hours = `0${dateInfo.getHours()}`.slice(-2);
    const minutes = `0${dateInfo.getMinutes()}`.slice(-2);
    const seconds = `0${dateInfo.getSeconds()}`.slice(-2);

    return `${year}/${month}/${dates} ${hours}:${minutes}:${seconds}`;
  }
  
  const handleComment = async(e: React.FormEvent<HTMLFormElement>, post_id: string) => {
    e.preventDefault()
    const token = localStorage.getItem("token")
    try{
      await axios.post(`https://hajimete-hackathon-backend.onrender.com/api/v1/comments/${post_id}`,{
        content: comment,
      },
      {
        headers: {"Authorization": `Bearer ${token}`},
      })
      .then(res => {
        console.log(res.data)
        setComments([res.data,...comments])
      })
      setComment("")
    }catch(e){
      alert("コメントに失敗しました")
      console.error(e)
    }
  }

  const DeleteComment = async(comment_id: string) => {
    const token = localStorage.getItem("token")
    try {
      await axios.delete(`https://hajimete-hackathon-backend.onrender.com/api/v1/comments/${comment_id}`,
      {
        headers: {"Authorization": `Bearer ${token}`},
      })
      .then(res => {
        console.log(res.data)
        setComments(comments.filter(c => c.id !== comment_id))
      })
    }catch (e) {
      alert("削除に失敗しました")
      console.error(e)
    }
  }

  return (
    <Card sx={{ maxWidth: 600 }} className={styles.center}>
      <Link href={`/user/${post.user.id}`}>
        <CardHeader
          title={post.user.name}
          subheader={formatDate(post.created_at.toString())}
        />
      </Link>
      <div className={styles.aho}>
        <iframe className={styles.gaki} src={`https://odesli.co/embed/?url=${post.song_url}&theme=dark`} frameBorder={0} allowFullScreen sandbox="allow-same-origin allow-scripts allow-presentation allow-popups allow-popups-to-escape-sandbox" allow="clipboard-read; clipboard-write">
        </iframe>
      </div>
      <CardContent>
        <Typography variant="body1">
          {post.content}
        </Typography>
      </CardContent>
      <CardActions disableSpacing style={{display:"flex", justifyContent:"space-around"}}>
        {
          likeFlag ? (
            <div style={{display:"flex"}}>
              <IconButton aria-label="add to favorites" onClick={deleteLike}>
                <FavoriteIcon sx={{ color: pink[500] }}/>
              </IconButton>
              <p style={{display:"flex", alignItems:"center"}}>{likeCount}</p>
            </div>
          ) : (
            <div style={{display:"flex"}}>
              <IconButton aria-label="add to favorites" onClick={postLike}>
                <FavoriteIcon />
              </IconButton>
              <p style={{display:"flex", alignItems:"center"}}>{likeCount}</p>
            </div>
          )
        }
        <div style={{display:"flex"}}>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <CommentIcon />
          </ExpandMore>
          <p style={{display:"flex", alignItems:"center"}}>{comments.length}</p>
        </div>
        {
          localStorage.getItem("user_id") === post.user.id ? (
            <>
              <IconButton>
                <EditIcon />
              </IconButton>
              <IconButton>
                <DeleteIcon onClick={() => handleDelete(post.id)}/>
              </IconButton>
            </>
          ):(
            <></>
          )
        }
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>コメント欄</Typography> 
          <form onSubmit={(e) => handleComment(e, post.id)}>
            <TextField 
              id="standard-basic" 
              label="コメントを書く" 
              variant="standard" 
              style={{marginBottom:"10px",width:"50%"}}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            // onKeyDown={handleKeyDown}
            />
          </form>
          {
            comments.map((comment) => {
              return (
                <Card sx={{ maxWidth: 600 }} key={comment.id} style={{marginBottom:"5px"}}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {comment.user.name}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      {formatDate(comment.created_at.toString())}
                    </Typography>
                    <div style={{display:"flex"}}>
                      <Typography variant="body1">
                        {comment.content}
                      </Typography>
                      {
                        localStorage.getItem("user_id") === comment.user.id ? (
                          <>
                            <IconButton style={{marginLeft:"auto"}}>
                              <DeleteIcon onClick={() => DeleteComment(comment.id)}/>
                            </IconButton>
                          </>
                        ) : (
                          <></>
                        )
                      }
                    </div>
                  </CardContent>
                </Card>
              )
            })
          }
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default ReviewCard