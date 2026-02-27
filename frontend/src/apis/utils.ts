import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Try refresh token
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const res = await axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL}/accounts/refresh`,
                        { refreshToken },
                    );
                    const { accessToken } = res.data;
                    localStorage.setItem('accessToken', accessToken);
                    if (error.config) {
                        error.config.headers.Authorization = `Bearer ${accessToken}`;
                        return apiClient(error.config);
                    }
                }
            } catch {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    },
);

export const Api = {
    get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
        const response = await apiClient.get<T>(url, config);
        return response.data;
    },
    post: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
        const response = await apiClient.post<T>(url, data, config);
        return response.data;
    },
    put: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
        const response = await apiClient.put<T>(url, data, config);
        return response.data;
    },
    patch: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
        const response = await apiClient.patch<T>(url, data, config);
        return response.data;
    },
    delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
        const response = await apiClient.delete<T>(url, config);
        return response.data;
    },
};

export default apiClient;
