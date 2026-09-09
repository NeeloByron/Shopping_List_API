// Business logic for each endpoint
import type { Item } from '@/Types/item.js'

const items: Item[] = [];
let nextId = 1;

export function getAllItems(): Item[] {
  return items;
}

// in memory array data
export function addItem(name: string, quantity: number): Item {
  const item: Item = {
    id: String(nextId++),
    name: name.trim(),
    quantity,
    purchased: false,
  };

  items.push(item);
  return item;
}

// find a single item by its string id
export function getItemById(id: string): Item | undefined {
  return items.find((item) => item.id === id);
}

// find an item and mutate its specific fields if provided
export function updateItem(
  id: string,
  updates: {
    name?: string;
    quantity?: number;
    purchased?: boolean;
  }
): Item | null {
  const item = items.find((item) => item.id === id);

  if (!item) return null;

  // apply updates
  if (updates.name !== undefined) item.name = updates.name;
  if (updates.quantity !== undefined) item.quantity = updates.quantity;
  if (updates.purchased !== undefined) item.purchased = updates.purchased;
  return item;
}

export function deleteItem(id: string): boolean {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return false;

  items.splice(index, 1);
  return true;
}

