import axios from "axios";
import { baseURL } from "./assets";

const instance = axios.create({
  baseURL,
});

export default instance;
