import axios from '~/api/axiosClient';

export const listPayoutRequests = async (params) => {
  const res = await axios.get('/payouts/admin', { params });
  return res.data; // kỳ vọng { items, page, total, ... }
};

export const completePayout = async (id) => {
  const res = await axios.post(`/payouts/admin/${id}/complete`);
  return res.data;
};

export const rejectPayout = async (id, data) => {
  const res = await axios.post(`/payouts/admin/${id}/reject`, data);
  return res.data;
};
