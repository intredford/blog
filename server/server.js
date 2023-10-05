import express from 'express';
import { loadPosts } from './posts.js';

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

app.get('/', (req, res) => {
	const totalPages = Math.ceil(posts.length / postsPerPage);
	const page = parseInt(req.query.page) || totalPages;
	const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1).reverse();
	const pagePosts = pages[page - 1];

	res.render('layout', { posts: pagePosts, page, pageNumbers, totalPages, query: null, req });
});

app.get('/search', (req, res) => {
	const query = req.query.q;
	if (!query) return res.redirect('/');

	let result = [];

	if (query) {
		result = posts.filter((post) => post.html.toLowerCase().includes(query.toLowerCase())).map((post) => {
			// выделяем совпадения тегом <mark>
			const markedHtml = post.html.replace(new RegExp(query, 'gi'), (match) => `<mark>${match}</mark>`);
			return { ...post, html: markedHtml };
		});
	}

	const totalPages = Math.ceil(result.length / postsPerPage);
	const page = parseInt(req.query.page) || totalPages;
	const pageNumbers = Array.from({ length: totalPages > 0 ? totalPages : 1 }, (_, index) => index + 1).reverse();
	const pagePosts = result.length ? chunkPosts(result, postsPerPage).reverse()[page - 1] : [];

	res.render('layout', { posts: pagePosts, page, pageNumbers, totalPages, query, req });
});

app.listen(port, () => {
	console.log(`Blog server is running on port ${port}`);
});
