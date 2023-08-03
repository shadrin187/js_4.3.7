const searchForm = document.querySelector(".search__box");
const input = searchForm.querySelector(".search__box input");
const autocomplete = searchForm.querySelector(".autocomplete");

const wrapper = document.createElement('div')
wrapper.classList.add('wrapper')

const debounce = (fn, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

class Card {
  constructor(obj) {
    this.name = obj.name;
    this.owner = obj.owner.login;
    this.stars = obj.stargazers_count;
  }

  createElement(elementTag, elementClass) {
    const element = document.createElement(elementTag);
    if (elementClass) {
      element.classList.add(elementClass);
    }
    return element;
  }

  addElements(array) {
    const fragment = document.createDocumentFragment();

    array.forEach((item) => {
      const repo = this.createElement("div", "choosed-repo");
      const repoInfo = this.createElement("div", "repo-wrapper");
      const repoDelete = this.createElement("div", "btn-wrapper");
      const repoName = this.createElement("p", 'repo-name');
      const repoOwner = this.createElement("p", 'repo-owner');
      const repoStars = this.createElement("p", 'repo-stars');

      repoName.textContent = `Name: ${item.name}`;
      repoOwner.textContent = `Owner: ${item.owner.login}`;
      repoStars.textContent = `Stars: ${item.stargazers_count}`;

      const btn = this.createElement("button", "btn");
      const span = this.createElement("span", "cross");
      btn.appendChild(span);
      btn.appendChild(span.cloneNode(true));
      btn.addEventListener("click", () => {
      repo.remove();
      });

      repoInfo.appendChild(repoName);
      repoInfo.appendChild(repoOwner);
      repoInfo.appendChild(repoStars);
      repoDelete.appendChild(btn);

      repo.appendChild(repoInfo);
      repo.appendChild(repoDelete);

      fragment.appendChild(repo);
      wrapper.appendChild(fragment)
      searchForm.appendChild(wrapper);
    });
  }
}

async function getRepo(repoObj) {
  try {
    const data = await fetch(`https://api.github.com/search/repositories?q=${repoObj}&per_page=5`);
    const response = await data.json();
    return response.items;
  } catch (error) {
    throw new Error("error");
  }
}

function showRepo(arr) {
  autocomplete.textContent = "";
  autocomplete.classList.remove('autocomplete_hidden')
  arr.forEach(obj => {
    const repoList = document.createElement("li");
    repoList.textContent = obj.name;
    repoList.classList.add("show-repo-list");
    repoList.setAttribute('tabIndex', 0)
    repoList.addEventListener("click", () => {
      const repoCollection = [];
      repoCollection.push(obj);
      const card = new Card(obj)
      card.addElements(repoCollection);
      input.value = "";
      autocomplete.classList.add('autocomplete_hidden')      
    });

    repoList.addEventListener('keyup', e => {
      if( e.code === 'Enter' ) {
        const repoCollection = [];
        repoCollection.push(obj);
        const card = new Card(obj)
        card.addElements(repoCollection);
        input.value = "";
        autocomplete.classList.add('autocomplete_hidden')  
      }
    })
    autocomplete.appendChild(repoList);
  });
}

input.addEventListener("input", debounce(async e => {
    if (e.target.value) {
      const repository = await getRepo(e.target.value);
      showRepo(repository);
    } else {
      autocomplete.textContent = "";
    }
  }, 500)
);
