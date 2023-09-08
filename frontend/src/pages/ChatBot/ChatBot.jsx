import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from "react-redux"
import Axios from 'axios';
import './ChatBot.css';
import { Navbar } from '../../components';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';

function App() {
    const navigate = useNavigate();
    const user = useSelector(state => state.handleUser)
    useEffect(()=>{
        if(!user)navigate('/login')
    },[])
    return (
        <div className="ChatBot">
            <Navbar />
            <section>
                <ChatRoom />
            </section>

        </div>
    );
}
function LoadingWait() {
    return (
        <div className="loading">
            <div>
                Generating Your Response
            </div>
            <div className="loading-circles">
                <div class="circle"></div>
                <div class="circle"></div>
                <div class="circle"></div>
            </div>
        </div>
    )
}

function ChatRoom() {
    const dummy = useRef();
    const [messages, setMessages] = useState([])
    const user = useSelector(state => state.handleUser)
    const [loading, setLoading] = useState(false)
    const [formValue, setFormValue] = useState('');
    const [userMessageAdded,setUserMessageAdded] = useState(false)
    const getAPIData = async()=>{
        const genderPrompt = `I am a ${user.gender}. `
        const brandPrompt = `I frequently purchase Brand ${user.brand}. `
        let messageForm = new FormData()
        messageForm.append('message' , genderPrompt + brandPrompt + formValue)
        setFormValue('')
        await Axios.post('http://127.0.0.1:5000' ,messageForm)

        .then(async(res)=>{
            const indexes = res.data.indexes.split(" ")
            const db = res.data.db
            let data = []
            for (let index of indexes){
                await Axios.get(`http://127.0.0.1:5000/product/${db}/${index-1}`)
                    .then((res)=>{
                        data.push(res.data)
                    })
                    .catch(err=>console.log(err))
            }
            console.log(data)
            setMessages(() => {
                return [...messages, { id: "ChatBot", data : data }]
            }) 
        })
        .catch((err)=>console.log(err))
        setLoading(false)
        setUserMessageAdded(false)
        
        dummy.current.scrollIntoView({ behavior: 'smooth' });
    }
    useEffect(()=>{
        if(userMessageAdded){
            getAPIData();
        }
    },[userMessageAdded])
    const sendMessage = (e) => {
        e.preventDefault();
        setMessages(() => {
            return [...messages, { id: user.email, text: formValue }]
        })
        setUserMessageAdded(true)
        setLoading(true)
        
        dummy.current.scrollIntoView({ behavior: 'smooth' });
    }

    return (<>
        <main>

            {messages && messages.map(msg => <ChatMessage message={msg} />)}

            <span ref={dummy}></span>
        </main>


        {loading && <LoadingWait></LoadingWait>}
        <form onSubmit={sendMessage}>


            <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="What Do You Want to wear?" />

            <button type="submit" className='submit-button' disabled={!formValue}>👠</button>

        </form>
    </>)
}

const renderCards = (data) =>{
    return(
        <>
        
        <div className='product-recommend'>
            <div style={{color:'black' , marginBottom: "20px"}}>Sure Here are some suggestions</div>
            <div className='products'>
            {data.map((product)=>{
                return(
                    <Card product={product}/>
                )
            })}
            </div>
        </div>
        </>
    )
}


function ChatMessage(props) {
    const user = useSelector(state => state.handleUser)
    const {id} = props.message;

    const messageClass = id === user.email ? 'sent' : 'received';

    return (<>
        <div className={`message ${messageClass}`}>
            {id === user.email ? <p>{props.message.text}</p> : renderCards(props.message.data)}
            
        </div>
    </>)
}


export default App;