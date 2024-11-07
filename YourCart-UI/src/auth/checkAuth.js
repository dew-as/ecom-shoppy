import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { login, logout } from "../redux/slices/authSlice";
import axiosConfig from "../api/axiosConfig";
import { useDispatch } from "react-redux";

export const checkAuth = (Component) => {
    function Wrapper(props) {
        const navigate = useNavigate()
        const dispatch = useDispatch()

        useEffect(() => {
            const isAuth = async () => {
                try {
                    const result = await axiosConfig.get('users/check')
                    console.log(result);
                    if (result.status == 200) {
                        dispatch(login({ _id: result.data._id }))
                    }
                } catch (error) {
                    dispatch(logout());
                    if (error.response && error.status == 401) {
                        navigate('/error/401', { state: { message: 'Unauthorized: Please log in.' } });
                    } else {
                        navigate('/error/500', { state: { message: 'Server Error' } });
                    }
                }
            }
            isAuth()
        }, [])
        return <Component {...props} />;
    }
    return Wrapper;
}

export default checkAuth;