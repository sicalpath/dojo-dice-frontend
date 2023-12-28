
import { Seeds } from '@/app/types';
import * as crypto from 'crypto';
import { keccak256 } from 'viem'

export function randomHexAndCommitment(length = 16): Seeds {
    const secret = crypto.randomBytes(length);
    const pub = crypto.randomBytes(length);
    return { value: [secret.toString('hex'), pub.toString('hex')], hash: [keccak256(secret), keccak256(pub)] };
}

export function getNewGameId(length = 16): string {
    return crypto.randomBytes(length).toString('hex');
}