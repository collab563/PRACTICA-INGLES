// Offline English-Spanish glossary. Unknown words are deliberately left unchanged.
const OfflineTranslator = (() => {
  const verbForms = [
    { base: 'work', past: 'worked', pastTranslation: 'trabajé', futureTranslation: 'trabajaré', type: 'regular' },
    { base: 'play', past: 'played', pastTranslation: 'jugué', futureTranslation: 'jugaré', type: 'regular' },
    { base: 'visit', past: 'visited', pastTranslation: 'visité', futureTranslation: 'visitaré', type: 'regular' },
    { base: 'watch', past: 'watched', pastTranslation: 'vi', futureTranslation: 'veré', type: 'regular' },
    { base: 'clean', past: 'cleaned', pastTranslation: 'limpié', futureTranslation: 'limpiaré', type: 'regular' },
    { base: 'cook', past: 'cooked', pastTranslation: 'cociné', futureTranslation: 'cocinaré', type: 'regular' },
    { base: 'open', past: 'opened', pastTranslation: 'abrí', futureTranslation: 'abriré', type: 'regular' },
    { base: 'close', past: 'closed', pastTranslation: 'cerré', futureTranslation: 'cerraré', type: 'regular' },
    { base: 'live', past: 'lived', pastTranslation: 'viví', futureTranslation: 'viviré', type: 'regular' },
    { base: 'study', past: 'studied', pastTranslation: 'estudié', futureTranslation: 'estudiaré', type: 'regular' },
    { base: 'try', past: 'tried', pastTranslation: 'intenté', futureTranslation: 'intentaré', type: 'regular' },
    { base: 'stop', past: 'stopped', pastTranslation: 'paré', futureTranslation: 'pararé', type: 'regular' },
    { base: 'travel', past: 'traveled', pastTranslation: 'viajé', futureTranslation: 'viajaré', type: 'regular' },
    { base: 'need', past: 'needed', pastTranslation: 'necesité', futureTranslation: 'necesitaré', type: 'regular' },
    { base: 'want', past: 'wanted', pastTranslation: 'quise', futureTranslation: 'querré', type: 'regular' },
    { base: 'help', past: 'helped', pastTranslation: 'ayudé', futureTranslation: 'ayudaré', type: 'regular' },
    { base: 'call', past: 'called', pastTranslation: 'llamé', futureTranslation: 'llamaré', type: 'regular' },
    { base: 'walk', past: 'walked', pastTranslation: 'caminé', futureTranslation: 'caminaré', type: 'regular' },
    { base: 'talk', past: 'talked', pastTranslation: 'hablé', futureTranslation: 'hablaré', type: 'regular' },
    { base: 'dance', past: 'danced', pastTranslation: 'bailé', futureTranslation: 'bailaré', type: 'regular' },
    { base: 'use', past: 'used', pastTranslation: 'usé', futureTranslation: 'usaré', type: 'regular' },
    { base: 'start', past: 'started', pastTranslation: 'empecé', futureTranslation: 'empezaré', type: 'regular' },
    { base: 'finish', past: 'finished', pastTranslation: 'terminé', futureTranslation: 'terminaré', type: 'regular' },
    { base: 'ask', past: 'asked', pastTranslation: 'pregunté', futureTranslation: 'preguntaré', type: 'regular' },
    { base: 'be', past: 'was', pastTranslation: 'fui / estuve', futureTranslation: 'seré / estaré', type: 'irregular' },
    { base: 'have', past: 'had', pastTranslation: 'tuve', futureTranslation: 'tendré', type: 'irregular' },
    { base: 'do', past: 'did', pastTranslation: 'hice', futureTranslation: 'haré', type: 'irregular' },
    { base: 'go', past: 'went', pastTranslation: 'fui', futureTranslation: 'iré', type: 'irregular' },
    { base: 'come', past: 'came', pastTranslation: 'vine', futureTranslation: 'vendré', type: 'irregular' },
    { base: 'get', past: 'got', pastTranslation: 'obtuve', futureTranslation: 'obtendré', type: 'irregular' },
    { base: 'make', past: 'made', pastTranslation: 'hice', futureTranslation: 'haré', type: 'irregular' },
    { base: 'take', past: 'took', pastTranslation: 'tomé', futureTranslation: 'tomaré', type: 'irregular' },
    { base: 'give', past: 'gave', pastTranslation: 'di', futureTranslation: 'daré', type: 'irregular' },
    { base: 'say', past: 'said', pastTranslation: 'dije', futureTranslation: 'diré', type: 'irregular' },
    { base: 'see', past: 'saw', pastTranslation: 'vi', futureTranslation: 'veré', type: 'irregular' },
    { base: 'eat', past: 'ate', pastTranslation: 'comí', futureTranslation: 'comeré', type: 'irregular' },
    { base: 'drink', past: 'drank', pastTranslation: 'bebí', futureTranslation: 'beberé', type: 'irregular' },
    { base: 'sleep', past: 'slept', pastTranslation: 'dormí', futureTranslation: 'dormiré', type: 'irregular' },
    { base: 'buy', past: 'bought', pastTranslation: 'compré', futureTranslation: 'compraré', type: 'irregular' },
    { base: 'pay', past: 'paid', pastTranslation: 'pagué', futureTranslation: 'pagaré', type: 'irregular' },
    { base: 'think', past: 'thought', pastTranslation: 'pensé', futureTranslation: 'pensaré', type: 'irregular' },
    { base: 'write', past: 'wrote', pastTranslation: 'escribí', futureTranslation: 'escribiré', type: 'irregular' },
    { base: 'speak', past: 'spoke', pastTranslation: 'hablé', futureTranslation: 'hablaré', type: 'irregular' },
    { base: 'find', past: 'found', pastTranslation: 'encontré', futureTranslation: 'encontraré', type: 'irregular' },
    { base: 'leave', past: 'left', pastTranslation: 'salí', futureTranslation: 'saldré', type: 'irregular' },
    { base: 'meet', past: 'met', pastTranslation: 'conocí', futureTranslation: 'conoceré', type: 'irregular' },
    { base: 'know', past: 'knew', pastTranslation: 'supe', futureTranslation: 'sabré', type: 'irregular' },
    { base: 'run', past: 'ran', pastTranslation: 'corrí', futureTranslation: 'correré', type: 'irregular' },
    { base: 'teach', past: 'taught', pastTranslation: 'enseñé', futureTranslation: 'enseñaré', type: 'irregular' },
    { base: 'tell', past: 'told', pastTranslation: 'conté', futureTranslation: 'contaré', type: 'irregular' },
    { base: 'feel', past: 'felt', pastTranslation: 'sentí', futureTranslation: 'sentiré', type: 'irregular' },
    { base: 'bring', past: 'brought', pastTranslation: 'traje', futureTranslation: 'traeré', type: 'irregular' },
    { base: 'read', past: 'read', pastTranslation: 'leí', futureTranslation: 'leeré', type: 'irregular' },
    { base: 'drive', past: 'drove', pastTranslation: 'conduje', futureTranslation: 'conduciré', type: 'irregular' },
    { base: 'wear', past: 'wore', pastTranslation: 'llevé', futureTranslation: 'llevaré', type: 'irregular' },
  ];

  const entries = `
good morning|buenos días
good afternoon|buenas tardes
good evening|buenas tardes
good night|buenas noches
nice to meet you|mucho gusto
some coffee|un poco de café
some tea|un poco de té
some water|un poco de agua
a house|una casa
a book|un libro
the answer|la respuesta
the house|la casa
the school|la escuela
the car|el coche
receptionist|recepcionista
shout|gritar
whisper|susurrar
laugh|reír
cry|llorar
suddenly|de repente
finally|finalmente
loudly|ruidosamente
quietly|silenciosamente
classical|clásico
classical music|música clásica
jazz|jazz
rock|rock
pop|pop
rap|rap
opposite|enfrente de
behind|detrás de
one thousand|mil
ten thousand|diez mil
one hundred thousand|cien mil
one million|un millón
1,000|mil
10,000|diez mil
100,000|cien mil
1,000,000|un millón
stadium|estadio
church|iglesia
museum|museo
predict|predecir
dream|sueño
a dream|un sueño
to dream|soñar
decide|decidir
promise|prometer
hope|esperar
smartphone|teléfono inteligente
tablet|tableta
app|aplicación
just|acabo de
subject pronoun|pronombre de sujeto
object pronoun|pronombre de objeto
possessive adjective|adjetivo posesivo
possessive adjectives|adjetivos posesivos
singular noun|sustantivo singular
plural noun|sustantivo plural
countable noun|sustantivo contable
uncountable noun|sustantivo incontable
present simple|presente simple
present continuous|presente continuo
past simple|pasado simple
present perfect|presente perfecto
comparative adjective|adjetivo comparativo
superlative adjective|adjetivo superlativo
regular verb|verbo regular
irregular verb|verbo irregular
auxiliary verb|verbo auxiliar
past participle|participio pasado
definite article|artículo definido
indefinite article|artículo indefinido
question word|palabra interrogativa
word order|orden de las palabras
imperative|imperativo
infinitive|infinitivo
base form|forma base
verb-ing|verbo terminado en -ing
frequency adverb|adverbio de frecuencia
adverb of manner|adverbio de modo
countable|contable
uncountable|incontable
quantifier|cuantificador
affirmative|afirmativo
negative|negativo
short answer|respuesta corta
identity card|documento de identidad
email address|correo electrónico
keys|llaves
person|persona
men|hombres
women|mujeres
box|caja
purse|monedero
wallet|cartera
credit card|tarjeta de crédito
umbrella|paraguas
sunglasses|gafas de sol
scissors|tijeras
diary|agenda
coin|moneda
gloves|guantes
ring|anillo
necklace|collar
earring|pendiente
earrings|pendientes
grandchild|nieto
grandchildren|nietos
cereal|cereal
flour|harina
butter|mantequilla
onion|cebolla
tomato|tomate
mushroom|champiñón
sausage|salchicha
beef|carne de res
pork|carne de cerdo
lamb|cordero
chips|papas fritas
crisps|patatas fritas de bolsa
biscuits|galletas
sweets|dulces
dessert|postre
lemonade|limonada
bottle|botella
packet|paquete
tin|lata
jar|frasco
slice|rebanada
piece|pedazo
cup|taza
kilo|kilo
half|mitad
quarter|cuarto
menu|menú
bill|cuenta
starter|entrada
main course|plato principal
meal|comida
recipe|receta
ingredient|ingrediente
ingredients|ingredientes
cash|efectivo
receipt|recibo
size|talla
fit|quedar
sell|vender
borrow|pedir prestado
lend|prestar
crowded|concurrido
crowd|multitud
queue|cola
advice|consejo
temperature|temperatura
degrees|grados
gallery|galería
square|plaza
palace|palacio
castle|castillo
cathedral|catedral
platform|andén
entrance|entrada
exit|salida
turning|giro
crossroads|cruce
roundabout|rotonda
sports centre|centro deportivo
theatre|teatro
concert|concierto
band|banda
song|canción
lyrics|letra
instrument|instrumento
violin|violín
drums|batería
download|descargar
upload|subir
password|contraseña
username|nombre de usuario
social media|redes sociales
headphones|auriculares
earphones|audífonos
online|en línea
offline|sin conexión
how are you|cómo estás
how old are you|cuántos años tienes
where are you from|de dónde eres
what is your name|cómo te llamas
what time is it|qué hora es
could you help me|podrías ayudarme
can you help me|puedes ayudarme
i need help|necesito ayuda
i need|necesito
i am looking for|estoy buscando
i'm looking for|estoy buscando
i do not understand|no entiendo
i don't understand|no entiendo
i need to go|necesito ir
i am from|soy de
i'm from|soy de
how do i say|cómo digo
see you later|hasta luego
see you soon|hasta pronto
thank you very much|muchas gracias
you are welcome|de nada
excuse me|disculpa
i am sorry|lo siento
i'm sorry|lo siento
i do not know|no sé
i don't know|no sé
i would like|me gustaría
i have to|tengo que
there is|hay
there are|hay
how much|cuánto
how many|cuántos
a lot of|muchos
next to|al lado de
in front of|delante de
behind the|detrás del
opposite the|frente al
go straight on|sigue recto
turn left|gira a la izquierda
turn right|gira a la derecha
by bus|en autobús
by train|en tren
at the moment|en este momento
every day|todos los días
once a week|una vez a la semana
twice a week|dos veces a la semana
last year|el año pasado
last week|la semana pasada
next week|la próxima semana
this morning|esta mañana
this afternoon|esta tarde
right now|ahora mismo
of course|por supuesto
for example|por ejemplo
a little|un poco
a few|unos pocos
good idea|buena idea
open a book|abrir un libro
close a book|cerrar un libro
have breakfast|desayunar
have lunch|almorzar
have dinner|cenar
get up|levantarse
go to bed|irse a la cama
go to work|ir al trabajo
go to school|ir a la escuela
listen to music|escuchar música
watch television|ver televisión
play the guitar|tocar la guitarra
play football|jugar al fútbol
do homework|hacer la tarea
take a photo|tomar una foto
make a mistake|cometer un error
look for|buscar
come back|volver
sit down|sentarse
stand up|ponerse de pie
turn on|encender
turn off|apagar
find out|averiguar
how do you say|cómo se dice
how do you spell|cómo se deletrea
what does it mean|qué significa
what do you do|a qué te dedicas
where do you live|dónde vives
what do you think|qué piensas
what are you doing|qué estás haciendo
where did you go|adónde fuiste
what did you do|qué hiciste
how was your weekend|cómo estuvo tu fin de semana
have a nice day|que tengas un buen día
have a nice weekend|que tengas un buen fin de semana
happy birthday|feliz cumpleaños
good luck|buena suerte
no problem|no hay problema
never mind|no importa
i agree|estoy de acuerdo
i disagree|no estoy de acuerdo
i think so|eso creo
i hope so|eso espero
i do not think so|no lo creo
in my opinion|en mi opinión
what about you|y tú
for the first time|por primera vez
from time to time|de vez en cuando
as soon as possible|lo antes posible
for a long time|durante mucho tiempo
a long time ago|hace mucho tiempo
in the past|en el pasado
in the future|en el futuro
next year|el próximo año
last month|el mes pasado
this week|esta semana
this year|este año
every morning|todas las mañanas
every night|todas las noches
once a day|una vez al día
twice a day|dos veces al día
quarter past|y cuarto
quarter to|menos cuarto
half past|y media
what day|qué día
what date|qué fecha
what time|a qué hora
in the middle of|en medio de
on the way|de camino
get on|subir a
get off|bajar de
pick up|recoger
put on|ponerse
take off|quitarse
try on|probarse
look after|cuidar
grow up|crecer
go out|salir
hang out|pasar el rato
get married|casarse
fall in love|enamorarse
have a good time|pasarlo bien
have fun|divertirse
make friends|hacer amigos
get lost|perderse
brush your teeth|cepillarse los dientes
wash your hands|lavarse las manos
get dressed|vestirse
get ready|prepararse
wake up|despertarse
fall asleep|quedarse dormido
go swimming|ir a nadar
go cycling|ir en bicicleta
go for a walk|dar un paseo
go for a run|salir a correr
go to the cinema|ir al cine
go to the beach|ir a la playa
go on holiday|irse de vacaciones
go abroad|ir al extranjero
come home|volver a casa
get home|llegar a casa
leave home|salir de casa
wait for|esperar a
pay for|pagar por
ask for|pedir
think about|pensar en
talk about|hablar de
listen to|escuchar
look at|mirar
look like|parecerse a
belong to|pertenecer a
depend on|depender de
agree with|estar de acuerdo con
worry about|preocuparse por
be interested in|estar interesado en
be good at|ser bueno en
be bad at|ser malo en
be afraid of|tener miedo de
be worried about|estar preocupado por
be excited about|estar emocionado por
be different from|ser diferente de
be married to|estar casado con
be careful|tener cuidado
be ready|estar listo
be famous for|ser famoso por
be full of|estar lleno de
there was|había
there were|había
there will be|habrá
how do i get to|cómo llego a
how can i get to|cómo puedo llegar a
where is the nearest|dónde está el más cercano
is there a|hay un
are there any|hay
at the end of the street|al final de la calle
on your left|a tu izquierda
on your right|a tu derecha
opposite the bank|enfrente del banco
next to the station|al lado de la estación
near the supermarket|cerca del supermercado
behind the school|detrás de la escuela
in front of the house|delante de la casa
on the ground floor|en la planta baja
inside the house|dentro de la casa
outside the house|fuera de la casa
what is your house like|cómo es tu casa
i live in a house|vivo en una casa
i live in a flat|vivo en un apartamento
i live with my family|vivo con mi familia
i live alone|vivo solo
go to the supermarket|ir al supermercado
go to the bank|ir al banco
go to the doctor|ir al médico
go to the dentist|ir al dentista
go to the pharmacy|ir a la farmacia
go to the gym|ir al gimnasio
go to the library|ir a la biblioteca
go to the park|ir al parque
go shopping|ir de compras
go on a trip|hacer un viaje
travel abroad|viajar al extranjero
travel by train|viajar en tren
travel by bus|viajar en autobús
travel by plane|viajar en avión
travel by car|viajar en coche
have a good trip|buen viaje
enjoy your stay|disfruta tu estancia
free time|tiempo libre
read a book|leer un libro
watch a film|ver una película
watch a movie|ver una película
watch tv|ver televisión
listen to the radio|escuchar la radio
play video games|jugar videojuegos
play board games|jugar juegos de mesa
play cards|jugar a las cartas
play an instrument|tocar un instrumento
play the piano|tocar el piano
play basketball|jugar al baloncesto
play tennis|jugar al tenis
do yoga|hacer yoga
do exercise|hacer ejercicio
go skiing|ir a esquiar
go dancing|ir a bailar
go camping|ir de campamento
go hiking|ir de excursión
meet friends|quedar con amigos
hang out with friends|pasar el rato con amigos
relax at home|relajarse en casa
take a break|tomar un descanso
get some sleep|dormir un poco
go to sleep|irse a dormir
wake up early|despertarse temprano
sleep well|dormir bien
get up early|levantarse temprano
stay up late|quedarse despierto hasta tarde
take a nap|echar una siesta
do nothing|no hacer nada
do something|hacer algo
make a list|hacer una lista
make a plan|hacer un plan
make dinner|preparar la cena
make a phone call|hacer una llamada telefónica
make money|ganar dinero
take notes|tomar apuntes
take medicine|tomar medicina
take a shower|ducharse
take a bath|bañarse
take care of|cuidar de
take part in|participar en
take place|tener lugar
give up|rendirse
give away|regalar
give back|devolver
give a hand|echar una mano
give me a minute|dame un minuto
give me a chance|dame una oportunidad
give me a call|llámame
give me an example|dame un ejemplo
give me an answer|dame una respuesta
give me your opinion|dame tu opinión
give me your name|dime tu nombre
give me the bill|dame la cuenta
give me the key|dame la llave
give birth|dar a luz
give a warning|dar una advertencia
give a lecture|dar una conferencia
give a lesson|dar una lección
give a talk|dar una charla
give an interview|dar una entrevista
give a presentation|hacer una presentación
give a gift|dar un regalo
give flowers|regalar flores
give support|dar apoyo
give advice|dar consejos
give information|dar información
give directions|dar indicaciones
give an example|dar un ejemplo
give an explanation|dar una explicación
give a description|dar una descripción
give attention to|prestar atención a
give priority to|dar prioridad a
give life to|dar vida a
give rise to|dar lugar a
make an impression|causar una impresión
first impression|primera impresión
good impression|buena impresión
bad impression|mala impresión
impress someone|impresionar a alguien
i|yo
you|tú
he|él
she|ella
it|eso
we|nosotros
they|ellos
me|me
him|lo
her|la
us|nos
them|los
my|mi
your|tu
his|su
our|nuestro
their|su
mine|mío
yours|tuyo
who|quién
what|qué
where|dónde
when|cuándo
why|por qué
which|cuál
whose|de quién
how|cómo
yes|sí
no|no
not|no
and|y
or|o
but|pero
because|porque
with|con
without|sin
from|de
to|a
in|en
on|sobre
under|debajo de
at|en
for|para
of|de
near|cerca
between|entre
about|sobre
before|antes
after|después
above|encima de
inside|dentro
outside|fuera
is|es
are|son
am|soy
was|era
were|eran
be|ser
have|tener
has|tiene
had|tenía
do|hacer
does|hace
did|hizo
can|poder
could|podría
will|hará
would|haría
should|debería
must|deber
go|ir
goes|va
went|fue
come|venir
came|vino
get|obtener
got|obtuvo
make|hacer
made|hizo
take|tomar
took|tomó
give|dar
gave|dio
say|decir
said|dijo
speak|hablar
talk|hablar
tell|decir
ask|preguntar
know|saber
think|pensar
want|querer
need|necesitar
like|gustar
love|amar
live|vivir
work|trabajar
study|estudiar
learn|aprender
teach|enseñar
read|leer
write|escribir
eat|comer
drink|beber
sleep|dormir
buy|comprar
pay|pagar
use|usar
open|abrir
close|cerrar
start|empezar
finish|terminar
help|ayudar
call|llamar
wait|esperar
meet|conocer
play|jugar
run|correr
walk|caminar
drive|conducir
travel|viajar
visit|visitar
find|encontrar
look|mirar
see|ver
watch|ver
listen|escuchar
hear|oír
remember|recordar
forget|olvidar
cook|cocinar
clean|limpiar
wash|lavar
good|bueno
bad|malo
big|grande
small|pequeño
long|largo
short|corto
new|nuevo
old|viejo
young|joven
happy|feliz
sad|triste
tired|cansado
hungry|hambriento
thirsty|sediento
hot|caliente
cold|frío
easy|fácil
difficult|difícil
important|importante
interesting|interesante
expensive|caro
cheap|barato
fast|rápido
slow|lento
early|temprano
late|tarde
always|siempre
usually|normalmente
often|a menudo
sometimes|a veces
never|nunca
today|hoy
tomorrow|mañana
yesterday|ayer
now|ahora
here|aquí
there|allí
again|otra vez
very|muy
too|demasiado
also|también
more|más
less|menos
enough|suficiente
man|hombre
woman|mujer
boy|niño
girl|niña
child|niño
children|niños
family|familia
mother|madre
father|padre
sister|hermana
brother|hermano
friend|amigo
house|casa
home|hogar
room|habitación
school|escuela
teacher|profesor
student|estudiante
book|libro
water|agua
food|comida
bread|pan
milk|leche
coffee|café
tea|té
apple|manzana
meat|carne
money|dinero
time|tiempo
day|día
week|semana
month|mes
year|año
morning|mañana
afternoon|tarde
evening|tarde
night|noche
name|nombre
job|trabajo
city|ciudad
country|país
street|calle
shop|tienda
restaurant|restaurante
hotel|hotel
station|estación
car|coche
bus|autobús
train|tren
bicycle|bicicleta
weather|clima
sun|sol
rain|lluvia
snow|nieve
music|música
language|idioma
question|pregunta
answer|respuesta
word|palabra
sentence|oración
monday|lunes
tuesday|martes
wednesday|miércoles
thursday|jueves
friday|viernes
saturday|sábado
sunday|domingo
january|enero
february|febrero
march|marzo
april|abril
may|mayo
june|junio
july|julio
august|agosto
september|septiembre
october|octubre
november|noviembre
december|diciembre
hello|hola
hi|hola
goodbye|adiós
please|por favor
thanks|gracias
sorry|lo siento
welcome|bienvenido
doctor|médico
the|el
a|un
an|un
this|este
that|ese
these|estos
those|esos
some|algunos
any|ningún
all|todo
every|cada
many|muchos
much|mucho
few|pocos
first|primero
last|último
one|uno
two|dos
three|tres
four|cuatro
five|cinco
six|seis
seven|siete
eight|ocho
nine|nueve
ten|diez
twenty|veinte
thirty|treinta
forty|cuarenta
fifty|cincuenta
hundred|cien
red|rojo
blue|azul
green|verde
black|negro
white|blanco
yellow|amarillo
orange|naranja
brown|marrón
phone|teléfono
computer|computadora
table|mesa
chair|silla
door|puerta
window|ventana
key|llave
bag|bolso
clothes|ropa
shirt|camisa
shoes|zapatos
head|cabeza
hand|mano
eye|ojo
body|cuerpo
dog|perro
cat|gato
bird|pájaro
beach|playa
park|parque
mountain|montaña
river|río
beautiful|hermoso
delicious|delicioso
funny|divertido
kind|amable
busy|ocupado
ready|listo
wrong|equivocado
different|diferente
problem|problema
example|ejemplo
world|mundo
people|gente
thing|cosa
place|lugar
life|vida
number|número
hour|hora
minute|minuto
weekend|fin de semana
holiday|vacaciones
birthday|cumpleaños
party|fiesta
game|juego
film|película
movie|película
picture|imagen
photo|foto
story|historia
newspaper|periódico
market|mercado
office|oficina
hospital|hospital
bank|banco
airport|aeropuerto
map|mapa
ticket|boleto
breakfast|desayuno
lunch|almuerzo
dinner|cena
fruit|fruta
vegetable|verdura
cheese|queso
egg|huevo
fish|pescado
chicken|pollo
rice|arroz
potato|patata
sugar|azúcar
salt|sal
nurse|enfermero
police|policía
driver|conductor
waiter|camarero
great|genial
nice|agradable
well|bien
better|mejor
worse|peor
maybe|quizás
perhaps|tal vez
together|juntos
alone|solo
quickly|rápidamente
slowly|lentamente
nothing|nada
something|algo
someone|alguien
everyone|todos
nobody|nadie
another|otro
others|otros
both|ambos
enjoy|disfrutar
prefer|preferir
feel|sentir
stay|quedarse
leave|salir
arrive|llegar
return|regresar
bring|traer
carry|llevar
send|enviar
show|mostrar
change|cambiar
choose|elegir
try|intentar
happen|ocurrir
believe|creer
understand|entender
mean|significar
explain|explicar
follow|seguir
keep|mantener
put|poner
wear|llevar puesto
win|ganar
lose|perder
fall|caer
break|romper
grow|crecer
build|construir
cut|cortar
draw|dibujar
sing|cantar
dance|bailar
swim|nadar
fly|volar
climb|escalar
rainy|lluvioso
sunny|soleado
cloudy|nublado
windy|ventoso
snowy|nevado
spring|primavera
summer|verano
autumn|otoño
winter|invierno
season|estación
english|inglés
spanish|español
peruvian|peruano
mexican|mexicano
american|estadounidense
british|británico
french|francés
german|alemán
italian|italiano
japanese|japonés
chinese|chino
brazilian|brasileño
argentinian|argentino
australian|australiano
canadian|canadiense
france|Francia
germany|Alemania
italy|Italia
japan|Japón
brazil|Brasil
argentina|Argentina
australia|Australia
canada|Canadá
mexico|México
peru|Perú
spain|España
england|Inglaterra
ireland|Irlanda
scotland|Escocia
russia|Rusia
india|India
egypt|Egipto
north|norte
south|sur
east|este
west|oeste
already|ya
yet|todavía
ever|alguna vez
since|desde
until|hasta
during|durante
while|mientras
ago|hace
soon|pronto
later|más tarde
tonight|esta noche
afraid|asustado
angry|enojado
excited|emocionado
worried|preocupado
surprised|sorprendido
sick|enfermo
healthy|saludable
strong|fuerte
weak|débil
careful|cuidadoso
dangerous|peligroso
safe|seguro
quiet|tranquilo
noisy|ruidoso
dirty|sucio
full|lleno
empty|vacío
closed|cerrado
married|casado
single|soltero
rich|rico
poor|pobre
famous|famoso
popular|popular
possible|posible
impossible|imposible
special|especial
boring|aburrido
exciting|emocionante
amazing|increíble
wonderful|maravilloso
fantastic|fantástico
friendly|amigable
helpful|servicial
lazy|perezoso
smart|inteligente
polite|educado
rude|grosero
generous|generoso
serious|serio
modern|moderno
traditional|tradicional
available|disponible
comfortable|cómodo
uncomfortable|incómodo
tasty|sabroso
sour|agrio
spicy|picante
fresh|fresco
soft|suave
hard|duro
heavy|pesado
light|ligero
dark|oscuro
bright|brillante
tall|alto
low|bajo
wide|ancho
narrow|estrecho
deep|profundo
thin|delgado
straight|recto
curly|rizado
blonde|rubio
beard|barba
moustache|bigote
glasses|gafas
hair|cabello
face|cara
nose|nariz
mouth|boca
tooth|diente
teeth|dientes
foot|pie
feet|pies
leg|pierna
arm|brazo
back|espalda
stomach|estómago
shoulder|hombro
knee|rodilla
neck|cuello
finger|dedo
headache|dolor de cabeza
toothache|dolor de muelas
stomachache|dolor de estómago
medicine|medicina
exercise|ejercicio
sport|deporte
football|fútbol
tennis|tenis
basketball|baloncesto
swimming|natación
cycling|ciclismo
trip|viaje
abroad|al extranjero
luggage|equipaje
suitcase|maleta
passport|pasaporte
flight|vuelo
plane|avión
boat|barco
underground|metro
taxi|taxi
motorcycle|motocicleta
traffic|tráfico
road|carretera
bridge|puente
corner|esquina
crossing|cruce
traffic lights|semáforo
direction|dirección
cloud|nube
sky|cielo
wind|viento
storm|tormenta
weather forecast|pronóstico del tiempo
sunshine|luz del sol
environment|medio ambiente
recycle|reciclar
plastic|plástico
paper|papel
glass|vidrio
energy|energía
electricity|electricidad
pollution|contaminación
forest|bosque
tree|árbol
flower|flor
plant|planta
grass|césped
leaf|hoja
leaves|hojas
insect|insecto
butterfly|mariposa
bee|abeja
horse|caballo
cow|vaca
sheep|oveja
pig|cerdo
goat|cabra
mouse|ratón
rabbit|conejo
lion|león
tiger|tigre
elephant|elefante
monkey|mono
snake|serpiente
turtle|tortuga
frog|rana
whale|ballena
dolphin|delfín
shark|tiburón
eagle|águila
owl|búho
duck|pato
hen|gallina
rooster|gallo
pet|mascota
farm|granja
zoo|zoológico
jungle|selva
desert|desierto
island|isla
lake|lago
ocean|océano
coast|costa
countryside|campo
village|pueblo
neighbourhood|barrio
neighborhood|barrio
building|edificio
flat|apartamento
stairs|escaleras
lift|ascensor
kitchen|cocina
bathroom|baño
bedroom|dormitorio
living room|sala de estar
dining room|comedor
garden|jardín
garage|garaje
roof|techo
wall|pared
floor|suelo
bed|cama
sofa|sofá
armchair|sillón
cupboard|armario
wardrobe|ropero
shelf|estante
mirror|espejo
lamp|lámpara
fridge|refrigerador
oven|horno
microwave|microondas
sink|fregadero
shower|ducha
bath|bañera
toilet|inodoro
towel|toalla
soap|jabón
toothbrush|cepillo de dientes
toothpaste|pasta de dientes
clock|reloj
calendar|calendario
laptop|computadora portátil
keyboard|teclado
screen|pantalla
website|sitio web
internet|internet
message|mensaje
text message|mensaje de texto
postcard|postal
battery|batería
charger|cargador
camera|cámara
radio|radio
television|televisión
magazine|revista
dictionary|diccionario
notebook|cuaderno
pencil|lápiz
pen|bolígrafo
rubber|goma
eraser|borrador
ruler|regla
board|pizarra
classroom|aula
lesson|lección
course|curso
subject|asignatura
exam|examen
mark|nota
grade|calificación
homework|tarea
uniform|uniforme
classmate|compañero de clase
university|universidad
pupil|alumno
library|biblioteca
gym|gimnasio
laboratory|laboratorio
science|ciencia
geography|geografía
maths|matemáticas
biology|biología
chemistry|química
physics|física
art|arte
grammar|gramática
vocabulary|vocabulario
pronunciation|pronunciación
spelling|ortografía
alphabet|alfabeto
verb|verbo
noun|sustantivo
adjective|adjetivo
adverb|adverbio
pronoun|pronombre
preposition|preposición
article|artículo
plural|plural
singular|singular
past|pasado
present|presente
future|futuro
tense|tiempo verbal
phrase|frase
text|texto
paragraph|párrafo
translation|traducción
meaning|significado
practice|práctica
incorrect|incorrecto
mistake|error
true|verdadero
false|falso
check|comprobar
complete|completar
match|emparejar
order|ordenar
fill|rellenar
spell|deletrear
pronounce|pronunciar
describe|describir
conversation|conversación
bookshop|librería
pharmacy|farmacia
supermarket|supermercado
shopping centre|centro comercial
greengrocer|frutería
hairdresser|peluquería
butcher|carnicería
bakery|panadería
newsagent|quiosco
shoe shop|zapatería
toy shop|juguetería
clothes shop|tienda de ropa
town hall|ayuntamiento
police station|comisaría
health centre|centro de salud
pedestrian crossing|paso de peatones
main street|calle principal
city centre|centro de la ciudad
old town|casco antiguo
public transport|transporte público
no entry|prohibido entrar
no parking|prohibido estacionar
adult|adulto
grandfather|abuelo
grandmother|abuela
grandparents|abuelos
uncle|tío
aunt|tía
cousin|primo
nephew|sobrino
niece|sobrina
husband|esposo
wife|esposa
son|hijo
daughter|hija
parents|padres
relative|pariente
surname|apellido
full name|nombre completo
occupation|ocupación
profession|profesión
company|empresa
boss|jefe
colleague|colega
employee|empleado
manager|gerente
accountant|contador
engineer|ingeniero
lawyer|abogado
firefighter|bombero
actor|actor
actress|actriz
singer|cantante
musician|músico
artist|artista
journalist|periodista
photographer|fotógrafo
scientist|científico
waitress|camarera
pilot|piloto
farmer|agricultor
builder|constructor
plumber|fontanero
electrician|electricista
mechanic|mecánico
vet|veterinario
unemployed|desempleado
retired|jubilado
salary|salario
meeting|reunión
appointment|cita
deadline|fecha límite
single ticket|billete de ida
return ticket|billete de ida y vuelta
traffic jam|atasco
rush hour|hora punta
speed limit|límite de velocidad
driving licence|carné de conducir
parking lot|estacionamiento
petrol station|gasolinera
bus stop|parada de autobús
bus station|estación de autobuses
train station|estación de tren
underground station|estación de metro
ticket office|taquilla
boarding pass|tarjeta de embarque
hand luggage|equipaje de mano
travel insurance|seguro de viaje
travel agent|agente de viajes
tourist attraction|atracción turística
art gallery|galería de arte
post office|oficina de correos
fire station|parque de bomberos
department store|grandes almacenes
shopping mall|centro comercial
how long does it take|cuánto tiempo tarda
what kind of|qué tipo de
what sort of|qué tipo de
what happened|qué pasó
are you sure|estás seguro
do you understand|entiendes
do you remember|recuerdas
do you know|sabes
i understand|entiendo
i remember|recuerdo
i know|sé
i see|ya veo
that makes sense|eso tiene sentido
it depends|depende
it is important|es importante
it is possible|es posible
it is easy|es fácil
it is difficult|es difícil
that sounds good|suena bien
that sounds great|suena genial
sounds like fun|suena divertido
what do you like doing|qué te gusta hacer
what do you like to do|qué te gusta hacer
what do you do in your free time|qué haces en tu tiempo libre
what is your favourite food|cuál es tu comida favorita
what is your favorite food|cuál es tu comida favorita
what is your favourite colour|cuál es tu color favorito
what is your favorite color|cuál es tu color favorito
what kind of music do you like|qué tipo de música te gusta
what kind of films do you like|qué tipo de películas te gustan
what is your favourite film|cuál es tu película favorita
what is your favorite movie|cuál es tu película favorita
`.trim();

  const enToEs = {};
  const esToEn = {};
  entries.split('\n').forEach(line => {
    const separator = line.indexOf('|');
    const english = line.slice(0, separator).trim();
    const spanish = line.slice(separator + 1).trim();
    enToEs[english] = spanish;
    if (!(spanish.toLocaleLowerCase('es') in esToEn)) {
      esToEn[spanish.toLocaleLowerCase('es')] = english;
    }
  });

  verbForms.forEach(({ base, past, pastTranslation, futureTranslation }) => {
    const futureForm = `will ${base}`;
    const pastPhrase = `i ${past}`;
    const futurePhrase = `i ${futureForm}`;
    if (!(past in enToEs)) enToEs[past] = pastTranslation;
    enToEs[pastPhrase] = pastTranslation;
    enToEs[futureForm] = futureTranslation;
    enToEs[futurePhrase] = futureTranslation;
    esToEn[pastTranslation.toLocaleLowerCase('es')] = pastPhrase;
    esToEn[futureTranslation.toLocaleLowerCase('es')] = futurePhrase;
  });

  Object.assign(esToEn, {
    'buenos días': 'good morning',
    'buenas tardes': 'good afternoon',
    'buenas noches': 'good night',
    'muchas gracias': 'thank you very much',
    'gracias': 'thanks',
    'de nada': 'you are welcome',
    'lo siento': 'i am sorry',
    'no sé': 'i do not know',
    'me gustaría': 'i would like',
    'tengo que': 'i have to',
    'cómo estás': 'how are you',
    'de dónde eres': 'where are you from',
    'cómo te llamas': 'what is your name',
    'qué hora es': 'what time is it',
    'y tú': 'what about you',
    'a qué te dedicas': 'what do you do',
    'dónde vives': 'where do you live',
    'mucho gusto': 'nice to meet you',
    'hasta luego': 'see you later',
    'hasta pronto': 'see you soon',
    'por favor': 'please',
    'buen viaje': 'have a good trip',
    'buen provecho': 'enjoy your meal',
    'feliz cumpleaños': 'happy birthday',
    'buena suerte': 'good luck',
    'no hay problema': 'no problem',
    'la': 'the',
    'las': 'the',
    'los': 'the',
    'un': 'a',
    'una': 'a',
    'unos': 'some',
    'unas': 'some',
    'de': 'of',
    'del': 'of the',
    'al': 'to the',
    'en': 'in',
    'con': 'with',
    'sin': 'without',
    'y': 'and',
    'o': 'or',
    'pero': 'but',
    'porque': 'because',
    'para': 'for',
    'por': 'for',
    'mi': 'my',
    'tu': 'your',
    'su': 'their',
    'es': 'is',
    'está': 'is',
    'están': 'are',
    'soy': 'am',
    'somos': 'are',
    'son': 'are',
    'tengo': 'have',
    'tiene': 'has',
    'hay': 'there is',
    'también': 'also',
    'más': 'more',
    'menos': 'less',
    'necesito ayuda': 'i need help',
    'no entiendo': "i don't understand",
    'podrías ayudarme': 'could you help me',
    'puedes ayudarme': 'can you help me',
    'estoy de acuerdo': 'i agree',
    'no estoy de acuerdo': 'i disagree',
    'en mi opinión': 'in my opinion',
    'de vez en cuando': 'from time to time',
    'a la izquierda': 'on the left',
    'a la derecha': 'on the right',
    'por supuesto': 'of course',
    'por ejemplo': 'for example',
    'había': 'there was',
    'habrá': 'there will be',
    'yo': 'i',
    'él': 'he',
    'ella': 'she',
    'nosotros': 'we',
    'ellos': 'they',
    'qué': 'what',
    'dónde': 'where',
    'cuándo': 'when',
    'por qué': 'why',
    'cuál': 'which',
    'de quién': 'whose',
    'cómo': 'how',
    'inglés': 'english',
    'español': 'spanish',
  });

  function createPattern(dictionary) {
    const alternatives = Object.keys(dictionary)
      .sort((a, b) => b.length - a.length)
      .map(phrase => phrase.split(/\s+/)
        .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('\\s+'))
      .join('|');
    return new RegExp(`(^|[^\\p{L}\\p{N}])(${alternatives})(?=$|[^\\p{L}\\p{N}])`, 'giu');
  }

  const dictionaries = { 'en-es': enToEs, 'es-en': esToEn };
  const patterns = {
    'en-es': createPattern(enToEs),
    'es-en': createPattern(esToEn),
  };

  function translate(text, direction) {
    const dictionary = dictionaries[direction];
    const pattern = patterns[direction];
    if (!dictionary || !pattern || !text) return text;
    pattern.lastIndex = 0;
    const locale = direction === 'en-es' ? 'en' : 'es';

    return text.replace(pattern, (match, prefix, source) => {
      const translation = dictionary[source.trim().toLocaleLowerCase(locale)];
      if (!translation) return match;
      const letters = source.match(/\p{L}/gu) || [];
      const isUpperCase = letters.length > 0 && source === source.toLocaleUpperCase(locale);
      const startsUpperCase = letters.length > 0 && source[0] === source[0].toLocaleUpperCase(locale);
      let output = isUpperCase ? translation.toLocaleUpperCase(locale) : translation;
      if (!isUpperCase && startsUpperCase) {
        output = output[0].toLocaleUpperCase(locale) + output.slice(1);
      }
      return prefix + output;
    });
  }

  return { translate, verbForms };
})();
