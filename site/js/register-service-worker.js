if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(() => navigator.serviceWorker.ready)
      .then(() => console.info('English Practice is ready to use offline.'))
      .catch(error => console.error('Could not prepare offline mode.', error));
  });
}
