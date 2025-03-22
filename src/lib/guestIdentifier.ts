// lib/guestIdentifier.ts
import { v4 as uuidv4 } from 'uuid';

const GUEST_ID_KEY = 'theoforge_guest_id';

export function getGuestId(): string {
  let guestId = localStorage.getItem(GUEST_ID_KEY);
  
  if (!guestId) {
    guestId = uuidv4();
    localStorage.setItem(GUEST_ID_KEY, guestId);
  }
  
  return guestId;
}

export function getStorageKeyForGuest(baseKey: string, guestId: string): string {
  return `${baseKey}_${guestId}`;
}