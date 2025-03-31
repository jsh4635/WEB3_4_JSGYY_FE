import axios from "axios";

const client = axios.create({
  baseURL: "https://43.203.93.186.sslip.io",
  withCredentials: true,
});

export default client;
