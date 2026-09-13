// Business logic for each endpoint
import type { Item } from '../Types/item'

const items: Item[] = []; // starts as an empty list.
let nextId = 1; // uses the current number then increases it

// returens the whole list
export function getAllItems(): Item[] {
  return items;
}

// creates an item, adds it and returns it
export function addItem(name: string, quantity: number, purchased:boolean): Item {
  const item: Item = {
    id: String(nextId++),
    name: name.trim(), // trim() removes spaces from both ends of a name.
    quantity,
    purchased,
  };

  items.push(item);
  return item;
}

// find a single item and returns undefined if missing
export function getItemById(id: string): Item | undefined {
  return items.find((item) => item.id === id);
}

// find an item and mutate its specific fields if provided. Returns null if missing,
export function updateItem(
  id: string,
  updates: {
    name?: string;
    quantity?: number;
    purchased?: boolean;
  }
): Item | null {
  const item = items.find((item) => item.id === id);

  if (!item) {
    return null;
  }
  // apply updates
  if (updates.name !== undefined) {
    item.name = updates.name.trim();
  }
  if (updates.quantity !== undefined) {
    item.quantity = updates.quantity;
  }
  if (updates.purchased !== undefined) { 
    item.purchased = updates.purchased; }
  return item;
    
}

// delete an item and returns true if removed, false if missing 
export function deleteItem(id: string): boolean {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) {
    return false;
  }
  items.splice(index, 1);
  return true;
}

