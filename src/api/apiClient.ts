import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/';

export const apiClient = axios.create({
	baseURL: BASE_URL,
	headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
	const token = localStorage.getItem('access_token');

	if (token && config.headers) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
	},
	(error) => {
	return Promise.reject(error);
	}
);

apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response) {
			const { status } = error.response;

			switch (status) {
				case 401:
					toast.error('The session has expired. Please log in again.');
					break;

				case 403:
					toast.error('Access denied! You do not have permission to perform this action.');
					break;

				case 	404:
					toast.error('Oops! The requested page or product was not found.');
					break;

				case 500:
					toast.error('There was a server error. We are working on fixing it, please try again later.');
					break;

				default:
					toast.error('Something went wrong. Please try again.');
			}
		} else {
			toast.error('There is no connection to the server. Check your internet connection.');
		}

		return Promise.reject(error);
})
