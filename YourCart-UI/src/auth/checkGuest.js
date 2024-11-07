import { useEffect } from "react";
import { useNavigate } from "react-router-dom"

export const checkGuest = (Component) => {
    function Wrapper(props) {
        var user = localStorage.getItem('isAuth');
        var navigate = useNavigate();
        useEffect(() => {
            if (user) {
                navigate('/');
            }
        }, [user])
        return <Component {...props} />;
    }
    return Wrapper;
}

export default checkGuest;