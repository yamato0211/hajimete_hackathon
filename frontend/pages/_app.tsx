import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Link from 'next/link'
import { IconButton } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import PostAddIcon from '@mui/icons-material/PostAdd';
import HomeIcon from '@mui/icons-material/Home';
import { useRouter } from 'next/router'
import { useEffect, useLayoutEffect } from 'react'
import style from "../styles/Home.module.css"

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useLayoutEffect(() => {
    const authCheck = () => {
      if(router.pathname !== "/Signup" && router.pathname !== "/Signin"){
        if(localStorage.getItem("token") === null) {
          router.push("/Signup")
        }
      }
    }
    authCheck()
  },[])

  const goMyPage = () => {
    const uid = localStorage.getItem("user_id")
    router.push(`/user/${uid}`)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user_id")
  }
  return (
    <>
      <Head>
        <meta name="theme-color" content="#FFFFFF" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/index.png" />
      </Head>
      {
        router.pathname !== "/Signup" && router.pathname !== "/Signin" ?(
          <header 
            style={{backgroundColor:"#4D4D4D", display:"flex",justifyContent:"space-around"}}
          >
            <h1 style={{color: "#EEEEEE"}}>SoNgS</h1>
            <div className={style.globalHeader}>
              <IconButton>
                <Link href="/">
                  <HomeIcon style={{color: "#EEEEEE"}}/>
                </Link>
              </IconButton>
              <IconButton onClick={goMyPage}>
                <div>
                  <PersonIcon style={{color: "#EEEEEE"}}/>
                </div>
              </IconButton>
              <IconButton>
                <Link href="/post">
                  <PostAddIcon style={{color: "#EEEEEE"}}/>
                </Link>
              </IconButton>
              <IconButton onClick={handleLogout}>
                <Link href="/Signup">
                  <LogoutIcon style={{color: "#EEEEEE"}}/>
                </Link>
              </IconButton>
            </div>
          </header>
        ) : (
          <></>
        )
      }
      <Component {...pageProps} />
    </>
  )
}
