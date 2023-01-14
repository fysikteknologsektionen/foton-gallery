import axiosGlobal from 'axios';

const axios = axiosGlobal.create({
  baseURL: '/api', // correct?
});

axios.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;
      if (err.response) {
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
          await axios.post('/refreshtoken');
          return axios(originalConfig);
        }
      }
      return Promise.reject(err);
    },
);

export default axios;
