import { FormEvent, useEffect, useMemo, useState } from 'react';

type ProgramItem = {
  time: string;
  title: string;
  description: string;
};

type CalendarDay = {
  label: number;
  isMuted?: boolean;
  isWeddingDay?: boolean;
};

const weddingDate = new Date('2026-07-04T15:00:00+03:00');

const program: ProgramItem[] = [
  {
    time: '14:00',
    title: 'Сбор гостей',
    description: 'Лёгкий welcome-фуршет, объятия и фото.',
  },
  {
    time: '15:00',
    title: 'Выездная церемония',
    description: 'Трогательная регистрация и наши главные слова «Да!».',
  },
  {
    time: '16:30',
    title: 'Праздничный ужин',
    description: 'Поздравления, тосты и уютный вечер в кругу близких.',
  },
  {
    time: '19:30',
    title: 'Вечеринка',
    description: 'Танцы, свадебный торт и незабываемый летний закат.',
  },
];

const details = [
  {
    title: 'Локация',
    text: 'Сабуров Холл — г. Воронеж, Пролетарская, 87в.',
  },
  {
    title: 'Сайт площадки',
    text: 'https://saburovhall.ru/',
  },
  {
    title: 'Подарки',
    text: 'Ваше присутствие — лучший подарок. Если захотите поздравить нас материально, будем благодарны за вклад в наше свадебное путешествие.',
  },
];

const palette = ['#eff8ff', '#dcefff', '#bfdfff', '#95c9f5', '#6faee6'];

const venueImages = [
  'https://static.tildacdn.com/tild6532-3037-4034-a537-393537653632/image_37.webp',
  'https://static.tildacdn.com/tild6566-3435-4635-b838-336164623539/image_38.webp',
  'https://static.tildacdn.com/tild6233-6165-4134-b539-393930653832/20210709-46-Pano.webp',
];

const couplePhotos = [
  {
    title: 'Фото жениха и невесты (VK)',
    image:
      'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1200&q=80',
    link: 'https://vk.com/photos156618815?z=photo156618815_457256115%2Fphoto_feed156618815',
  },
  {
    title: 'Наша история любви',
    image:
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    link: 'https://vk.com/photos156618815?z=photo156618815_457256115%2Fphoto_feed156618815',
  },
];

const july2026Calendar: CalendarDay[] = [
  { label: 29, isMuted: true },
  { label: 30, isMuted: true },
  { label: 1 },
  { label: 2 },
  { label: 3 },
  { label: 4, isWeddingDay: true },
  { label: 5 },
  { label: 6 },
  { label: 7 },
  { label: 8 },
  { label: 9 },
  { label: 10 },
  { label: 11 },
  { label: 12 },
  { label: 13 },
  { label: 14 },
  { label: 15 },
  { label: 16 },
  { label: 17 },
  { label: 18 },
  { label: 19 },
  { label: 20 },
  { label: 21 },
  { label: 22 },
  { label: 23 },
  { label: 24 },
  { label: 25 },
  { label: 26 },
  { label: 27 },
  { label: 28 },
  { label: 29 },
  { label: 30 },
  { label: 31 },
  { label: 1, isMuted: true },
  { label: 2, isMuted: true },
];

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
        <h1>Владимир & Анастасия</h1>
        <p className="date">4 июля 2026 · суббота · 15:00</p>
        <p className="place">Сабуров Холл</p>

        <div className="countdown" aria-live="polite">
          {countdown.isExpired ? (
            <p>Мы уже сказали друг другу «Да!» 💙</p>
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
          Мы с огромной радостью приглашаем вас разделить с нами один из самых счастливых дней в
          нашей жизни. Будем счастливы отметить этот момент вместе с вами.
        </p>
      </section>

      <section className="section card">
        <h2>Наша дата в календаре</h2>
        <div className="calendar-header">
          <strong>Июль 2026</strong>
          <span>Сердечком отмечен наш день — 4 июля</span>
        </div>
        <div className="weekdays">
          <span>Пн</span>
          <span>Вт</span>
          <span>Ср</span>
          <span>Чт</span>
          <span>Пт</span>
          <span>Сб</span>
          <span>Вс</span>
        </div>
        <div className="calendar-grid" aria-label="Календарь июля 2026">
          {july2026Calendar.map((day, index) => (
            <div
              key={`${day.label}-${index}`}
              className={`calendar-day${day.isMuted ? ' muted' : ''}${day.isWeddingDay ? ' wedding' : ''}`}
            >
              <span>{day.label}</span>
              {day.isWeddingDay ? <em aria-hidden="true">❤</em> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="section card">
        <h2>Детали дня</h2>
        <div className="details-grid">
          {details.map((item) => (
            <article key={item.title} className="detail-item">
              <h3>{item.title}</h3>
              {item.text.startsWith('https://') ? (
                <p>
                  <a href={item.text} target="_blank" rel="noreferrer">
                    {item.text}
                  </a>
                </p>
              ) : (
                <p>{item.text}</p>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="section card">
        <h2>Площадка</h2>
        <div className="photo-grid">
          {venueImages.map((image, index) => (
            <img key={image} src={image} alt={`Сабуров Холл, фото ${index + 1}`} loading="lazy" />
          ))}
        </div>
      </section>

      <section className="section card">
        <h2>Жених и невеста</h2>
        <p>
          Добавили блок с нашими фотографиями и ссылкой на VK-альбом. При открытии можно посмотреть
          оригиналы.
        </p>
        <div className="photo-grid couple-grid">
          {couplePhotos.map((photo) => (
            <a key={photo.image} href={photo.link} target="_blank" rel="noreferrer" className="photo-link">
              <img src={photo.image} alt={photo.title} loading="lazy" />
            </a>
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
        <p>Будем рады, если вы поддержите палитру ice blue в нарядах и аксессуарах.</p>

        <div className="palette" aria-label="Рекомендованная цветовая палитра">
          {palette.map((color) => (
            <div key={color} className="swatch" style={{ backgroundColor: color }} title={color} />
          ))}
        </div>
      </section>

      <section className="section card" id="rsvp">
        <h2>RSVP до 1 июня 2026</h2>
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

          {isSubmitted && <p className="success">Спасибо! Мы получили ваш ответ 💙</p>}
        </form>
      </section>
    </div>
  );
};
