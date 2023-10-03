// posts.js
import fs from 'fs';
import markdownIt from 'markdown-it';

const md = markdownIt({ 
    html: true,
    // typographer: true,
    // quotes: '«»„“'
});

const postsDirectory = './posts'

// Парсит дату из названий файлов постов: 29-09-23
function parseDate(dateStr) {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(2000 + year, month - 1, day);
}

// Форматирует дату к виду, который показывается в постах: 29 сентября 2023
function getFormattedDate(dateStr) {
    const date = parseDate(dateStr);
    const formattedDate = date.toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

	return { date, formattedDate }
}

export function loadPosts() {
    return fs.readdirSync(postsDirectory) // прочитать посты
        .map(postFile => {
            const markdown = fs.readFileSync(`${postsDirectory}/${postFile}`, 'utf8');
            const html = md.render(markdown); // md -> html
            const dateStr = postFile.split('_')[0];
            const { date, formattedDate } = getFormattedDate(dateStr)

            return { 
				html,
				date: formattedDate, 
				unixTime: date.getTime() // по-дурацки немного :)
			};
        })
        .sort((a, b) => b.unixTime - a.unixTime); // От новых к старым
}