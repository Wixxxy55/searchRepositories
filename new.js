class Search {
    constructor() {
        this.app = document.getElementById('app');

        this.search = this.createElement('div', 'search');
        this.searchInput = this.createElement('input', 'search-input');
        this.searchList = this.createElement('ul', 'search-list');

        this.search.append(this.searchInput);
        this.search.append(this.searchList);
        this.app.append(this.search);

        this.repositories = this.createElement('div', 'repositories');

        this.app.append(this.repositories);

        this.debouncedFetch = this.debounce(this.fetchRepositories.bind(this), 500);
        this.searchInput.addEventListener('input', this.handleInput.bind(this));
    }

    createElement(elementTag, elementClass) {
        const element = document.createElement(elementTag);
        if (elementClass) {
            element.classList.add(elementClass);
        }
        return element;
    }

    debounce(func, delay) {
        let timerId;
        return (...args) => {
            clearTimeout(timerId);
            timerId = setTimeout(() => {
                func(...args);
            }, delay);
        };
    }

    handleInput() {
        this.debouncedFetch();
    }

    fetchRepositories() {
        try {
        const searchTerm = this.searchInput.value.trim();
        if (searchTerm === '') {
            this.searchList.innerHTML = '';
            return;
        }
        fetch(`https://api.github.com/search/repositories?q=${searchTerm}`)
            .then(response => response.json())
            .then(data => {
                this.showAutocomplete(data.items.slice(0, 5));
            })
            .catch(error => console.error(error));
        }
        catch (error) {
            console.log(error);
        }
    }

    showAutocomplete(items) {
    try {
        this.searchList.innerHTML = '';
        items.forEach(item => {
            const li = this.createElement('li', 'search__list-item');
            li.textContent = item.name;
            li.addEventListener('click', () => this.addRepository(item));
            this.searchList.appendChild(li);
        });
    }
    catch (error) {
        console.log(error);
    }
    }

    addRepository(repository) {
    try {
        const repoItem = this.createElement('ul', 'repositories-list');
        repoItem.innerHTML = `
            <li class ="repositories__list-item">Name: ${repository.name}</li> 
            <li class ="repositories__list-item">Owner: ${repository.owner.login}</li>
            <li class ="repositories__list-item">Stars: ${repository.stargazers_count}</li>
            <button class="repositories__btn"></button>
        `;
        const removeBtn = repoItem.querySelector('.repositories__btn');
        removeBtn.addEventListener('click', () => this.repositories.removeChild(repoItem));
        
        this.repositories.appendChild(repoItem);
        
        this.searchInput.value = '';
        this.searchList.innerHTML = '';
    }
    catch (error) {
    console.log(error);
}   
}
}
new Search();