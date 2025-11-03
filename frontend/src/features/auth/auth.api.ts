import api from '../../api/axios';
export const getMe = () => api.get('/auth/me').then(r => r.data);
export const loginPassword = (email: string, password: string) =>
  api.post('/auth/login', { email, password }).then(r => r.data); // expect {token}
