// posts.js
import fs from 'fs';
import markdownIt from 'markdown-it';
import { projectPath } from './path.js';
import path from 'path'
import pkg from 'image-size';
const { imageSize } = pkg;

import hljs from 'highlight.js/lib/core';
import css from 'highlight.js/lib/languages/css';
hljs.registerLanguage('css', css);

const md = markdownIt({ 
    html: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(str, { language: lang, ignoreIllegals: true }).value;
          } catch (err) {
            console.error(err)
          }
        }
    
        return ''; // use external default escaping
    }
}).use((md) => {
    md.renderer.rules.image = (tokens, idx, options, env, self) => {
        function getImageSize(src) {
            const size = imageSize(path.join(projectPath(import.meta.url), src));
            return { width: size.width, height: size.height };
        }

        const token = tokens[idx];
        const src = token.attrs[token.attrIndex('src')][1];
        const width = token.attrs.find(attr => attr[0] === 'width');
        const height = token.attrs.find(attr => attr[0] === 'height');

        if (src && !width && !height) {
            const { width: imgWidth, height: imgHeight } = getImageSize(src);
            token.attrPush(['width', imgWidth]);
            token.attrPush(['height', imgHeight]);
        }

        return self.renderToken(tokens, idx, options);
    };
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