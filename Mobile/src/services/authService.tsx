import axios from 'axios';
import { BASE_URL } from './config';
import { tokenStorage } from '@state/storage';
import { useAuthStore } from '@state/authStore';
import { resetAndNavigate } from '@utils/NavigationUtils';
import { appAxios } from './apiInterceptors';

console.log('🔥 authService FILE LOADED');

// ================= CUSTOMER LOGIN =================
export const customerLogin = async (phone: string) => {
  console.log('📤 customerLogin CALLED with:', phone);

  try {
    const response = await axios.post(`${BASE_URL}/customer/login`, { phone });

    console.log('✅ RESPONSE DATA:', response.data);

    const { accessToken, refreshToken, customer } = response.data;

    // ✅ MMKV – correct methods
    tokenStorage.set('accessToken', accessToken);
    tokenStorage.set('refreshToken', refreshToken);

    // ✅ Zustand
    const { setUser } = useAuthStore.getState();
    setUser(customer);

    return true;
  } catch (error: any) {
    console.log('❌ LOGIN ERROR:', error.message);
    throw error;
  }
};

// ================= DELIVERY LOGIN =================
export const deliveryLogin = async (email: string, password: string) => {
  const response = await axios.post(`${BASE_URL}/delivery/login`, {
    email,
    password,
  });

  const { accessToken, refreshToken, deliveryPartner } = response.data;

  tokenStorage.set('accessToken', accessToken);
  tokenStorage.set('refreshToken', refreshToken);

  const { setUser } = useAuthStore.getState();
  setUser(deliveryPartner);
};

// ================= REFRESH TOKEN =================
export const refresh_token = async () => {
  try {
    const refreshToken = tokenStorage.getString('refreshToken');

    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    const response = await axios.post(`${BASE_URL}/refresh-token`, {
      refreshToken,
    });

    const newAccessToken = response.data.accessToken;
    const newRefreshToken = response.data.refreshToken;

    tokenStorage.set('accessToken', newAccessToken);
    tokenStorage.set('refreshToken', newRefreshToken);

    return newAccessToken;
  } catch (error) {
    console.log('❌ REFRESH TOKEN FAILED');

    // ✅ DO NOT use clear / clearAll here
    tokenStorage.delete('accessToken');
    tokenStorage.delete('refreshToken');

    resetAndNavigate('CustomerLogin');
  }
};

// ================= FETCH USER =================
export const refetchUser = async (setUser: any) => {
  const response = await appAxios.get('/user');
  setUser(response.data.user);
};
