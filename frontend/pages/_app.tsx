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
import { useLayoutEffect } from 'react'

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
          <header style={{backgroundColor:"aquamarine", display:"flex",justifyContent:"space-between"}}>
            <h1>Hajimete_Hackathon</h1>
            <div>
              <IconButton>
                <Link href="/">
                  <HomeIcon/>
                </Link>
              </IconButton>
              <IconButton>
                <Link href="/user">
                  <PersonIcon/>
                </Link>
              </IconButton>
              <IconButton>
                <Link href="/post">
                  <PostAddIcon/>
                </Link>
              </IconButton>
              <IconButton onClick={handleLogout}>
                <Link href="/Signup">
                  <LogoutIcon/>
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
