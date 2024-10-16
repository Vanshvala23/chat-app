import React from "react";
import { View, Text, StyleSheet, TouchableOpacity,Animated } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const ChatBubble = ({ role, text }) => {
    const [animation, setAnimation] = React.useState(new Animated.Value(0));
    React.useEffect(()=>
    {
        Animated.timing(animation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
            
        }).start()
    },[setAnimation]);
  const onSpeech = (text) => {
    Speech.speak(text, {
      language: 'en',
      pitch: 1,
      rate: 1,
      voice: 'en-US-Male', // Change to male voice
    });
  };

  const handleSpeech = () => {
    onSpeech(text);
  }

  const handleStop = () => {
    Speech.stop();
  }

  return (
    <Animated.View style={[styles.container, role === 'user' ? styles.userChatItem : styles.modelChatItem, {
        opacity: animation,
        transform: [
          {
            scale: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 1],
            }),
          },
        ],
      }]}>
        <Text style={styles.text}>{text}</Text>
        {role === 'model' && (
          <View style={styles.speakerIconContainer}>
            <TouchableOpacity onPress={handleSpeech} style={styles.speakerIcon}>
              <Ionicons name="volume-high" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleStop} style={styles.stopIcon}>
              <FontAwesome name="stop" size={24} color="black" />
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#333',
    borderRadius: 3,
    padding: 12,
    marginVertical: 4,
    maxWidth: '80%',
    minWidth: '40%',
    alignSelf: 'flex-start',
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  speakerIconContainer: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    flexDirection: 'row',
  },
  speakerIcon: {
    marginRight: 10,
  },
  stopIcon: {
    marginLeft: 10,
  },
  text: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  userChatItem: {
    alignSelf: 'flex-end',
    backgroundColor: 'pink',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  modelChatItem: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
});

export default ChatBubble;