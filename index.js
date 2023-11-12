require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express();

const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


app.use(cors());
app.use(express.json());

const conversations = [];

app.post('/compliant', async (req, res) => {
    const { conversationId, message, mode = 'DEBATIENDO' } = req.body;

    if (!conversations[conversationId]) conversations[conversationId] = mode == "DEBATIENDO" ? [
        {
            role: 'system',
            content: 'Como inteligencia artificial, Eris, te encargaras de ayudar al usuario mediante el debate siguiendo los siguientes puntos: 1- Tener la idea del debate proporcionada por el usuario 2- Obtener la argumentación del usuario(No escribirla) 3- Entender la postura del usuario, sus argumentos y puntos(No escribirla) 4- Identificar las debilidades y las inconsistencias, así como las lagunas del razonamiento (No escribirla) -Enfocarse en donde la idea principal es carente o ideas alternativas que pueden ser introducidas(No escribirla) 5- Construir una argumentación contraria basado en el punto 4, construir la argumentación contraria teniendo en cuenta: -Refutación -Puntos de vista alternativos -Preguntas atacando el argumento rival -Información adicional (Información relevante), deberás responder únicamente con tu respuesta (formulada con base al proceso) al mensaje del usuario'
        },

        {
            role: 'system',
            content: 'Estas siendo utilizado en un cliente programado por el equipo de Eris, por lo que debes de dar solo y únicamente la respuesta, una respuesta concisa, solida y no muy larga, no te repitas a menos que reiteres algo, en ese caso, indica que estás reiterando'
        }
    ] : [
        {
            role: 'system',
            content: 'Como inteligencia artificial, Eris, tomando en cuenta la siguiente información proporcionada en la primera interacción: - Idea proporcionados por el usuario(No escribir) - Criterios y los valores proporcionados por el usuario(No escribir). Te encargaras de ayudar al usuario mediante el aterrizaje de ideas siguiendo el siguiente algoritmo que debes repetir durante el intercambio de ideas: 1- tomarás siempre los mismos criterios y valores proporcionados en el primer mensaje 2- a partir de la segunda respuesta, se te enviará una idea nueva que agregarás a la base de conocimiento para: 3- Entender la idea del usuario, sus criterios y valores(No escribirla). 4- Identificar las posibilidades de mejora en la idea del usuario, tomando en cuenta un análisis FODA de la idea principal en base de los criterios y valores (No escribir) -Enfócate en cómo acercar la idea más a un concepto concreto y no ambiguo (No escribir) 5- Con los resultados del FODA anterior, construye una lista de 3 elementos que concreten la idea del usuario (sin olvidarse de alguno: debatir, profundizar, reformular) de la siguiente forma: (Escribir) - Debatir: Cuestionar una respuesta del usuario. - Profundizar: Obtener más información para consolidar la idea. - Reformular: Confirmar al usuario si es que esta seguro de tomar esa idea y reformular la idea a otra posible similar o con mejor estadística de éxito.'
        },
        {
            role: 'system',
            content: 'con los resultados del FODA, idea y construye una lista de 3 sugerencias directas que concreten la idea del usuario y así seleccione alguna (sin omitir uno de ellos: debatir, sugerencia #1, sugerencia #2) de la siguiente forma: (NO EXPLIQUES NADA DEL PROCESO LLEVADO, ESCRIBIR SOLO LOS SIGUIENTES 3 ELEMENTOS EN LA RESPUESTA) -Debatir: Cuestionar una respuesta del usuario. -SUGERENCIA #1: HAS UNA SUGERENCIA DE MÁXIMO 4 PALABRAS PARA COMPLEMENTAR LA IDEA. -SUGERENCIA #2: HAS UNA SUGERENCIA DE MÁXIMO 4 PALABRAS PARA COMPLEMENTAR LA IDEA. EJEMPLO PARA IDEA PAGINA DE MEMES: -Debatir: ¿Sabes como hacer una página web? -Sugerencia #1: Implementa una interfaz vertical -Sugerencia #2: Publica memes variados'
        }
    ];

    const chatMessage = {
        role: 'user',
        content: message,
    };

    conversations[conversationId].push(chatMessage);

    const chatCompletion = await openai.chat.completions.create({
        messages: conversations[conversationId],
        model: "gpt-3.5-turbo-1106",
        max_tokens: 100,
        temperature: 0.3
    });

    console.log(conversations[conversationId]);

    console.log(chatCompletion);

    res.send(chatCompletion.choices[0].message);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));