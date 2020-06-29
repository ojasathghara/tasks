function getCookie(name) {
    
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

var activeItem = null;  // to get the item selected


// building list and adding event listeners to individual items
buildList = () => {
    let wrapper = document.getElementById('list-wrapper');
    let url = 'http://localhost:8000/api/task-list/';
    wrapper.innerHTML = '';

    fetch(url)
    .then((resp) => resp.json())
    .then((data) => {
        
        console.log(data);
        let list = data;

        list.forEach((item) => {

            let title_div = `
                        <div style="flex:7" class="title">
                            ${item.title}
                        </div>
                    `
            if (item.completed === true) {
                title_div = `
                    <div style="flex:7" class="title">
                        <strike>${item.title}</strike>
                    </div>
                `
            }
            

            let task = `
                <div id="data-row-${item.id}" class="task-wrapper flex-wrapper">
                    ${title_div}
                    <div style="flex:1">
                        <button class="btn btn-sm btn-outline-info edit">Edit </button>
                    </div>
                    <div style="flex:1">
                        <button class="btn btn-sm btn-outline-dark delete">-</button>
                    </div>
                </div>
            `

            wrapper.innerHTML += task;
        })

        list.forEach((item) => {

            let currentTask = document.getElementById(`data-row-${item.id}`)
            
            // add event listener to edit button
            let editBtn = currentTask.querySelector('.edit');
            editBtn.addEventListener('click', ((item) => {

                return () => {
                    editItem(item)
                }
            })(item));

            // add event listener to delete button
            let deleteBtn = currentTask.querySelector('.delete');
            deleteBtn.addEventListener('click', ((item) => {

                return () => {
                    deleteItem(item);
                }
            })(item));

            // add strike unstrike feature
            let title = currentTask.querySelector('.title');
            title.addEventListener('click', ((item) => {

                return () => {
                    strikeUnstrike(item);
                }
            })(item));
        })
    });
}

// render the list with all functionalities
buildList();


// form submission aka task creation
let form = document.getElementById('form');
form.addEventListener('submit', (e) => {
    
    e.preventDefault();
    console.log('form submitted');

    let url = 'http://localhost:8000/api/task-create/';
    let method = 'POST';
    let id = null;

    // for updating the current item
    if (activeItem != null) {
        url = `http://localhost:8000/api/task-update/${activeItem.id}/`;
        method = 'PUT';
        id = activeItem.id;     // put method requires an id
        activeItem = null;
    }

    // for creating a new item
    let title = document.getElementById('title').value;
    fetch(url, {
        
        method: method,
        headers:{
            'Content-type':'application/json',
            'X-CSRFToken':csrftoken,
        },
        body:JSON.stringify({'id': id,'title':title})
    }
    ).then(function(response){
        buildList();
        form.reset();
    });
});


// editing the items on the list
editItem = (item) => {
    activeItem = item;
    console.log('edit clicked ' + item.title);
    document.getElementById('title').value = activeItem.title;
}

// deleting an item
deleteItem = (item) => {
    console.log('delete clicked ' + item.title);
    
    let url = `http://localhost:8000/api/task-delete/${item.id}/`;
    let method = 'DELETE';
    let id = item.id;

    fetch(url, {
        
        method: method,
        headers:{
            'Content-type':'application/json',
            'X-CSRFToken':csrftoken,
        },
        body:JSON.stringify({'id': id})
    })
    .then((response) => {
        buildList();
    })
}

// a utility function to strike unstrike items
strikeUnstrike = (item) => {
    console.log('item (un)striked ' + item.title);

    let url = `http://localhost:8000/api/task-update/${item.id}/`;
    let method = 'PUT';
    let completedStatus = !item.completed;  // if item has been clicked then we want to invert the state

    fetch(url, {
        
        method: method,
        headers:{
            'Content-type':'application/json',
            'X-CSRFToken':csrftoken,
        },
        body:JSON.stringify({'id': item.id, 'title': item.title, 'completed': completedStatus})
    })
    .then((response) => {
        buildList();
    })
}