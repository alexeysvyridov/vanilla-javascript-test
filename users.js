

const root = document.querySelector('.row');
const ul = document.querySelector(".pagination");

const getAllUsers = async() => {
    try {
      let res = await fetch("http://localhost:4200/api/get-users")
      const data =  await res.json()
      return data
    } catch (error) {
      console.log(error);
    }
  }


class Users {
  constructor(users) {
    this._users = users || [];
    this._user = {};
    this.page_sum = null;
    this.current_page = 1;
  }
}

class Utils extends Users {
  constructor(data) {
    super(data)
    this.setPaginationButtons = this.setPaginationButtons.bind(this)
    this.setPage = this.setPage.bind(this)
    this.getIndex = this.getIndex.bind(this)
    this.limit = 10;
  }

  renderUserCard() {
    const list = document.querySelector(".list-users")
    list.addEventListener('click', this.getIndex)
    let start = (this.current_page - 1) * this.limit;
    let per_page_limit = this.current_page * this.limit;
    let users =  this.getUsers().slice()
    root.innerHTML = ""
    for(var i = start; i < per_page_limit && i < users.length; i++) {
        let user = users[i];   
        
      let card =   `<div class="card col-xs-12 col-sm-3 col-md-3 m-1 p-2 align-middle">
        <img class="card-img-top" src="../public/pictures/${user.picture}"></img>
        <div class="card-body" style="height: 200px">
          <h6 class="card-title">${user.username}</h6>
          <p class="card-text">
            <span>${user.first_name}</span>
            <span>${user.last_name}</span>
          </p>
          <a href="#" data-id="${user.id}" 
          class="btn btn-primary user-details" 
          style="position:absolute; bottom:23px">
            Details
          </a>
        </div>
      </div>
      `
      list.innerHTML += card
    }
  }
  getUsers() {
    return this._users;
  }

  setUpPaginaton(limit=10) {
    this.limit = limit;
    this.page_sum = Math.ceil(this._users.length / limit);
    this.setPaginationButtons(this.page_sum, this.current_page);
  }
  setPaginationButtons(pages, current_page) {
    ul.innerHTML = ""
    ul.addEventListener('click', this.setPage)
    for(let i=1; i < pages; i++) {
      let li;
      if(current_page === i) {
        li = `
          <li class="page-item active">
            <a href="#" class="page-link" data-a="${i}">${i}</a>
          </li>
        `
      } else {
        li = `
          <li class="page-item" data-li="${i}">
            <a href="#" class="page-link" data-a="${i}">${i}</a>
          </li>
        `
      }
      ul.innerHTML += li;
    }
  }
  getIndex(e) {
    let id = e.target.dataset.id;
    if(id === undefined) {
      return
    }
    var searchParams = new URLSearchParams(window.location.search);
    searchParams.set("id", `${id}`);
    var newRelativePathQuery = "user.html" + '?' + searchParams.toString();
    history.pushState(null, '', newRelativePathQuery);
    window.location = newRelativePathQuery;
  }
  setPage(e) {
    let id = e.target.dataset.a;
    let prev_node = document.querySelector(".active")
    if(prev_node) {
      prev_node.classList.remove("active")
    } 
    let li = document.querySelector(`[data-li="${id}"]`)
    li.classList.add("active")
    this.current_page = id;  
    this.renderUserCard()
  }
  refreshPage() {
    this.current_page = 1;
    this.page_sum = null;
  }
}

let utils;
const users = new Users()

const initUsers = 
  Promise.resolve(getAllUsers())  
  .then((data) => {
    utils = new Utils(data)
    utils.setUpPaginaton()
    utils.renderUserCard()
  })
  .catch(err => console.log(err));

  const paginationBtn = (e) => {
    utils.refreshPage()
    utils.setUpPaginaton(+e.value)
    utils.renderUserCard()
  }

