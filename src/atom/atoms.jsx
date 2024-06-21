import { atomWithStorage } from "jotai/utils";

export const bearerTokenAtom = atomWithStorage('token', "");
export const currentUserAtom = atomWithStorage('currentUser', null);
export const popUpAtom = atomWithStorage('popUp', null)
