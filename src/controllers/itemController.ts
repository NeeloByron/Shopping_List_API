// Business logic for each endpoint
import type { Item } from '@/models/item';

const items: Item[] = [];
let nextId = 1;

module.exports = {
  getAllItems(): Item[] {
    return items;
  },

// in memory array data
addItem(name: string, quantity: number): Item {
    const item: Item = {
        id: String(nextId++),
        name,
        quantity,
        purchased: false,
    };
    
    items.push(item);
    return item;
  }
},

  // find a single item by its string id
  function getItemById(id: string): Item | undefined {
    return items.find(item => item.id === id);
  },

// find an item and mutate its specific fields if provided
 function updateItem(
     id: string, 
     updates: { 
       name?: string; 
       quantity?: number; 
       purchased?: boolean }
  ): Item | null {
   const item = items.find((item) => item.id === id );

    if (!item) return null;

    // apply changes field by field if they are present in the request
    if (updates.name !== undefined) item.name = updates.name;
    if (updates.quantity !== undefined) item.quantity = updates.quantity;
    if (updates.purchased !== undefined) item.purchased = updates.purchased;
    return item;
   }

function getItemById(id: any, string: any) {
  throw new Error('Function not implemented.');
}


