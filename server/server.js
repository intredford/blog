import express from 'express';
import { loadPosts } from './posts.js';
import getMeta from './utils/get-meta.js'

import ejs from 'ejs';

const app = express();
const port = 3000;

import compression from 'express-compression';
app.use(compression());

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

const posts = loadPosts();

const defaultTitle = 'Дима / разглагольствования'
const defaultDescription = 'Блог'

const meta = {
	title: defaultTitle,
	description: defaultDescription
}

const index = await ejs.renderFile('views/layout.ejs', { posts, index: true, meta });

app.get('/', (req, res) => {
	res.send(index)
})

app.get('/post/:name', (req, res) => {
	const post = posts.find(post => post.name === req.params.name);

	if (post) {
		const { title } = getMeta(post.markdown)
		const meta = {
			title: `${title} @ ${defaultTitle}`,
			description: ''
		}

		res.render('layout', { 
			posts: [ post ],
			index: false,
			req,
			meta
		});
	} else {
		res.status(404).send(
`<!DOCTYPE html>
<head><title>404 @ ${defaultTitle}</title></head>
<pre>
<b>404 / Не найдено</b>

Пост "${req.url}" не неписан или был удалён.
Связаться можно по mail@dimius.ru

<a href = "/">На главную</a>

---

<b>404 / Not Found</b>

The post "${req.url}" has not been written yet or has been moved/deleted.
You can contact us at mail@dimius.ru

<a href="/">Go to Homepage</a>
</pre>
<style>pre{line-height:1.4;white-space:break-spaces;}</style>`
		)
	}
})

app.listen(port, () => {
	console.log(`Blog server is running on port ${port}`);
});