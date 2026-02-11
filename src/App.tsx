import { FormEvent, useEffect, useMemo, useState } from 'react';

type ProgramItem = {
  time: string;
  title: string;
  description: string;
};

const weddingDate = new Date('2026-08-15T15:00:00+03:00');

const program: ProgramItem[] = [
  {
    time: '14:00',
    title: 'Сбор гостей',
    description: 'Лёгкий фуршет, welcome drink и первые объятия.',
  },
  {
    time: '15:00',
    title: 'Выездная церемония',
    description: 'Торжественная регистрация в саду у озера.',
  },
  {
    time: '16:30',
    title: 'Праздничный ужин',
    description: 'Поздравления, тёплые тосты и первый танец.',
  },
  {
    time: '19:30',
    title: 'Вечеринка',
    description: 'Танцы, свадебный торт и музыкальные сюрпризы.',
  },
];

const details = [
  {
    title: 'Локация',
    text: 'Загородный клуб «Белый сад», Московская область',
  },
  {
    title: 'Трансфер',
    text: 'Организуем автобус от м. Славянский бульвар. Подробности пришлём в чате гостей.',
  },
  {
    title: 'Подарки',
    text: 'Ваше присутствие — лучший подарок. Если хотите поздравить нас материально, будем благодарны за вклад в наше свадебное путешествие.',
  },
];

const palette = ['#f2e5d5', '#dcc7b0', '#b8a38f', '#8f7b67'];

const getCountdown = (targetDate: Date, currentTime: number) => {
  const distance = targetDate.getTime() - currentTime;

  if (distance <= 0) {
    return { days: 0, hours: 0, minutes: 0, isExpired: true };
  }

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    isExpired: false,
  };
};

export const App = () => {
  const [now, setNow] = useState(() => Date.now());
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(interval);
  }, []);

  const countdown = useMemo(() => getCountdown(weddingDate, now), [now]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="page">
      <header className="hero section">
        <p className="eyebrow">Wedding invitation</p>
        <h1>Анна & Михаил</h1>
        <p className="date">15 августа 2026 · суббота · 15:00</p>
        <p className="place">Загородный клуб «Белый сад»</p>

        <div className="countdown" aria-live="polite">
          {countdown.isExpired ? (
            <p>Мы уже сказали друг другу «Да!» ✨</p>
          ) : (
            <>
              <div>
                <strong>{countdown.days}</strong>
                <span>дней</span>
              </div>
              <div>
                <strong>{countdown.hours}</strong>
                <span>часов</span>
              </div>
              <div>
                <strong>{countdown.minutes}</strong>
                <span>минут</span>
              </div>
            </>
          )}
        </div>

        <a className="button" href="#rsvp">
          Подтвердить участие
        </a>
      </header>

      <section className="section card story">
        <h2>Дорогие родные и друзья!</h2>
        <p>
          Один прекрасный день изменит нашу жизнь навсегда, и мы хотим разделить его именно с вами.
          Приглашаем вас стать частью нашего праздника любви, нежности и семейного тепла.
        </p>
      </section>

      <section className="section card">
        <h2>Детали дня</h2>
        <div className="details-grid">
          {details.map((item) => (
            <article key={item.title} className="detail-item">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section card">
        <h2>Программа</h2>
        <ul className="timeline">
          {program.map((item) => (
            <li key={item.time + item.title}>
              <span>{item.time}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="section card">
        <h2>Дресс-код</h2>
        <p>
          Мы будем благодарны, если вы поддержите мягкую природную палитру: бежевый, молочный,
          пудровый, карамельный и оливковый оттенки.
        </p>

        <div className="palette" aria-label="Рекомендованная цветовая палитра">
          {palette.map((color) => (
            <div key={color} className="swatch" style={{ backgroundColor: color }} title={color} />
          ))}
        </div>
      </section>

      <section className="section card" id="rsvp">
        <h2>RSVP до 1 июля 2026</h2>
        <p>Пожалуйста, заполните форму, чтобы мы могли комфортно организовать праздник для всех гостей.</p>

        <form className="form" onSubmit={handleSubmit}>
          <label>
            Ваше имя и фамилия
            <input required type="text" name="name" placeholder="Например: Иван Петров" />
          </label>

          <label>
            Сможете присутствовать?
            <select name="attending" defaultValue="yes">
              <option value="yes">Да, с радостью!</option>
              <option value="no">К сожалению, не смогу</option>
            </select>
          </label>

          <label>
            Комментарий
            <textarea
              name="message"
              rows={4}
              placeholder="Например: есть аллергии / нужен трансфер / буду с ребёнком"
            />
          </label>

          <button type="submit">Отправить</button>

          {isSubmitted && <p className="success">Спасибо! Мы получили ваш ответ 💛</p>}
        </form>
      </section>
    </div>
  );
};
