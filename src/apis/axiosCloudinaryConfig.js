import axios from 'axios';

const cloudName = 'dmjafhfiu';

const instance = axios.create({
	baseURL: `https://api.cloudinary.com/v1_1/${cloudName}`,
});
// Add a request interceptor
instance.interceptors.request.use(
	function (config) {
		config.headers['Content-Type'] = 'multipart/form-data';
		// Do something before request is sent
		return config;
	},
	function (error) {
		// Do something with request error
		return Promise.reject(error);
	},
);

// Add a response interceptor
instance.interceptors.response.use(
	function (response) {
		// Any status code that lie within the range of 2xx cause this function to trigger
		// Do something with response data
		return response && response.data ? response.data : response;
	},
	function (error) {
		// Any status codes that falls outside the range of 2xx cause this function to trigger
		// Do something with response error
		return error && error.response && error.response.data
			? error.response.data
			: Promise.reject(error);
	},
);
export default instance;
