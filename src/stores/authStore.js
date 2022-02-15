import { makeAutoObservable } from "mobx";
import instance from "./instance";
import decode from "jwt-decode";

class AuthStore {
  user = null;
  constructor() {
    makeAutoObservable(this);
  }

  setUser = (token) => {
    this.user = decode(token);
    localStorage.setItem("token", token);
    instance.defaults.headers.common.Authorization = `Bearer ${token}`;
  };

  signout = () => {
    localStorage.removeItem("token");
    this.user = null;
  };

  signup = async (user) => {
    try {
      const res = await instance.post("/user/signup", user);
      this.setUser(res.data.token);
    } catch (error) {
      console.log(error);
    }
  };

  checkForToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = decode(token);
      if (Date.now() < +decodedToken.exp) {
        this.setUser(token);
      } else this.signout();
    }
  };
}

const authStore = new AuthStore();
authStore.checkForToken();

export default authStore;
