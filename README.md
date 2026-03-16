# critiq ✍️

**Crítica literaria por IA para relato breve.**

Sube tu relato (PDF, DOCX, DOC o TXT, máximo 100 páginas) y recibe en segundos:

- 📊 **Nota sobre 10** calculada con una rúbrica literaria profesional de 10 categorías ponderadas.
- 💬 **Hasta 10 bullet points de feedback** accionable, justificado con evidencia textual y basado en principios de escritura creativa.
- 📝 **Síntesis** con las fortalezas principales y el camino de mejora más importante.

---

## Rúbrica de evaluación

| Categoría | Peso |
|-----------|------|
| Estructura narrativa | 12% |
| Voz narrativa y punto de vista | 12% |
| Personajes | 12% |
| Conflicto y tensión | 12% |
| Estilo y lenguaje | 12% |
| Escena y descripción | 10% |
| Tema e intención | 10% |
| Diálogo | 8% |
| Economía narrativa | 7% |
| Originalidad y riesgo | 5% |

---

## Instalación y uso

### Requisitos

- Node.js 18+
- Una API key de OpenAI con acceso a GPT-4o

### Pasos

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar la API key
cp .env.local.example .env.local
# Editar .env.local y añadir tu OPENAI_API_KEY

# 3. Iniciar en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Producción

```bash
npm run build
npm start
```

---

## Base de conocimiento

La carpeta `knowledge-base/` está reservada para los PDFs con teoría de escritura creativa y relato breve. Cuando estén disponibles, el sistema los integrará en el prompt de evaluación para proporcionar feedback más fundamentado en las lecciones teóricas.

---

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `OPENAI_API_KEY` | API key de OpenAI (obligatoria) |

---

## Formatos admitidos

| Formato | Extensión |
|---------|-----------|
| PDF | `.pdf` |
| Word (moderno) | `.docx` |
| Word (antiguo) | `.doc` |
| Texto plano | `.txt` |

Tamaño máximo: **50 MB** · Longitud máxima: **100 páginas** (~180.000 caracteres)
