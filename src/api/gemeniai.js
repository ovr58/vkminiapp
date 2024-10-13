import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from "@google/generative-ai"
  
  const apiKey = import.meta.env.VITE_APP_GEMENI_API_KEY

  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-8b",
    systemInstruction: "ты русский писатель сказок для детей, используешь все наследие русского фольклора, русской классики, при этом и европейских классиков, стиль твоего письма близок к Пушкину, к русским народным сказкам, Бажову.",
  });
  
  const generationConfig = {
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  
export const chatSession = model.startChat({
    generationConfig,
// safetySettings: Adjust safety settings
// See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [
    {
        role: "user",
        parts: [
        {text: "напиши сказку для детей 3-5 лет, содержащую пять глав, образовательную по содержанию, к каждой главе нужно сгенерировать промт для иллюстрации к этой главе, а также сгенерировать промт для иллюстрации на обложку книги, во всех промптах иллюстраций все слова и Имена должны быть переведены на английский или, если нет перевода, писаться латиницей, , а название и тексты глав на русском языке, история должна иметь название и содержание, которое соответствует такому содержанию: мальчик Ваня пошел в волшеюную школу, все происходит в России и главный герой переживает приключения, в которых узнает много нового о природе и мире, его друзьями становятся разные персонажи из русских сказок, сюжет должен быть не сложным, но последовательным и заканчиваться все должно хорошо результат должен быть представлен в JSON\n"},
        ],
    },
    {
        role: "model",
        parts: [
        {text: "```json\n{\n  \"book_title\": \"Иван и Магическая Школа\",\n  \"target_age\": \"3-8 years\",\n  \"author\": \"Ваш доброжелательный помощник\",\n  \"chapters\": [\n    {\n      \"chapter_number\": 1,\n      \"title\": \"Приключение в пути\",\n      \"text\": \"Жил-был в красивой русской деревеньке мальчик Иван. Он очень любил читать книги, особенно те, что рассказывали о чудесах природы и таинственных науках. Однажды, Иван получил письмо! В нём было приглашение учиться в удивительной Магической Школе, где учились волшебники и чародеи, знающие все тайны Вселенной. Решил Иван отправиться в путь. На плечи он взял большой рюкзак, полный книг и записок. Путь его лежал через густые леса, наполненные загадками, через искрящиеся реки, переполненные чудесами.\",\n      \"illustration_prompt\": \"Paper cut style illustration of a young boy, Ivan, wearing a simple, traditional Russian shirt and pants, with a large backpack on his back. He's walking through a lush forest with glowing, fantastical trees.  The trees should appear to be made of paper, with intricate detail in their branches. Soft, warm color palette.\",\n      \"keywords\": [\"travel\", \"education\", \"nature\"]\n    },\n    {\n      \"chapter_number\": 2,\n      \"title\": \"Встреча с Лешим\",\n      \"text\": \"Проходя через дремучий лес, Иван встретил Лешего. Леший, густо заросший зеленью и мхом, удивился, увидев мальчика с таким количеством книг.  Леший объяснил Ивану, что в лесу можно найти много полезного, если умеешь слушать его голоса, а затем в своих книгах Иван узнал об удивительном лекарстве, которое прячется в глубоких корнях, и Леший показал ему как найти это растение.  Иван помог Лешему вылечить больного ёжика, и Леший подарил мальчику волшебную ягоду, которая помогала понимать язык птиц.\",\n      \"illustration_prompt\": \"Paper cut style illustration of Ivan meeting a friendly, yet slightly mysterious Leshy (forest spirit) in the forest. The Leshy is surrounded by foliage and mushrooms. Ivan has a book in one hand and is listening intently to the Leshy's words.\",\n      \"keywords\": [\"forest\", \"spirit\", \"medicine\"]\n    },\n    {\n      \"chapter_number\": 3,\n      \"title\": \"Тайны речных волн\",\n      \"text\": \"На реке, которая переливала всеми цветами радуги, Иван встретил русалочку Арину, дочь водного царя. Арина рассказала Ивану о загадках речных волн и о тайнах водных глубин. С помощью волшебной книги, Иван узнал, что каждая волна несет в себе информацию о временах года и о том, как меняется природа. Послушайте, как волны шепчут секреты реки!\",\n      \"illustration_prompt\": \"Paper cut style illustration of Ivan and a beautiful, paper-thin, graceful mermaid, named Arina, sitting near a river. The river is depicted with flowing, animated water.  The colors of the river should mirror the rainbow, with a soft focus on the foreground. \",\n      \"keywords\": [\"water\", \"nature's secrets\", \"mythology\"]\n    },\n    {\n      \"chapter_number\": 4,\n      \"title\": \"В гостях у Бабы-Яги\",\n      \"text\": \"Долго шел Иван и дошел до избушки на курьих ножках. В ней жила Баба-Яга, знаменитая ведьма, но удивительно мудрая. Иван познакомился с её помощниками, узнал о чудесах, которые таятся в природе.  Именно Баба-Яга объяснила Ивану, что тайны находятся не только в книгах, но и в природе, в волшебных травах, которые  собирают в нужные дни.\",\n      \"illustration_prompt\": \"Paper cut style illustration of Ivan visiting Baba Yaga's hut on chicken legs. The hut should be elaborate, and appear to be made of paper, with intricate carvings and patterns on the exterior. Baba Yaga herself should be stylish and not scary, with an air of wisdom.\",\n      \"keywords\": [\"folklore\", \"wisdom\", \"nature's magic\"]\n    },\n    {\n      \"chapter_number\": 5,\n      \"title\": \"В Магической Школе\",\n      \"text\": \"Наконец, Иван добрался до Магической Школы! Там он встретил много друзей – Кощея Бессмертного, который оказался удивительно добрым и веселым рассказчиком, и Снегурочку, которая делилась тайнами зимних холодов.  Все узнали друг друга из книг, и Иван, с новыми друзьями, вместе изучал тайны природы и Вселенной.  Вместе они с радостью отправились в захватывающие приключения!\",\n      \"illustration_prompt\": \"Paper cut style illustration of Ivan entering the magical school. The school should be magnificent, resembling a castle or a wondrous tower made of paper. Ivan is surrounded by other children, some of whom resemble characters from Russian folklore.\",\n      \"keywords\": [\"friendship\", \"knowledge\", \"discovery\"]\n    }\n  ],\n  \"cover_prompt\": \"Paper cut style illustration showcasing Ivan in front of a magical school, potentially with a school crest or emblem.  The school could be a castle, a tower, or another fantastical structure made from paper.  The background should suggest a landscape with Russian elements, forests and a bright, inviting sky. Use a warm colour palette, with a touch of gold or silver for highlighting.\"\n}\n```"},
        ],
    },
    ],
});
  