import { useDispatch } from "react-redux";
import { login, register, getMe } from "../services/api.auth";
import { setUser, setLoading, setError } from "../auth.slice";
import { logout } from "../services/api.auth.js";
import { logout as logoutAction } from "../auth.slice.js";

export function useAuth() {
    const dispatch = useDispatch()

    async function handleRegister({ email, username, password }) {
        try {
            dispatch(setLoading(true))
            const data = await register({ email, username, password })
        } catch (error) {
            dispatch(setError(error.reponse?.data?.message || "Registration Failed"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogin({ email, password }) {
        try {
            dispatch(setLoading(true))
            const data = await login({ email, password })
            dispatch(setUser(data.user))
        } catch (error) {
            dispatch(setError(error.reponse?.data?.message || "Login Failed"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handlegetMe() {
        try {
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
        } catch (error) {
            dispatch(setError(error.reponse?.data?.message || "Failed to fetch data "))
        } finally {
            dispatch(setLoading(false))
        }
    }


    async function handleLogout() {

        try {

            await logout();

            dispatch(logoutAction());

            navigate("/login");

        }

        catch (err) {

            console.log(err);

        }

    };


    return {
        handleRegister, handleLogin, handlegetMe,handleLogout
    }
}
