import { Navbar, Main, Product, Footer } from "../components";
import { useEffect } from 'react';
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "../redux/action";
function Home() {
  const dispatch = useDispatch()
  useEffect(()=>{
      async function getUser(){
        await axios.get('http://localhost:4000/getUser')
          .then((res)=>{
            if(res.data.authenticated){
              dispatch(setUser(res.data.user))
            }
          })
          .catch((err)=>console.log(err))
      }
      getUser()
  },[])
  return (
    <>
      <Navbar />
      <Main />
      <Product />
      <Footer />
    </>
  )
}

export default Home