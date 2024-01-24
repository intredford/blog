import express from 'express';
import { loadPosts } from './posts.js';
import getMeta from './utils/get-meta.js'

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

const chunkPosts = (posts, perPage) => {
	return Array.from(
		{ length: Math.ceil(posts.length / perPage) },
		(_, i) => posts.slice(i * perPage, (i + 1) * perPage)
	);
};

const postsPerPage = 5;
const posts = loadPosts();
const pages = chunkPosts(posts, postsPerPage).reverse();

const defaultTitle = 'Дима / разглагольствования'
const defaultDescription = 'Блог'

app.get('/', (req, res) => {
	const totalPages = Math.ceil(posts.length / postsPerPage);
	const page = parseInt(req.query.page) || totalPages;
	const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1).reverse();
	const pagePosts = pages[page - 1];

	const meta = {
		title: defaultTitle,
		description: defaultDescription
	}

	res.render('layout', { posts: pagePosts, page, pageNumbers, totalPages, query: null, req, meta });
});

app.get('/search', (req, res) => {
	const query = req.query.q;
	if (!query) return res.redirect('/');

	let result = [];

	if (query) {
		result = posts.filter((post) => {
			const text = post.markdown.replace(/<[^>]*>/g, "").toLowerCase();
			return text.includes(query.toLowerCase())
		}).map((post) => {
			// выделяем совпадения тегом <mark>
			const markedHtml = post.html.replace(new RegExp(query, 'gi'), (match) => `<mark>${match}</mark>`);
			return { ...post, html: markedHtml };
		});
	}

	const totalPages = Math.ceil(result.length / postsPerPage);
	const page = parseInt(req.query.page) || totalPages;
	const pageNumbers = Array.from({ length: totalPages > 0 ? totalPages : 1 }, (_, index) => index + 1).reverse();
	const pagePosts = result.length ? chunkPosts(result, postsPerPage).reverse()[page - 1] : [];

	const meta = {
		title: `"${query}" @ ${defaultTitle}`,
		description: `Поиск по запросу "${query}"`
	}

	res.render('layout', { posts: pagePosts, page, pageNumbers, totalPages, query, req, meta });
});

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
			req,
			page: 1,
			pageNumbers: [ 1 ],
			totalPages: 1,
			query: '',
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
