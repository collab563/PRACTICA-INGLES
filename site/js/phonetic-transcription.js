function transcribeEnglishIPA(text) {
  const dictionary = globalThis.EnglishIPADictionary || {};
  const source = String(text || '').trim();
  if (!source) return { transcription: '', missing: [] };

  const normalizedPhrase = source.toLocaleUpperCase('en-GB').replace(/\s+/g, ' ');
  const wholePhrase = dictionary[normalizedPhrase];
  if (wholePhrase) return { transcription: formatIPA(wholePhrase), missing: [] };

  const missing = [];
  const transcription = source.replace(/[A-Za-z]+(?:['’][A-Za-z]+)*/g, word => {
    const key = word.replace(/’/g, "'").toLocaleUpperCase('en-GB');
    const pronunciation = dictionary[key];
    if (!pronunciation) {
      missing.push(word);
      return word;
    }
    return formatIPA(pronunciation);
  });
  return { transcription, missing: [...new Set(missing)] };
}

function formatIPA(pronunciation) {
  return pronunciation
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    // Match the traditional IPA symbols shown in the user's chart.
    .replace(/ɐ/g, 'ʌ')
    .replace(/ɹ/g, 'r')
    .replace(/ɛ/g, 'e')
    .trim();
}

function createPhoneticControl(getSource, { watchInput = null } = {}) {
  const control = document.createElement('div');
  control.className = 'phonetic-control';

  const button = document.createElement('button');
  button.className = 'btn btn-secondary';
  button.type = 'button';
  button.textContent = 'Show phonetic transcription';
  button.title = 'Show British English phonetic transcription';
  button.setAttribute('aria-expanded', 'false');

  const result = document.createElement('span');
  result.className = 'phonetic-result';
  result.hidden = true;
  result.setAttribute('aria-live', 'polite');

  button.addEventListener('click', () => {
    if (!result.hidden) {
      result.hidden = true;
      button.textContent = 'Show phonetic transcription';
      button.setAttribute('aria-expanded', 'false');
      return;
    }

    const source = String(getSource() || '').trim();
    if (!source) {
      showToast('Write an English word or sentence first.', 'error');
      return;
    }
    const { transcription, missing } = transcribeEnglishIPA(source);
    result.textContent = `UK IPA: /${transcription}/${missing.length ? ` · No dictionary entry for: ${missing.join(', ')}` : ''}`;
    result.hidden = false;
    button.textContent = 'Hide phonetic transcription';
    button.setAttribute('aria-expanded', 'true');
  });

  if (watchInput) watchInput.addEventListener('input', () => {
    result.hidden = true;
    button.textContent = 'Show phonetic transcription';
    button.setAttribute('aria-expanded', 'false');
  });
  control.append(button, result);
  return control;
}
