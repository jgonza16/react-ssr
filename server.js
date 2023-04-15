import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { createServer as createViteServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 5175;

async function createServer() {
  const app = express();

  // Crea servidor Vite en modo middleware y configura el tipo de aplicación como
  // 'custom', deshabilitando la propia lógica de servicio HTML de Vite para que el servidor principal
  // puede tomar el control
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  // Usa la instancia de Connect de Vite como middleware. Si usas tu propio
  // router de Express (express.Router()), debes usar router.use
  app.use(vite.middlewares);

  app.use('*', async (req, res) => {
    const url = req.originalUrl;

    try {
      // 1. Lee index.html
      let template = fs.readFileSync(
        path.resolve(__dirname, 'index.html'),
        'utf-8'
      );

      // 2. Aplica transformaciones Vite HTML. Esto inyecta el cliente Vite HMR
      // y también aplica transformaciones HTML de los complementos de Vite, por ejemplo,
      // preámbulos globales de @vitejs/plugin-react
      template = await vite.transformIndexHtml(url, template);

      // 3. Carga la entrada del servidor. vite.ssrLoadModule se transforma automáticamente
      // ¡tu código fuente de ESM se puede usar en Node.js! No hay empaquetado
      // requerido, y proporciona una invalidación eficiente similar a HMR.
      const { render } = await vite.ssrLoadModule('/src/entry-server.jsx');

      // 4. renderiza el HTML de la aplicación. Esto asume que la función `render`
      // exportada desde entry-server.js llama a las API de SSR del marco apropiado,
      // por ejemplo, ReactDOMServer.renderToString()
      const appHtml = await render(url);

      // 5. Inyecta el HTML generado por la aplicación en la plantilla.
      const html = template.replace(`<!--ssr-outlet-->`, appHtml);

      // 6. Devuelve el HTML renderizado.
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      // Si se detecta un error, permite que Vite fije el trazado de pila
      // para que se asigne de nuevo a tu código fuente real.
      vite.ssrFixStacktrace(e);
      console.error(e);
      res.status(500).end(e.message);
    }
  });

  app.listen(PORT);
  console.log(`Server success in localhost:${PORT}`);
}

createServer();
