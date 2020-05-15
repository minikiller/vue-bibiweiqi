import config from 'config';
import { authHeader ,handleResponse} from '../_helpers';

export const gameService = {
    getAll,
};

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/games`, requestOptions).then(handleResponse);
}