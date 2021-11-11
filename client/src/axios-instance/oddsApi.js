import axios from 'axios';
import config from '../config'

const instance = axios.create({ baseURL: config.ODDS_API_URL });

export default instance;