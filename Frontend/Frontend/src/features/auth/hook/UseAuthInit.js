    import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getMe } from "../services/api.auth.js";
import { setUser, setLoading } from "../auth.slice.js";

export function useAuthInit() {
    const dispatch = useDispatch();

    useEffect(() => {
        async function checkAuth() {
            dispatch(setLoading(true));
            try {
                const data = await getMe();
                dispatch(setUser(data.user));
            } catch (err) {
                dispatch(setUser(null));
            } finally {
                dispatch(setLoading(false));
            }
        }
        checkAuth();
    }, []);
}