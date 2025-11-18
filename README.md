ISJPS Frontend (ready)

How to run locally:
1. Unzip this package into your `frontend` folder.
2. `cd frontend`
3. Run `npm install`
4. Run `npm run dev`
5. Open http://localhost:3000

Notes:
- Backend URL is configured in .env.local (NEXT_PUBLIC_BACKEND_URL).
- Ensure your backend (uvicorn main:app --reload) is running at that address.
- This scaffold uses Firebase v9 (modular). Ensure your Firebase project and users exist.
