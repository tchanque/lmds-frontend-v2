import { atom } from "jotai";

export const userAtom = atom({
  email: "",
  id: "",
  token: "",
  isLoggedIn: false,
});