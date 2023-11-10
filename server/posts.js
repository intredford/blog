// posts.js
import fs from 'fs';

import markdownIt from 'markdown-it';

import { projectPath } from './path.js';
import path from 'path'

import pkg from 'image-size';
const { imageSize } = pkg;

import hljs from 'highlight.js/lib/core';
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
hljs.registerLanguage('css', css);
hljs.registerLanguage('xml', js); // ????

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
        const getImageSize = (src) => {
            const size = imageSize(path.join(projectPath(import.meta.url), src));
            return { width: size.width, height: size.height };
        };

        const token = tokens[idx];
        const src = token.attrs.find(attr => attr[0] === 'src')[1];
        const [width, height] = token.attrs.filter(attr => attr[0] === 'width' || attr[0] === 'height');

        if (src && !width && !height) {
            const { width: imgWidth, height: imgHeight } = getImageSize(src);
            token.attrs.push(['width', imgWidth]);
            token.attrs.push(['height', imgHeight]);
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

export function loadPosts() {
    return fs.readdirSync(postsDirectory) // прочитать посты
        .map(postFilename => {
            const markdown = fs.readFileSync(`${postsDirectory}/${postFilename}`, 'utf8');
            const html = md.render(markdown); // md -> html

            const name = postFilename.split('_')[1].split('.')[0];
            
            const date = parseDate(postFilename.split('_')[0]);

            return { 
                markdown,
				html,
                name,
				date: date,
			};
        })
        .sort((a, b) => b.date.getTime() - a.date.getTime()); // От новых к старым
}