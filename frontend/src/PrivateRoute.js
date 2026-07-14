import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";

function PrivateRoute() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || token === "undefined") {
            toast.error("No valid token found", { position: "top-right", autoClose: 2000 });
            navigate("/");
        }

    }, [navigate])

    return (
        <>
            {localStorage.getItem("token") ? <Outlet /> : null}
        </>
    )
}

export default PrivateRoute;