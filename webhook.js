import express from 'express';
import { exec } from 'child_process';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config(); // Загрузка переменных окружения из файла .env

const app = express();
const port = 3001;

app.use(express.json());

app.post('/update', (req, res) =>
{
    const { body, headers } = req;
    const secret = process.env.SECRET_KEY;

    // Проверка секретного ключа
    const signature = headers['x-hub-signature'];
    const computedSignature = `sha1=${crypto.createHmac('sha1', secret).update(JSON.stringify(body)).digest('hex')}`;
    if (signature !== computedSignature) {
        console.error('Неверная подпись запроса');
        return res.status(403).send('Forbidden');
    }

    // Выполнение команды git pull для обновления репозитория
    exec('cd /var/www/dima/data/www/rant.dimius.ru# && git pull', (error, stdout) =>
    {
        if (error) {
            console.error(`Ошибка при обновлении: ${error.message}`);
            return res.status(500).send('Internal Server Error');
        }
        console.log(`Репозиторий успешно обновлен: ${stdout}`);
        return res.status(200).send('OK');
    });
});

app.listen(port, () => {
    console.log(`Сервер для вебхука запущен на порту ${port}`);
});