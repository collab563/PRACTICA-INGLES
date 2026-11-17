#!/usr/bin/env python3
"""
build.py — Validador y gestor del proyecto English Practice.

Uso:
  python3 build.py validate     # Valida la estructura del sitio
  python3 build.py serve [port] # Sirve el sitio localmente para pruebas
  python3 build.py package      # Empaqueta el sitio en un .zip listo para GitHub Pages

Requisitos: Python 3.6+ (sin dependencias externas).
Para serve, no necesita nada. Para un servidor con auto-reload, considera `python3 -m http.server`.
"""

import os
import sys
import zipfile
import http.server
import socketserver
from pathlib import Path

ROOT = Path(__file__).parent.resolve()
SITE = ROOT / 'site'

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
    required_tags = ['<title>', 'mainView', 'js/app.js']
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

    print('\n🎉 Validación completa')


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
            if f.name.startswith('.') and f.name != '.gitignore':
                continue
            zf.write(f, rel)

    print(f'\n✅ {deploy_zip.name} creado ({deploy_zip.stat().st_size / 1024:.1f} KB)')
    print(f'   → Descomprime, git init, git add ., git commit, git push')
    print(f'   → Activa GitHub Pages en Settings → Pages')
    print(f'\n✅ {source_zip.name} creado ({source_zip.stat().st_size / 1024:.1f} KB)')
    print(f'   → Contiene build.py, site/, README.md (proyecto completo)')


def usage():
    print(__doc__)
    print('Comandos disponibles:')
    print('  validate   Valida estructura y sintaxis')
    print('  serve      Servidor local (default: puerto 8000)')
    print('  package    Empaqueta el sitio en .zip')

def main():
    if len(sys.argv) < 2:
        usage()
        sys.exit(0)
    cmd = sys.argv[1]
    if cmd == 'validate':
        cmd_validate()
    elif cmd == 'serve':
        cmd_serve()
    elif cmd == 'package':
        cmd_package()
    elif cmd in ('-h', '--help', 'help'):
        usage()
    else:
        print(f'❌ Comando desconocido: {cmd}\n')
        usage()
        sys.exit(1)

if __name__ == '__main__':
    main()
