import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const bearerToken = atomWithStorage('bearer_token', null)