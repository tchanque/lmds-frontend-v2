import { atomWithStorage } from "jotai/utils";

export const bearerTokenAtom = atomWithStorage('token', "");
export const currentUserAtom = atomWithStorage('currentUser', null);
export const popUpEventAtom = atomWithStorage('popUpEvent', null);
export const popUpPublicationAtom = atomWithStorage('popUpPublication', null);
export const popUpAdminFormAtom = atomWithStorage('popUpAdminForm', null);

