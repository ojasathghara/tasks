var taskList = [];
var activeItem = null;

buildList = () => {
    let listWrapper = document.getElementById('list-wrapper');
    listWrapper.innerHTML = '';
    // clears the wrapper first to prevent appending same rows twice

    const url = 'http://localhost:8000/api/task-list/';

    fetch(url)
    .then(data => data.json())
    .then((tasks) => {
        
        taskList = tasks;

        console.log(tasks);
        for (let i in tasks) {

            // console.log(task);

            let taskItem = `
                <div id="data-row-${i}" class="task-wrapper flex-wrapper">
                    <div style="flex:7">
                        ${tasks[i].title}
                    </div>
                    <div style="flex:1">
                        <button class="btn btn-sm btn-outline-info edit">Edit </button>
                    </div>
                    <div style="flex:1">
                        <button class="btn btn-sm btn-outline-dark delete">-</button>
                    </div>
                </div>
            `
            listWrapper.innerHTML += taskItem;
        }
    });
}


// copied from https://docs.djangoproject.com/en/3.0/ref/csrf/ to generate requred csrf token
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


// upload a task
let form = document.getElementById('form')
form.addEventListener('submit', (e) => {
    e.preventDefault(); // prevents default submission of the form to customize it
    
    let url = 'http://localhost:8000/api/task-create/';

    // for editing and deleting 
    if (activeItem != null) {
        url = `http://localhost:8000/api/task-update/${activeItem.id}`;
        activeItem = null;
    }

    const task_title = document.getElementById('title').value;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({title: task_title})   // this contains the data we want to send
    }).then((response) => {
        buildList();
        document.getElementById('form').reset();
    }); // we want the buildList to be called again so that it will rebuild the list after adding the task
    // the fetch is promised based so we used then, we don't want to do anything with response
    
    console.log('form submitted');
});


buildList()