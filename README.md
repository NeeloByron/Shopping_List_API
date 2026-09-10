<h2 align="center">Shopping List API</h2>

<p align="center">
  <em>A REST API built with Node.js and TypeScript that lets users manage the items they want to buy.</em>
</p

<hr>

<h2 align="center">About</h2>

<p>You need to make a note of groceries before going to the store. You're making a shopping list consisting of items such as "Milk" or "Bread". As you shop, you check off items that you purchased. You can change amounts (e.g., 2L of milk rather than 1), and delete items you no longer need.</p>

<hr>

## Screenshot 

<p align="center">
  <img src="./src/assets/post-items.png" alt="Shopping List App Dashboard" width="700">
</p>
  
<hr>

<h2>Features</h2>

<table>
  <thead>
    <tr>
      <th align="left">Method</th>
      <th align="left">Endpoint</th>
      <th align="left">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>POST</code></td>
      <td><code>/items</code></td>
      <td>Add an item</td>
    </tr>
    <tr>
      <td><code>GET</code></td>
      <td><code>/items</code></td>
      <td>Get all items</td>
    </tr>
    <tr>
      <td><code>GET</code></td>
      <td><code>/items/:id</code></td>
      <td>Get a single item by ID</td>
    </tr>
    <tr>
      <td><code>PUT</code></td>
      <td><code>/items/:id</code></td>
      <td>Update an item (name, quantity, purchased status, etc.)</td>
    </tr>
    <tr>
      <td><code>DELETE</code></td>
      <td><code>/items/:id</code></td>
      <td>Delete an item</td>
    </tr>
  </tbody>
</table>

<hr>

<h2>Tech Stack</h2>

<ul>
  <li><strong>Node.js</strong> - Runtime environment</li>
  <li><strong>TypeScript</strong> - Type-safe JavaScript</li>
</ul>

## Setup 

Initialize package.json
- npm init -y

Install TypeScript and dependencies
- npm i typescript ts-node @types/code

Installation of dependency installation 
- npm install -D tsx nodemon

TypeScript Compiler Configuration
- npx tsc --init


## Getting Started
- Node.js (v14 or higher)
- npm 

<hr>

### Steps to Run locally

```bash
# Clone the repository
git clone https://github.com/NeeloByron/Shopping_List_API.git
```

```bash
# Navigate to the project directory
cd Shopping_List_API
```

```bash
# Run locally
npm run dev
```
