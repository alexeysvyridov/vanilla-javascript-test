const modalContainer = document.querySelector("#modal-container")
const getUser = async (id) =>  {
  try {
    const user = await fetch(`http://localhost:4200/api/get-user/${id}`)
    let data = await user.json()
    return data
  } catch (error) {
    console.log(error);
  }
}
    const renderPopUp = (user) => {
        let {location} = user;
        let modalBlock = `
        <div class="card">
          <div class="card-body">
            <div class="d-flex">
            <img  style="width: 250px"   src="../public/pictures/${user.picture}"/>
            <div style="padding: 25px;">
              <p>Username - ${user.username}</p>
              <p>Email - ${user.email}</p>
            </div>
          </div>
            <div class="card-content" style="border: 1px solid #d1d1d1; border-radius: 4px;margin-top: 25px;padding: 25px" >
              <p><span>Firstname</span> - ${user.first_name}</p>
              <p><span>Lastname</span>  - ${user.last_name}</p>
              <p><span>Phone</span>  - ${user.phone_number}</p>
              <p><span>city</span> : ${location.city}</p>
              <p><span>state</span> : ${location.state}</p>
              <p><span>street</span> : ${location.street}</p>
            </div>
        </div>
        </div>
      `;
        modalContainer.innerHTML += modalBlock;
      }
    const initUser = () => {
         const id = JSON.parse(window.localStorage.getItem("user"));
         Promise.resolve(getUser(id)) 
         .then(({user}) => renderPopUp(user))  
     }    
     initUser()