import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const bearerTokenAtom = atomWithStorage(
  localStorage.getItem("token") || ""
);

export const setBearerTokenAtom = atom(
  (get) => get(bearerTokenAtom),
  (get, set, newToken) => {
    localStorage.setItem("token", newToken);
    set(bearerTokenAtom, newToken);
  }
);

// current user information as returned by POST users/sign_in
export const currentUserAtom = atomWithStorage("currentUserAtom", null);

export const userAtom = atom({
    id: "",
    isLoggedIn: !!localStorage.getItem('token'),
    token: localStorage.getItem('token') || "",
  });
