import express from 'express';
import { loadPosts } from './posts.js';


const app = express();
const port = 3000;
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

const postsPerPage = 5;
const posts = loadPosts();
const pages = Array.from(
	{ length: Math.ceil(posts.length / postsPerPage) },
	(_, i) => posts.slice(i * postsPerPage, (i + 1) * postsPerPage)
).reverse();

app.get('/', (req, res) =>
{
	const totalPages = Math.ceil(posts.length / postsPerPage);
	const page = parseInt(req.query.page) || totalPages;
	const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1).reverse();

	const pagePosts = pages[page-1]

	res.render('layout', { posts: pagePosts, page, pageNumbers, totalPages });
});

app.listen(port, () =>
{
	console.log(`Blog server is running on port ${port}`);
});
