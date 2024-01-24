export default (markdown) => {

    const title = markdown.substring(2, markdown.indexOf('\n')).trim();

    return { title }
}