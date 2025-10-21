## How to Run the project Client and Server

### Prerequisites

- Node.js (v20 or above recommended)
- pnpm (recommended) or npm

---

## 1. Running the Client

### Steps:

1. Navigate to the `client` directory:
   ```sh
   cd client
   ```
2. Install dependencies:
   ```sh
   pnpm install
   ```
3. Create a `.env` file in the `client` directory. (You can use the `example.env` file as a template.)
4. Start the development server:

   ```sh
   pnpm dev
   ```

5. The client will be available at `http://localhost:5173` (default Vite port).

---

## 2. Running the Server

### Steps:

1. Navigate to the `server` directory:
   ```sh
   cd server
   ```
2. Install dependencies:
   ```sh
   pnpm install
   ```
3. Create a `.env` file in the `server` directory. (You can use the `example.env` file as a template.)

4. (Optional) Run Prisma migrations: (needed if you are using a local database to push the schema to the database)
   ```sh
   pnpm db:push
   # or
   npx prisma db push
   ```
5. Start the server:
   ```sh
   pnpm dev
   ```
6. The server will be available at `http://localhost:5000` (default port).

---

## Environment Variables

> **Note:**
>
> - Make sure to replace placeholder values with your actual credentials and URLs.
> - Both client and server must be running for the application to function correctly.
