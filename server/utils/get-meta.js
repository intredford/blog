export default (markdown) => {

    markdown = markdown.replace(/\n/g, ' ')

    const title = (/^#\s*(.*)$/gm).exec(markdown)[1].trim()

    const description = 'Пост: ' + markdown.replace(/^#\s*(.*)$/gm, '').split(' ').slice(2, 12).join(' ') + '...'

    return { title, description }
}