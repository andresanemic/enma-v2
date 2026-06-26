# Notas GEO/AEO — que las IA con búsqueda entiendan y citen a Enma

GEO (Generative Engine Optimization) / AEO (Answer Engine Optimization): optimizar
para que asistentes con búsqueda (ChatGPT, Perplexity, Gemini, etc.) comprendan,
resuman y citen el contenido de Enma.

## Qué implementó H7 y por qué ayuda
- **JSON-LD `Organization`** (nombre, rubro, fundadores, contacto, ubicación): define
  la entidad de marca de forma legible por máquinas → respuestas más precisas sobre
  "qué es Enma".
- **JSON-LD `Article`** en el blog (autor, fecha, sección, imagen): permite citar las
  columnas con atribución correcta.
- **JSON-LD `BreadcrumbList`**: comunica la estructura del sitio.
- **Descripciones meta autoexplicativas**: cada página responde qué/quién/dónde sin
  depender del contexto de navegación.
- **Datos de contacto consistentes (NAP)**: mismo nombre, teléfono y región en sitio
  y en JSON-LD → refuerza la entidad.
- **Idioma `es-CL`** declarado (`<html lang>`, `inLanguage`): contexto regional claro.
- **Sitemap + contenido factual**: facilita el descubrimiento y la extracción.

## Buenas prácticas a mantener al crear contenido nuevo
- Encabezados semánticos (`h1`/`h2`) que enuncien la idea en una frase.
- Responder la pregunta principal en el primer párrafo (estilo "respuesta directa").
- Datos concretos y verificables (de `docs/que-es-enma.txt`), sin inflar claims.
- Texto real en HTML (no encerrar información clave solo en imágenes).
- Mantener `Organization`/`Article` actualizados si cambian datos de marca.

## Pendiente / futuro (no en H7)
- Agregar `sameAs` cuando existan redes sociales.
- Considerar una página `/faq` con `FAQPage` JSON-LD si se quiere capturar respuestas.
