import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, FlatList, Text, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface Message {
  id: string;
  text: string;
  image?: string;
}
interface User {
  id: string;
  name: string;
}

const ChatScreen = () => {
  const [message, setMessage] = useState<string>('');
  const [users] = useState<User[]>([
    { id: '1', name: 'Brayden Lawson' },
    { id: '2', name: 'Jorge Santos' },
    { id: '3', name: 'Dr.Griffin' },
    { id: '4', name: 'Willy Wonka' },
    { id: '5', name: 'Joker' },
    { id: '6', name: 'Batman' },
  ]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userMessages, setUserMessages] = useState<{ [userId: string]: Message[] }>({});
  const [userPhoto, setUserPhoto] = useState('');

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    if (!userMessages[user.id]) {
      setUserMessages(prevUserMessages => ({ ...prevUserMessages, [user.id]: [] }));
    }
  };

  const handleMessageSend = () => {
    if (!selectedUser || (message.trim() === '' && !userPhoto)) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      image: userPhoto, // Assuming userPhoto is the URI of the selected image
    };

    setUserMessages(prevUserMessages => ({
      ...prevUserMessages,
      [selectedUser.id]: [...prevUserMessages[selectedUser.id], newMessage],
    }));

    setMessage('');
    setUserPhoto('');
  };

  const handleUserPhotoSelect = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Gallery permission is required!');
      return;
    }

    const photoSelected = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      aspect: [4, 4],
      allowsEditing: true,
    });

    if (!photoSelected.canceled && photoSelected.assets && photoSelected.assets.length > 0) {
        setUserPhoto(photoSelected.assets[0].uri);
      }
  };

  return (
    <View style={styles.container}>
      <View style={styles.userList}>
        <Text style={styles.heading}>:lollipop: Users</Text>
        <FlatList
          data={users}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleUserSelect(item)}>
              <Text style={[styles.userItem, selectedUser?.id === item.id && styles.selectedUser]}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={styles.chatContainer}>
        {selectedUser ? (
          <>
            <FlatList
              data={userMessages[selectedUser.id] || []}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View style={[styles.message, styles.receiverMessage]}>
                  <Text style={styles.messageText}>{item.text}</Text>
                  {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
                </View>
              )}
            />
            <View style={styles.inputContainer}>
              <TouchableOpacity onPress={handleUserPhotoSelect}>
                <MaterialIcons name="add-a-photo" size={24} color="#FF6B6B" />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                onChangeText={setMessage}
                value={message}
                placeholder="Type a sweet message..."
                multiline
                placeholderTextColor="#999"
              />
              <TouchableOpacity onPress={handleMessageSend}>
                <MaterialIcons name="send" size={24} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text style={styles.selectUserText}>:candy: Please select a user to start chatting</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFE4E1',
  },
  userList: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#FF69B4',
    padding: 20,
  },
  heading: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#FF69B4',
  },
  userItem: {
    fontSize: 16,
    marginBottom: 10,
    color: '#FF69B4',
  },
  selectedUser: {
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  chatContainer: {
    flex: 3,
    padding: 20,
  },
  message: {
    backgroundColor: '#F0F8FF',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  receiverMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFB6C1',
    marginLeft: '20%',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#FF69B4',
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#FF69B4',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    maxHeight: 150,
    backgroundColor: '#fff',
    color: '#333',
  },
  selectUserText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#FF69B4',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 5,
  },
});

export default ChatScreen;
