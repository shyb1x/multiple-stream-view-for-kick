let streams = [];
let groups = {
    "Red": { color: "red" },
    "Blue": { color: "blue" },
    "Green": { color: "green" },
    "Yellow": { color: "yellow" },
    "Purple": { color: "purple" },
    "Orange": { color: "orange" }
};

function addStream() {
    const usernameInput = document.getElementById('kick-username');
    const username = usernameInput.value.trim();
    if (username && streams.length < 50) {
        streams.push({ username, group: null });
        usernameInput.value = '';
        renderStreamList();
        renderStreams();
    }
}

function removeStream(username) {
    streams = streams.filter(stream => stream.username !== username);
    renderStreamList();
    renderStreams();
}

function toggleStreamList() {
    const streamListContainer = document.getElementById('stream-list-container');
    streamListContainer.classList.toggle('visible');
}

function hideStreamList() {
    const streamListContainer = document.getElementById('stream-list-container');
    streamListContainer.classList.remove('visible');
}

function renderStreamList() {
    const streamList = document.getElementById('stream-list');
    streamList.innerHTML = '';
    streams.forEach(({ username, group }) => {
        const streamItem = document.createElement('div');
        streamItem.classList.add('stream-item');
        streamItem.draggable = true;
        streamItem.ondragstart = (e) => dragStart(e, username);
        streamItem.ondragover = (e) => dragOver(e);
        streamItem.ondrop = (e) => drop(e, username);
        streamItem.innerHTML = `
            <span class="username">${username}</span>
            <select class="group-select" onchange="changeGroup('${username}', this.value)">
                ${Object.keys(groups).map(groupName => `
                    <option value="${groupName}" ${group === groupName ? 'selected' : ''}>${groupName}</option>
                `).join('')}
                <option value="" ${group === null ? 'selected' : ''}>No Group</option>
            </select>
            <button class="remove-btn" onclick="removeStream('${username}')">X</button>
        `;
        streamList.appendChild(streamItem);
    });
}

function renderStreams() {
    const container = document.getElementById('streams-container');
    container.innerHTML = '';
    const numStreams = streams.length;
    const columns = Math.ceil(Math.sqrt(numStreams));
    const rows = Math.ceil(numStreams / columns);
    const streamWidth = Math.min(100 / columns, 16);
    const streamHeight = streamWidth * (9 / 16);

    streams.forEach(({ username, group }) => {
        const streamDiv = document.createElement('div');
        streamDiv.classList.add('stream');
        streamDiv.style.width = `calc(${streamWidth}vw - 10px)`;
        streamDiv.style.height = `calc(${streamHeight}vw - 10px)`;
        if (group) {
            streamDiv.style.borderColor = groups[group].color;
            streamDiv.style.borderWidth = "4px";
            streamDiv.style.borderStyle = "solid";
            streamDiv.style.boxSizing = "border-box";
            streamDiv.style.borderRadius = "10px";
        }
        streamDiv.innerHTML = `<iframe src="https://player.kick.com/${username}" frameborder="0" allowfullscreen scrolling="no"></iframe>`;
        container.appendChild(streamDiv);
    });
}

function changeGroup(username, group) {
    const stream = streams.find(stream => stream.username === username);
    if (stream) {
        stream.group = group;
        renderStreams();
    }
}

function addGroup() {
    const groupName = prompt('Enter group name:');
    if (groupName && !groups[groupName]) {
        const groupColor = prompt('Enter group color:');
        groups[groupName] = { color: groupColor };
        renderStreamList();
    }
}

function editGroup(oldGroupName) {
    const newGroupName = prompt('Enter new group name:', oldGroupName);
    if (newGroupName && newGroupName !== oldGroupName) {
        groups[newGroupName] = groups[oldGroupName];
        delete groups[oldGroupName];
        streams.forEach(stream => {
            if (stream.group === oldGroupName) {
                stream.group = newGroupName;
            }
        });
        renderStreamList();
        renderStreams();
    }
}

function dragStart(e, username) {
    e.dataTransfer.setData('text/plain', username);
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e, targetUsername) {
    const draggedUsername = e.dataTransfer.getData('text/plain');
    const draggedIndex = streams.findIndex(stream => stream.username === draggedUsername);
    const targetIndex = streams.findIndex(stream => stream.username === targetUsername);

    if (draggedIndex !== -1 && targetIndex !== -1) {
        const [draggedStream] = streams.splice(draggedIndex, 1);
        streams.splice(targetIndex, 0, draggedStream);
        renderStreamList();
        renderStreams();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderStreamList();
    renderStreams();
    document.addEventListener('click', (e) => {
        if (!document.querySelector('.header').contains(e.target) && !document.getElementById('stream-list-container').contains(e.target)) {
            hideStreamList();
        }
    });
});
