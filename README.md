# react-ssr
Example app SSR with react.

## Stack
 - React
 - Vite
 - Express

## Add entries
- index.html
- server.js # main application server
- src/
  - main.js          # exports env-agnostic (universal) app code
  - entry-client.jsx  # mounts the app to a DOM element
  - entry-server.jsx  # renders the app using the framework's SSR API
  
## LINKS

vide-docs(https://es.vitejs.dev/guide/ssr.html)
react-docs(https://react.dev/)
