import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const bearerToken = atomWithStorage('bearer_token', null)
export const currentUserAtom = atomWithStorage('current_user_atom', null);