import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useUserId = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const user_id = await AsyncStorage.getItem('user_id');
        if (user_id) {
          setUserId(user_id);
        }
      } catch (error) {
        console.error('Error retrieving user_id:', error);
      }
    };

    fetchUserId();
  }, []);

  return userId;
};

export default useUserId;
