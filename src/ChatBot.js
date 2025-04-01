import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import ChatBubble from './ChatBubble';
import { speak, isSpeakingAsync, stop } from 'expo-speech';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function ChatBot() {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef=useRef(null);

  useEffect(()=>
  {
    scrollRef.current?.scrollToEnd({animated:true})
  },[messages])

  const API_KEY = 'AIzaSyD1rrm09TOs_ytwukPKm4hjYppSIZL1_go';

  const handleUser = useCallback(async () => {
    if(!userInput.trim()) return ;
    try {
      const updateChat = [
        ...messages,
        {
          role: 'user',
          parts: [{ text: userInput }]
        },
      ];
      setLoading(true);
      const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
        {
          contents: updateChat,
        }
      );
      const modelResponse = response.data;
      const modelResposes = modelResponse?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  
      // Clean the output to remove unwanted characters like ***
      const cleanedResponse = modelResposes.replace(/[*]+/g, ''); // Remove asterisks
      if (cleanedResponse) {
        const updateChatWithModel = [
          ...updateChat,
          {
            role: 'model',
            parts: [{ text: cleanedResponse }],
          }
        ];
        setMessages(updateChatWithModel);
        setUserInput('');
      }
    } catch (error) {
      console.error("Error in Venom AI :", error);
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  }, [userInput, messages]);
  
  const handleSpeech = useCallback(async (text) => {
    console.log('handleSpeech called with text:', text);
    if (!isSpeaking) {
      console.log('Stopping speech');
      stop();
      setIsSpeaking(false);
    } else {
      console.log('Checking if speaking');
      if (!(await isSpeakingAsync())) {
        console.log('Speaking text:', text);
        speak(text,{
          language: 'en-US',
          pitch: 1.0,
          rate: 1,
          voice:'en-US-Male'
        });
        setIsSpeaking(true);
      }
    }
  }, [isSpeaking]);

  const renderChatItem = ({ item }) => {
    return (
      <ScrollView
      ref={scrollRef}
      contentContainerStyle={styles.chatContainer}
      showsVerticalScrollIndicator={false}
    >
      <ChatBubble
        role={item.role}
        text={item.parts[0].text}
        onSpeech={item.role === 'model' ? () => handleSpeech(item.parts[0].text) : null}  
      />
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
       <LinearGradient colors={['#222', '#000']} style={styles.header}>
        <Text style={styles.title}>Venom AI ✨</Text>
      </LinearGradient>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.chatContainer}
      >
        {messages.map((item, index) => (
          <View key={index}>
            {renderChatItem({ item })}
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={userInput}
          onChangeText={setUserInput}
          placeholder="Type your message here..."
          placeholderTextColor="#fff"
          selectionColor="#007bff"
          underlineColorAndroid="transparent"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleUser}>
        <MaterialIcons name="send" size={24} color="black" style={styles.sendButtonText} />
        </TouchableOpacity>
      </View>
      {loading && <ActivityIndicator size="large" color="#007bff" style={styles.loading} />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Text style={styles.text1}>Remember Venom AI can make mistakes</Text>
      <Text style={styles.text2}>Developed by Vansh🐼</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 0,
    margin: 0,
  },
  textContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#333',
    color:'magenta'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    top: 40,
    left: 20,
    alignItems: 'center',
    color: 'pink',
    linearGradient:{
      colors: ['red', 'black'],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    }
  },
  chatContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    display: 'flex',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    backgroundColor: '#333',
    width: '100%',
    top:-30,
  },
  input: {
    flex: 1,
    padding: 10,
    color: '#fff',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: 'green',
    borderRadius: 5,
    padding: 10,
  },
  sendButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  loading: {
    display:'flex',
    flexDirection:'column',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  errorText: {
    color: 'red',
    marginTop: 20,
  },
  text1: {
    color: '#fff',
    display:'flex',
    flexDirection:'column',
    top:-20,
    textAlign: 'center',
    fontSize: 12,
  },
  text2: {
    color: '#fff',
    display:'flex',
    flexDirection:'column',
    top:-10,
    textAlign: 'center',
    fontSize: 18,
  }
});