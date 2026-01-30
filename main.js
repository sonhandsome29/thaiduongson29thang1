async function GetData() {
    try {
        let res = await fetch('http://localhost:3000/posts')
        if (res.ok) {
            let posts = await res.json();
            let bodyTable = document.getElementById('body-table');
            bodyTable.innerHTML = '';
            for (const post of posts) {
                bodyTable.innerHTML += convertObjToHTML(post)
            }
        }
    } catch (error) {
        console.log(error);
    }
}
async function Save() {
    let id = document.getElementById("id_txt").value;
    let title = document.getElementById("title_txt").value;
    let views = document.getElementById("views_txt").value;

    let getItem = await fetch('http://localhost:3000/posts/' + id);
    if (getItem.ok) {
        let res = await fetch('http://localhost:3000/posts/'+id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                views: views
            })
        })
        
    } else {
        //fetch -> HTTP POST
        let res = await fetch('http://localhost:3000/posts', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                title: title,
                views: views
            })
        })
    }
    GetData();
    return false;

}

function convertObjToHTML(post) {
    return `<tr>
    <td>${post.id}</td>
    <td>${post.title}</td>
    <td>${post.views}</td>
    <td><input type='submit' value='Delete' onclick='Delete(${post.id})'></td>
    </tr>`
}
async function Delete(id) {
    let res = await fetch('http://localhost:3000/posts/' + id, {
        method: "DELETE"
    })
    if (res.ok) {
        GetData()
    }
    return false;
}
GetData();
