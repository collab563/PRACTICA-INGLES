#!/usr/bin/env python3
"""
build.py — Validador y gestor del proyecto English Practice.

Uso:
  python3 build.py validate     # Valida la estructura de los datos
  python3 build.py stats        # Muestra estadísticas del contenido
  python3 build.py serve [port] # Sirve el sitio localmente para pruebas
  python3 build.py package      # Empaqueta el sitio en un .zip listo para GitHub Pages
  python3 build.py add-file     # Muestra una plantilla para añadir un File nuevo

Requisitos: solo Python 3.6+ (sin dependencias externas para validate/stats/package).
Para serve, no necesita nada. Para un servidor con auto-reload, considera `python3 -m http.server`.
"""

import os
import sys
import json
import re
import shutil
import zipfile
import http.server
import socketserver
from pathlib import Path

ROOT = Path(__file__).parent.resolve()
SITE = ROOT / 'site'

# ============================================================
# UTILIDADES
# ============================================================

def parse_files_js():
    """Extrae los datos del archivo site/data/files.js como JSON-like dict.

    Nota: este parser maneja un subset del formato que generamos.
    Para proyectos más complejos, considerar usar `node -e` y leer el JSON.
    """
    code = (SITE / 'data' / 'files.js').read_text(encoding='utf-8')
    # Reemplaza `const Files =` por `globalThis.Files =` para eval en Node.
    # Pero como estamos en Python, vamos a parsear con regex.
    # Para máxima fidelidad, recomendamos usar el validador en Node (validate.js).
    raise NotImplementedError("Usa `node validate.js` para validación exacta. Este script hace validación por regex para estadísticas.")

def parse_files_with_node():
    """Usa node para parsear el archivo JS y devolver estadísticas precisas."""
    import subprocess
    code = """
const code = require('fs').readFileSync('site/data/files.js', 'utf8');
global.Files = null;
eval(code.replace('const Files =', 'global.Files ='));
const stats = {
  files: global.Files.length,
  lessons: global.Files.reduce((s,f) => s + f.lessons.length, 0),
  questions: global.Files.reduce((s,f) => s + f.lessons.reduce((ss,l) => ss + l.grammar.length + l.vocabulary.length + l.mixed.length, 0), 0),
  byFile: global.Files.map(f => ({
    id: f.id,
    title: f.title,
    lessons: f.lessons.length,
    questions: f.lessons.reduce((ss,l) => ss + l.grammar.length + l.vocabulary.length + l.mixed.length, 0),
  })),
  byType: {}
};
global.Files.forEach(f => f.lessons.forEach(l => {
  ['grammar','vocabulary','mixed'].forEach(sec => {
    l[sec].forEach(q => {
      stats.byType[q.type] = (stats.byType[q.type] || 0) + 1;
    });
  });
}));
console.log(JSON.stringify(stats));
"""
    result = subprocess.run(
        ['node', '-e', code],
        cwd=ROOT,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        print('❌ Error ejecutando node:', result.stderr)
        sys.exit(1)
    return json.loads(result.stdout)

# ============================================================
# COMANDOS
# ============================================================

def cmd_validate():
    """Valida la estructura del proyecto."""
    print('🔍 Validando proyecto...\n')
    # 1. Archivos requeridos
    required = [
        SITE / 'index.html',
        SITE / 'css' / 'styles.css',
        SITE / 'js' / 'app.js',
        SITE / 'js' / 'exercises.js',
        SITE / 'js' / 'storage.js',
        SITE / 'js' / 'router.js',
        SITE / 'data' / 'files.js',
    ]
    missing = [p for p in required if not p.exists()]
    if missing:
        print('❌ Archivos faltantes:')
        for p in missing:
            print(f'   - {p.relative_to(ROOT)}')
        sys.exit(1)
    print('✅ Todos los archivos requeridos existen')

    # 2. Validar HTML básico
    html = (SITE / 'index.html').read_text(encoding='utf-8')
    required_tags = ['<title>', 'mainView', 'data/files.js', 'js/app.js']
    for tag in required_tags:
        if tag not in html:
            print(f'❌ index.html no contiene: {tag}')
            sys.exit(1)
    print('✅ index.html contiene los elementos clave')

    # 3. Validar sintaxis JS
    import subprocess
    for js_file in ['app.js', 'exercises.js', 'router.js', 'storage.js']:
        path = SITE / 'js' / js_file
        result = subprocess.run(['node', '-c', str(path)], capture_output=True, text=True)
        if result.returncode != 0:
            print(f'❌ Error de sintaxis en {js_file}:')
            print(result.stderr)
            sys.exit(1)
    print('✅ Todos los archivos JS tienen sintaxis válida')

    # 4. Validar data/files.js ejecutando validate.js
    if not (SITE / 'validate.js').exists():
        print('⚠️  validate.js no existe (opcional, pero recomendado)')
    else:
        result = subprocess.run(['node', 'validate.js'], cwd=SITE, capture_output=True, text=True)
        # Tomamos solo el resumen
        lines = result.stdout.strip().split('\n')
        summary = '\n'.join([l for l in lines if 'Total' in l or '✅' in l or 'Errors' in l or 'Warnings' in l])
        print(summary)

    print('\n🎉 Validación completa')


def cmd_stats():
    """Muestra estadísticas del contenido."""
    print('📊 Estadísticas del proyecto\n')
    try:
        stats = parse_files_with_node()
    except FileNotFoundError:
        print('❌ Node.js no encontrado. Instálalo desde https://nodejs.org/')
        sys.exit(1)

    print(f'   Files (niveles):  {stats["files"]}')
    print(f'   Lecciones:         {stats["lessons"]}')
    print(f'   Preguntas:         {stats["questions"]}')
    print(f'   Preguntas/File:    {stats["questions"] / stats["files"]:.1f} promedio')
    print(f'   Preguntas/Lección: {stats["questions"] / stats["lessons"]:.1f} promedio')
    print('\n📚 Por File:')
    for f in stats['byFile']:
        bar = '█' * (f['questions'] // 5)
        print(f"   File {f['id']:>2}  {f['title']:<20}  {f['questions']:>3} preguntas  {bar}")
    print('\n🎯 Por tipo de pregunta:')
    for t, n in sorted(stats['byType'].items(), key=lambda x: -x[1]):
        print(f'   {t:<10}  {n:>4}  {"█" * (n // 10)}')


def cmd_serve():
    """Sirve el sitio localmente."""
    port = int(sys.argv[2]) if len(sys.argv) > 2 else 8000
    os.chdir(SITE)
    handler = http.server.SimpleHTTPRequestHandler
    try:
        with socketserver.TCPServer(('', port), handler) as httpd:
            url = f'http://localhost:{port}/'
            print(f'🚀 Sirviendo en {url}')
            print(f'   Abre esa URL en tu navegador.')
            print(f'   Ctrl+C para detener.')
            httpd.serve_forever()
    except KeyboardInterrupt:
        print('\n👋 Servidor detenido')
    except OSError as e:
        if 'Address already in use' in str(e):
            print(f'❌ Puerto {port} ocupado. Prueba: python3 build.py serve {port + 1}')
        else:
            raise


def cmd_package():
    """Empaqueta el sitio en un .zip listo para GitHub Pages.

    Crea dos archivos:
    - english-practice-deploy.zip: con la estructura lista para subir a GitHub Pages
      (el contenido de site/ en la raíz). Solo necesitas descomprimir, hacer git init
      y push.
    - english-practice-source.zip: con la estructura completa del proyecto (build.py,
      site/, README.md). Para desarrollo.
    """
    deploy_zip = ROOT / 'english-practice-deploy.zip'
    source_zip = ROOT / 'english-practice-source.zip'

    # ZIP de despliegue: contenido de site/ en la raíz
    print(f'📦 Empaquetando {deploy_zip.name} (para GitHub Pages)...')
    with zipfile.ZipFile(deploy_zip, 'w', zipfile.ZIP_DEFLATED) as zf:
        for f in SITE.rglob('*'):
            if f.is_file():
                arcname = f.relative_to(SITE)
                zf.write(f, arcname)
        # Añadir .nojekyll para que GitHub Pages no intente usar Jekyll
        zf.writestr('.nojekyll', '')

    # ZIP fuente: proyecto completo (sin attachments, caches, ni zips previos)
    print(f'📦 Empaquetando {source_zip.name} (código fuente)...')
    EXCLUDE_DIRS = {'attachments', '.home', '.plugin-cache', 'node_modules', '__pycache__',
                    '.git', '.vscode', 'tmp'}
    EXCLUDE_FILES = {'english-practice-deploy.zip', 'english-practice-source.zip',
                     'english-practice.zip', 'test-browser.js', '.DS_Store'}
    EXCLUDE_EXT = {'.zip'}
    with zipfile.ZipFile(source_zip, 'w', zipfile.ZIP_DEFLATED) as zf:
        for f in sorted(ROOT.rglob('*')):
            if not f.is_file():
                continue
            rel = f.relative_to(ROOT)
            if any(p in EXCLUDE_DIRS for p in rel.parts):
                continue
            if f.name in EXCLUDE_FILES:
                continue
            if f.suffix in EXCLUDE_EXT:
                continue
            if f.name.startswith('.'):
                continue
            zf.write(f, rel)

    print(f'\n✅ {deploy_zip.name} creado ({deploy_zip.stat().st_size / 1024:.1f} KB)')
    print(f'   → Descomprime, git init, git add ., git commit, git push')
    print(f'   → Activa GitHub Pages en Settings → Pages')
    print(f'\n✅ {source_zip.name} creado ({source_zip.stat().st_size / 1024:.1f} KB)')
    print(f'   → Contiene build.py, site/, README.md (proyecto completo)')


def cmd_add_file():
    """Muestra una plantilla para añadir un File nuevo."""
    print('📝 Plantilla para añadir un File nuevo\n')
    print('Edita site/data/files.js y añade este objeto al array `Files`:\n')
    template = """  {
    id: '11',
    title: 'Tu título aquí',
    description: 'Descripción breve del nivel',
    lessons: [
      {
        letter: 'A',
        title: 'Nombre de la lección A',
        grammar_topic: 'Tema de gramática',
        vocab_topic: 'Tema de vocabulario',
        grammar: [
          { type: 'mc', prompt: 'Pregunta aquí', options: ['A','B','C','D'], answer: 0, explanation: 'Por qué' },
          { type: 'fill', prompt: 'Completa: I ___ (be) happy.', answer: 'am' },
          { type: 'reorder', prompt: 'Ordena:', words: ['I','am','happy','.'] },
          { type: 'match', prompt: 'Empareja:', pairs: [['a','A'],['b','B']] },
          { type: 'tf', prompt: '"A" es correcto.', answer: true },
        ],
        vocabulary: [ /* mismo formato */ ],
        mixed: [ /* mismo formato */ ],
      },
      // Repite para B y C
    ],
  },"""
    print(template)
    print('\nTipos de pregunta disponibles:')
    print('  • mc      → Multiple choice (4 opciones)')
    print('  • fill    → Rellenar hueco(s) con texto')
    print('  • reorder → Ordenar palabras para formar oración')
    print('  • match   → Emparejar elementos (mínimo 2 pares)')
    print('  • tf      → Verdadero / Falso')
    print('\nDespués de editar, ejecuta: python3 build.py validate')


# ============================================================
# MAIN
# ============================================================

def usage():
    print(__doc__)
    print('Comandos disponibles:')
    print('  validate   Valida estructura y sintaxis')
    print('  stats      Estadísticas del contenido')
    print('  serve      Servidor local (default: puerto 8000)')
    print('  package    Empaqueta el sitio en .zip')
    print('  add-file   Plantilla para añadir un File nuevo')

def main():
    if len(sys.argv) < 2:
        usage()
        sys.exit(0)
    cmd = sys.argv[1]
    if cmd == 'validate':
        cmd_validate()
    elif cmd == 'stats':
        cmd_stats()
    elif cmd == 'serve':
        cmd_serve()
    elif cmd == 'package':
        cmd_package()
    elif cmd == 'add-file':
        cmd_add_file()
    elif cmd in ('-h', '--help', 'help'):
        usage()
    else:
        print(f'❌ Comando desconocido: {cmd}\n')
        usage()
        sys.exit(1)

if __name__ == '__main__':
    main()
