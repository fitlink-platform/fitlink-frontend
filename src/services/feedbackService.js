import axios from '../api/axiosClient'

const getMyFeedbacks = ({ page = 1, limit = 10 } = {}) => {
  return axios.get('/feedbacks/me', { params: { page, limit } });
};

const feedbackService = {
  getMyFeedbacks
}
export default feedbackService

