import axios from 'axios';
import { Bot, Keyboard } from 'grammy';
import iconv from 'iconv-lite';

import dotenv from 'dotenv';
dotenv.config();

const bot = new Bot(process.env.BOT_HOHOTUN_KEY);

async function fetchJoke(category) {
  try {
    const response = await axios.get(`http://rzhunemogu.ru/RandJSON.aspx?CType=${category}`, {
      responseType: 'arraybuffer',
    });

    const decodedResponse = iconv.decode(Buffer.from(response.data, 'binary'), 'win1251');
    const joke = decodedResponse
      .substring(1, decodedResponse.length - 3)
      .replace('"content":"', '');

    return joke;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const categories = {
  JOKE: 'Анекдот',
  JOKE_ADULT: '🔞Анекдот 18+',
  TOAST: 'Тост',
  APHORISM: 'Афоризм',
  POEM: 'Стишок',
};

const buttons = [
  categories.JOKE,
  categories.JOKE_ADULT,
  categories.TOAST,
  categories.APHORISM,
  categories.POEM,
];

const keyboard = new Keyboard()
  .text(categories.JOKE)
  .text(categories.JOKE_ADULT)
  .row()
  .text(categories.TOAST)
  .text(categories.APHORISM)
  .text(categories.POEM)
  .resized();

bot.command('start', (ctx) => {
  const userId = ctx.message.from;
  console.log(userId);

  ctx.reply('Ну что, будем надрывать животики от смеху?🤡', {
    reply_markup: keyboard,
  });
});

bot.hears([...buttons], async (ctx) => {
  const clickedButton = ctx.message.text;
  let joke;

  switch (clickedButton) {
    case categories.JOKE:
      joke = await fetchJoke('1');
      break;
    case categories.JOKE_ADULT:
      joke = await fetchJoke('11');
      break;
    case categories.TOAST:
      joke = await fetchJoke('6');
      break;
    case categories.APHORISM:
      joke = await fetchJoke('4');
      break;
    case categories.POEM:
      joke = await fetchJoke('3');
      break;
    default:
      break;
  }

  ctx.reply(joke);
});

bot.on('message', (ctx) =>
  ctx.reply('Чтобы выбрать категрию, открой нижнее меню! или пропиши /start')
);

bot.start();
