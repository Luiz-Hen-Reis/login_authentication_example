import axios from 'axios';
import jwt_decode from 'jwt-decode';

type SignInRequestData = {
    identifier: string;
    password: string
}

type JwtData = {
    id: number;
}

export async function signInRequest({ identifier, password }: SignInRequestData) {
    try {
        const request = await axios.post('http://localhost:1337/api/auth/local', { identifier, password });
        return request.data;
    } catch (error) {
        console.log(error);
    }
}

export async function recoverUserInformation(jwt: string) {
    try {
        const decoded: JwtData = jwt_decode(jwt);
        const userId = decoded.id;
        const request = await axios.get(`http://localhost:1337/api/users/${userId}`);
        return request.data;
    } catch (error) {
        console.log(error);
    }
}