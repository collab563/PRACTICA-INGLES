# 📚 English Practice — Cuestionarios interactivos de inglés

Sitio web de práctica de inglés basado en el contenido de **English File Elementary 4th Edition**. Permite practicar con cuestionarios interactivos de opción múltiple, rellenar huecos, ordenar palabras, emparejar y verdadero/falso.

> ⚠️ **Aviso legal**: Este proyecto está inspirado en el contenido del libro *English File Elementary 4th Edition* (Christina Latham-Koenig, Clive Oxenden, Jerry Lambert, Paul Seligson) — publicado por Oxford University Press. **No se reproduce ningún material con derechos de autor**: ni imágenes, ni texto literal del libro, ni archivos de audio. Todas las preguntas han sido creadas de forma original siguiendo los temas gramaticales y de vocabulario del currículo público de A1/A2.

---

## ✨ Características

- **10 niveles (Files)** × **3 lecciones** = 30 lecciones
- **~460 preguntas** en 5 formatos diferentes:
  - 📝 Opción múltiple
  - ✍️ Rellenar huecos
  - 🔀 Ordenar palabras
  - 🔗 Emparejar elementos
  - ✓/✗ Verdadero / Falso
- **Progreso guardado** en el navegador (localStorage)
- **Racha de días** 🔥 y puntos ⭐
- **Sonido de acierto** generado localmente por el navegador; se puede activar o silenciar desde el botón 🔊
- **Repaso de errores** automático
- **Modo práctica libre** y **Modo examen** con temporizador en vivo, iniciado al pulsar «Iniciar examen»
- **Teoría de gramática** con 12 temas y 36 subtemas, explicaciones originales en español y ejemplos propios; cada tema se puede leer en una tarjeta desplazable o ampliar a pantalla completa desde la navegación principal
- **Traductores inglés ↔ español online y offline**: el panel flotante permite elegir entre el glosario local, que no envía texto a internet, o el servicio público de Apertium por HTTPS, que requiere conexión y recibe el texto para traducirlo. No envíes información confidencial; la disponibilidad y la calidad pueden variar. El traductor offline sigue disponible como alternativa. El glosario conserva palabras desconocidas y ofrece traducciones aproximadas, sin análisis gramatical completo.
- **Estadísticas detalladas** con gráficos
- **Modo oscuro** 🌙
- **Diseño responsive** (móvil, tablet, PC)
- **Uso sin conexión tras la primera visita online**: el navegador guarda los archivos de la aplicación mediante un service worker. Abre y deja cargar el sitio con internet una vez; luego podrá abrirse offline en ese mismo navegador. Las traducciones online siguen necesitando conexión.
- **Sin dependencias instalables**: HTML + CSS + JS puro; el modo online del traductor es opcional y requiere internet

---

## 🚀 Desplegar en GitHub Pages

### Opción 1: Subir directamente (la más fácil)

1. Crea un nuevo repositorio en GitHub (público).
2. Sube **todo el contenido de la carpeta `site/`** a la raíz del repositorio:
   ```
   tu-repo/
     index.html
     css/
     js/
     data/
   ```
3. Ve a **Settings → Pages**.
4. En **Source**, elige `main` branch y `/ (root)`.
5. Guarda. Tu sitio estará en `https://tu-usuario.github.io/tu-repo/` en unos minutos.

### Opción 2: Mantener la estructura de carpetas

Si prefieres mantener `site/` como carpeta:
1. Sube todo el proyecto (incluida la carpeta `site/`).
2. En GitHub Pages, configura la fuente en `main` branch / `site` folder.
3. Tu sitio estará en `https://tu-usuario.github.io/tu-repo/site/`.

> 💡 **Recomendación**: usa la Opción 1 (mover `site/*` a la raíz). Para GitHub Pages es más limpio y la URL queda más corta.

### Mover archivos a la raíz

Si subiste con la estructura `site/`, desde la terminal:

```bash
# Clona tu repo
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo

# Mueve el contenido de site/ a la raíz
mv site/* .
rmdir site
git add .
git commit -m "Move site contents to root"
git push
```

---

## 🛠️ Desarrollo local

### Requisitos

- Python 3.6+ (opcional, para `build.py`)
- Node.js 14+ (opcional, para validación con `validate.js`)

### Servir localmente

```bash
# Opción 1: con el script incluido
python3 build.py serve

# Opción 2: con Python directamente
cd site && python3 -m http.server 8000

# Opción 3: con Node
npx http-server site
```

Abre `http://localhost:8000` en tu navegador.

El modo offline funciona sin conexión una vez que los archivos del sitio están disponibles localmente. Su glosario está en `site/js/translator.js`; la calidad depende de las frases y palabras incluidas. El modo online usa la API pública de [Apertium](https://apertium.org/apy/), un proyecto de traducción automática de código abierto. La página envía el texto por HTTPS al servicio para traducirlo; no incluyas información confidencial. El endpoint público puede tener límites o interrupciones y la calidad varía según la traducción.

Al abrir el sitio publicado con conexión, un service worker guarda la aplicación en el navegador. Espera a que termine la carga antes de desconectarte; luego vuelve a abrir la misma dirección en el mismo navegador para usar ejercicios, teoría, progreso y traducción local sin conexión. El traductor online requiere internet. Los datos de progreso permanecen en el almacenamiento local del navegador.

### Validar contenido

```bash
python3 build.py validate    # valida estructura
python3 build.py stats       # muestra estadísticas
node site/validate.js        # validación detallada de cada pregunta
```

### Empaquetar para distribuir

```bash
python3 build.py package     # crea english-practice.zip
```

---

## ➕ Añadir más contenido

Para añadir un File nuevo (por ejemplo, File 11):

1. Abre `site/data/files.js`
2. Copia la plantilla:

```js
{
  id: '11',
  title: 'Mi nuevo nivel',
  description: 'Descripción del nivel',
  lessons: [
    {
      letter: 'A',
      title: 'Lección A',
      grammar_topic: 'Tema de gramática',
      vocab_topic: 'Tema de vocabulario',
      grammar: [
        { type: 'mc', prompt: 'Pregunta', options: ['A','B','C','D'], answer: 0, explanation: 'Por qué' },
        { type: 'fill', prompt: 'I ___ (be) happy.', answer: 'am' },
        { type: 'reorder', prompt: 'Ordena:', words: ['I','am','happy','.'] },
        { type: 'match', prompt: 'Empareja:', pairs: [['a','A'],['b','B']] },
        { type: 'tf', prompt: '"Frase" es correcta.', answer: true },
      ],
      vocabulary: [ /* mismo formato */ ],
      mixed: [ /* mismo formato */ ],
    },
    // Repite para B y C
  ],
},
```

O usa `python3 build.py add-file` para ver la plantilla.

3. Valida: `python3 build.py validate`

---

## 📂 Estructura del proyecto

```
.
├── build.py              ← Script Python: validar / servir / empaquetar
├── site/
│   ├── index.html        ← Página principal
│   ├── css/
│   │   └── styles.css    ← Estilos
│   ├── js/
│   │   ├── app.js        ← Lógica principal + vistas
│   │   ├── exercises.js  ← Renderizado y calificación de ejercicios
│   │   ├── router.js     ← Router hash-based
│   │   ├── storage.js    ← localStorage: progreso, racha, puntos
│   │   └── translator.js ← Glosario inglés-español sin conexión
│   ├── data/
│   │   ├── files.js      ← 459 preguntas en 30 lecciones
│   │   └── theory.js     ← 12 temas de teoría gramatical original
│   └── validate.js       ← Validador Node.js
├── english-practice.zip  ← Paquete listo para distribuir
└── README.md             ← Este archivo
```

---

## 🎓 Temas cubiertos

| File | Tema | Gramática principal |
|------|------|---------------------|
| 1 | Hello! | verb be, subject pronouns, days, numbers, countries |
| 2 | Daily life | present simple, word order in questions |
| 3 | What can you do? | can/can't, present continuous, weather |
| 4 | Things I like | object pronouns, like + verb-ing, the date |
| 5 | Where did you go? | past simple (was/were, regular, irregular) |
| 6 | Places and things | there is/are, there was/were, prepositions |
| 7 | Food and quantities | countable/uncountable, quantifiers, comparatives |
| 8 | Going places | superlatives, be going to (plans & predictions) |
| 9 | Modifiers and more | adverbs of manner, verb + to + infinitive, the article |
| 10 | Life experiences | present perfect, present perfect vs past simple |

---

## 📜 Licencia

El código de este proyecto es **MIT** — úsalo, modif́icalo, distribúyelo libremente.

El **contenido** (las preguntas) son obra original del autor de este repo, inspiradas en el currículo público de A1/A2, no en material con copyright del libro.

---

## 🙏 Créditos

- **Libro de referencia**: English File Elementary 4th Edition — Latham-Koenig, Oxenden, Lambert, Seligson (OUP). No se reproduce contenido con copyright.
- **Iconos**: Emoji unicode.
- **Inspirado en**: la necesidad de practicar sin gastar libros ni conexión.

---

¿Errores o sugerencias? Abre un issue o edita el código — es todo tuyo 💪
