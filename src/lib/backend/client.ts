import axios from "axios";

const client = axios.create({
  baseURL: "http://43.203.93.186:8080",
  withCredentials: true,
});

export default client;
