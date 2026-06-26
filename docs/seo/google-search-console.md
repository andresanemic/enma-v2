# Indexación rápida en Google Search Console (Fase I)

> Requisito: el sitio ya debe estar en producción en https://enmachile.com (H9).
> H7 ya dejó listos: sitemap.xml, robots.txt y el placeholder de meta tag.

## 1. Sitemap (✅ ya creado en H7)
- Disponible en https://enmachile.com/sitemap.xml (generado por `src/app/sitemap.ts`).
- robots.txt apunta a él: https://enmachile.com/robots.txt

## 2. Agregar la propiedad
- Entrar a https://search.google.com/search-console
- Agregar propiedad → tipo "Prefijo de URL" → https://enmachile.com

## 3. Verificar la propiedad — dos métodos (elegir uno)

### Método A — Meta tag (recomendado para este sitio)
1. Search Console entrega un código `google-site-verification`.
2. Reemplazar el placeholder en `src/app/layout.tsx`:
   `verification: { google: "<CÓDIGO>" }` (hoy dice `"REEMPLAZAR_EN_FASE_I"`).
3. Rebuild + redeploy (H8/H9). El meta tag queda en el `<head>` de todas las páginas.
4. Pulsar "Verificar".

### Método B — Archivo HTML (alternativa Namecheap)
1. Descargar `googleXXXX.html` desde Search Console.
2. Subirlo a `public_html/` en el hosting Namecheap (cPanel File Manager o FTP).
   - En este proyecto equivale a poner el archivo en `public/` antes del build,
     o subirlo directo a `public_html` junto al sitio ya exportado.
3. Pulsar "Verificar".

## 4. Enviar el sitemap
- En Search Console → Sitemaps → añadir `sitemap.xml` → Enviar.

## 5. Inspección de URL ("Fetch as Google")
- Search Console → Inspección de URLs → pegar URL clave (home, /proyectos, /blog) →
  "Solicitar indexación". Repetir para las páginas más importantes.

## Checklist de cierre Fase I
- [ ] Propiedad verificada
- [ ] Sitemap enviado y "Correcto"
- [ ] Home + páginas clave solicitadas para indexación
- [ ] (Opcional) Bing Webmaster Tools con el mismo sitemap
