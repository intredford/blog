import express from 'express';
import { loadPosts } from './posts.js';

const app = express();
const port = 3000;
const postsPerPage = 5;
const posts = loadPosts();

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
	const totalPages = Math.ceil(posts.length / postsPerPage);
	const page = parseInt(req.query.page) || totalPages;
	const pageNumbers = Array.from({ length: totalPages }, (_, index) => totalPages - index);
	const startIndex = (page - 1) * postsPerPage;
	const endIndex = startIndex + postsPerPage;
	const pagePosts = posts.slice(startIndex, endIndex);

	res.render('layout', { posts: pagePosts, page, pageNumbers, totalPages });
});

app.listen(port, () => {
	console.log(`Blog server is running on port ${port}`);
});
