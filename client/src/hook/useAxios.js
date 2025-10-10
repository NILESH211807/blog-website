import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../utils/axiosInstance';

const useAxios = () => {

    const navigate = useNavigate();

    const fetchData = async ({
        url,
        method,
        data,
        headers = {
            'Content-Type': 'application/json',
        }
    }) => {

        try {
            await new Promise((resolve) => setTimeout(resolve, 500));

            const response = await axiosInstance({
                method,
                url,
                data,
                headers,
            });
            return response.data;

        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Something went wrong';
            if (message == "Unauthorized access. Please login.") {
                navigate('/login', { replace: true });
            }
            return { success: false, message };
        }
    };

    const fetchAdminData = async ({
        url,
        method,
        data,
        headers = {
            'Content-Type': 'application/json',
        }
    }) => {

        try {
            await new Promise((resolve) => setTimeout(resolve, 500));

            const response = await axiosInstance({
                method,
                url,
                data,
                headers,
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Something went wrong';
            if (message == "Unauthorized access. Please login.") {
                navigate('/admin/login', { replace: true });
            }
            return { success: false, message };
        }
    };

    return { fetchData, fetchAdminData };
}

export default useAxios;
