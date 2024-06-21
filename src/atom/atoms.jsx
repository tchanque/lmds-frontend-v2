import { atomWithStorage } from "jotai/utils";

export const bearerTokenAtom = atomWithStorage('token', "");
export const currentUserAtom = atomWithStorage('currentUser', null);
