let baseUrl = "https://tarmeezacademy.com/api/v1";
function loginBtnClicked() {
  toggleLoader();
  let username = document.getElementById("username-input").value;
  let password = document.getElementById("password-input").value;
  let params = {
    username: username,
    password: password,
  };
  axios
    .post(`${baseUrl}/login`, params)
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      let modal = document.getElementById("login-modal");
      let modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("Logged In Successfully", "success");
      setupUI();
      getPosts();
    })
    .catch((error) => {
      let message = error.response.data.message;
      showAlert(message, "danger");
    })
    .finally(() => {
      toggleLoader(false);
    });
}
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  showAlert("Logged Out Successfully", "success");
  setupUI();
  getPosts();
}
function setupUI() {
  let token = localStorage.getItem("token");
  let loginDiv = document.getElementById("login-div");
  let logoutDiv = document.getElementById("logout-div");
  let addBtn = document.getElementById("add-btn");
  if (token == null) {
    if (addBtn != null) {
      addBtn.style.setProperty("display", "none", "important");
    }

    loginDiv.style.setProperty("display", "flex", "important");
    logoutDiv.style.setProperty("display", "none", "important");
  } else {
    if (addBtn != null) {
      addBtn.style.setProperty("display", "block", "important");
    }

    loginDiv.style.setProperty("display", "none", "important");
    logoutDiv.style.setProperty("display", "flex", "important");
    let user = getCurrentUser();
    document.getElementById("nav-username").innerHTML = user.username;
    document.getElementById("nav-userimg").src = user.profile_image;
  }
}
function showAlert(customMessage, type) {
  const alertPlaceholder = document.getElementById("success-alert");
  const alert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");
    alertPlaceholder.append(wrapper);
  };
  alert(customMessage, type);
}
function registerBtnClicked() {
  toggleLoader();
  let name = document.getElementById("register-name-input").value;
  let userName = document.getElementById("register-username-input").value;
  let password = document.getElementById("register-password-input").value;
  let image = document.getElementById("register-image-input").files[0];

  let formData = new FormData();
  formData.append("name", name);
  formData.append("username", userName);
  formData.append("password", password);
  formData.append("image", image);
  let headers = {
    "Content-Type": "multipart/form-data",
  };

  axios
    .post(`${baseUrl}/register`, formData, {
      headers: headers,
    })
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      let modal = document.getElementById("register-modal");
      let modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("New User Regstered Successfully", "success");
      setupUI();
    })
    .catch((error) => {
      let message = error.response.data.message;
      showAlert(message, "danger");
    })
    .finally(() => {
      toggleLoader(false);
    });
}
function getCurrentUser() {
  let user = null;
  let storageUser = localStorage.getItem("user");
  if (storageUser != null) {
    user = JSON.parse(storageUser);
  }
  return user;
}

function deletePostBtnClicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));
  let postModal = new bootstrap.Modal(
    document.getElementById("delete-post-modal"),
    {}
  );
  document.getElementById("delete-post-id-input").value = post.id;
  postModal.toggle();
}

function confirmDelete() {
  let id = document.getElementById("delete-post-id-input").value;
  let token = localStorage.getItem("token");

  let headers = {
    authorization: `Bearer ${token}`,
  };

  axios
    .delete(`${baseUrl}/posts/${id}`, {
      headers,
    })
    .then((response) => {
      let modal = document.getElementById("delete-post-modal");
      let modalInstance = bootstrap.Modal.getInstance(modal);

      modalInstance.hide();
      showAlert("The Post Has Beeb Deleted Successfully", "success");

      setupUI();
      getPosts();
    });
}

function addBtnClicked() {
  document.getElementById("post-modal-submit-btn").innerHTML = "Creat";
  document.getElementById("post-id-input").value = "";
  document.getElementById("post-modal-title").innerHTML = "Creat A New Post";
  document.getElementById("post-title-input").value = "";
  document.getElementById("post-body-input").value = "";
  let postModal = new bootstrap.Modal(
    document.getElementById("create-post-modal"),
    {}
  );
  postModal.toggle();
}

function CreateNewPostClicked() {
  let postId = document.getElementById("post-id-input").value;
  let isCreat = postId == null || postId == "";
  let title = document.getElementById("post-title-input").value;
  let body = document.getElementById("post-body-input").value;
  let image = document.getElementById("post-image-input").files[0];
  let token = localStorage.getItem("token");
  let formData = new FormData();
  formData.append("body", body);
  formData.append("title", title);
  formData.append("image", image);
  let url = ``;
  let headers = {
    authorization: `Bearer ${token}`,
  };
  let theMsg = "";
  if (isCreat) {
    url = `${baseUrl}/posts`;
    theMsg = "New Post Has Been Created";
  } else {
    formData.append("_method", "put");
    url = `${baseUrl}/posts/${postId}`;
    theMsg = "the post has been edited successfully";
  }
  toggleLoader();
  axios
    .post(url, formData, {
      headers: headers,
    })
    .then((response) => {
      let modal = document.getElementById("create-post-modal");
      let modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      getPosts();
      showAlert(theMsg, "success");
    })
    .catch((error) => {
      let message = error.response.data.message;
      showAlert(message, "danger");
    })
    .finally(() => {
      toggleLoader();
    });
}

function profileClicked() {
  let user = getCurrentUser();
  let userId = user.id;
  window.location = `profile.html?userId=${userId}`;
}

function toggleLoader(show = true) {
  if (show) {
    document.getElementById("loader").style.visibility = "visible";
  } else {
    document.getElementById("loader").style.visibility = "hidden";
  }
}
