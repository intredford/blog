// Скрипт для оборачивания изображений в тег <a> с target="_blank"
const postImages = document.querySelectorAll('.post img');
postImages.forEach(image => {
	const parentLink = document.createElement('a');
	parentLink.href = image.src;
	parentLink.target = '_blank';
	image.parentNode.replaceChild(parentLink, image);
	parentLink.appendChild(image);
});