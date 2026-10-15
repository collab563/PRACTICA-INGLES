# 📚 English Practice — Cuestionarios interactivos de inglés

Sitio web independiente para practicar inglés de nivel A1/A2. Incluye ejercicios interactivos, práctica de lectura y escritura, vocabulario y traducción.

> **Fuentes y contenido**: *English File Elementary 4th Edition* se utiliza como referencia de nivel y temas. Los conceptos gramaticales, los temas generales y el vocabulario común no implican por sí solos que se haya copiado una obra. No se ha hecho una comparación exhaustiva de los textos concretos del proyecto con sus fuentes; si se identifica una reproducción o adaptación cercana de ejercicios, lecturas o explicaciones, verifica los permisos antes de redistribuirla. Este proyecto no está afiliado, patrocinado ni aprobado por Oxford University Press.

---

## ✨ Características

- **10 niveles (Files)** × **3 lecciones** = 30 lecciones
- **~460 preguntas en los 10 Files** en 5 formatos básicos; Grammar Practice también incluye ejercicios de conversación y comparativos:
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
- **Teoría de gramática** con 12 temas y 36 subtemas; cada tema se puede leer en una tarjeta desplazable o ampliar a pantalla completa desde la navegación principal
- **Traductores inglés ↔ español online y offline**: el panel flotante permite elegir entre el glosario local, que no envía texto a internet, o el servicio público de Apertium por HTTPS, que requiere conexión y recibe el texto para traducirlo. No envíes información confidencial; la disponibilidad y la calidad pueden variar. El traductor offline sigue disponible como alternativa. El glosario conserva palabras desconocidas y ofrece traducciones aproximadas, sin análisis gramatical completo.
- **Práctica de lectura**: 10 lecturas en cada uno de tres niveles, con preguntas de comprensión y actividades de emparejar.
- **Práctica de escritura**: tres niveles con 10 oraciones cada uno para traducir del español al inglés.
- **Evaluador de escritura con IA**: ofrece comentarios sobre gramática, ortografía, redundancia y orden de palabras mediante Google Gemini. También permite usar Gemini para traducir desde el traductor.
- **Vocabulario de comida y números**, con pronunciación mediante las voces disponibles en el navegador.
- **Créditos de imágenes**: las fotos locales y sus fuentes/licencias verificables están documentadas en [`site/IMAGE-CREDITS.md`](site/IMAGE-CREDITS.md); la aplicación muestra los créditos junto a cada foto.
- **Estadísticas detalladas** con gráficos
- **Modo oscuro** 🌙
- **Diseño responsive** (móvil, tablet, PC)
- **Uso sin conexión tras la primera visita online**: el navegador guarda los archivos de la aplicación mediante un service worker. Abre y deja cargar el sitio con internet una vez; luego podrá abrirse offline en ese mismo navegador. Las traducciones online siguen necesitando conexión.
- **Sin dependencias instalables para el sitio**: HTML + CSS + JavaScript. Los servicios online son opcionales y requieren conexión.

### Privacidad y uso de servicios externos

- El progreso de ejercicios se guarda en el almacenamiento local del navegador (`localStorage`); no hace falta crear una cuenta para usar el sitio.
- El traductor offline procesa el texto en el navegador. Si eliges Apertium, el texto se envía por HTTPS a ese servicio para traducirlo.
- El evaluador de escritura y la traducción con Gemini envían el texto que escribas a Google Gemini. Para usarlos, debes proporcionar tu propia clave de API. La clave se mantiene en memoria durante la sesión de la página y la aplicación no la guarda en `localStorage`; las estadísticas de uso de tokens se guardan en `sessionStorage`.
- La aplicación no guarda automáticamente el texto enviado ni las respuestas de IA en el almacenamiento del navegador. El tratamiento que hagan Google o Apertium está sujeto a sus propias condiciones y políticas.
- No introduzcas información personal, confidencial ni claves de API en textos que envíes a servicios online. No publiques tu clave en el repositorio, capturas de pantalla o enlaces.

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

- Python 3.6+ para los comandos de `build.py`
- Node.js 14+ para validar y obtener estadísticas (`build.py validate`, `build.py stats` y `site/validate.js`)
- No se requieren dependencias de npm para ejecutar el sitio

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

El modo offline funciona sin conexión una vez que los archivos del sitio están disponibles localmente. Su glosario está en `site/js/translator.js`; la calidad depende de las frases y palabras incluidas. El modo online de Apertium envía el texto por HTTPS al servicio; no incluyas información confidencial. El endpoint público puede tener límites o interrupciones y la calidad varía según la traducción.

El evaluador de escritura y el traductor con Gemini usan una clave de API que proporciona cada usuario. La clave solo se mantiene en memoria durante la sesión de la página; no se incluye en el código ni se persiste en el almacenamiento local. El texto enviado se transmite a Google Gemini. Revisa las condiciones y políticas del proveedor antes de usarlo y no envíes información personal o confidencial.

Al abrir el sitio publicado con conexión, un service worker guarda la aplicación en el navegador. Espera a que termine la carga antes de desconectarte; luego vuelve a abrir la misma dirección en el mismo navegador para usar ejercicios, teoría, progreso y traducción local sin conexión. El traductor online requiere internet. Los datos de progreso permanecen en el almacenamiento local del navegador.

### Validar contenido

```bash
python3 build.py validate    # valida estructura
python3 build.py stats       # muestra estadísticas
node site/validate.js        # validación detallada de cada pregunta
```

### Empaquetar para distribuir

```bash
python3 build.py package     # crea english-practice-deploy.zip y english-practice-source.zip
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
│   ├── IMAGE-CREDITS.md  ← Fuentes y licencias de las imágenes
│   ├── css/
│   │   ├── styles.css    ← Estilos principales
│   │   └── writing-evaluator.css
│   ├── js/
│   │   ├── app.js        ← Lógica principal + vistas
│   │   ├── exercises.js  ← Renderizado y calificación de ejercicios
│   │   ├── router.js     ← Router hash-based
│   │   ├── storage.js    ← localStorage: progreso, racha, puntos
│   │   ├── translator.js ← Glosario offline y servicios de traducción
│   │   ├── reading-practice.js
│   │   ├── writing-practice.js
│   │   ├── writing-evaluator.js ← Evaluación y traducción con Gemini
│   │   └── register-service-worker.js
│   ├── data/
│   │   ├── files.js      ← Preguntas de 10 niveles y 30 lecciones
│   │   ├── theory.js     ← 12 temas de teoría gramatical
│   │   ├── reading.js    ← Lecturas y preguntas de comprensión
│   │   ├── reading-extensions.js
│   │   └── writing.js    ← Oraciones para practicar traducción
│   └── validate.js       ← Validador Node.js
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

Este repositorio no incluye actualmente un archivo `LICENSE`. Por tanto, no se debe asumir que el código está publicado bajo MIT ni que se concede permiso para reutilizarlo; añade una licencia explícita si quieres autorizar su uso, modificación o distribución.

El contenido está organizado para practicar temas de nivel A1/A2 y no es material oficial del libro citado. Su originalidad y su posible similitud con materiales de terceros no se han verificado de forma independiente; comprueba las fuentes y los permisos antes de redistribuirlo.

---

## 🙏 Créditos

- **Referencia curricular**: *English File Elementary 4th Edition*, de Oxford University Press.
- **Iconos**: Emoji unicode.
- Proyecto educativo independiente; no está afiliado ni aprobado por Oxford University Press.

---

¿Errores o sugerencias? Abre un issue o contribuye con una propuesta. La ausencia de una licencia significa que no se concede permiso general para reutilizar el código.
