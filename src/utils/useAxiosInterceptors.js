import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const useAxiosInterceptors = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const requestInterceptor = axios.interceptors.request.use(
			function (config) {
				return config;
			},
			function (error) {
				return Promise.reject(error);
			},
		);

		const responseInterceptor = axios.interceptors.response.use(
			function (response) {
				return response && response.data ? response.data : response;
			},
			function (error) {
				if (error.response && error.response.status === 401) {
					navigate('/login');
				}
				return error && error.response && error.response.data
					? error.response.data
					: Promise.reject(error);
			},
		);

		// Cleanup interceptors on unmount
		return () => {
			axios.interceptors.request.eject(requestInterceptor);
			axios.interceptors.response.eject(responseInterceptor);
		};
	}, [navigate]);
};

export default useAxiosInterceptors;
