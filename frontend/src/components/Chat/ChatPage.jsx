import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import ChatInput from './ChatInput'; 
import ChatMessage from './ChatMessage'; 
import Layout from '../Layout';
import '../../styles/chatpage.css';


const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // メッセージをバックエンドから取得
  const fetchMessages = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // トークンがない場合は認証されていない
      console.error("認証されていません");
      return;
    }


    try {
      const response = await axios.get('http://localhost:8000/api/chat/messages/user_messages/', {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      setMessages(response.data);
    } catch (err) {
      console.error("メッセージの取得に失敗しました:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);
  
  // 新しいメッセージを送信
  const sendMessage = async (message) => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error("トークンがありません。ログインしてください。");
      return;
    }

    // 送信されたユーザーのメッセージを即表示
    const newMessage = {
      id: `temp-${Date.now()}`, 
      user: "You",
      text: message,
      is_bot: false,
    }; 

    setMessages((prevMessages) => [...prevMessages, newMessage]);


    try {
      const response = await axios.post(
        'http://localhost:8000/api/chat/messages/send_message/', 
        { message },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        }
      );

      // ボットの返信を取得してメッセージを更新
      const botResponse = {
        id: response.data.bot_response.id, // ボット返信のID
        user: "Bot",
        text: response.data.bot_response.text, // ボットの返信
        is_bot: true,
      };

      setMessages((prevMessages) => [...prevMessages, botResponse]);


    } catch (err) {
      console.error("メッセージ送信に失敗しました:", err);
      // エラーハンドリングの強化
      alert("メッセージの送信に失敗しました。もう一度試してください。");
    }
  };

  // メッセージが更新された後に自動でスクロールする
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]); 

  return (
    <Layout>  
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
        <ChatInput onSendMessage={sendMessage} />
      </div>
    </Layout>
  );
};

export default ChatPage;
