// Picture vocabulary for the Dish country practice.
// Remote photos are cached by the service worker after they are first loaded online.
globalThis.FoodDishCategories = [
  {
    id: 'italy',
    country: 'Italy',
    flag: '🇮🇹',
    items: [
      {
        word: 'pizza', translation: 'pizza',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80',
        alt: 'Neapolitan pizza with tomato, mozzarella, and basil',
        imageCredit: { label: 'Photo by Aurélien Lemasson-Théobald · Unsplash', url: 'https://unsplash.com/photos/x00CzBt4Dfk', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
      {
        word: 'spaghetti', aliases: ['pasta'], translation: 'espagueti',
        image: 'https://images.unsplash.com/photo-1676471771228-c4cdbfbd2a7f?auto=format&fit=crop&w=900&q=80',
        alt: 'Spaghetti with tomato sauce and basil',
        imageCredit: { label: 'Photo by Nima Naseri · Unsplash', url: 'https://unsplash.com/photos/QSXPD_7_kuA', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
      {
        word: 'lasagna', aliases: ['lasagne'], translation: 'lasaña',
        image: 'https://images.unsplash.com/photo-1709429790175-b02bb1b19207?auto=format&fit=crop&w=900&q=80',
        alt: 'Italian lasagna layered with pasta, sauce, and cheese',
        imageCredit: { label: 'Photo by Emanuel Ekström · Unsplash', url: 'https://unsplash.com/photos/a-white-plate-topped-with-lasagna-covered-in-sauce-flEUTTwGlJQ', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
      {
        word: 'risotto', translation: 'risotto de arroz',
        image: 'https://images.unsplash.com/photo-1682428617976-f25633ed8469?auto=format&fit=crop&w=900&q=80',
        alt: 'A plate of creamy Italian risotto',
        imageCredit: { label: 'Photo by Luna Hu · Unsplash', url: 'https://unsplash.com/photos/a-white-plate-topped-with-food-on-top-of-a-table-7TaFlRyAhSQ', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
      {
        word: 'ravioli', aliases: ['raviolo'], translation: 'ravioles',
        image: 'https://images.unsplash.com/photo-1676832661871-994153cf2d93?auto=format&fit=crop&w=900&q=80',
        alt: 'A plate of Italian ravioli pasta',
        imageCredit: { label: 'Photo by Lorenzo Tomassetti · Unsplash', url: 'https://unsplash.com/photos/a-close-up-of-a-plate-of-ravioli-d-0tA02arMk', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
    ],
  },
  {
    id: 'mexico',
    country: 'Mexico',
    flag: '🇲🇽',
    items: [
      {
        word: 'tacos', aliases: ['taco'], translation: 'tacos',
        image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=900&q=80',
        alt: 'Corn tacos with fresh toppings',
        imageCredit: { label: 'Photo by Tai’s Captures · Unsplash', url: 'https://unsplash.com/photos/JiRSy0GfqPA', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
      {
        word: 'enchiladas', aliases: ['enchilada'], translation: 'enchiladas',
        image: 'https://images.unsplash.com/photo-1673925885673-15f8e48d4e7e?auto=format&fit=crop&w=900&q=80',
        alt: 'A plate of Mexican enchiladas',
        imageCredit: { label: 'Photo by gentilesco. · karolina ferretis · Unsplash', url: 'https://unsplash.com/photos/a-plate-of-food-on-a-table--_3OqGuSEfk', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
      {
        word: 'guacamole', translation: 'guacamole',
        image: 'https://images.unsplash.com/photo-1640516050694-590a128e69f6?auto=format&fit=crop&w=900&q=80',
        alt: 'A bowl of guacamole with fresh avocado',
        imageCredit: { label: 'Photo by Tangerine Newt · Unsplash', url: 'https://unsplash.com/photos/a-bowl-of-guacamole-a-slice-of-avocado-and-AKH4OVEmILc', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
      {
        word: 'quesadilla', aliases: ['quesadillas'], translation: 'quesadilla',
        image: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?auto=format&fit=crop&w=900&q=80',
        alt: 'A Mexican quesadilla filled with melted cheese',
        imageCredit: { label: 'Photo by Lottie Griffiths · Unsplash', url: 'https://unsplash.com/photos/pvTgyioFSTY', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
      {
        word: 'burrito', aliases: ['burritos'], translation: 'burrito',
        image: 'https://images.unsplash.com/photo-1722239311797-cc487371e9b0?auto=format&fit=crop&w=900&q=80',
        alt: 'A Mexican burrito wrapped in paper',
        imageCredit: { label: 'Photo by Alimentos Fotogénicos · Unsplash', url: 'https://unsplash.com/photos/xbEJ-4S6iNc', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
    ],
  },
  {
    id: 'japan',
    country: 'Japan',
    flag: '🇯🇵',
    items: [
      {
        word: 'sushi', translation: 'sushi',
        image: 'https://images.unsplash.com/photo-1600019229299-f64d27082460?auto=format&fit=crop&w=900&q=80',
        alt: 'Assorted sushi on a dark plate',
        imageCredit: { label: 'Photo by Jason Leung · Unsplash', url: 'https://unsplash.com/photos/IFvjRdXhj_U', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
      {
        word: 'ramen', translation: 'ramen',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80',
        alt: 'A bowl of ramen noodles with toppings',
        imageCredit: { label: 'Ramen photo · Unsplash', url: 'https://unsplash.com/s/photos/ramen', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
      {
        word: 'tempura', translation: 'tempura',
        image: 'https://images.unsplash.com/photo-1763469026654-c6db622f5ec0?auto=format&fit=crop&w=900&q=80',
        alt: 'Shrimp tempura served with rice and soup',
        imageCredit: { label: 'Photo by note thanun · Unsplash', url: 'https://unsplash.com/photos/shrimp-tempura-over-rice-with-a-side-of-soup-9w5z5UrqOtM', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
      {
        word: 'udon', translation: 'fideos udon',
        image: 'https://images.unsplash.com/photo-1707201124182-099f3d98bb90?auto=format&fit=crop&w=900&q=80',
        alt: 'A bowl of udon noodles with seaweed',
        imageCredit: { label: 'Photo by Winston Chen · Unsplash', url: 'https://unsplash.com/photos/a-bowl-of-soup-with-noodles-and-seaweed--F53y5bjk6Y', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
      {
        word: 'yakitori', translation: 'brochetas japonesas de pollo',
        image: 'https://images.unsplash.com/photo-1775379995350-43098b52d8ed?auto=format&fit=crop&w=900&q=80',
        alt: 'Grilled chicken skewers, or yakitori, from Japan',
        imageCredit: { label: 'Photo by Jaz. Mine · Unsplash', url: 'https://unsplash.com/photos/two-skewers-of-grilled-chicken-with-lemon-slice-WLJdIA86-k0', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
    ],
  },
  {
    id: 'peru',
    country: 'Peru',
    flag: '🇵🇪',
    items: [
      {
        word: 'ceviche', translation: 'ceviche',
        image: 'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?auto=format&fit=crop&w=900&q=80',
        alt: 'Peruvian ceviche served with corn and sweet potato',
        imageCredit: { label: 'Peruvian food photo · Unsplash', url: 'https://unsplash.com/s/photos/peruvian-food', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
      {
        word: 'lomo saltado', translation: 'lomo saltado',
        image: 'https://images.unsplash.com/photo-1713742000609-7dfb86bfc720?auto=format&fit=crop&w=900&q=80',
        alt: 'Peruvian lomo saltado with beef, vegetables, and fries',
        imageCredit: { label: 'Photo by Marcelo de la Torre · Unsplash', url: 'https://unsplash.com/photos/BnkjG7OZzMw', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
      {
        word: 'chicken and rice', aliases: ['arroz con pollo'], translation: 'arroz con pollo',
        image: 'https://images.unsplash.com/photo-1724441980118-741eaf55b0f8?auto=format&fit=crop&w=900&q=80',
        alt: 'A plate of chicken and rice, a common Peruvian dish',
        imageCredit: { label: 'Photo by Mayte Baque · Unsplash', url: 'https://unsplash.com/photos/a-plate-of-chicken-and-rice-on-a-table-RK_L7fq7E0A', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
      {
        word: 'anticuchos', aliases: ['anticucho'], translation: 'brochetas peruanas',
        image: 'https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=900&q=80',
        alt: 'Grilled anticucho with sauce from a restaurant in Peru',
        imageCredit: { label: 'Photo by Pirata Studio Film · Unsplash', url: 'https://unsplash.com/photos/close-up-photo-of-grilled-meat-with-sauce-qt6b5042lrw', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
      {
        word: 'causa limeña', aliases: ['causa'], translation: 'causa limeña',
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/30/Peru_CausaLimena.jpg/1280px-Peru_CausaLimena.jpg',
        alt: 'Peruvian causa limeña, a layered potato dish with tuna and avocado',
        imageCredit: { label: 'Photo by Xauxa · Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Peru_CausaLimena.jpg', licenseLabel: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/' },
      },
    ],
  },
  {
    id: 'india',
    country: 'India',
    flag: '🇮🇳',
    items: [
      {
        word: 'curry', translation: 'curry',
        image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=900&q=80',
        alt: 'Indian curry garnished with fresh herbs',
        imageCredit: { label: 'Indian curry photo · Unsplash', url: 'https://unsplash.com/s/photos/indian-curry', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
      {
        word: 'biryani', translation: 'biryani de pollo',
        image: 'https://images.unsplash.com/photo-1559528896-c5310744cce8?auto=format&fit=crop&w=900&q=80',
        alt: 'A bowl of Indian chicken biryani rice',
        imageCredit: { label: 'Photo by Steve Tsang · Unsplash', url: 'https://unsplash.com/photos/food-photography-of-bowl-of-chicken-biryani-OterGMpkdsM', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
      {
        word: 'samosa', aliases: ['samosas'], translation: 'samosa',
        image: 'https://images.unsplash.com/photo-1572099107898-46f22b3af4f9?auto=format&fit=crop&w=900&q=80',
        alt: 'Golden Indian samosas on a table',
        imageCredit: { label: 'Photo by Juli Moreira · Unsplash', url: 'https://unsplash.com/photos/samosa-on-table-3oc6OzX4LaQ', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
      {
        word: 'naan', translation: 'pan naan',
        image: 'https://images.unsplash.com/photo-1697155406014-04dc649b0953?auto=format&fit=crop&w=900&q=80',
        alt: 'Indian naan bread served in a bowl',
        imageCredit: { label: 'Photo by Rashpal Singh · Unsplash', url: 'https://unsplash.com/photos/a-bowl-filled-with-pita-bread-and-a-fork-h7cZs0aFicw', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
      {
        word: 'tandoori chicken', translation: 'pollo tandoori',
        image: 'https://images.unsplash.com/photo-1775211578178-61f06027adf3?auto=format&fit=crop&w=900&q=80',
        alt: 'Tandoori chicken served with flatbread and yogurt dip',
        imageCredit: { label: 'Photo by Nidhi Mathur · Unsplash', url: 'https://unsplash.com/photos/tandoori-chicken-with-flatbread-and-yogurt-dip-TpEWAKRwsOg', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
    ],
  },
  {
    id: 'china',
    country: 'China',
    flag: '🇨🇳',
    items: [
      {
        word: 'dumplings', aliases: ['dumpling'], translation: 'empanadillas chinas',
        image: 'https://images.unsplash.com/photo-1678026582164-24a5460c447a?auto=format&fit=crop&w=900&q=80',
        alt: 'Steamed Chinese dumplings in a bamboo basket',
        imageCredit: { label: 'Photo by Yu · Unsplash', url: 'https://unsplash.com/photos/o8awPHmAzh8', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
      {
        word: 'Peking duck', aliases: ['Beijing duck'], translation: 'pato laqueado de Pekín',
        image: 'https://images.unsplash.com/photo-1765441012353-10fb4701a276?auto=format&fit=crop&w=900&q=80',
        alt: 'Crispy Peking duck served on a plate',
        imageCredit: { label: 'Photo by Wenhao Wang · Unsplash', url: 'https://unsplash.com/photos/crispy-peking-duck-with-mint-leaves-on-white-plate-tm4Y0NAUA48', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
      {
        word: 'fried rice', translation: 'arroz frito',
        image: 'https://images.unsplash.com/photo-1747628857854-1c2c1395638c?auto=format&fit=crop&w=900&q=80',
        alt: 'Chinese fried rice served in a clay pot',
        imageCredit: { label: 'Photo by YunFengQ · Unsplash', url: 'https://unsplash.com/photos/savory-fried-rice-served-in-a-clay-pot-EtAODsTL_PM', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
      {
        word: 'spring rolls', aliases: ['spring roll'], translation: 'rollitos de primavera',
        image: 'https://images.unsplash.com/photo-1623253083987-26681ce4a992?auto=format&fit=crop&w=900&q=80',
        alt: 'Chinese spring rolls served with dipping sauce',
        imageCredit: { label: 'Photo by Keji Gao · Unsplash', url: 'https://unsplash.com/photos/spring-rolls-and-sauce-are-ready-to-eat-MuZqJdRJpAU', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
      {
        word: 'chow mein', translation: 'fideos salteados',
        image: 'https://images.unsplash.com/photo-1772729219168-af0f0e57bb9c?auto=format&fit=crop&w=900&q=80',
        alt: 'A plate of chow mein noodles with vegetables and chicken',
        imageCredit: { label: 'Photo by Mohammad Fahim · Unsplash', url: 'https://unsplash.com/photos/a-plate-of-delicious-noodles-with-vegetables-and-chicken--q8D0-ELL3E', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
    ],
  },
  {
    id: 'france',
    country: 'France',
    flag: '🇫🇷',
    items: [
      {
        word: 'croissant', translation: 'cruasán',
        image: 'https://images.unsplash.com/photo-1754652327649-b7f96de797bd?auto=format&fit=crop&w=900&q=80',
        alt: 'Golden-brown French croissant on a marble surface',
        imageCredit: { label: 'Photo by Dillon Lobo · Unsplash', url: 'https://unsplash.com/photos/HCAqH2LrMsY', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
      {
        word: 'ratatouille', translation: 'ratatouille de verduras',
        image: 'https://images.unsplash.com/photo-1652622550740-f90d03edfbf0?auto=format&fit=crop&w=900&q=80',
        alt: 'French ratatouille made with sliced vegetables',
        imageCredit: { label: 'Photo by Marjan Sadeghi · Unsplash', url: 'https://unsplash.com/photos/a-pan-filled-with-sliced-up-vegetables-on-top-of-a-wooden-table-3vDJ--i7w88', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
      {
        word: 'French onion soup', translation: 'sopa de cebolla francesa',
        image: 'https://images.unsplash.com/photo-1768295982465-ffc2f48e63f4?auto=format&fit=crop&w=900&q=80',
        alt: 'French onion soup topped with toasted bread and cheese',
        imageCredit: { label: 'Photo by Álvaro Bernal · Unsplash', url: 'https://unsplash.com/photos/french-onion-soup-in-a-white-bowl-with-cheese-topping-Qxlez2RBOtY', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
      {
        word: 'crêpe', aliases: ['crepe'], translation: 'crepa',
        image: 'https://images.unsplash.com/photo-1565087170449-fa23854a6100?auto=format&fit=crop&w=900&q=80',
        alt: 'A French crêpe with ice cream and syrup',
        imageCredit: { label: 'Photo by Austin P · Unsplash', url: 'https://unsplash.com/photos/crepe-with-ice-cream-and-syrup-1ZTccDpF71k', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
      {
        word: 'macarons', aliases: ['macaron'], translation: 'macarrones franceses',
        image: 'https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?auto=format&fit=crop&w=900&q=80',
        alt: 'A pile of colorful French macarons',
        imageCredit: { label: 'Photo by Mockaroon · Unsplash', url: 'https://unsplash.com/photos/pile-of-macarons-yCOzRIbL08E', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
    ],
  },
  {
    id: 'spain',
    country: 'Spain',
    flag: '🇪🇸',
    items: [
      {
        word: 'paella', translation: 'paella',
        image: 'https://images.unsplash.com/photo-1650964807311-970cb88d347c?auto=format&fit=crop&w=900&q=80',
        alt: 'Spanish seafood paella in a wide pan',
        imageCredit: { label: 'Photo by Colin + Meg · Unsplash', url: 'https://unsplash.com/photos/OjGywUZ-v-w', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
      {
        word: 'patatas bravas', translation: 'papas bravas',
        image: 'https://images.unsplash.com/photo-1748522474927-11ab380598db?auto=format&fit=crop&w=900&q=80',
        alt: 'Spanish patatas bravas served in a bowl',
        imageCredit: { label: 'Photo by Theo · Unsplash', url: 'https://unsplash.com/photos/patatas-bravas-served-in-a-bowl-on-a-table-2uvIu7b6ArE', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
      {
        word: 'churros', aliases: ['churro'], translation: 'churros',
        image: 'https://images.unsplash.com/photo-1786420194794-095d83393326?auto=format&fit=crop&w=900&q=80',
        alt: 'A cinnamon churro served with coffee',
        imageCredit: { label: 'Photo by Bimda W · Unsplash', url: 'https://unsplash.com/photos/churros-with-popcorn-and-coffee-E8-ZiHAHrwQ', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
      {
        word: 'Spanish omelette', aliases: ['Spanish tortilla', 'tortilla española'], translation: 'tortilla española',
        image: 'https://images.unsplash.com/photo-1595519516956-9d085ab1cd50?auto=format&fit=crop&w=900&q=80',
        alt: 'A Spanish tortilla, also called a Spanish omelette',
        imageCredit: { label: 'Photo by Chase Daley · Unsplash', url: 'https://unsplash.com/photos/brown-bread-with-green-leaves-on-white-ceramic-plate-mFfLHPr6ZZs', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
      {
        word: 'gazpacho', translation: 'gazpacho',
        image: 'https://images.unsplash.com/photo-1624382075163-a4fdb99b99ec?auto=format&fit=crop&w=900&q=80',
        alt: 'A bowl of Spanish gazpacho, a chilled tomato soup',
        imageCredit: { label: 'Photo by Empreinte · Unsplash', url: 'https://unsplash.com/photos/white-ceramic-bowl-with-stainless-steel-spoon--TnVo1rEfYw', licenseLabel: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' },
      },
    ],
  },
];
