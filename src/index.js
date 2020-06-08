const ul = () => document.getElementById('quote-list')

document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/quotes?_embed=likes')
        .then(res => res.json())
        .then(data => data.forEach(renderQuote))
    document.getElementById('new-quote-form').addEventListener('submit', handleSubmit)
})

const handleSubmit = (e) => {
    fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            quote: e.target.quote.value,
            author: e.target.author.value
        })
    })
        .then(res => res.json())
        .then(renderQuote)
}

const renderQuote = (quote) => {
    let blockquote = document.createElement('blockquote')
    let p =  document.createElement('p')
    let li = document.createElement('li')
    let br = document.createElement('br')
    let footer = document.createElement('footer')
    let likeButton = document.createElement('button')
    let deleteButton = document.createElement('button')

    likeButton.addEventListener('click', (e) => handleLike(e, quote.id))
    li.addEventListener('click', (e) => handleDelete(e, quote.id))
    blockquote.className = 'blockquote'
    li.className = 'quote-card'
    p.className = 'mb-0'
    footer.className = 'blockquote-footer'
    likeButton.className = 'btn-success'
    likeButton.innerHTML = `Likes: <span>${quote.likes.length}</span>`
    deleteButton.className = 'btn-danger'
    deleteButton.textContent = 'Delete'
    p.textContent = quote.quote
    footer.textContent = quote.author

    li.append(blockquote, p, footer, br, likeButton, deleteButton)
    ul().appendChild(li)
}

const handleLike = (e, id) => {
    fetch('http://localhost:3000/likes/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            quoteId: id,
            createdAt: Date.now()
        })
    })
        .then(() => e.target.querySelector('span').innerText++)
}

const handleDelete = (e, id) => {
    let li = e.currentTarget
    if (e.target.className === 'btn-danger') {
        fetch(`http://localhost:3000/quotes/${id}`, {
            method: 'DELETE'
        }).then(() => {li.remove()})
    }
}