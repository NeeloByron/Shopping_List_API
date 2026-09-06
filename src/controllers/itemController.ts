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
}
