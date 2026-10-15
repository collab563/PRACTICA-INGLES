// ============== MAIN APP ==============
// Wires up routing, state, and views

let STATE = Storage.load();
let EXAM = null;
const ONLINE_TRANSLATOR_API = 'https://apertium.org/apy/translate';
let feedbackAudioContext = null;

const FILE_10_VOCABULARY = {
  food: [
    { word: 'apples', aliases: ['apple'], translation: 'manzanas', image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=900&q=80', alt: 'Apples' },
    { word: 'bread', translation: 'pan', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80', alt: 'Bread' },
    { word: 'butter', translation: 'mantequilla', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=900&q=80', alt: 'Butter' },
    { word: 'cereal', translation: 'cereal', image: 'images/vocabulary/cereal.jpg', alt: 'Bowl of corn flakes with milk', imageCredit: { label: 'Photo by Calum Lewis · Unsplash', url: 'https://unsplash.com/photos/ceramic-bowl-filled-with-cereals-and-spoon-KMx5YilipX0', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' } },
    { word: 'cheese', translation: 'queso', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=900&q=80', alt: 'Cheese' },
    { word: 'coffee', translation: 'café', image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=900&q=80', alt: 'Coffee' },
    { word: 'eggs', aliases: ['egg'], translation: 'huevos', image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=900&q=80', alt: 'Eggs' },
    { word: 'jam', translation: 'mermelada', image: 'https://images.unsplash.com/photo-1707092009843-2b5a919d17b0?auto=format&fit=crop&w=900&q=80', alt: 'Jam served on toast' },
    { word: 'orange juice', translation: 'jugo de naranja', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=900&q=80', alt: 'Orange juice' },
    { word: 'sugar', translation: 'azúcar', image: 'https://images.unsplash.com/photo-1709651808265-977ed7ef78c6?auto=format&fit=crop&w=900&q=80', alt: 'Sugar cubes' },
    { word: 'tea', translation: 'té', image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=900&q=80', alt: 'Tea' },
    { word: 'toast', translation: 'tostada', image: 'images/vocabulary/toast.jpg', alt: 'Slices of toasted bread on a plate', imageCredit: { label: 'Photo by Yukiko Kanada · Unsplash', url: 'https://unsplash.com/photos/toasted-bread-on-black-round-plate-5C2JmojQ6hQ', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' } },
    { word: 'fish', translation: 'pescado', image: 'https://images.unsplash.com/photo-1611214774777-3d997a9d0e35?auto=format&fit=crop&w=900&q=80', alt: 'Fresh fish on ice' },
    { word: 'herbs', aliases: ['herb'], translation: 'hierbas', image: 'https://images.unsplash.com/photo-1784802905060-427471c824d0?auto=format&fit=crop&w=900&q=80', alt: 'Fresh basil leaves' },
    { word: 'meat', translation: 'carne', image: 'https://images.unsplash.com/photo-1783632666729-fbfb2ed5516a?auto=format&fit=crop&w=900&q=80', alt: 'Raw meat' },
    { word: 'chicken', translation: 'pollo', image: 'images/vocabulary/chicken.jpg', alt: 'Raw chickens on a plate with lettuce and pepper', imageCredit: { label: 'Photo by Rimsha Noor · Unsplash', url: 'https://unsplash.com/photos/two-raw-chickens-on-a-plate-with-lettuce-and-pepper-_VhofEs6mmM', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' } },
    { word: 'sausages', aliases: ['sausage'], translation: 'salchichas', image: 'https://images.unsplash.com/photo-1766589152317-2bafe6f2923c?auto=format&fit=crop&w=900&q=80', alt: 'Grilled sausages' },
    { word: 'steak', translation: 'bistec', image: 'images/vocabulary/steak.jpg', alt: 'Grilled steak on a plate', imageCredit: { label: 'Photo by Marcelo de la Torre · Unsplash', url: 'https://unsplash.com/photos/a-steak-on-a-plate-with-a-fork-and-knife-BuWKiCGY33w', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' } },
    { word: 'ham', translation: 'jamón', image: 'images/vocabulary/ham.jpg', alt: 'Sliced ham', imageCredit: { label: 'Photo by Сергей Орловский · Unsplash', url: 'https://unsplash.com/photos/sliced-ham-1OfPse1qVLM', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' } },
    { word: 'oil', translation: 'aceite', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=900&q=80', alt: 'Oil' },
    { word: 'pasta', translation: 'pasta', image: 'images/vocabulary/pasta.jpg', alt: 'Fusilli pasta with vegetables and curry leaves', imageCredit: { label: 'Photo by Monish Badda · Unsplash', url: 'https://unsplash.com/photos/fusilli-pasta-with-vegetables-and-curry-leaves-dHliA6BwH5g', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' } },
    { word: 'milk', translation: 'leche', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80', alt: 'Milk' },
    { word: 'rice', translation: 'arroz', image: 'images/vocabulary/rice.jpg', alt: 'Uncooked white rice grains', imageCredit: { label: 'Photo by Pierre Bamin · Unsplash', url: 'https://unsplash.com/photos/raw-white-rice-grains-background--LdilhDx3sk', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' } },
    { word: 'salad', translation: 'ensalada', image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=900&q=80', alt: 'Salad' },
    { word: 'seafood', translation: 'mariscos', image: 'https://images.unsplash.com/photo-1765100479761-2359e22fbe16?auto=format&fit=crop&w=900&q=80', alt: 'Assorted seafood platter' },
    { word: 'spices', translation: 'especias', image: 'images/vocabulary/spices.jpg', alt: 'Different types of spices on a table', imageCredit: { label: 'Photo by Anju Ravindranath · Unsplash', url: 'https://unsplash.com/photos/a-table-topped-with-different-types-of-spices-Nihdo084Yos', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' } },
    { word: 'carrots', aliases: ['carrot'], translation: 'zanahorias', image: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=900&q=80', alt: 'Carrots' },
    { word: 'chips', aliases: ['french fries'], translation: 'papas fritas', image: 'images/vocabulary/chips.jpg', alt: 'A basket of French fries on a wooden table', imageCredit: { label: 'Photo by Mitchell Luo · Unsplash', url: 'https://unsplash.com/photos/a-basket-of-french-fries-sitting-on-top-of-a-wooden-table-ChXHveqrb28', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' } },
    { word: 'lettuce', translation: 'lechuga', image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=900&q=80', alt: 'Lettuce' },
    { word: 'mushrooms', aliases: ['mushroom'], translation: 'champiñones', image: 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?auto=format&fit=crop&w=900&q=80', alt: 'Mushrooms' },
    { word: 'onions', aliases: ['onion'], translation: 'cebollas', image: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=900&q=80', alt: 'Onions' },
    { word: 'peas', aliases: ['pea'], translation: 'guisantes', image: 'https://images.unsplash.com/photo-1632640107771-80c37386cfcd?auto=format&fit=crop&w=900&q=80', alt: 'Green peas in a bowl' },
    { word: 'peppers', aliases: ['pepper'], translation: 'pimientos', image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=900&q=80', alt: 'Peppers' },
    { word: 'potatoes', aliases: ['potato'], translation: 'patatas', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=80', alt: 'Potatoes' },
    { word: 'tomatoes', aliases: ['tomato'], translation: 'tomates', image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=80', alt: 'Tomatoes' },
    { word: 'bananas', aliases: ['banana'], translation: 'plátanos', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=900&q=80', alt: 'Bananas' },
    { word: 'oranges', aliases: ['orange'], translation: 'naranjas', image: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=900&q=80', alt: 'Oranges' },
    { word: 'pineapple', aliases: ['a pineapple'], translation: 'piña', image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=900&q=80', alt: 'Pineapple' },
    { word: 'strawberries', aliases: ['strawberry'], translation: 'fresas', image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=900&q=80', alt: 'Strawberries' },
    { word: 'cake', translation: 'pastel', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80', alt: 'Cake' },
    { word: 'fruit salad', translation: 'ensalada de frutas', image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=900&q=80', alt: 'Fruit salad' },
    { word: 'ice cream', translation: 'helado', image: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&w=900&q=80', alt: 'Ice cream' },
    { word: 'cookie', aliases: ['biscuit', 'biscuits'], translation: 'galleta', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=900&q=80', alt: 'Cookie' },
    { word: 'chocolate', translation: 'chocolate', image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=900&q=80', alt: 'Chocolate' },
    { word: 'crisps', aliases: ['crisp'], translation: 'papas fritas de bolsa', image: 'images/vocabulary/crisps.jpg', alt: 'Crispy potato chips piled on checkered paper', imageCredit: { label: 'Photo by Ryan Waldman · Unsplash', url: 'https://unsplash.com/photos/crispy-potato-chips-piled-on-checkered-paper-CoiePy_UbjY', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' } },
    { word: 'nuts', aliases: ['nut'], translation: 'nueces', image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=900&q=80', alt: 'Nuts' },
    { word: 'sandwich', aliases: ['a sandwich'], translation: 'sándwich', image: 'images/vocabulary/sandwich.jpg', alt: 'Sandwich on a white surface', imageCredit: { label: 'Photo by Mae Mu · Unsplash', url: 'https://unsplash.com/photos/sandwich-on-white-surface-IZ0LRt1khgM', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' } },
    { word: 'broccoli', translation: 'brócoli', image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=900&q=80', alt: 'Fresh broccoli' },
    { word: 'papaya', translation: 'papaya', image: 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&w=900&q=80', alt: 'Ripe papaya' },
    { word: 'avocado', aliases: ['avocados'], translation: 'palta, aguacate', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=900&q=80', alt: 'Avocado halves' },
    { word: 'lemon', aliases: ['lemons'], translation: 'limón', image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=900&q=80', alt: 'Fresh lemons' },
    { word: 'salt', translation: 'sal', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/Salt_shaker_on_white_background.jpg/960px-Salt_shaker_on_white_background.jpg', alt: 'Glass salt shaker', imageCredit: { label: 'SoraZG · Salt shaker on white background · Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Salt_shaker_on_white_background.jpg', licenseLabel: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/' } },
    { word: 'flour', translation: 'harina', image: 'https://images.unsplash.com/photo-1627485937980-221c88ac04f9?auto=format&fit=crop&w=900&q=80', alt: 'Flour for baking' },
    { word: 'pickle', aliases: ['pickles', 'gherkin', 'gherkins'], translation: 'pepinillo', image: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=900&q=80', alt: 'Fresh whole cucumbers' },
    { word: 'chilli pepper', aliases: ['chili pepper', 'chilli', 'chili'], translation: 'ají, chile', image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=900&q=80', alt: 'Fresh chilli peppers' },
    { word: 'grapes', aliases: ['grape'], translation: 'uvas', image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=900&q=80', alt: 'A bunch of grapes' },
    { word: 'watermelon', aliases: ['watermelons'], translation: 'sandía', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=900&q=80', alt: 'Watermelon slices' },
    { word: 'pear', aliases: ['pears'], translation: 'pera', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0b/D%27anjou_pear.jpg/960px-D%27anjou_pear.jpg', alt: 'D’Anjou pear', imageCredit: { label: 'Rhododendrites · D’Anjou pear · Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:D%27anjou_pear.jpg', licenseLabel: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/' } },
    { word: 'coconut', aliases: ['coconuts'], translation: 'coco', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/A_coconut%2C_broken_in_half.jpg/960px-A_coconut%2C_broken_in_half.jpg', alt: 'A coconut broken in half', imageCredit: { label: 'Slyronit · A coconut, broken in half · Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:A_coconut,_broken_in_half.jpg', licenseLabel: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/' } },
    { word: 'sweets', aliases: ['sweet'], translation: 'dulces', image: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&w=900&q=80', alt: 'Sweets' },
  ],
};

function numberBelowOneThousandToEnglish(number) {
  const units = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const parts = [];

  if (number >= 100) {
    parts.push(`${units[Math.floor(number / 100)]} hundred`);
    number %= 100;
    if (number > 0) parts.push('and');
  }
  if (number >= 20) {
    const tensWord = tens[Math.floor(number / 10)];
    number %= 10;
    parts.push(number > 0 ? `${tensWord}-${units[number]}` : tensWord);
    number = 0;
  } else if (number >= 10) {
    parts.push(teens[number - 10]);
    number = 0;
  }
  if (number > 0) parts.push(units[number]);

  return parts.join(' ');
}

function numberToEnglish(number) {
  const scales = [[1000000, 'million'], [1000, 'thousand']];
  const parts = [];
  let remainder = number;

  scales.forEach(([scale, label]) => {
    const group = Math.floor(remainder / scale);
    if (group > 0) {
      parts.push(`${numberBelowOneThousandToEnglish(group)} ${label}`);
      remainder %= scale;
    }
  });
  if (remainder > 0) {
    if (parts.length && remainder < 100) parts.push('and');
    parts.push(numberBelowOneThousandToEnglish(remainder));
  }
  return parts.join(' ');
}

function createNumberVocabulary() {
  const numbers = Array.from({ length: 10 }, (_, index) => index + 1);
  for (let digits = 2; digits <= 9; digits += 1) {
    const count = digits <= 3 ? 12 : 11;
    const minimum = 10 ** (digits - 1);
    const maximum = 10 ** digits - 1;
    const selected = new Set();
    while (selected.size < count) {
      const number = minimum + Math.floor(Math.random() * (maximum - minimum + 1));
      const trailingRepeatedDigits = String(number).match(/(.)\1*$/)?.[0].length || 0;
      if (number <= 10 || trailingRepeatedDigits >= 3) continue;
      selected.add(number);
    }
    numbers.push(...selected);
  }
  for (let index = numbers.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [numbers[index], numbers[swapIndex]] = [numbers[swapIndex], numbers[index]];
  }
  const numberToWords = numbers.map(number => ({
    number,
    word: numberToEnglish(number),
    direction: 'number-to-words',
    accepted: [numberToEnglish(number)],
  }));
  const wordsToNumber = numberToWords.map(item => ({
    ...item,
    direction: 'words-to-number',
    accepted: [String(item.number)],
  }));

  return [...numberToWords, ...wordsToNumber];
}

const GRAMMAR_PRACTICE_SOURCES = [
  [['1', 'A'], ['1', 'B'], ['1', 'C']],
  [null, null, null],
  [['2', 'A'], ['2', 'B'], ['2', 'C']],
  [null, null, null],
  [['3', 'A'], ['3', 'B'], ['3', 'C']],
  [['4', 'A'], ['4', 'B'], ['4', 'C']],
  [['5', 'A'], ['5', 'B'], ['5', 'C']],
  [['5', 'C'], ['6', 'B'], ['6', 'C']],
  [['7', 'A'], ['7', 'B'], ['7', 'C']],
  [['8', 'A'], ['8', 'B'], ['8', 'C']],
  [['9', 'A'], ['9', 'B'], ['9', 'C']],
  [['10', 'A'], ['10', 'B'], ['10', 'C']],
];

const GRAMMAR_PRACTICE_QUESTIONS = {
  '1-0': [
    { type: 'mc', prompt: 'Choose the correct plural of <em>address</em>.', options: ['address', 'addressies', 'addresses', 'addresss'], answer: 2 },
    { type: 'fill', prompt: 'There are three ___ (city) near the coast.', answer: 'cities' },
    { type: 'mc', prompt: 'Choose the correct article: ___ orange.', options: ['a', 'an', 'the a', 'no article'], answer: 1 },
    { type: 'mc', prompt: 'What is the plural of <em>child</em>?', options: ['childs', 'childes', 'children', 'childrens'], answer: 2 },
  ],
  '1-1': [
    { type: 'mc', prompt: 'Choose the correct phrase.', options: ['a comfortable chair', 'a chair comfortable', 'comfortable a chair', 'a comfortably chair'], answer: 0 },
    { type: 'fill', prompt: 'The bags are ___ (heavy).', answer: 'heavy' },
    { type: 'mc', prompt: 'Choose the correct sentence.', options: ['The house is old.', 'The house is olds.', 'The old is house.', 'The house old is.'], answer: 0 },
    { type: 'fill', prompt: 'It is ___ interesting book.', answer: 'an' },
  ],
  '1-2': [
    { type: 'mc', prompt: '___ your name here, please.', options: ['Writes', 'Write', 'Writing', 'To write'], answer: 1 },
    { type: 'fill', prompt: '___ (not / touch) the hot pan!', answer: "Don't touch" },
    { type: 'mc', prompt: 'Complete the suggestion: Let’s ___ home.', options: ['go', 'goes', 'going', 'to go'], answer: 0 },
    { type: 'fill', prompt: '___ careful when you cross the road.', answer: 'Be' },
  ],
  '3-0': [
    { type: 'mc', prompt: 'This is ___ (Marta) umbrella.', options: ['Martas', 'Marta', 'Marta’s', 'Martas’'], answer: 2 },
    { type: 'fill', prompt: '___ jacket is this? (ask about the owner)', answer: 'Whose' },
    { type: 'mc', prompt: 'Choose the correct plural possessive.', options: ['my friends house', 'my friend’s house', 'my friends’ house', 'my friends’s house'], answer: 2 },
    { type: 'tf', prompt: '<em>Who’s</em> means “who is”, while <em>whose</em> asks about possession.', answer: true },
  ],
  '3-1': [
    { type: 'fill', prompt: 'The meeting starts ___ 9:30.', answer: 'at' },
    { type: 'mc', prompt: 'We usually travel ___ July.', options: ['at', 'on', 'in', 'to'], answer: 2 },
    { type: 'fill', prompt: 'Her birthday is ___ Monday.', answer: 'on' },
    { type: 'mc', prompt: 'The café is ___ the bank and the library.', options: ['between', 'during', 'at', 'to'], answer: 0 },
  ],
  '3-2': [
    { type: 'mc', prompt: 'I ___ drink tea in the morning.', options: ['usually', 'am usually', 'usual', 'once'], answer: 0 },
    { type: 'fill', prompt: 'She is ___ late for class. (0% of the time)', answer: 'never' },
    { type: 'mc', prompt: 'Which phrase normally goes at the end?', options: ['often', 'usually', 'twice a week', 'never'], answer: 2 },
    { type: 'fill', prompt: '___ often do you exercise?', answer: 'How' },
  ],
};

const COMPARATIVE_SENTENCE_QUESTIONS = [
  { type: 'comparative-sentence', prompt: 'Complete with a comparative adjective: The greenhouse is ___ than the garden shed. (warm)', answer: 'warmer' },
  { type: 'comparative-sentence', prompt: 'Complete with a comparative adjective: Walking to work is ___ than driving in traffic. (healthy)', answer: 'healthier' },
  { type: 'comparative-sentence', prompt: 'Complete with a comparative adjective: The blue suitcase feels ___ than the grey one. (light)', answer: 'lighter' },
  { type: 'comparative-sentence', prompt: 'Complete with a comparative adjective: The market is ___ in the morning than in the afternoon. (busy)', answer: 'busier' },
  { type: 'comparative-sentence', prompt: 'Complete with a comparative adjective: This forest path is ___ than the road beside it. (dangerous)', answer: 'more dangerous' },
  { type: 'comparative-sentence', prompt: 'Complete with a comparative adjective: My new desk is ___ than the old table. (wide)', answer: 'wider' },
  { type: 'comparative-sentence', prompt: 'Complete with a comparative adjective: Taking the ferry is ___ than driving around the bay. (convenient)', answer: 'more convenient' },
  { type: 'comparative-sentence', prompt: 'Complete with a comparative adjective: The community centre is ___ than the old hall. (modern)', answer: 'more modern' },
  { type: 'comparative-sentence', prompt: 'Complete with a comparative adjective: The island is ___ in spring than in summer. (peaceful)', answer: 'more peaceful' },
  { type: 'comparative-sentence', prompt: 'Complete with a comparative adjective: This week’s assignment is ___ than last week’s. (difficult)', answer: 'more difficult' },
];

const COMPARATIVE_ADJECTIVE_QUESTIONS = [
  ['high', 'higher'],
  ['dirty', 'dirtier'],
  ['important', 'more important'],
  ['late', 'later'],
  ['low', 'lower'],
  ['bored', 'more bored'],
  ['wet', 'wetter'],
  ['modern', 'more modern'],
  ['comfortable', 'more comfortable'],
  ['happy', 'happier'],
  ['small', 'smaller'],
  ['large', 'larger'],
  ['nice', 'nicer'],
  ['safe', 'safer'],
  ['wide', 'wider'],
  ['close', 'closer'],
  ['hot', 'hotter'],
  ['thin', 'thinner'],
  ['fat', 'fatter'],
  ['sad', 'sadder'],
  ['easy', 'easier'],
  ['early', 'earlier'],
  ['busy', 'busier'],
  ['noisy', 'noisier'],
  ['funny', 'funnier'],
  ['pretty', 'prettier'],
  ['heavy', 'heavier'],
  ['friendly', 'friendlier'],
  ['useful', 'more useful'],
  ['careful', 'more careful'],
  ['expensive', 'more expensive'],
  ['beautiful', 'more beautiful'],
  ['dangerous', 'more dangerous'],
  ['popular', 'more popular'],
  ['crowded', 'more crowded'],
  ['boring', 'more boring'],
  ['exciting', 'more exciting'],
  ['good', 'better'],
  ['bad', 'worse'],
  ['strong', 'stronger'],
];

function $(sel, root = document) { return root.querySelector(sel); }
function $$(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

function showToast(msg, type = '') {
  const t = $('#toast');
  t.textContent = msg;
  t.className = 'toast show ' + type;
  setTimeout(() => t.classList.remove('show'), 2500);
}

function updateHeaderStats() {
  $('#streakNum').textContent = STATE.streak;
  $('#pointsNum').textContent = STATE.points;
}

function updateSoundToggle() {
  const button = $('#soundToggle');
  button.textContent = STATE.soundEnabled ? '🔊' : '🔇';
  button.setAttribute('aria-label', STATE.soundEnabled ? 'Mute sounds' : 'Enable sounds');
  button.setAttribute('aria-pressed', String(STATE.soundEnabled));
  button.title = STATE.soundEnabled ? 'Sounds on' : 'Sounds muted';
}

function playCorrectSound() {
  if (!STATE.soundEnabled) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    console.warn('Sound effects are not available in this browser.');
    return;
  }

  try {
    if (!feedbackAudioContext) feedbackAudioContext = new AudioContextClass();
    const playChime = () => {
      const notes = [659.25, 880];
      const startAt = feedbackAudioContext.currentTime;
      notes.forEach((frequency, index) => {
        const oscillator = feedbackAudioContext.createOscillator();
        const gain = feedbackAudioContext.createGain();
        const noteStart = startAt + index * 0.12;
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.12, noteStart + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.2);
        oscillator.connect(gain);
        gain.connect(feedbackAudioContext.destination);
        oscillator.start(noteStart);
        oscillator.stop(noteStart + 0.21);
      });
    };

    if (feedbackAudioContext.state === 'suspended') {
      feedbackAudioContext.resume().then(playChime).catch(error => {
        console.warn('Could not start the correct-answer sound.', error);
      });
    } else {
      playChime();
    }
  } catch (error) {
    console.warn('Could not play the correct-answer sound.', error);
  }
}

async function speakVocabularyWord(text) {
  const synthesis = window.speechSynthesis;
  if (!synthesis || typeof SpeechSynthesisUtterance === 'undefined') {
    showToast('Speech is not available in this browser.', 'error');
    return;
  }

  let voices = synthesis.getVoices();
  if (!voices.length) {
    voices = await new Promise(resolve => {
      let timeout;
      const loadVoices = () => {
        const availableVoices = synthesis.getVoices();
        if (availableVoices.length) {
          clearTimeout(timeout);
          synthesis.removeEventListener('voiceschanged', loadVoices);
          resolve(availableVoices);
        }
      };
      synthesis.addEventListener('voiceschanged', loadVoices);
      timeout = setTimeout(() => {
        synthesis.removeEventListener('voiceschanged', loadVoices);
        resolve(synthesis.getVoices());
      }, 1000);
      loadVoices();
    });
  }

  const englishVoices = voices.filter(candidate => /^en(-|$)/i.test(candidate.lang));
  const voice = englishVoices.find(candidate => candidate.localService) || englishVoices[0];
  if (!voice) {
    showToast('No English voice is available in this browser.', 'error');
    return;
  }

  try {
    synthesis.cancel();
    if (!voice.localService) {
      showToast('This English voice may require an internet connection.');
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = voice.lang;
    utterance.rate = 0.85;
    utterance.onerror = event => {
      if (event.error === 'canceled' || event.error === 'interrupted') return;
      console.warn('Could not play the pronunciation.', event.error);
      showToast('Could not play the pronunciation.', 'error');
    };
    synthesis.speak(utterance);
  } catch (error) {
    console.warn('Could not start the pronunciation.', error);
    showToast('Could not start the pronunciation.', 'error');
  }
}

// Theme
function applyTheme() {
  document.documentElement.setAttribute('data-theme', STATE.theme);
  $('#themeToggle').textContent = STATE.theme === 'dark' ? '☀️' : '🌙';
}

function init() {
  // Init theme
  applyTheme();
  updateSoundToggle();
  $('#themeToggle').addEventListener('click', () => {
    STATE.theme = STATE.theme === 'dark' ? 'light' : 'dark';
    applyTheme();
    Storage.save(STATE);
  });
  $('#soundToggle').addEventListener('click', () => {
    STATE.soundEnabled = !STATE.soundEnabled;
    updateSoundToggle();
    Storage.save(STATE);
  });
  document.addEventListener('answered', event => {
    if (event.detail.correct) playCorrectSound();
  });
  const translatorLink = $('.nav-link[data-route="translate"]');
  translatorLink.addEventListener('click', event => {
    event.preventDefault();
    toggleFloatingTranslator();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && $('#translatorOverlayRoot').firstElementChild) {
      closeFloatingTranslator(true);
    }
  });
  document.addEventListener('pointerdown', event => {
    const root = $('#translatorOverlayRoot');
    if (root.firstElementChild && !root.contains(event.target) &&
        event.target !== translatorLink && !translatorLink.contains(event.target)) {
      closeFloatingTranslator();
    }
  });
  window.addEventListener('hashchange', () => {
    if ($('#translatorOverlayRoot').firstElementChild) closeFloatingTranslator();
  });
  updateHeaderStats();
  // Init storage streak
  Storage.updateStreak(STATE);
  Storage.save(STATE);
  // Set up routes
  Router.add('home', renderHome);
  Router.add('theory', renderTheory);
  Router.add('file', renderFile);
  Router.add('vocabulary', params => renderVocabularyPractice(params[0]));
  Router.add('lesson', renderLesson);
  Router.add('practice', renderPractice);
  Router.add('grammar-practice', renderGrammarPractice);
  Router.add('reading', renderReadingPractice);
  Router.add('writing', renderWritingPractice);
  Router.add('translate', () => renderTranslator());
  Router.add('review', renderReview);
  Router.add('stats', renderStats);
  Router.add('exam', renderExam);
  Router.add('exam-result', renderExamResult);
  Router.init();
}

// ============== VIEWS ==============

// --- OFFLINE TRANSLATOR ---
function renderTranslator(view = $('#mainView'), floating = false, mode = 'offline') {
  const online = mode === 'online';
  const gemini = mode === 'gemini';
  const title = gemini ? 'Gemini AI translator' : online ? 'Online translator' : 'Offline translator';
  const translatorForm = `
    <section class="translator-card" aria-label="${title}">
      <div class="translator-toolbar">
        <label for="translationDirection">Translation direction</label>
        <select id="translationDirection" class="translator-direction">
          <option value="en-es">English → Spanish</option>
          <option value="es-en">Spanish → English</option>
        </select>
        <button type="button" class="btn btn-secondary" id="swapTranslation" aria-label="Swap languages">⇄ Swap</button>
      </div>
      <div class="translator-panels">
        <label class="translator-panel">
          <span id="sourceLanguageLabel">English</span>
          <textarea id="translationSource" rows="${floating ? 4 : 8}" placeholder="Enter a word or text to translate…" spellcheck="true"></textarea>
          <span class="translator-count"><span id="sourceCharCount">0</span> characters</span>
        </label>
        <label class="translator-panel">
          <span id="targetLanguageLabel">Spanish</span>
          <textarea id="translationResult" class="${gemini ? 'translator-gemini-result' : ''}" rows="${floating ? 4 : 8}" placeholder="The translation will appear here…" readonly></textarea>
          <span class="translator-count${gemini ? ' translator-gemini-status' : ''}" id="translationStatus" aria-live="polite">${online ? 'Online translation · internet required' : gemini ? 'Gemini AI translation · internet required' : 'Offline translation'}</span>
        </label>
      </div>
      ${gemini ? `
        <details class="translator-gemini-details" id="geminiTranslationDetails" hidden>
          <summary>Context notes and key vocabulary</summary>
          <div class="translator-gemini-detail-content">
            <section id="geminiLiteralBlock" hidden>
              <h3>Literal translation</h3>
              <p id="geminiLiteralTranslation"></p>
            </section>
            <section>
              <h3>Context notes</h3>
              <p id="geminiContextNotes"></p>
            </section>
            <section>
              <h3>Key vocabulary</h3>
              <ul id="geminiKeyVocabulary"></ul>
            </section>
          </div>
        </details>
      ` : ''}
      <div class="translator-actions">
        <button type="button" class="btn" id="translateNow">${gemini ? 'Translate with Gemini AI' : online ? 'Translate online' : 'Translate'}</button>
        <button type="button" class="btn btn-secondary" id="copyTranslation">Copy translation</button>
        <button type="button" class="btn btn-ghost" id="clearTranslation">Clear text</button>
      </div>
      ${online ? '<p class="translator-online-notice">Text is sent over HTTPS to the public Apertium service. Do not send confidential information. Use offline mode without an internet connection.</p>' : ''}
      ${gemini ? '<p class="translator-online-notice">Text is sent over HTTPS directly to Google Gemini using the key loaded in the Writing Evaluator.</p>' : ''}
    </section>
  `;

  view.innerHTML = floating ? `
    <section class="translator-floating" role="dialog" aria-modal="false" aria-label="Floating translator">
      <header class="translator-floating-header">
        <h2>🌐 ${title}</h2>
        <div class="translator-floating-header-actions">
          <button type="button" class="btn btn-ghost translator-floating-change">Change</button>
          <button type="button" class="btn btn-secondary translator-floating-close" aria-label="Close translator">✕</button>
        </div>
      </header>
      ${translatorForm}
    </section>
  ` : `
    <h1 class="section-title">🌐 English ↔ Spanish Translator</h1>
    <p class="text-muted translator-note">Works offline with a built-in dictionary. It translates words and texts; unknown words are left unchanged.</p>
    ${translatorForm}
    <section class="translator-verb-sections" aria-label="Verbos en pasado y futuro">
      <div class="translator-verb-card">
        <h2>⏮️ Simple past verbs</h2>
        <p class="text-muted">Example forms use “I”. Regular verbs usually end in <strong>-ed</strong>; irregular verbs change form.</p>
        <div class="translator-table-wrap">
          <table class="translator-verb-table">
            <thead><tr><th>Type</th><th>Past-tense verb</th><th>Spanish translation</th></tr></thead>
            <tbody>
              ${OfflineTranslator.verbForms.map(verb => `
                <tr>
                  <td><span class="verb-type ${verb.type}">${verb.type === 'regular' ? 'Regular' : 'Irregular'}</span></td>
                  <td><code>I ${escapeHTML(verb.past)}</code></td>
                  <td>${escapeHTML(verb.pastTranslation)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      <div class="translator-verb-card">
        <h2>⏭️ Future with “will”</h2>
        <p class="text-muted">The future uses <strong>will + base verb</strong> for all verbs, regular and irregular. The Spanish translations show the first-person form.</p>
        <div class="translator-table-wrap">
          <table class="translator-verb-table">
            <thead><tr><th>Type</th><th>Future-tense verb</th><th>Spanish translation</th></tr></thead>
            <tbody>
              ${OfflineTranslator.verbForms.map(verb => `
                <tr>
                  <td><span class="verb-type ${verb.type}">${verb.type === 'regular' ? 'Regular' : 'Irregular'}</span></td>
                  <td><code>I will ${escapeHTML(verb.base)}</code></td>
                  <td>${escapeHTML(verb.futureTranslation)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;

  const source = $('#translationSource', view);
  const result = $('#translationResult', view);
  const direction = $('#translationDirection', view);
  const submitButton = $('#translateNow', view);
  const geminiDetails = gemini ? $('#geminiTranslationDetails', view) : null;
  const geminiLiteralBlock = gemini ? $('#geminiLiteralBlock', view) : null;
  const geminiLiteral = gemini ? $('#geminiLiteralTranslation', view) : null;
  const geminiContext = gemini ? $('#geminiContextNotes', view) : null;
  const geminiVocabulary = gemini ? $('#geminiKeyVocabulary', view) : null;
  const translateText = () => {
    const fromEnglish = direction.value === 'en-es';
    if (mode === 'offline') result.value = OfflineTranslator.translate(source.value, direction.value);
    else {
      result.value = '';
      $('#translationStatus', view).textContent = source.value
        ? gemini ? 'Select “Translate with Gemini AI” to translate this text' : 'Select “Translate online” to send your text to the service'
        : online ? 'Online translation · internet required' : 'Gemini AI translation · internet required';
      if (geminiDetails) geminiDetails.hidden = true;
    }
    $('#sourceCharCount', view).textContent = source.value.length;
    $('#sourceLanguageLabel', view).textContent = fromEnglish ? 'English' : 'Spanish';
    $('#targetLanguageLabel', view).textContent = fromEnglish ? 'Spanish' : 'English';
    if (mode === 'offline') {
      $('#translationStatus', view).textContent = source.value
        ? 'Offline translation · unknown words are left unchanged'
        : 'Offline translation';
    }
  };

  source.addEventListener('input', translateText);
  direction.addEventListener('change', translateText);
  submitButton.addEventListener('click', async () => {
    if (!source.value.trim()) {
      result.value = '';
      $('#translationStatus', view).textContent = gemini
        ? 'Enter text before translating'
        : online ? 'Enter text before translating' : 'Offline translation';
      return;
    }
    if (mode === 'offline') {
      translateText();
      return;
    }

    const status = $('#translationStatus', view);
    const request = new AbortController();
    const timeout = setTimeout(() => request.abort(), gemini ? 60000 : 30000);
    submitButton.disabled = true;
    submitButton.textContent = 'Translating...';
    status.classList.add('is-loading');
    status.setAttribute('aria-busy', 'true');
    result.setAttribute('aria-busy', 'true');
    if (geminiDetails) geminiDetails.hidden = true;
    try {
      if (gemini) {
        const service = window.GeminiTranslationService;
        if (!service?.hasActiveKey()) {
          throw new Error('Enter your API key in the Writing Evaluator to enable Gemini AI translation.');
        }
        const translation = await service.translate(source.value.trim(), direction.value, request.signal);
        result.value = translation.translated_text;
        geminiLiteral.textContent = translation.literal_translation;
        geminiLiteralBlock.hidden = !translation.literal_translation.trim();
        geminiContext.textContent = translation.context_notes || 'No additional context notes.';
        geminiVocabulary.replaceChildren();
        translation.key_vocabulary.forEach(item => {
          const entry = document.createElement('li');
          const word = document.createElement('strong');
          word.textContent = item.word;
          const meaning = document.createElement('span');
          meaning.textContent = item.meaning;
          entry.append(word, document.createTextNode(' — '), meaning);
          geminiVocabulary.appendChild(entry);
        });
        geminiDetails.hidden = false;
        geminiDetails.open = false;
        status.textContent = 'Gemini AI translation complete.';
      } else {
        status.textContent = 'Connecting to Apertium...';
        const response = await fetch(ONLINE_TRANSLATOR_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            q: source.value,
            langpair: direction.value === 'en-es' ? 'eng|spa' : 'spa|eng',
          }),
          signal: request.signal,
        });
        if (!response.ok) {
          throw new Error(response.status === 429
            ? 'The service is busy. Wait a moment and try again.'
            : `The service returned error ${response.status}.`);
        }
        const data = await response.json();
        if (data.responseStatus !== 200) {
          throw new Error(data.responseDetails || 'Apertium could not process this text.');
        }
        if (typeof data.responseData?.translatedText !== 'string') {
          throw new Error('The service returned an invalid translation response.');
        }
        result.value = data.responseData.translatedText;
        status.textContent = 'Online translation · Apertium';
      }
    } catch (error) {
      console.error(`${gemini ? 'Gemini AI' : 'Online'} translation failed.`, error);
      result.value = '';
      if (geminiDetails) geminiDetails.hidden = true;
      if (error.name === 'AbortError') {
        status.textContent = 'The request timed out. Check your connection and try again.';
      } else if (error instanceof TypeError) {
        status.textContent = 'Could not connect to the service. Check your internet connection or try again later.';
      } else if (error instanceof SyntaxError) {
        status.textContent = 'The service returned an invalid response. Try again later.';
      } else {
        status.textContent = `${gemini ? 'Gemini AI' : 'Online'} translation failed: ${error.message || 'try again later.'}`;
      }
    } finally {
      clearTimeout(timeout);
      status.classList.remove('is-loading');
      status.setAttribute('aria-busy', 'false');
      result.setAttribute('aria-busy', 'false');
      submitButton.disabled = false;
      submitButton.textContent = gemini ? 'Translate with Gemini AI' : online ? 'Translate online' : 'Translate';
    }
  });
  $('#swapTranslation', view).addEventListener('click', () => {
    if (!result.value) {
      direction.value = direction.value === 'en-es' ? 'es-en' : 'en-es';
      translateText();
      return;
    }
    source.value = result.value;
    direction.value = direction.value === 'en-es' ? 'es-en' : 'en-es';
    translateText();
  });
  $('#clearTranslation', view).addEventListener('click', () => {
    source.value = '';
    result.value = '';
    translateText();
    source.focus();
  });
  $('#copyTranslation', view).addEventListener('click', async () => {
    if (!result.value) {
      showToast('There is no translation to copy', 'error');
      return;
    }
    try {
      await navigator.clipboard.writeText(result.value);
      showToast('Translation copied', 'success');
    } catch (error) {
      console.error('Could not copy the translation.', error);
      result.focus();
      result.select();
      showToast('Select and copy the text manually', 'error');
    }
  });

  if (floating) {
    $('.translator-floating-close', view).addEventListener('click', () => closeFloatingTranslator(true));
    $('.translator-floating-change', view).addEventListener('click', openTranslatorChooser);
  }
}

function toggleFloatingTranslator() {
  const root = $('#translatorOverlayRoot');
  if (root.firstElementChild) {
    if (root.querySelector('.translator-mode-choice')) {
      closeFloatingTranslator();
    } else {
      openTranslatorChooser();
    }
    return;
  }
  openTranslatorChooser();
}

function openTranslatorChooser() {
  const root = $('#translatorOverlayRoot');
  const hasGeminiKey = Boolean(window.GeminiTranslationService?.hasActiveKey());
  root.innerHTML = `
    <section class="translator-floating translator-mode-choice" role="dialog" aria-modal="false" aria-label="Choose a translator">
      <header class="translator-floating-header">
        <h2>Choose a translator</h2>
        <button type="button" class="btn btn-secondary translator-floating-close" aria-label="Close translator options">✕</button>
      </header>
      <div class="translator-choice-list">
        <button type="button" class="translator-choice" data-translator-mode="offline">
          <strong>Offline translator</strong>
          <span>Works without an internet connection. Uses the built-in dictionary.</span>
        </button>
        <button type="button" class="translator-choice" data-translator-mode="online">
          <strong>Online translator</strong>
          <span>Uses Apertium to translate words and texts over the internet.</span>
        </button>
        <button type="button" class="translator-choice${hasGeminiKey ? '' : ' translator-choice-disabled'}" data-translator-mode="gemini" ${hasGeminiKey ? '' : 'disabled'}>
          <strong>Gemini AI Translator (High Accuracy)</strong>
          <span>${hasGeminiKey ? 'Uses the Gemini key loaded in the Writing Evaluator for contextual translations.' : 'Enter your API key in the Writing Evaluator to enable advanced AI translation.'}</span>
        </button>
        ${hasGeminiKey ? '' : '<button type="button" class="btn btn-secondary translator-key-setup" id="openGeminiKeySetup">Open Writing Evaluator</button>'}
        <p class="translator-online-notice">Requires internet. Text is sent over HTTPS to a public service; do not send confidential information. Availability and translation quality may vary.</p>
      </div>
    </section>
  `;
  $('.nav-link[data-route="translate"]').setAttribute('aria-expanded', 'true');
  $('.translator-floating-close', root).addEventListener('click', () => closeFloatingTranslator(true));
  const keySetupButton = $('#openGeminiKeySetup', root);
  if (keySetupButton) {
    keySetupButton.addEventListener('click', () => {
      closeFloatingTranslator();
      Router.navigate('writing/evaluate');
    });
  }
  $$('.translator-choice', root).forEach(button => {
    button.addEventListener('click', () => {
      renderTranslator(root, true, button.dataset.translatorMode);
      $('#translationSource', root).focus();
    });
  });
}

function closeFloatingTranslator(returnFocus = false) {
  $('#translatorOverlayRoot').replaceChildren();
  const trigger = $('.nav-link[data-route="translate"]');
  trigger.setAttribute('aria-expanded', 'false');
  if (returnFocus) trigger.focus();
}

// --- HOME ---
function renderHome() {
  const view = $('#mainView');
  const totalQuestions = Files.reduce((sum, f) => sum + f.lessons.reduce((s, l) => s + l.grammar.length + l.vocabulary.length + l.mixed.length, 0), 0);
  const totalLessons = Files.reduce((s, f) => s + f.lessons.length, 0);
  const completedLessons = Object.values(STATE.fileProgress).reduce((s, f) => s + Object.values(f).filter(l => l.completed).length, 0);
  const accuracy = STATE.totalAnswered > 0 ? Math.round((STATE.totalCorrect / STATE.totalAnswered) * 100) : 0;

  view.innerHTML = `
    <div class="hero">
      <h1>Practice English, one exercise at a time <span class="hero-title-icon" aria-hidden="true">📚</span></h1>
      <p>Independent activities to practise grammar, vocabulary, reading, and writing.</p>
      <div class="hero-stats">
        <div class="hero-stat"><strong>${totalQuestions}</strong> questions</div>
        <div class="hero-stat"><strong>${Files.length}</strong> levels</div>
        <div class="hero-stat"><strong>${totalLessons}</strong> lessons</div>
        <div class="hero-stat"><strong>${accuracy}%</strong> your accuracy</div>
        <div class="hero-stat"><strong>${completedLessons}</strong> lessons completed</div>
      </div>
    </div>

    <h2 class="section-title">📂 Levels (Files)</h2>
    <div class="files-grid">
      ${Files.map(f => {
        const progress = Storage.getFileProgress(STATE, f.id);
        const done = f.lessons.filter(l => STATE.fileProgress[f.id]?.[l.letter]?.completed).length;
        const total = f.lessons.length;
        const totalQ = f.lessons.reduce((s, l) => s + l.grammar.length + l.vocabulary.length + l.mixed.length, 0);
        return `
          <div class="file-card" data-file="${f.id}">
            <div class="file-header">
              <span class="file-num">File ${f.id}</span>
              <span class="file-status">${done}/${total} lessons</span>
            </div>
            <div class="file-title">${escapeHTML(f.title)}</div>
            <div class="file-desc">${escapeHTML(f.description)}</div>
            <div class="file-progress">
              <div class="file-progress-fill" style="width: ${progress}%"></div>
            </div>
            <div class="file-stats">
              <span>${totalQ} questions</span>
              <span>${progress}% complete</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
  attachTheoryInteractions(view);
  $$('.file-card').forEach(card => {
    card.addEventListener('click', () => Router.navigate('file/' + card.dataset.file));
  });
}

const QUESTION_WORD_GUIDES = {
  how: {
    title: 'How',
    translation: '“How” significa principalmente “cómo” o “cuánto/a”. Se usa en estas seis clases de preguntas:',
    sections: [
      {
        title: '1. Manera, método o estado',
        description: 'Pregunta de qué forma se hace algo o cuál es el estado de una persona o situación.',
        examples: [
          ['How do you open this box?', '¿Cómo abres esta caja?'],
          ['How does this machine work?', '¿Cómo funciona esta máquina?'],
          ['How was your day?', '¿Cómo estuvo tu día?'],
        ],
      },
      {
        title: '2. Cantidad o precio',
        description: 'How much pregunta por una cantidad incontable o un precio; how many se usa con sustantivos contables en plural.',
        examples: [
          ['How much is this jacket?', '¿Cuánto cuesta esta chaqueta?'],
          ['How much water do you drink?', '¿Cuánta agua bebes?'],
          ['How many brothers do you have?', '¿Cuántos hermanos tienes?'],
        ],
      },
      {
        title: '3. Frecuencia',
        description: 'How often pregunta con qué frecuencia o cada cuánto sucede algo.',
        examples: [
          ['How often do you go to the gym?', '¿Con qué frecuencia vas al gimnasio?'],
          ['How often does it rain here?', '¿Cada cuánto llueve aquí?'],
        ],
      },
      {
        title: '4. Grado, edad y características',
        description: 'How se combina con un adjetivo para preguntar por el grado de una característica, una medida, una duración o una distancia.',
        examples: [
          ['How old are you?', '¿Cuántos años tienes?'],
          ['How tall is he?', '¿Qué tan alto es él?'],
          ['How far is the beach?', '¿Qué tan lejos está la playa?'],
          ['How long is the movie?', '¿Cuánto dura la película?'],
          ['How fast can you run?', '¿Qué tan rápido puedes correr?'],
        ],
      },
      {
        title: '5. Opiniones y sugerencias',
        description: 'How puede pedir una opinión sobre una experiencia. How about sirve para proponer una idea o actividad.',
        examples: [
          ['How do you like your new job?', '¿Qué tal te parece tu nuevo trabajo?'],
          ['How about going to the cinema tonight?', '¿Qué tal si vamos al cine esta noche?'],
        ],
      },
      {
        title: '6. Causa o razón (informal)',
        description: 'How come pregunta informalmente por la razón de algo y suele equivaler a “¿por qué?” o “¿cómo es que...?”.',
        examples: [
          ['How come you are late?', '¿Cómo es que llegas tarde? / ¿Por qué llegas tarde?'],
        ],
      },
    ],
  },
  what: {
    title: 'What',
    translation: '“What” normalmente significa “qué” o “cuál”. Se usa para preguntar por información, cosas, actividades o características.',
    sections: [
      {
        title: 'Preguntar por cosas, acciones o información',
        description: 'Con la mayoría de los verbos, what va antes del auxiliar do/does y del sujeto. Con be, va antes de be.',
        examples: [
          ['What does this button do?', '¿Qué hace este botón?'],
          ['What do you want?', '¿Qué quieres?'],
          ['What is your name?', '¿Cómo te llamas? (literalmente: ¿Cuál es tu nombre?)'],
        ],
      },
      {
        title: 'Expresiones frecuentes',
        description: 'What se combina con sustantivos y otras palabras para hacer preguntas más específicas.',
        examples: [
          ['What time do the shops close?', '¿A qué hora cierran las tiendas?'],
          ['What kind of music do you like?', '¿Qué tipo de música te gusta?'],
          ['What about this one?', '¿Qué tal este? / ¿Y este?'],
        ],
      },
      {
        title: 'What como sujeto',
        description: 'Cuando what es quien realiza la acción, normalmente no se añade do/does.',
        examples: [
          ['What makes you happy?', '¿Qué te hace feliz?'],
        ],
      },
    ],
  },
  where: {
    title: 'Where',
    translation: '“Where” significa “dónde” o “adónde”. Se usa para preguntar por un lugar, una ubicación o un destino.',
    sections: [
      {
        title: 'Ubicación con be',
        description: 'Coloca where antes de be para preguntar dónde está alguien o algo.',
        examples: [
          ['Where are your parents?', '¿Dónde están tus padres?'],
          ['Where is the nearest station?', '¿Dónde está la estación más cercana?'],
        ],
      },
      {
        title: 'Lugares y destinos con otros verbos',
        description: 'Con la mayoría de los otros verbos, usa where + do/does + sujeto + verbo base.',
        examples: [
          ['Where do you live?', '¿Dónde vives?'],
          ['Where does this bus go?', '¿Adónde va este autobús?'],
        ],
      },
      {
        title: 'Preguntar por el origen',
        description: 'Where ... from pregunta de dónde es o de dónde viene una persona o cosa.',
        examples: [
          ['Where are you from?', '¿De dónde eres?'],
        ],
      },
    ],
  },
  when: {
    title: 'When',
    translation: '“When” significa “cuándo” y pregunta por el momento, la fecha o la ocasión en que sucede algo.',
    sections: [
      {
        title: 'Preguntar por momentos y horarios',
        description: 'Con be, when va antes de be. Con otros verbos, normalmente va antes del auxiliar do/does.',
        examples: [
          ['When is your birthday?', '¿Cuándo es tu cumpleaños?'],
          ['When do you start work?', '¿Cuándo empiezas a trabajar?'],
          ['When does the train leave?', '¿Cuándo sale el tren?'],
        ],
      },
      {
        title: 'When en preguntas y oraciones',
        description: 'También introduce una pregunta indirecta o una cláusula que indica cuándo ocurre otra acción.',
        examples: [
          ['Do you know when the shop opens?', '¿Sabes cuándo abre la tienda?'],
          ['Call me when you arrive.', 'Llámame cuando llegues.'],
        ],
      },
    ],
  },
  with: {
    title: 'With',
    translation: '“With” significa “con”. No suele funcionar por sí sola como palabra interrogativa, pero aparece dentro de preguntas para preguntar por compañía, herramientas, ingredientes o características.',
    sections: [
      {
        title: 'Compañía o relación',
        description: 'With puede indicar con quién está o hace algo una persona. En una pregunta, suele aparecer al final.',
        examples: [
          ['Who are you going with?', '¿Con quién vas?'],
          ['Who does she live with?', '¿Con quién vive ella?'],
        ],
      },
      {
        title: 'Herramientas o medios',
        description: 'Pregunta qué instrumento o medio se utiliza para hacer algo.',
        examples: [
          ['What do you write with?', '¿Con qué escribes?'],
          ['What did you open it with?', '¿Con qué lo abriste?'],
        ],
      },
      {
        title: 'Cualidades y características',
        description: 'With también describe qué tiene o incluye una persona o cosa.',
        examples: [
          ['Which bag is the one with the red handle?', '¿Cuál es el bolso que tiene el asa roja?'],
        ],
      },
    ],
  },
};

const QUESTION_WORD_PATTERN = /\b(how|what|where|when|with)\b/gi;

function renderQuestionWordLinks(value) {
  return escapeHTML(value).replace(QUESTION_WORD_PATTERN, match => {
    const word = match.toLowerCase();
    return `<button type="button" class="theory-word-link" data-question-word="${word}" aria-label="Learn about ${word}">${match}</button>`;
  });
}

function renderQuestionWordGuide(guide) {
  return `
    <p class="question-word-translation">Common question patterns with <strong>${escapeHTML(guide.title)}</strong>:</p>
    ${guide.sections.map((section, index) => `
      <section class="question-word-section">
        <h3>Pattern ${index + 1}</h3>
        <ul>
          ${section.examples.map(([english]) => `
            <li><strong>${escapeHTML(english)}</strong></li>
          `).join('')}
        </ul>
      </section>
    `).join('')}
  `;
}

function renderTheoryBody(topic) {
  return topic.sections.map(section => `
    <article class="theory-subsection">
      <h3>${renderQuestionWordLinks(section.title)}</h3>
      <p>${renderQuestionWordLinks(section.intro)}</p>
      <ul class="theory-rules">
        ${section.rules.map(rule => `<li>${renderQuestionWordLinks(rule)}</li>`).join('')}
      </ul>
      <p class="theory-formula"><strong>Structure:</strong> ${renderQuestionWordLinks(section.formula)}</p>
      <div class="theory-example-list">
        ${section.examples.map(([english]) => `
          <div class="theory-example">
            <code>${renderQuestionWordLinks(english)}</code>
          </div>
        `).join('')}
      </div>
      ${section.note ? `<p class="theory-tip"><strong>Note:</strong> ${renderQuestionWordLinks(section.note)}</p>` : ''}
    </article>
  `).join('');
}

function renderTheorySection(showTheoryLink = false) {
  return `
    <section class="theory-section" aria-labelledby="theory-title">
      <div class="theory-heading">
        <div>
          <h2 class="section-title" id="theory-title">📘 Theory · Grammar Bank</h2>
          <p class="text-muted">12 topics organized into subtopics, with explanations, structures, and original examples. Open a card or expand it to read more. Click blue, underlined words such as how, what, where, when, and with for usage notes.</p>
        </div>
        ${showTheoryLink ? '<a class="btn btn-secondary theory-link" href="#theory" data-route="theory">View all theory</a>' : ''}
      </div>
      <div class="theory-grid">
        ${GrammarTheory.map((topic, index) => `
          <details class="theory-topic">
            <summary>
              <span class="theory-topic-title">${escapeHTML(topic.title)}</span>
              <span class="theory-topic-focus">${escapeHTML(topic.focus)}</span>
            </summary>
            <div class="theory-content">
              <div class="theory-content-toolbar">
                <span>${topic.sections.length} subtopics · independent scrolling</span>
                <button type="button" class="btn btn-secondary theory-expand" data-topic-index="${index}" aria-label="Expand ${escapeHTML(topic.title)}">⛶ Expand</button>
              </div>
              ${renderTheoryBody(topic)}
            </div>
          </details>
        `).join('')}
      </div>
      <p class="theory-note">An original guide organized into 12 topic areas; review each subtopic and its examples.</p>
      <dialog class="theory-dialog" aria-labelledby="theoryDialogTitle">
        <div class="theory-dialog-shell">
          <header class="theory-dialog-heading">
            <h2 id="theoryDialogTitle"></h2>
            <button type="button" class="btn btn-secondary theory-dialog-close" aria-label="Close expanded theory">✕ Close</button>
          </header>
          <div class="theory-dialog-body"></div>
        </div>
      </dialog>
      <dialog class="question-word-dialog" aria-labelledby="questionWordDialogTitle">
        <div class="question-word-dialog-shell">
          <header class="question-word-dialog-heading">
            <div>
              <span>ENGLISH QUESTION WORD</span>
              <h2 id="questionWordDialogTitle"></h2>
            </div>
            <button type="button" class="btn btn-secondary question-word-dialog-close" aria-label="Close word explanation">✕ Close</button>
          </header>
          <div class="question-word-dialog-body"></div>
        </div>
      </dialog>
    </section>
  `;
}

function renderTheory() {
  const view = $('#mainView');
  view.innerHTML = `
    <a href="#home" class="back-link">← Back to Home</a>
    ${renderTheorySection()}
  `;
  attachTheoryInteractions(view);
}

function attachTheoryInteractions(view) {
  const dialog = $('.theory-dialog', view);
  if (!dialog) return;
  const wordDialog = $('.question-word-dialog', view);
  const dialogTitle = $('#theoryDialogTitle', dialog);
  const dialogBody = $('.theory-dialog-body', dialog);
  const wordDialogTitle = $('#questionWordDialogTitle', wordDialog);
  const wordDialogBody = $('.question-word-dialog-body', wordDialog);

  const updateDialogScrollLock = () => {
    const anyDialogOpen = $$('.theory-dialog, .question-word-dialog', view).some(item => item.open);
    document.documentElement.classList.toggle('theory-dialog-open', anyDialogOpen);
  };

  view.addEventListener('click', event => {
    const wordButton = event.target instanceof Element
      ? event.target.closest('.theory-word-link')
      : null;
    if (!wordButton || !view.contains(wordButton)) return;
    const guide = QUESTION_WORD_GUIDES[wordButton.dataset.questionWord];
    if (!guide) return;
    wordDialogTitle.textContent = guide.title;
    wordDialogBody.innerHTML = renderQuestionWordGuide(guide);
    wordDialog.showModal();
    $('.question-word-dialog-close', wordDialog).focus();
  });

  $('.question-word-dialog-close', wordDialog).addEventListener('click', () => wordDialog.close());
  wordDialog.addEventListener('close', updateDialogScrollLock);
  wordDialog.addEventListener('click', event => {
    if (event.target === wordDialog) wordDialog.close();
  });

  $$('.theory-expand', view).forEach(button => {
    button.addEventListener('click', () => {
      const topic = GrammarTheory[Number(button.dataset.topicIndex)];
      if (!topic) return;
      dialogTitle.textContent = topic.title;
      dialogBody.innerHTML = renderTheoryBody(topic);
      dialog.showModal();
      updateDialogScrollLock();
      $('.theory-dialog-close', dialog).focus();
    });
  });

  $('.theory-dialog-close', dialog).addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', updateDialogScrollLock);
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Escape' && dialog.open) {
      event.preventDefault();
      dialog.close();
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
}

function renderVocabularyPractice(categoryKey = 'food') {
  const view = $('#mainView');
  const isNumberPractice = categoryKey === 'numbers';
  let collection = isNumberPractice ? createNumberVocabulary() : FILE_10_VOCABULARY.food;
  const label = isNumberPractice ? 'Numbers' : 'Food';
  let words = collection.map(item => ({
    ...item,
    accepted: item.accepted || [item.word, ...(item.aliases || [])],
  }));
  let currentIndex = 0;
  let correctCount = 0;
  const correctlyAnswered = new Set();
  const responses = new Map();
  let advanceTimeout = null;

  const normalizeAnswer = value => String(value).trim().toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, ' ');
  const normalizeNumberAnswer = value => normalizeAnswer(value.replace(/-/g, ' ')).replace(/\band\b/g, ' ').replace(/\s+/g, ' ').trim();
  const normalizeNumberDigits = value => {
    const trimmed = String(value).trim();
    if (!/^\d+$/.test(trimmed) && !/^\d{1,3}(,\d{3})+$/.test(trimmed)) return '';
    return trimmed.replace(/,/g, '');
  };
  const answerLabel = item => isNumberPractice && item.direction === 'words-to-number'
    ? Number(item.number).toLocaleString('en-US')
    : item.word;

  const finishVocabularySession = () => {
    const percent = Math.round((correctCount / words.length) * 100);
    view.innerHTML = `
      <a href="#practice" class="back-link">← Back to Practice</a>
      <div class="lesson-header text-center">
        <div style="font-size:3rem">🎉</div>
        <h1>Vocabulary · ${escapeHTML(label)}</h1>
        <p class="topics">You completed ${words.length} ${isNumberPractice ? 'number questions' : 'words'}.</p>
        <p style="font-size:1.5rem; color:var(--primary); font-weight:700;">${correctCount} / ${words.length} correct (${percent}%)</p>
        <div class="mt-2">
          <button class="btn" type="button" id="vocabRetryBtn">🔁 Try again</button>
          <a href="#practice" class="btn btn-secondary">Back</a>
        </div>
      </div>
    `;
    $('#vocabRetryBtn')?.addEventListener('click', () => renderVocabularyPractice(categoryKey));
  };

  const renderItem = () => {
    const item = words[currentIndex];
    const progress = `${currentIndex + 1} / ${words.length}`;
    if (advanceTimeout) {
      clearTimeout(advanceTimeout);
      advanceTimeout = null;
    }
    const card = document.createElement('div');
    card.className = 'vocabulary-practice';
    card.innerHTML = `
      <div class="vocabulary-progress-bar">
        <span>Progress</span>
        <strong>${progress}</strong>
      </div>
      <div class="vocabulary-card-panel">
        ${isNumberPractice
          ? `<div class="vocabulary-number-display${item.direction === 'words-to-number' ? ' vocabulary-number-words' : ''}" aria-label="${item.direction === 'words-to-number' ? 'Number in words' : `Number ${item.number}`}">${item.direction === 'words-to-number' ? escapeHTML(item.word) : item.number}</div>`
          : `<img class="vocabulary-image" src="${item.image}" alt="${escapeHTML(item.alt)}" />
            ${item.imageCredit ? `<span class="vocabulary-image-credit"><a href="${item.imageCredit.url}" target="_blank" rel="noopener noreferrer">${escapeHTML(item.imageCredit.label)}</a> · <a href="${item.imageCredit.licenseUrl}" target="_blank" rel="noopener noreferrer">${escapeHTML(item.imageCredit.licenseLabel)}</a></span>` : ''}`}
        <div class="vocabulary-question">
          <h3>${isNumberPractice ? (item.direction === 'words-to-number' ? 'Write this number in digits.' : 'What is this number called?') : 'What food can you see?'}</h3>
          <p>${isNumberPractice
            ? (item.direction === 'words-to-number'
              ? 'Enter the number shown in words. Commas are optional.'
              : 'Write the number in English. Both the British form with “and” and the American form without “and” are accepted.')
            : 'Write its name in English.'}</p>
        </div>
        <div class="vocabulary-speech-control">
          <div class="vocabulary-speech-buttons">
            <button class="btn btn-secondary" id="speakVocabularyBtn" type="button">🔊 Listen to pronunciation</button>
            <button class="btn btn-secondary" id="vocabularyNoteBtn" type="button" aria-haspopup="dialog">📝 Note</button>
          </div>
            <small>Works offline if an English voice is installed on your device.</small>
        </div>
        <dialog class="vocabulary-note-dialog" aria-labelledby="vocabularyNoteTitle">
            <h2 id="vocabularyNoteTitle">Set up speech on Android</h2>
            <p>Open Settings → Accessibility → Text-to-speech output. On some devices, this is under General management → Text-to-speech.</p>
            <p>Select Speech Recognition &amp; Synthesis from Google or Google Speech Services as the preferred engine.</p>
            <p>Under Install voice data, download English (United States) or English (United Kingdom).</p>
            <p>Close and reopen Chrome, then try the button again.</p>
            <button class="btn btn-secondary vocabulary-note-close" type="button">Close</button>
        </dialog>
        <input id="vocabularyAnswer" class="vocabulary-input" type="text" inputmode="${isNumberPractice && item.direction === 'words-to-number' ? 'numeric' : 'text'}" placeholder="${isNumberPractice ? (item.direction === 'words-to-number' ? 'Write the number in digits...' : 'Write the number in English...') : 'Write the word...'}" autocomplete="off" />
        <div class="exercise-actions">
          <button class="btn btn-secondary" id="previousVocabularyBtn" type="button" ${currentIndex === 0 ? 'disabled' : ''}>← Previous question</button>
          <button class="btn" id="checkVocabularyBtn" type="button">Check</button>
          <button class="btn btn-secondary" id="skipVocabularyBtn" type="button">${currentIndex === words.length - 1 ? 'Finish practice' : 'Next question'}</button>
        </div>
        <div id="vocabularyFeedback" class="vocabulary-feedback hidden"> </div>
      </div>
    `;

    const feedback = card.querySelector('#vocabularyFeedback');
    const input = card.querySelector('#vocabularyAnswer');
    const checkBtn = card.querySelector('#checkVocabularyBtn');
    const skipBtn = card.querySelector('#skipVocabularyBtn');
    const previousBtn = card.querySelector('#previousVocabularyBtn');
    const speakBtn = card.querySelector('#speakVocabularyBtn');
    const noteBtn = card.querySelector('#vocabularyNoteBtn');
    const noteDialog = card.querySelector('.vocabulary-note-dialog');

    const savedResponse = responses.get(currentIndex);
    if (savedResponse) {
      input.value = savedResponse.answer;
      feedback.className = `vocabulary-feedback ${savedResponse.correct ? 'success' : 'error'}`;
      feedback.innerHTML = savedResponse.correct
        ? `<strong>✅ Correct!</strong><span>The answer is <strong>${escapeHTML(answerLabel(item))}</strong>.</span>`
        : `<strong>❌ Not quite.</strong><span>The correct answer is <strong>${escapeHTML(answerLabel(item))}</strong>.</span>`;
      if (savedResponse.correct) {
        input.disabled = true;
        checkBtn.disabled = true;
      } else {
        input.classList.add('wrong');
      }
    }

    const advance = () => {
      if (advanceTimeout) {
        clearTimeout(advanceTimeout);
        advanceTimeout = null;
      }
      window.speechSynthesis?.cancel();
      if (currentIndex < words.length - 1) {
        currentIndex += 1;
        renderItem();
      } else {
        finishVocabularySession();
      }
    };

    previousBtn.addEventListener('click', () => {
      if (currentIndex === 0) return;
      currentIndex -= 1;
      renderItem();
    });

    speakBtn.addEventListener('click', () => speakVocabularyWord(item.word));
    noteBtn.addEventListener('click', () => noteDialog.showModal());
    $('.vocabulary-note-close', noteDialog).addEventListener('click', () => noteDialog.close());
    noteDialog.addEventListener('keydown', event => {
      if (event.key === 'Escape' && noteDialog.open) {
        event.preventDefault();
        noteDialog.close();
      }
    });
    noteDialog.addEventListener('click', event => {
      if (event.target === noteDialog) noteDialog.close();
    });

    input.addEventListener('input', () => {
      if (responses.get(currentIndex)?.correct) return;
      responses.delete(currentIndex);
      feedback.className = 'vocabulary-feedback hidden';
      input.classList.remove('wrong');
    });

    checkBtn.addEventListener('click', () => {
      if (checkBtn.disabled) return;
      const isWordsToNumber = isNumberPractice && item.direction === 'words-to-number';
      const value = isWordsToNumber
        ? normalizeNumberDigits(input.value)
        : isNumberPractice ? normalizeNumberAnswer(input.value) : normalizeAnswer(input.value);
      const accepted = item.accepted.map(term => isWordsToNumber
        ? normalizeNumberDigits(term)
        : isNumberPractice ? normalizeNumberAnswer(term) : normalizeAnswer(term));
      const correct = accepted.includes(value);
      responses.set(currentIndex, { answer: input.value, correct });
      input.disabled = true;
      checkBtn.disabled = true;
      if (correct) {
        if (!correctlyAnswered.has(currentIndex)) {
          correctlyAnswered.add(currentIndex);
          correctCount += 1;
        }
        playCorrectSound();
        feedback.className = 'vocabulary-feedback success';
        feedback.innerHTML = `<strong>✅ Correct!</strong><span>The answer is <strong>${escapeHTML(answerLabel(item))}</strong>.</span>`;
        advanceTimeout = setTimeout(advance, 900);
      } else {
        input.disabled = false;
        checkBtn.disabled = false;
        input.classList.add('wrong');
        feedback.className = 'vocabulary-feedback error';
        feedback.innerHTML = `<strong>❌ Not quite.</strong><span>The correct answer is <strong>${escapeHTML(answerLabel(item))}</strong>.</span>`;
      }
    });

    input.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        checkBtn.click();
      }
    });

    skipBtn.addEventListener('click', advance);

    const wrap = $('#mainView');
    wrap.innerHTML = `
      <a href="#practice" class="back-link">← Back to Practice</a>
      <div class="lesson-header">
        <span class="file-num">Vocabulary · ${escapeHTML(label)}</span>
        <h1 style="margin-top:0.5rem">${escapeHTML(label)} practice</h1>
        <p class="topics">${isNumberPractice ? 'Practice writing numbers in words and digits.' : 'Write the name of the food or item shown in the picture.'}</p>
        <button class="btn btn-secondary" id="shuffleVocabularyBtn" type="button">🔀 Shuffle and restart</button>
      </div>
    `;
    $('#shuffleVocabularyBtn').addEventListener('click', () => {
      window.speechSynthesis?.cancel();
      if (isNumberPractice) collection = createNumberVocabulary();
      words = collection.map(item => ({
        ...item,
        accepted: item.accepted || [item.word, ...(item.aliases || [])],
      }));
      for (let index = words.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [words[index], words[randomIndex]] = [words[randomIndex], words[index]];
      }
      currentIndex = 0;
      correctCount = 0;
      correctlyAnswered.clear();
      responses.clear();
      renderItem();
    });
    wrap.appendChild(card);
  };

  renderItem();
}

// --- FILE (LESSON LIST) ---
function renderFile(params) {
  const fileId = params[0];
  const file = Files.find(f => f.id === fileId);
  if (!file) { Router.navigate('home'); return; }
  const view = $('#mainView');
  view.innerHTML = `
    <a href="#home" class="back-link">← Back to Levels</a>
    <div class="lesson-header">
      <span class="file-num">File ${file.id}</span>
      <h1 style="margin-top:0.5rem">${escapeHTML(file.title)}</h1>
      <p class="topics">${escapeHTML(file.description)}</p>
      <div class="section-tabs" style="margin-top:1rem">
        <button class="tab-btn" id="startReview">📝 Practice the whole File</button>
        <button class="tab-btn" id="startExam">🎯 Take the File exam</button>
      </div>
    </div>
    <h2 class="section-title">📖 Lessons</h2>
    <div class="lesson-list">
      ${file.lessons.map(l => {
        const lp = STATE.fileProgress[fileId]?.[l.letter] || { answered: 0, correct: 0, completed: false };
        const total = l.grammar.length + l.vocabulary.length + l.mixed.length;
        const acc = lp.answered > 0 ? Math.round((lp.correct / lp.answered) * 100) : null;
        return `
          <div class="lesson-card" data-lesson="${l.letter}">
            <div>
              <span class="lesson-letter">${l.letter}</span>
              <strong>${escapeHTML(l.title)}</strong>
            </div>
            <div class="lesson-topics">${escapeHTML(l.grammar_topic)} · ${escapeHTML(l.vocab_topic)}</div>
            <div class="lesson-meta">
              <span>${total} questions</span>
              <span>${lp.completed ? '✅ Completed' : (lp.answered > 0 ? `${lp.answered}/${total} answered · ${acc ?? 0}%` : 'Not started')}</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
  $$('.lesson-card').forEach(card => {
    card.addEventListener('click', () => Router.navigate('lesson/' + fileId + '/' + card.dataset.lesson));
  });
  $('#startReview').addEventListener('click', () => Router.navigate('practice/file/' + fileId));
  $('#startExam').addEventListener('click', () => Router.navigate('exam/' + fileId));
}

// --- LESSON DETAIL ---
function renderLesson(params) {
  const [fileId, lessonLetter] = params;
  const file = Files.find(f => f.id === fileId);
  if (!file) { Router.navigate('home'); return; }
  const lesson = file.lessons.find(l => l.letter === lessonLetter);
  if (!lesson) { Router.navigate('file/' + fileId); return; }
  const view = $('#mainView');
  view.innerHTML = `
    <a href="#file/${fileId}" class="back-link">← Back to File ${fileId}</a>
    <div class="lesson-header">
      <span class="file-num">File ${fileId} · Lesson ${lesson.letter}</span>
      <h1 style="margin-top:0.5rem">${escapeHTML(lesson.title)}</h1>
      <p class="topics"><strong>Grammar:</strong> ${escapeHTML(lesson.grammar_topic)}<br><strong>Vocabulary:</strong> ${escapeHTML(lesson.vocab_topic)}</p>
      <div class="section-tabs" id="sectionTabs">
        <button class="tab-btn active" data-section="grammar">📐 Grammar <span class="count">${lesson.grammar.length}</span></button>
        <button class="tab-btn" data-section="vocabulary">📚 Vocabulary <span class="count">${lesson.vocabulary.length}</span></button>
        <button class="tab-btn" data-section="mixed">🎲 Mixed practice <span class="count">${lesson.mixed.length}</span></button>
        <button class="tab-btn" data-section="all">📋 All <span class="count">${lesson.grammar.length + lesson.vocabulary.length + lesson.mixed.length}</span></button>
      </div>
    </div>
    <div id="exerciseContainer"></div>
    <div class="text-center mt-3" id="completionArea" style="display:none">
      <p class="text-muted">You have finished this lesson! 🎉</p>
      <button class="btn btn-success" id="markComplete">Mark as completed</button>
      <a href="#file/${fileId}" class="btn btn-secondary" style="margin-left:0.5rem">Back to File</a>
    </div>
  `;

  let answered = 0;
  const total = lesson.grammar.length + lesson.vocabulary.length + lesson.mixed.length;
  const showCompletion = () => {
    if (answered >= total) $('#completionArea').style.display = 'block';
  };

  const renderSection = (section) => {
    const c = $('#exerciseContainer');
    c.innerHTML = '';
    answered = 0;
    $('#completionArea').style.display = 'none';
    const items = section === 'all'
      ? [
          ...lesson.grammar.map(q => ({ ...q, _section: 'grammar' })),
          ...lesson.vocabulary.map(q => ({ ...q, _section: 'vocabulary' })),
          ...lesson.mixed.map(q => ({ ...q, _section: 'mixed' })),
        ]
      : lesson[section].map(q => ({ ...q, _section: section }));
    items.forEach((q, idx) => {
      Exercises.render(q, idx, c);
    });
    // Listen for answers
    c.addEventListener('answered', e => {
      answered++;
      const { correct, qIdx } = e.detail;
      const item = items[qIdx];
      const sectionKey = item._section;
      STATE = Storage.recordAnswer(STATE, fileId, lessonLetter, sectionKey, qIdx, correct);
      updateHeaderStats();
      if (correct) showToast('+10 points ⭐', 'success');
      showCompletion();
    });
  };

  $$('.tab-btn[data-section]').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.tab-btn[data-section]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSection(btn.dataset.section);
    });
  });

  $('#markComplete')?.addEventListener('click', () => {
    STATE = Storage.markCompleted(STATE, fileId, lessonLetter);
    showToast('Lesson marked as completed ✅', 'success');
    Router.navigate('file/' + fileId);
  });

  renderSection('grammar');
}

// --- PRACTICE HUB ---
function renderPractice(params) {
  const view = $('#mainView');
  if (params[0] === 'file') {
    const fileId = params[1];
    const file = Files.find(f => f.id === fileId);
    if (!file) { Router.navigate('home'); return; }
    return startMixedPractice(file, 'file');
  }
  if (params[0] === 'review' || params[0] === 'wrong') {
    return startWrongReview();
  }
  if (params[0] === 'all') {
    return startAllPractice();
  }
  if (params[0] === 'vocabulary') {
    view.innerHTML = `
      <a href="#practice" class="back-link">← Back to Practice</a>
      <div class="lesson-header">
        <span class="file-num">Vocabulary practice</span>
        <h1 style="margin-top:0.5rem">Vocabulary</h1>
        <p class="topics">Choose a category to practise useful English words.</p>
      </div>
      <div class="vocabulary-menu vocabulary-menu-expanded">
        <button class="vocabulary-card" data-vocabulary="food" type="button">
          <span class="vocabulary-emoji">🍽️</span>
          <span>Food</span>
        </button>
        <button class="vocabulary-card" data-vocabulary="numbers" type="button">
          <span class="vocabulary-emoji">🔢</span>
          <span>Numbers</span>
        </button>
      </div>
    `;
    $$('.vocabulary-card', view).forEach(card => card.addEventListener('click', () => {
      Router.navigate('vocabulary/' + card.dataset.vocabulary);
    }));
    return;
  }
  // Hub
  view.innerHTML = `
    <h1 class="section-title">🎯 Practice modes</h1>
    <p class="text-muted">Choose how you would like to practice today.</p>
    <div class="practice-modes">
      <div class="practice-mode" data-mode="all">
        <div class="practice-mode-icon">🌍</div>
        <h3>Global practice</h3>
        <p>60 different random questions from all Files. Ideal for general review.</p>
      </div>
      <div class="practice-mode" data-mode="wrong">
        <div class="practice-mode-icon">🔁</div>
        <h3>Review mistakes (${STATE.wrongQuestions.length})</h3>
        <p>Questions you have answered incorrectly. The more you miss them, the more often they will appear.</p>
      </div>
      ${Files.map(f => `
        <div class="practice-mode" data-mode="file" data-file="${f.id}">
          <div class="practice-mode-icon">📘</div>
          <h3>File ${f.id}: ${escapeHTML(f.title)}</h3>
          <p>Questions from this File only. Recommended when finishing a level.</p>
        </div>
      `).join('')}
    </div>
    <section class="grammar-practice-section">
        <h2 class="section-title">🗂️ VOCABULARY</h2>
        <button class="grammar-practice-card" id="openVocabularyPractice" type="button">
        <span class="vocabulary-emoji" aria-hidden="true">🗂️</span>
        <span>
          <strong>Vocabulary</strong>
          <small>Practise useful English words with food and numbers.</small>
        </span>
        <span aria-hidden="true">→</span>
      </button>
    </section>
    <section class="grammar-practice-section">
      <h2 class="section-title">📐 GRAMMAR PRACTICE</h2>
      <button class="grammar-practice-card" id="openGrammarPractice" type="button">
        <span class="vocabulary-emoji">✍️</span>
        <span>
          <strong>Grammar Practice</strong>
          <small>Practice all 12 grammar topics and their subtopics.</small>
        </span>
        <span aria-hidden="true">→</span>
      </button>
    </section>
    <section class="grammar-practice-section">
      <h2 class="section-title">📖 READING</h2>
      <button class="grammar-practice-card" id="openReadingPractice" type="button">
        <span class="vocabulary-emoji" aria-hidden="true">📖</span>
        <span>
          <strong>Reading</strong>
          <small>Read ten passages at each level and answer comprehension questions.</small>
        </span>
        <span aria-hidden="true">→</span>
      </button>
    </section>
    <section class="grammar-practice-section">
      <h2 class="section-title">✍️ WRITING</h2>
      <button class="grammar-practice-card" id="openWritingPractice" type="button">
        <span class="vocabulary-emoji" aria-hidden="true">✍️</span>
        <span>
          <strong>Writing</strong>
          <small>Translate Spanish sentences into English at your level.</small>
        </span>
        <span aria-hidden="true">→</span>
      </button>
    </section>
  `;
  $$('.practice-mode').forEach(el => {
    el.addEventListener('click', () => {
      const mode = el.dataset.mode;
      if (mode === 'all') Router.navigate('practice/all');
      else if (mode === 'wrong') Router.navigate('practice/wrong');
      else if (mode === 'file') Router.navigate('practice/file/' + el.dataset.file);
    });
  });
  const openVocabularyPractice = $('#openVocabularyPractice');
  if (openVocabularyPractice) {
    openVocabularyPractice.addEventListener('click', () => Router.navigate('practice/vocabulary'));
  }
  $('#openGrammarPractice').addEventListener('click', () => Router.navigate('grammar-practice'));
  $('#openReadingPractice').addEventListener('click', () => Router.navigate('reading'));
  $('#openWritingPractice').addEventListener('click', () => Router.navigate('writing'));
}

const GRAMMAR_EXERCISE_TYPES = [
  { key: 'write', title: 'Write the answer', description: 'Type the missing word or phrase.', matches: question => question.type === 'fill' },
  { key: 'comparative-sentences', title: 'Complete comparative sentences', description: 'Complete each sentence with the comparative adjective.', matches: question => question.type === 'comparative-sentence' },
  { key: 'comparative-forms', title: 'Write comparative adjective forms', description: 'Write the comparative form of each adjective. Includes 40 adjectives.', matches: question => question.type === 'comparative-form' },
  { key: 'conversation', title: 'Complete the Questions in the Conversation', description: 'Read the conversation and fill in the missing words.', matches: question => question.type === 'conversation' },
  { key: 'choice', title: 'Choose an answer', description: 'Select the correct option or true/false answer.', matches: question => question.type === 'mc' || question.type === 'tf' },
  { key: 'order', title: 'Put the words in order', description: 'Arrange the words to build the sentence.', matches: question => question.type === 'reorder' },
  { key: 'match', title: 'Match the pairs', description: 'Connect each item with its matching pair.', matches: question => question.type === 'match' },
];

const GRAMMAR_CONVERSATIONS = {
  '0-0': [[['Who is your new classmate?', 'Her name is Maya.']]],
  '0-1': [[['Are you at home now?', 'No, I am at the library.']]],
  '0-2': [[['Whose jacket is this?', 'It is Daniel’s jacket.']]],
  '1-0': [[['How many boxes are there?', 'There are four boxes.']]],
  '1-1': [[['What is the new classroom like?', 'It is bright and comfortable.']]],
  '1-2': [[['What should I do with this form?', 'Write your name at the top.']]],
  '2-0': [[['When does the swimming pool open?', 'It opens at half past six.']]],
  '2-1': [[['What does your cousin do?', 'He designs websites for a small company.']]],
  '2-2': [
    [
      ['Who do you share your apartment with?', 'I share it with my friend Lena.', 'Who ___ you share your apartment with?', ['do']],
      ['What does Lena do?', 'She studies architecture at college.', 'What ___ Lena ___?', ['does', 'do']],
      ['Where does she study?', 'At Northside College, near the river.', 'Where ___ she ___?', ['does', 'study']],
      ['What does she like about her course?', 'She enjoys designing small houses.', 'What ___ she ___ about her course?', ['does', 'like']],
      ['What does Lena do after class?', 'She usually visits the studio and works on models.', 'What ___ Lena ___ after class?', ['does', 'do']],
      ['Is the course difficult?', 'Sometimes, but she says it is interesting.', 'Is the course ___?', ['difficult']],
      ['Does she use a computer for her projects?', 'Yes, she does. She draws plans on it.', '___ she ___ a computer for her projects?', ['Does', 'use']],
      ['What do you do in the evening?', 'I cook dinner and practise the guitar.', 'What ___ you ___ in the evening?', ['do', 'do']],
    ],
    [
      ['How many projects does Lena have this term?', 'She has three projects.', 'How many projects ___ Lena have this term?', ['does']],
      ['What do the students do at lunch?', 'They eat in the garden.', 'What ___ the students do at lunch?', ['do']],
    ],
    [
      ['How busy is the studio?', 'It is very busy on Thursdays.', 'How busy ___ the studio?', ['is']],
      ['Where does Lena go on Fridays?', 'She meets her classmates at a café.', 'Where ___ Lena go on Fridays?', ['does']],
    ],
    [
      ['What time does your class finish?', 'It finishes at four o’clock.', 'What time ___ your class finish?', ['does']],
      ['What does Lena carry in her backpack?', 'She carries a sketchbook and a laptop.', 'What ___ Lena carry in her backpack?', ['does']],
    ],
    [
      ['Do you take the bus to college?', 'Yes, I do. It stops outside the library.', '___ you take the bus to college?', ['Do']],
      ['What kind of music does Lena listen to?', 'She listens to jazz while she draws.', 'What kind of music ___ Lena listen to?', ['does']],
      ['Where do your classmates meet?', 'They meet in the design room.', 'Where ___ your classmates meet?', ['do']],
      ['How does Lena travel home?', 'She cycles when the weather is warm.', 'How ___ Lena travel home?', ['does']],
    ],
  ],
  '3-0': [[['Whose keys are these?', 'They are my brother’s keys.']]],
  '3-1': [[['When is your appointment?', 'It is on Friday at ten.']]],
  '3-2': [[['How often do you exercise?', 'I go swimming twice a week.']]],
  '4-0': [[['Can your sister drive?', 'Yes, she can.']]],
  '4-1': [[['What are you doing right now?', 'I am writing an email.']]],
  '4-2': [[['Do you usually work at home?', 'Yes, but today I am at the office.']]],
  '5-0': [[['Who did you invite to dinner?', 'I invited my neighbours.']]],
  '5-1': [[['What do you enjoy doing after work?', 'I enjoy painting.']]],
  '5-2': [[['Does your brother work here?', 'No, he studies here.']]],
  '6-0': [[['Where were you last night?', 'I was at home.']]],
  '6-1': [[['What did you clean yesterday?', 'I cleaned the kitchen.']]],
  '6-2': [[['Did you call the hotel?', 'Yes, I called and left a message.']]],
  '7-0': [[['What did you buy at the market?', 'I bought some fresh fruit.']]],
  '7-1': [[['Is there a pharmacy near here?', 'Yes, there is one on King Street.']]],
  '7-2': [[['Were there any cafés near the station?', 'Yes, there were two.']]],
  '8-0': [[['Is there any yoghurt in the fridge?', 'Yes, there is a small pot.']]],
  '8-1': [[['How many tickets should I book?', 'Please book four.']]],
  '8-2': [[['Which room is brighter?', 'The room upstairs is brighter.']]],
  '9-0': [[['What is the tallest building in town?', 'The new one on Main Street.']]],
  '9-1': [[['What are you going to do this weekend?', 'I am going to visit my cousin.']]],
  '9-2': [[['Why is Nina taking an umbrella?', 'It is going to rain.']]],
  '10-0': [[['How does your teacher speak?', 'She speaks clearly.']]],
  '10-1': [[['What do you want to do next year?', 'I want to learn to drive.']]],
  '10-2': [[['What do you listen to in the car?', 'I listen to the radio.']]],
  '11-0': [[['Have you ever visited Rome?', 'Yes, I have.']]],
  '11-1': [[['When did you visit Rome?', 'I went there last summer.']]],
  '11-2': [[['What have the guests done?', 'They have booked a table.']]],
};

const GRAMMAR_QUESTION_ORDER = {
  '0-0': ['Who is your new teacher?'],
  '0-1': ['Where are your friends now?'],
  '0-2': ['Whose phone is this?'],
  '1-0': ['How many children are in the class?'],
  '1-1': ['Is the new house very comfortable?'],
  '1-2': ['How do you spell your surname?'],
  '2-0': ['What time does the swimming pool open?'],
  '2-1': ['Where does your cousin design websites?'],
  '2-2': [
    'How many models does Lena build this month?',
    'How busy is the design studio?',
    'What colour is her sketchbook?',
    'Where does Lena study architecture?',
    'Do you take the bus to college?',
    'What kind of music does Lena listen to?',
    'What does she do after class?',
    'Are the design classes interesting?',
    'Where do her classmates meet?',
    'How does Lena travel home?',
  ],
  '3-0': ['Whose coat is hanging by the door?'],
  '3-1': ['When does the film start?'],
  '3-2': ['How often do you visit your grandparents?'],
  '4-0': ['Can your brother play the guitar?'],
  '4-1': ['What are the children doing outside?'],
  '4-2': ['Are you studying now or working?'],
  '5-0': ['Who did you see at the station?'],
  '5-1': ['What does your friend enjoy doing?'],
  '5-2': ['Does your sister live nearby?'],
  '6-0': ['Were you at school yesterday?'],
  '6-1': ['When did the lesson finish?'],
  '6-2': ['What did you do after work?'],
  '7-0': ['Where did they go last weekend?'],
  '7-1': ['Are there any clean cups in the kitchen?'],
  '7-2': ['How many shops were there in the village?'],
  '8-0': ['Would you like some vegetable soup?'],
  '8-1': ['How many postcards did Mia send?'],
  '8-2': ['Which room is brighter?'],
  '9-0': ['What is the most beautiful place you have visited?'],
  '9-1': ['Where are you going to stay in London?'],
  '9-2': ['What is going to happen next?'],
  '10-0': ['How carefully does she drive?'],
  '10-1': ['What do you need to bring?'],
  '10-2': ['Does the radio work without the internet?'],
  '11-0': ['Have you ever eaten Thai food?'],
  '11-1': ['When did you last see your friend?'],
  '11-2': ['What have the students learned this week?'],
};

function createGrammarConversationExercise(pairs) {
  const turns = [];
  pairs.forEach(([question, reply, cloze, missingWords]) => {
    const firstWord = /^(How many|How much|How often|How long|What time|What kind of|How old|What|Where|When|Who|Whose|Why|How|Is|Are|Am|Was|Were|Do|Does|Did|Can|Could|Will|Would|Have|Has|Had)\b/i.exec(question)?.[0];
    const template = cloze || (firstWord ? question.replace(firstWord, '___') : question);
    const answers = missingWords || (firstWord ? [firstWord] : []);
    turns.push({ speaker: 'A', text: template, answers });
    turns.push({ speaker: 'B', text: reply });
  });
  return {
    type: 'conversation',
    prompt: 'Complete the questions in the conversation.',
    turns,
    answer: turns.flatMap(turn => turn.answers || []),
    explanation: 'Use the reply and the grammar to fill in the missing words.',
  };
}

function grammarQuestionCount(questions, typeKey) {
  const exerciseType = GRAMMAR_EXERCISE_TYPES.find(type => type.key === typeKey);
  return questions.filter(exerciseType.matches).length;
}

function collectGrammarSentenceSeeds(topicIndex, sectionIndex, questions) {
  const seeds = [];
  const add = value => {
    if (typeof value !== 'string') return;
    const sentence = value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    if (sentence && !sentence.includes('___') && !seeds.some(seed => seed.toLowerCase() === sentence.toLowerCase())) {
      seeds.push(sentence);
    }
  };
  const addTheoryExamples = section => (section.examples || []).forEach(([sentence]) => add(sentence));
  const section = GrammarTheory[topicIndex].sections[sectionIndex];
  addTheoryExamples(section);
  questions.forEach(question => {
    if (question.type === 'fill') {
      const answers = Array.isArray(question.answer) ? question.answer : [question.answer];
      let answerIndex = 0;
      add(question.prompt.replace(/___/g, () => String(answers[answerIndex++] || '')));
    } else if (question.type === 'reorder') {
      add(question.words.join(' '));
    } else if (question.type === 'mc') {
      add(question.answerText || question.options[question.answer]);
    } else if (question.type === 'conversation') {
      question.turns.forEach(turn => add(turn.text));
    }
  });
  GrammarTheory[topicIndex].sections.forEach((sibling, siblingIndex) => {
    if (siblingIndex !== sectionIndex && seeds.length < 18) addTheoryExamples(sibling);
  });
  for (const topic of GrammarTheory) {
    topic.sections.forEach(addTheoryExamples);
  }
  return seeds.filter(sentence => sentence.split(/\s+/).length >= 3);
}

function createGrammarClozeCandidates(sentences) {
  const candidates = [];
  const seen = new Set();
  sentences.forEach(sentence => {
    const words = sentence.split(/\s+/);
    words.forEach((word, wordIndex) => {
      const answer = word.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9'’%-]+$/g, '');
      if (!answer) return;
      const cloze = [...words];
      cloze[wordIndex] = '___';
      const prompt = `Complete the sentence: ${cloze.join(' ')}`;
      const key = prompt.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      candidates.push({ prompt, answer });
    });
  });
  return candidates;
}

function createGrammarConversationVariants(conversationSets, needed) {
  const variants = [];
  const seen = new Set();
  for (const conversation of conversationSets) {
    for (const [question, reply] of conversation) {
      const words = question.split(/\s+/);
      for (let size = 1; size <= Math.min(3, words.length - 1); size += 1) {
        const choose = (start, indexes) => {
          if (indexes.length === size) {
            const clozeWords = [...words];
            const answers = indexes.map(index => words[index].replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9'’%-]+$/g, ''));
            indexes.forEach(index => { clozeWords[index] = '___'; });
            const cloze = clozeWords.join(' ');
            if (seen.has(cloze.toLowerCase())) return false;
            seen.add(cloze.toLowerCase());
            variants.push(createGrammarConversationExercise([[question, reply, cloze, answers]]));
            return variants.length >= needed;
          }
          for (let index = start; index <= words.length - (size - indexes.length); index += 1) {
            indexes.push(index);
            if (choose(index + 1, indexes)) return true;
            indexes.pop();
          }
          return false;
        };
        if (choose(0, [])) return variants;
      }
    }
  }
  const contextPrefixes = ['Please tell me: ', 'One more question: ', 'I have another question: '];
  for (const conversation of conversationSets) {
    for (const [question, reply] of conversation) {
      for (const prefix of contextPrefixes) {
        const words = question.split(/\s+/);
        for (let index = 0; index < words.length; index += 1) {
          const clozeWords = [...words];
          const answer = clozeWords[index].replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9'’%-]+$/g, '');
          clozeWords[index] = '___';
          const cloze = `${prefix}${clozeWords.join(' ')}`;
          if (seen.has(cloze.toLowerCase())) continue;
          seen.add(cloze.toLowerCase());
          variants.push(createGrammarConversationExercise([[question, reply, cloze, [answer]]]));
          if (variants.length >= needed) return variants;
        }
      }
    }
  }
  return variants;
}

function createGrammarSupplementalExercises(topicIndex, sectionIndex, questions, conversationSets) {
  const supplemental = [];
  const seeds = collectGrammarSentenceSeeds(topicIndex, sectionIndex, questions);
  const clozeCandidates = createGrammarClozeCandidates(seeds);

  const missingFill = Math.max(0, 10 - grammarQuestionCount(questions, 'write'));
  clozeCandidates.slice(0, missingFill).forEach(candidate => {
    supplemental.push({
      type: 'fill',
      prompt: candidate.prompt,
      answer: candidate.answer,
      explanation: 'Use the grammar pattern in this subtopic.',
    });
  });

  const missingChoice = Math.max(0, 10 - grammarQuestionCount(questions, 'choice'));
  const distractorPool = [...new Set(clozeCandidates.map(candidate => candidate.answer.toLowerCase()))];
  const fallbackOptions = ['am', 'is', 'are', 'do', 'does', 'did', 'was', 'were', 'have', 'has', 'a', 'an', 'some', 'any', 'in', 'on', 'at', 'to', 'my', 'your'];
  for (let index = 0; index < missingChoice; index += 1) {
    const candidate = clozeCandidates[index % clozeCandidates.length];
    const correct = candidate.answer;
    const options = [correct];
    [...distractorPool, ...fallbackOptions].forEach(option => {
      if (options.length < 4 && !options.some(existing => existing.toLowerCase() === option.toLowerCase())) options.push(option);
    });
    const correctIndex = index % options.length;
    [options[0], options[correctIndex]] = [options[correctIndex], options[0]];
    supplemental.push({
      type: 'mc',
      prompt: candidate.prompt,
      options,
      answer: correctIndex,
      answerText: correct,
      explanation: 'Choose the word that correctly completes the sentence.',
    });
  }

  const existingConversationCount = grammarQuestionCount(questions, 'conversation');
  const missingConversations = Math.max(0, 10 - existingConversationCount);
  supplemental.push(...createGrammarConversationVariants(conversationSets, missingConversations));

  const existingOrderCount = grammarQuestionCount(questions, 'order');
  let missingOrder = Math.max(0, 10 - existingOrderCount);
  const existingOrderedSentences = new Set(questions
    .filter(question => question.type === 'reorder')
    .map(question => question.words.join(' ').toLowerCase()));
  for (const sentence of seeds) {
    if (!missingOrder) break;
    if (existingOrderedSentences.has(sentence.toLowerCase())) continue;
    const words = sentence.split(/\s+/);
    if (words.length < 3) continue;
    existingOrderedSentences.add(sentence.toLowerCase());
    supplemental.push({
      type: 'reorder',
      prompt: 'Put the words in order to make a sentence:',
      words,
    });
    missingOrder -= 1;
  }

  const missingMatches = Math.max(0, 10 - grammarQuestionCount(questions, 'match'));
  const matchCandidates = [];
  const seenMatchAnswers = new Set();
  clozeCandidates.forEach(candidate => {
    const answerKey = candidate.answer.toLowerCase();
    if (!seenMatchAnswers.has(answerKey)) {
      seenMatchAnswers.add(answerKey);
      matchCandidates.push([candidate.prompt.replace('Complete the sentence: ', ''), candidate.answer]);
    }
  });
  for (let index = 0; index < missingMatches; index += 1) {
    const pairs = [];
    for (let offset = 0; offset < matchCandidates.length && pairs.length < 4; offset += 1) {
      const pair = matchCandidates[(index + offset) % matchCandidates.length];
      if (!pairs.some(existing => existing[1].toLowerCase() === pair[1].toLowerCase())) pairs.push(pair);
    }
    if (pairs.length >= 2) {
      supplemental.push({
        type: 'match',
        prompt: 'Match each sentence with its missing word.',
        pairs,
        explanation: 'Each word completes one of the sentences.',
      });
    }
  }

  return supplemental;
}

function getGrammarSectionQuestions(topicIndex, sectionIndex) {
  const key = `${topicIndex}-${sectionIndex}`;
  const source = GRAMMAR_PRACTICE_SOURCES[topicIndex][sectionIndex];
  let questions = [];
  if (source) {
    const [fileId, lessonLetter] = source;
    const lesson = Files.find(file => file.id === fileId)?.lessons.find(item => item.letter === lessonLetter);
    questions = (lesson?.grammar || []).map((question, qIdx) => ({
      ...question,
      _ref: { file: fileId, lesson: lessonLetter, section: 'grammar', qIdx },
    }));
  } else {
    questions = GRAMMAR_PRACTICE_QUESTIONS[key] || [];
  }
  const conversations = (GRAMMAR_CONVERSATIONS[key] || []).map(createGrammarConversationExercise);
  const orderedQuestions = (GRAMMAR_QUESTION_ORDER[key] || []).map(sentence => {
    const words = sentence.split(' ');
    words[words.length - 1] = `${words[words.length - 1].replace(/\?$/, '')}?`;
    return {
      type: 'reorder',
      prompt: 'Put the words in order to make a question:',
      words,
    };
  });
  const sectionQuestions = [...questions, ...conversations, ...orderedQuestions];
  if (topicIndex === 8 && sectionIndex === 2) {
    sectionQuestions.push(
      ...COMPARATIVE_SENTENCE_QUESTIONS,
      ...COMPARATIVE_ADJECTIVE_QUESTIONS.map(([adjective, comparative]) => ({
        type: 'comparative-form',
        prompt: `Write the comparative form of: <strong>${escapeHTML(adjective)}</strong> → ___`,
        answer: comparative,
      }))
    );
  }
  return [
    ...sectionQuestions,
    ...createGrammarSupplementalExercises(
      topicIndex,
      sectionIndex,
      sectionQuestions,
      GRAMMAR_CONVERSATIONS[key] || []
    ),
  ];
}

function renderGrammarPractice(params = []) {
  const view = $('#mainView');
  const topicIndex = params.length ? Number(params[0]) : NaN;
  if (params.length && (!Number.isInteger(topicIndex) || !GrammarTheory[topicIndex])) {
    Router.navigate('practice');
    return;
  }

  if (params.length > 1) {
    const sectionIndex = Number(params[1]);
    if (!Number.isInteger(sectionIndex) || !GrammarTheory[topicIndex].sections[sectionIndex]) {
      Router.navigate(`grammar-practice/${topicIndex}`);
      return;
    }
    if (params.length > 3) {
      Router.navigate(`grammar-practice/${topicIndex}/${sectionIndex}`);
      return;
    }
    if (params.length > 2) {
      const exerciseType = GRAMMAR_EXERCISE_TYPES.find(type => type.key === params[2]);
      if (!exerciseType) {
        Router.navigate(`grammar-practice/${topicIndex}/${sectionIndex}`);
        return;
      }
      startGrammarTypePractice(topicIndex, sectionIndex, exerciseType);
      return;
    }
  }

  if (!params.length) {
    view.innerHTML = `
      <a href="#practice" class="back-link">← Back to Practice</a>
      <div class="lesson-header">
        <span class="file-num">Grammar practice</span>
        <h1 style="margin-top:0.5rem">GRAMMAR PRACTICE</h1>
        <p class="topics">Choose one of the 12 topics to view its three subtopics and practice.</p>
      </div>
      <div class="grammar-practice-grid">
        ${GrammarTheory.map((topic, index) => `
          <button class="grammar-practice-card" type="button" data-topic-index="${index}">
            <strong>${escapeHTML(topic.title)}</strong>
            <small>${escapeHTML(topic.focus)}</small>
            <span>View subtopics →</span>
          </button>
        `).join('')}
      </div>
    `;
    $$('.grammar-practice-card[data-topic-index]', view).forEach(button => {
      button.addEventListener('click', () => Router.navigate(`grammar-practice/${button.dataset.topicIndex}`));
    });
    return;
  }

  const topic = GrammarTheory[topicIndex];
  if (params.length > 1) {
    const section = topic.sections[Number(params[1])];
    const questions = getGrammarSectionQuestions(topicIndex, Number(params[1]));
    const availableTypes = GRAMMAR_EXERCISE_TYPES
      .map(type => ({ ...type, questions: questions.filter(type.matches) }))
      .filter(type => type.questions.length);
    if (!availableTypes.length) {
      console.error(`No exercises are configured for ${section.title}.`);
      showToast('No exercises are configured for this subtopic.', 'error');
      Router.navigate(`grammar-practice/${topicIndex}`);
      return;
    }
    view.innerHTML = `
      <a href="#grammar-practice/${topicIndex}" class="back-link">← Back to Topic ${topicIndex + 1}</a>
      <div class="lesson-header">
        <span class="file-num">Grammar Practice · ${escapeHTML(section.title.split(' · ')[0])}</span>
        <h1 style="margin-top:0.5rem">${escapeHTML(section.title)}</h1>
        <p class="topics">Choose an exercise type to begin. You will answer one question at a time.</p>
      </div>
      <div class="grammar-practice-grid">
        ${availableTypes.map(type => `
          <button class="grammar-practice-card" type="button" data-exercise-type="${type.key}">
            <strong>${escapeHTML(type.title)}</strong>
            <small>${escapeHTML(type.description)}</small>
            <span>${type.questions.length} ${type.questions.length === 1 ? 'question' : 'questions'} · Start →</span>
          </button>
        `).join('')}
      </div>
    `;
    $$('.grammar-practice-card[data-exercise-type]', view).forEach(button => {
      button.addEventListener('click', () => Router.navigate(`grammar-practice/${topicIndex}/${params[1]}/${button.dataset.exerciseType}`));
    });
    return;
  }

  view.innerHTML = `
    <a href="#grammar-practice" class="back-link">← Back to Grammar Practice</a>
    <div class="lesson-header">
      <span class="file-num">Grammar Practice · Topic ${topicIndex + 1}</span>
      <h1 style="margin-top:0.5rem">${escapeHTML(topic.title)}</h1>
      <p class="topics">${escapeHTML(topic.focus)}</p>
    </div>
    <div class="grammar-practice-grid">
      ${topic.sections.map((section, sectionIndex) => `
        <button class="grammar-practice-card" type="button" data-section-index="${sectionIndex}">
          <strong>${escapeHTML(section.title)}</strong>
          <small>${escapeHTML(section.intro)}</small>
          <span>Start exercises →</span>
        </button>
      `).join('')}
    </div>
  `;
  $$('.grammar-practice-card[data-section-index]', view).forEach(button => {
    button.addEventListener('click', () => Router.navigate(`grammar-practice/${topicIndex}/${button.dataset.sectionIndex}`));
  });
}

function startGrammarTypePractice(topicIndex, sectionIndex, exerciseType) {
  const topic = GrammarTheory[topicIndex];
  const section = topic.sections[sectionIndex];
  let questions = getGrammarSectionQuestions(topicIndex, sectionIndex).filter(exerciseType.matches);
  if (!questions.length) {
    console.error(`No ${exerciseType.key} exercises are configured for ${section.title}.`);
    showToast('No exercises are configured for this exercise type.', 'error');
    Router.navigate(`grammar-practice/${topicIndex}/${sectionIndex}`);
    return;
  }
  questions = questions.map(question => ({ ...question }));
  const route = `#grammar-practice/${topicIndex}/${sectionIndex}/${exerciseType.key}`;
  const view = $('#mainView');
  let currentIndex = 0;
  let correctCount = 0;
  let advanceTimeout = null;
  const cancelAdvanceOnNavigation = () => {
    if (window.location.hash !== route) {
      if (advanceTimeout) {
        clearTimeout(advanceTimeout);
        advanceTimeout = null;
      }
      window.removeEventListener('hashchange', cancelAdvanceOnNavigation);
    }
  };
  window.addEventListener('hashchange', cancelAdvanceOnNavigation);

  const showSummary = () => {
    view.innerHTML = `
      <a href="#grammar-practice/${topicIndex}/${sectionIndex}" class="back-link">← Back to Exercise Types</a>
      <div class="lesson-header text-center">
        <div style="font-size:3rem">🎉</div>
        <h1>${escapeHTML(exerciseType.title)} complete!</h1>
        <p class="topics">${escapeHTML(section.title)}</p>
        <p style="font-size:1.5rem; color:var(--primary); font-weight:700;">${correctCount} / ${questions.length} correct</p>
        <div class="mt-2">
          <button class="btn" type="button" id="grammarPracticeRetry">🔁 Try again</button>
          <a href="#grammar-practice/${topicIndex}/${sectionIndex}" class="btn btn-secondary">Back to Exercise Types</a>
        </div>
      </div>
    `;
    $('#grammarPracticeRetry').addEventListener('click', () => Router.navigate(route));
  };

  const renderQuestion = () => {
    if (advanceTimeout) {
      clearTimeout(advanceTimeout);
      advanceTimeout = null;
    }
    if (currentIndex >= questions.length) {
      showSummary();
      return;
    }
    const question = questions[currentIndex];
    view.innerHTML = `
      <a href="#grammar-practice/${topicIndex}/${sectionIndex}" class="back-link">← Back to Exercise Types</a>
      <div class="lesson-header">
        <span class="file-num">${escapeHTML(section.title.split(' · ')[0])} · ${escapeHTML(exerciseType.title)}</span>
        <h1 style="margin-top:0.5rem">${escapeHTML(section.title)}</h1>
        <button class="btn btn-secondary" id="grammarPracticeShuffle" type="button">🔀 Shuffle and restart</button>
      </div>
      <div class="vocabulary-progress-bar">
        <span>Progress</span>
        <strong>${currentIndex + 1} / ${questions.length}</strong>
      </div>
      <div class="grammar-practice-question" id="grammarPracticeQuestion"></div>
      <div class="exercise-actions">
        <button class="btn btn-secondary" id="grammarPracticeNextQuestion" type="button">${currentIndex === questions.length - 1 ? 'Finish practice' : 'Next question'}</button>
      </div>
      <div class="exercise-actions hidden" id="grammarPracticeRetryActions">
        <button class="btn" type="button" id="grammarPracticeRetryQuestion">Try again</button>
      </div>
    `;
    const questionContainer = $('#grammarPracticeQuestion');
    Exercises.render(question, currentIndex, questionContainer);
    $('#grammarPracticeNextQuestion').addEventListener('click', () => {
      currentIndex += 1;
      renderQuestion();
    });
    $('#grammarPracticeShuffle').addEventListener('click', () => {
      for (let index = questions.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [questions[index], questions[swapIndex]] = [questions[swapIndex], questions[index]];
      }
      currentIndex = 0;
      correctCount = 0;
      renderQuestion();
    });
    questionContainer.addEventListener('answered', event => {
      const { correct } = event.detail;
      if (question._ref) {
        STATE = Storage.recordAnswer(
          STATE,
          question._ref.file,
          question._ref.lesson,
          question._ref.section,
          question._ref.qIdx,
          correct
        );
        updateHeaderStats();
        if (correct) showToast('+10 points ⭐', 'success');
      }
      if (correct) {
        correctCount += 1;
        advanceTimeout = setTimeout(() => {
          advanceTimeout = null;
          if (window.location.hash !== route) return;
          currentIndex += 1;
          renderQuestion();
        }, 900);
      } else {
        $('#grammarPracticeRetryActions').classList.remove('hidden');
        $('#grammarPracticeRetryQuestion').addEventListener('click', renderQuestion, { once: true });
      }
    }, { once: true });
  };

  renderQuestion();
}

function startAllPractice() {
  const all = [];
  Files.forEach(f => f.lessons.forEach(l => {
    [...l.grammar, ...l.vocabulary, ...l.mixed].forEach((q, i) => {
      all.push({ ...q, _ref: { file: f.id, lesson: l.letter, section: 'all', qIdx: i } });
    });
  }));
  const uniqueQuestions = new Map();
  all.forEach(question => {
    const content = { ...question };
    delete content._ref;
    const key = JSON.stringify(content);
    if (!uniqueQuestions.has(key)) uniqueQuestions.set(key, question);
  });
  const shuffled = [...uniqueQuestions.values()].sort(() => Math.random() - 0.5).slice(0, 60);
  startSession('Global Practice', shuffled, { mode: 'global' });
}

function startWrongReview() {
  if (STATE.wrongQuestions.length === 0) {
    const view = $('#mainView');
    view.innerHTML = `
      <h1 class="section-title">🔁 Review Mistakes</h1>
      <div class="lesson-header" style="text-align:center">
        <p style="font-size:1.2rem">🎉 You have no questions to review!</p>
        <p class="text-muted">Keep practicing; questions you answer incorrectly will appear here.</p>
        <a href="#home" class="btn mt-2">Back to Home</a>
      </div>
    `;
    return;
  }
  const items = [];
  STATE.wrongQuestions.forEach(w => {
    const file = Files.find(f => f.id === w.file);
    if (!file) return;
    const lesson = file.lessons.find(l => l.letter === w.lesson);
    if (!lesson) return;
    const pool = lesson[w.section] || lesson.grammar;
    if (pool[w.qIdx]) items.push({ ...pool[w.qIdx], _ref: w });
  });
  startSession('Review Mistakes', items, { mode: 'review' });
}

function startMixedPractice(file, mode) {
  const items = [];
  file.lessons.forEach(l => {
    [...l.grammar, ...l.vocabulary, ...l.mixed].forEach((q, i) => {
      items.push({ ...q, _ref: { file: file.id, lesson: l.letter, section: 'all', qIdx: i } });
    });
  });
  items.sort(() => Math.random() - 0.5);
  startSession(`File ${file.id} — Practice`, items, { mode });
}

function startSession(title, items, opts = {}) {
  const view = $('#mainView');
  const backRoute = opts.backRoute || '#home';
  const backLabel = opts.backLabel || '← Back to Home';
  view.innerHTML = `
    <a href="${escapeHTML(backRoute)}" class="back-link">${escapeHTML(backLabel)}</a>
    <div class="lesson-header">
      <h1>${escapeHTML(title)}</h1>
      <p class="topics">${items.length} questions · Take your time; your progress is saved automatically.</p>
      <div class="mt-2">
        <button class="btn btn-secondary" id="restartBtn">🔀 Shuffle and restart</button>
        <button class="btn btn-ghost" id="exitBtn">Exit</button>
      </div>
    </div>
    <div id="exerciseContainer"></div>
    <div id="endSummary" style="display:none"></div>
  `;
  const c = $('#exerciseContainer');
  const results = [];
  items.forEach((q, idx) => {
    const exEl = document.createElement('div');
    exEl.dataset.idx = idx;
    c.appendChild(exEl);
    Exercises.render(q, idx, exEl);
  });
  c.addEventListener('answered', e => {
    const { correct, qIdx } = e.detail;
    const item = items[qIdx];
    const r = item._ref;
    if (r) {
      STATE = Storage.recordAnswer(STATE, r.file, r.lesson, r.section, qIdx, correct);
      updateHeaderStats();
      if (correct) showToast('+10 points ⭐', 'success');
    }
    results[qIdx] = correct;
  });
  // Summary at end: scroll watcher
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && entries[0].boundingClientRect.top > 0) {
      const allAnswered = results.filter(r => r !== undefined).length === items.length;
      if (allAnswered) {
        observer.disconnect();
        const correct = results.filter(Boolean).length;
        const pointsEarned = items.reduce((sum, item, index) => sum + (item._ref && results[index] ? 10 : 0), 0);
        $('#endSummary').style.display = 'block';
        $('#endSummary').innerHTML = `
        <div class="lesson-header text-center">
          <h2>🎉 Session complete!</h2>
          <p style="font-size:1.5rem; color:var(--primary); font-weight:700;">${correct} / ${items.length} correct (${Math.round(correct/items.length*100)}%)</p>
          ${pointsEarned ? `<p class="text-muted">Points earned: <strong>+${pointsEarned}</strong></p>` : ''}
          <div class="mt-2">
            <a href="${escapeHTML(backRoute)}" class="btn">${escapeHTML(backLabel.replace(/^←\s*/, ''))}</a>
            <button class="btn btn-secondary" id="repeatBtn">🔁 Try again</button>
          </div>
          </div>
        `;
        $('#repeatBtn').addEventListener('click', () => {
          if (opts.mode === 'global') startAllPractice();
          else if (opts.mode === 'review') startWrongReview();
          else if (opts.mode === 'file') {
            const file = Files.find(f => f.id === items[0]?._ref?.file);
            if (file) startMixedPractice(file, 'file');
          }
          else location.reload();
        });
      }
    }
  });
  observer.observe($('#endSummary'));

  $('#restartBtn').addEventListener('click', () => {
    if (opts.mode === 'global') startAllPractice();
    else if (opts.mode === 'review') startWrongReview();
    else if (opts.mode === 'file') {
      const file = Files.find(f => f.id === items[0]?._ref?.file);
      if (file) startMixedPractice(file, 'file');
    }
  });
  $('#exitBtn').addEventListener('click', () => Router.navigate(backRoute));
}

// --- REVIEW PAGE ---
function renderReview() {
  const view = $('#mainView');
  const wrong = STATE.wrongQuestions;
  view.innerHTML = `
    <h1 class="section-title">🔁 Review Mistakes (${wrong.length})</h1>
    ${wrong.length === 0 ? `
      <div class="lesson-header text-center">
        <p style="font-size:1.2rem">🎉 You have no mistakes to review.</p>
        <p class="text-muted">Questions you answer incorrectly are saved here automatically so you can review them.</p>
        <a href="#practice" class="btn mt-2">Go to Practice</a>
      </div>
    ` : `
      <p class="text-muted mb-2">These are the questions you answered incorrectly. Practice them until you master them.</p>
      <button class="btn mb-2" id="practiceWrong">🎯 Practice now</button>
      <button class="btn btn-ghost mb-2" id="clearWrong">🗑️ Clear list</button>
      <div class="review-list">
        ${wrong.map(w => {
          const file = Files.find(f => f.id === w.file);
          const lesson = file?.lessons.find(l => l.letter === w.lesson);
          const pool = lesson?.[w.section] || lesson?.grammar || [];
          const q = pool[w.qIdx];
          if (!q) return '';
          return `
            <div class="review-item">
              <div class="meta">
                <span>File ${w.file} · Lesson ${w.lesson} · ${w.section === 'grammar' ? 'Grammar' : w.section === 'vocabulary' ? 'Vocabulary' : 'Mixed practice'}</span>
                <span>${new Date(w.ts).toLocaleDateString()}</span>
              </div>
              <div class="q">${q.prompt}</div>
            </div>
          `;
        }).join('')}
      </div>
    `}
  `;
  $('#practiceWrong')?.addEventListener('click', () => Router.navigate('practice/wrong'));
  $('#clearWrong')?.addEventListener('click', () => {
    if (confirm('Clear the entire list of mistakes?')) {
      STATE.wrongQuestions = [];
      Storage.save(STATE);
      renderReview();
    }
  });
}

// --- STATS PAGE ---
function renderStats() {
  const view = $('#mainView');
  const totalAnswered = STATE.totalAnswered;
  const accuracy = totalAnswered > 0 ? Math.round((STATE.totalCorrect / totalAnswered) * 100) : 0;
  // Per-file accuracy
  const fileStats = Files.map(f => {
    const lp = STATE.fileProgress[f.id] || {};
    const answered = Object.values(lp).reduce((s, l) => s + l.answered, 0);
    const correct = Object.values(lp).reduce((s, l) => s + l.correct, 0);
    const totalQuestions = f.lessons.reduce(
      (sum, lesson) => sum + lesson.grammar.length + lesson.vocabulary.length + lesson.mixed.length,
      0
    );
    return {
      file: f,
      answered,
      correct,
      totalQuestions,
      completion: totalQuestions > 0 ? Math.round(answered / totalQuestions * 100) : 0,
      accuracy: answered > 0 ? Math.round(correct / answered * 100) : 0
    };
  });

  view.innerHTML = `
    <h1 class="section-title">📊 Your Progress</h1>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="label">Current streak</div>
        <div class="value">${STATE.streak} 🔥</div>
        <div class="sub">consecutive days</div>
      </div>
      <div class="stat-card">
        <div class="label">Total points</div>
        <div class="value">${STATE.points} ⭐</div>
        <div class="sub">+10 for a correct answer, -2 for a mistake</div>
      </div>
      <div class="stat-card">
        <div class="label">Questions answered</div>
        <div class="value">${totalAnswered}</div>
        <div class="sub">in total</div>
      </div>
      <div class="stat-card">
        <div class="label">Overall accuracy</div>
        <div class="value">${accuracy}%</div>
        <div class="sub">${STATE.totalCorrect} correct out of ${totalAnswered}</div>
      </div>
      <div class="stat-card">
        <div class="label">Mistakes to review</div>
        <div class="value">${STATE.wrongQuestions.length} 🔁</div>
        <div class="sub">to review</div>
      </div>
      <div class="stat-card">
        <div class="label">Exams taken</div>
        <div class="value">${STATE.examHistory.length} 🎯</div>
      </div>
    </div>
    <div class="chart">
      <h3>📈 Activity by File</h3>
      <div class="bar-chart">
        ${fileStats.map(s => `
          <div class="bar-row">
            <div class="bar-label">File ${s.file.id}</div>
            <div class="bar-track">
              <div class="bar-fill" style="width: ${s.completion}%"></div>
            </div>
            <div class="bar-value" title="${s.accuracy}% accuracy">${s.answered}/${s.totalQuestions} (${s.completion}%)</div>
          </div>
        `).join('')}
      </div>
    </div>
    ${STATE.examHistory.length > 0 ? `
      <div class="chart">
        <h3>🎯 Exam History</h3>
        <div class="bar-chart">
          ${STATE.examHistory.slice().reverse().slice(0, 10).map(e => {
            const pct = Math.round(e.score / e.total * 100);
            return `
              <div class="bar-row">
                <div class="bar-label">${new Date(e.date).toLocaleDateString()}</div>
                <div class="bar-track">
                  <div class="bar-fill" style="width: ${pct}%; background: ${pct >= 70 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--error)'}"></div>
                </div>
                <div class="bar-value">${e.score}/${e.total} (${pct}%)</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    ` : ''}
    <div class="text-center mt-3">
      <button class="btn btn-ghost" id="resetBtn">🗑️ Reset all my progress</button>
    </div>
  `;
  $('#resetBtn').addEventListener('click', () => {
    if (confirm('Are you sure? This will erase ALL your points, streaks, mistakes, and progress.')) {
      Storage.reset();
      STATE = Storage.load();
      updateHeaderStats();
      showToast('Progress reset', 'success');
      renderStats();
    }
  });
}

// --- EXAM MODE ---
function renderExam(params) {
  stopExamTimer();
  const fileId = params[0];
  const file = Files.find(f => f.id === fileId);
  if (!file) { Router.navigate('home'); return; }
  // Build a 15-question random exam
  const all = [];
  file.lessons.forEach(l => {
    [...l.grammar, ...l.vocabulary, ...l.mixed].forEach((q, i) => {
      all.push({ ...q, _ref: { file: file.id, lesson: l.letter, section: 'exam', qIdx: i } });
    });
  });
  const questions = all.sort(() => Math.random() - 0.5).slice(0, Math.min(15, all.length));
  EXAM = {
    fileId,
    questions,
    idx: 0,
    score: 0,
    answers: [],
    started: false,
    startTime: null,
    intervalId: null,
  };
  renderExamIntro();
}

function renderExamIntro() {
  const view = $('#mainView');
  view.innerHTML = `
    <div class="lesson-header text-center exam-intro">
      <div style="font-size:3rem">🎯</div>
      <h1>Exam — File ${escapeHTML(EXAM.fileId)}</h1>
      <p class="topics">${EXAM.questions.length} questions. The timer will start when you click “Start Exam”.</p>
      <div class="mt-3">
        <button class="btn" id="startExamNow">▶ Start Exam</button>
        <a href="#file/${encodeURIComponent(EXAM.fileId)}" class="btn btn-secondary">Back to File</a>
      </div>
    </div>
  `;
  $('#startExamNow').addEventListener('click', () => {
    EXAM.started = true;
    EXAM.startTime = Date.now();
    renderExamQuestion();
    EXAM.intervalId = setInterval(updateExamTimer, 1000);
  });
}

function updateExamTimer() {
  if (!EXAM || !EXAM.started || !EXAM.startTime) return;
  if (Router.current !== 'exam') {
    clearInterval(EXAM.intervalId);
    EXAM.intervalId = null;
    return;
  }
  const elapsed = Math.floor((Date.now() - EXAM.startTime) / 1000);
  const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const secs = (elapsed % 60).toString().padStart(2, '0');
  const timer = $('#examTimer');
  if (timer) timer.textContent = `⏱ ${mins}:${secs}`;
}

function stopExamTimer() {
  if (EXAM && EXAM.intervalId) {
    clearInterval(EXAM.intervalId);
    EXAM.intervalId = null;
  }
}

function renderExamQuestion() {
  if (!EXAM || !EXAM.started) return;
  const view = $('#mainView');
  const q = EXAM.questions[EXAM.idx];
  const total = EXAM.questions.length;
  const elapsed = Math.floor((Date.now() - EXAM.startTime) / 1000);
  const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const secs = (elapsed % 60).toString().padStart(2, '0');

  view.innerHTML = `
    <div class="exam-banner">
      <div>
        <strong>🎯 Exam — File ${EXAM.fileId}</strong>
        <div style="font-size:0.85rem; opacity:0.9">Question ${EXAM.idx + 1} of ${total}</div>
        <div class="exam-progress"><div class="exam-progress-fill" style="width: ${(EXAM.idx / total) * 100}%"></div></div>
      </div>
      <div class="timer" id="examTimer">⏱ ${mins}:${secs}</div>
    </div>
    <div id="examQuestion"></div>
    <div class="text-center mt-2">
      <button class="btn btn-ghost" id="exitExam">Exit Exam</button>
    </div>
  `;
  const container = $('#examQuestion');
  Exercises.render(q, EXAM.idx, container);
  container.addEventListener('answered', e => {
    const correct = e.detail.correct;
    EXAM.answers.push(correct);
    if (correct) EXAM.score++;
    setTimeout(() => {
      EXAM.idx++;
      if (EXAM.idx >= EXAM.questions.length) {
        // Finish
        stopExamTimer();
        STATE = Storage.recordExam(STATE, EXAM.score, EXAM.questions.length, 'file-' + EXAM.fileId, [EXAM.fileId]);
        STATE = Storage.updateStreak(STATE);
        STATE.points += EXAM.score * 5; // bonus for exam
        Storage.save(STATE);
        Router.navigate('exam-result');
      } else {
        renderExamQuestion();
      }
    }, 1200);
  });
  $('#exitExam').addEventListener('click', () => {
    if (confirm('Exit the exam? You will lose your current progress.')) {
      stopExamTimer();
      Router.navigate('home');
    }
  });
}

function renderExamResult() {
  const view = $('#mainView');
  const { score, questions } = EXAM;
  const total = questions.length;
  const pct = Math.round((score / total) * 100);
  let msg = '', emoji = '';
  if (pct >= 90) { msg = 'Excellent! You have mastered this level.'; emoji = '🏆'; }
  else if (pct >= 70) { msg = 'Very good! Almost perfect.'; emoji = '🎉'; }
  else if (pct >= 50) { msg = 'Good work, but a little more review would help.'; emoji = '👍'; }
  else { msg = 'You need more practice with this File.'; emoji = '💪'; }

  view.innerHTML = `
    <div class="lesson-header text-center">
      <div style="font-size:4rem">${emoji}</div>
      <h1>Exam Results</h1>
      <p style="font-size:2rem; color:var(--primary); font-weight:700;">${score} / ${total} (${pct}%)</p>
      <p class="text-muted">${msg}</p>
      <p class="text-muted">Bonus points: +${score * 5} ⭐</p>
      <div class="mt-3">
        <a href="#home" class="btn">Back to Home</a>
        <button class="btn btn-secondary" id="retakeBtn">🔁 Retake Exam</button>
        <a href="#file/${EXAM.fileId}" class="btn btn-secondary">📖 Review File</a>
      </div>
    </div>
  `;
  $('#retakeBtn').addEventListener('click', () => Router.navigate('exam/' + EXAM.fileId));
  updateHeaderStats();
}

// Start
document.addEventListener('DOMContentLoaded', init);
