for (let i in list) {

    let item = `
        <div id="data-row-${i}" class="task-wrapper flex-wrapper">
            <div style="flex:7">
                ${list[i].title}
            </div>
            <div style="flex:1">
                <button class="btn btn-sm btn-outline-info edit">Edit </button>
            </div>
            <div style="flex:1">
                <button class="btn btn-sm btn-outline-dark delete">-</button>
            </div>
        </div>
    `
    wrapper.innerHTML += item;
}

for (let i in list) {
    let editBtn = document.getElementsByClassName('edit')[i];
    editBtn.addEventListener('click', (item) => {
        
        return function() {
            editItem(item);
        }
    })(list[i]);
}