const weddingDate = new Date('2026-08-15T14:00:00');

const schedule = [
  { time: '14:00', title: 'Сбор гостей', description: 'Фуршет, музыка, живое общение.' },
  { time: '15:00', title: 'Выездная церемония', description: 'Трогательный момент в кругу близких.' },
  { time: '16:00', title: 'Банкет', description: 'Ужин, поздравления, первый танец.' },
  { time: '19:00', title: 'Вечеринка', description: 'Танцы, торт и много радости.' },
];

const dressCode = ['Кремовый', 'Пудровый', 'Песочный', 'Оливковый'];

const formatCountdown = (targetDate: Date) => {
  const difference = targetDate.getTime() - Date.now();
  if (difference <= 0) {
    return 'Этот день уже наступил ✨';
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);

  return `${days} дней ${hours} часов ${minutes} минут до нашего дня`;
};

export const App = () => {
  return (
    <div className="page">
      <header className="hero section">
        <p className="eyebrow">Wedding day</p>
        <h1>Анна & Михаил</h1>
        <p className="date">15 августа 2026 · 15:00</p>
        <p className="place">Загородный клуб «Белый сад», Московская область</p>
        <p className="countdown">{formatCountdown(weddingDate)}</p>
        <a className="button" href="#rsvp">
          Подтвердить присутствие
        </a>
      </header>

      <section className="section card story">
        <h2>Дорогие родные и друзья!</h2>
        <p>
          Будем счастливы разделить с вами один из самых важных дней в нашей жизни — день нашей
          свадьбы. Ваше присутствие станет для нас самым ценным подарком.
        </p>
      </section>

      <section className="section card">
        <h2>Программа дня</h2>
        <ul className="timeline">
          {schedule.map((item) => (
            <li key={item.time}>
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
        <p>Будем благодарны, если в ваших образах будут присутствовать спокойные природные оттенки.</p>
        <div className="palette">
          {dressCode.map((color) => (
            <div key={color} className="pill">
              {color}
            </div>
          ))}
        </div>
      </section>

      <section className="section card" id="rsvp">
        <h2>RSVP</h2>
        <p>Пожалуйста, подтвердите присутствие до 1 июля 2026 года.</p>
        <form className="form">
          <label>
            Ваше имя
            <input type="text" name="name" placeholder="Введите имя" />
          </label>
          <label>
            Сможете присутствовать?
            <select name="attending" defaultValue="yes">
              <option value="yes">Да, с радостью!</option>
              <option value="no">К сожалению, не смогу</option>
            </select>
          </label>
          <label>
            Пожелания
            <textarea name="message" rows={4} placeholder="Например, по меню или трансферу" />
          </label>
          <button type="submit">Отправить</button>
        </form>
      </section>
    </div>
  );
};
