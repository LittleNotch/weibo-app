import * as api from '../api/account';
import { message } from 'antd';
import { ACCESS_TOKEN_KEY, UID_KEY } from '../constants';


export function getAccess(params = {}) {
    return async () => {
        try {
            const { access_token, uid } = await api.getAccess(params);
            localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
            localStorage.setItem(UID_KEY, uid);
        } catch (e) {
            message.error('login failure!');
        }
        window.location.href = '/';
    }
}