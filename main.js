async function GetPosts() {
    try {
        let res = await fetch('http://localhost:3000/posts')
        if (res.ok) {
            let posts = await res.json();
            let bodyTable = document.getElementById('body-table');
            bodyTable.innerHTML = '';
            for (const post of posts) {
                bodyTable.innerHTML += convertPostToHTML(post)
            }
        }
    } catch (error) {
        console.log(error);
    }
}
async function GetComments() {
    try {
        let res = await fetch('http://localhost:3000/comments')
        if (res.ok) {
            let comments = await res.json();
            let bodyTable = document.getElementById('body-comment-table');
            bodyTable.innerHTML = '';
            for (const comment of comments) {
                bodyTable.innerHTML += convertCommentToHTML(comment)
            }
        }
    } catch (error) {
        console.log(error);
    }
}
function getNextId(items) {
    let maxId = items.reduce((max, item) => {
        let numericId = parseInt(item.id, 10);
        return Number.isNaN(numericId) ? max : Math.max(max, numericId);
    }, 0);
    return String(maxId + 1);
}
async function SavePost() {
    let id = document.getElementById("id_txt").value.trim();
    let title = document.getElementById("title_txt").value;
    let views = document.getElementById("views_txt").value;

    if (id !== '') {
        let getItem = await fetch('http://localhost:3000/posts/' + id);
        if (getItem.ok) {
            let post = await getItem.json();
            await fetch('http://localhost:3000/posts/' + id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: String(id),
                    title: title,
                    views: views,
                    isDeleted: post.isDeleted ?? false
                })
            })
            GetPosts();
            return false;
        }
    }

    let allPosts = await fetch('http://localhost:3000/posts');
    let posts = allPosts.ok ? await allPosts.json() : [];
    let nextId = getNextId(posts);

    await fetch('http://localhost:3000/posts', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: nextId,
            title: title,
            views: views,
            isDeleted: false
        })
    })
    GetPosts();
    return false;
}

async function SaveComment() {
    let id = document.getElementById("comment_id_txt").value.trim();
    let text = document.getElementById("comment_text_txt").value;
    let postId = document.getElementById("comment_post_id_txt").value;

    if (id !== '') {
        let getItem = await fetch('http://localhost:3000/comments/' + id);
        if (getItem.ok) {
            await fetch('http://localhost:3000/comments/' + id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: String(id),
                    text: text,
                    postId: String(postId)
                })
            })
            GetComments();
            return false;
        }
    }

    let allComments = await fetch('http://localhost:3000/comments');
    let comments = allComments.ok ? await allComments.json() : [];
    let nextId = getNextId(comments);

    await fetch('http://localhost:3000/comments', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: nextId,
            text: text,
            postId: String(postId)
        })
    })
    GetComments();
    return false;
}

function convertPostToHTML(post) {
    let deletedClass = post.isDeleted ? 'deleted-post' : '';
    return `<tr class='${deletedClass}'>
    <td>${post.id}</td>
    <td>${post.title}</td>
    <td>${post.views}</td>
    <td><input type='submit' value='Delete' onclick='DeletePost("${post.id}")'></td>
    </tr>`
}
function convertCommentToHTML(comment) {
    return `<tr>
    <td>${comment.id}</td>
    <td>${comment.text}</td>
    <td>${comment.postId}</td>
    <td><input type='submit' value='Delete' onclick='DeleteComment("${comment.id}")'></td>
    </tr>`
}
async function DeletePost(id) {
    await fetch('http://localhost:3000/posts/' + id, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            isDeleted: true
        })
    })
    GetPosts();
    return false;
}
async function DeleteComment(id) {
    let res = await fetch('http://localhost:3000/comments/' + id, {
        method: "DELETE"
    })
    if (res.ok) {
        GetComments()
    }
    return false;
}
GetPosts();
GetComments();
