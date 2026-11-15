import { openDB } from 'idb';
const DB_NAME='PrecureCardDB'; const STORE='cardStates';
const dbPromise=openDB(DB_NAME,1,{upgrade(db){if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE,{keyPath:'cardId'});}});
export async function getAllCardStates(){return (await dbPromise).getAll(STORE);}
export async function saveCardState(state){return (await dbPromise).put(STORE,state);}
export async function replaceAllCardStates(states){const db=await dbPromise;const tx=db.transaction(STORE,'readwrite');await tx.store.clear();for(const s of states) await tx.store.put(s);await tx.done;}
