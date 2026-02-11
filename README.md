# Wedding Invitation

Одностраничный сайт-приглашение на свадьбу на React + TypeScript.

## Совместимость

Проект актуализирован под современные версии инструментов:

- Vite 7
- React 19
- TypeScript 5

> Требуется **Node.js 20.19+** и npm 10+.

## Установка и запуск

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
```

## Важно

Если раньше вы работали на старом стеке (Node 12 / Vite 2), переустановите зависимости с нуля:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Кастомизация

Основной контент вынесен в `src/App.tsx`:

- дата свадьбы: `weddingDate`;
- программа: `program`;
- блок деталей: `details`;
- палитра дресс-кода: `palette`.
