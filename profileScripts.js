setupUI();
getUser();
getPosts();
getCurrentUserId();

function getCurrentUserId() {
  let urlParams = new URLSearchParams(window.location.search);
  let id = urlParams.get("userId");
  return id;
}

function getUser() {
  let id = getCurrentUserId();
  axios.get(`${baseUrl}/users/${id}`).then(function (response) {
    let user = response.data.data;
    document.getElementById("header-img").src = user.profile_image;
    document.getElementById("main-info-email").innerHTML = user.email;
    document.getElementById("main-info-name").innerHTML = user.name;
    document.getElementById("main-info-username").innerHTML = user.username;
    document.getElementById("posts-count").innerHTML = user.posts_count;
    document.getElementById("comments-count").innerHTML = user.comments_count;
    document.getElementById("name-post").innerHTML = `${user.username}'s posts`;
  });
}

function getPosts() {
  let id = getCurrentUserId();
  axios.get(`${baseUrl}/users/${id}/posts`).then(function (response) {
    let posts = response.data.data;
    document.getElementById("user-posts").innerHTML = "";
    for (let post of posts.reverse()) {
      let author = post.author;
      let user = getCurrentUser();
      let isMyPost = "";
      if (user != null) {
        isMyPost = user.id == post.author.id && user.id != null;
      }
      let btnContent = ``;
      if (isMyPost) {
        btnContent = `<button class="btn btn-danger" style="float: right; margin-left: 10px" onclick="deletePostBtnClicked('${encodeURIComponent(
          JSON.stringify(post)
        )}')">delete</button>
        <button class="btn btn-secondary" style="float: right" onclick="editPostBtnClicked('${encodeURIComponent(
          JSON.stringify(post)
        )}')">edit</button>
        `;
      }
      let postTitle = "";
      if (post.title != null) {
        postTitle = post.title;
      }
      let postImage = "";
      if (typeof post.image !== "object") {
        postImage = `<img src="${post.image}" class="w-100"/>`;
      }
      let content = `
      <div class="card shadow-lg" >
          <div class="card-header">
            <img
              src="${author.profile_image}"
              alt=""
              style="width: 45px; height: 45px"
              class="rounded-circle border border-2"
            />
            <b class="ms-2">${author.username}</b>
            ${btnContent}
          </div>
          <div class="card-body" onclick="postClicked(${post.id})" style="cursor: pointer">
            ${postImage}
            <h6 class="mt-2" style="color: #797979">${post.created_at}</h6>
            <h5>${postTitle}</h5>
            <p>
              ${post.body}
            </p>
            <hr>
            <div id = "post-tags-${post.id}">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
              </svg>
              <b>
                (${post.comments_count}) comment
              </b>
            </div>
          </div>
        </div>
      `;
      document.getElementById("user-posts").innerHTML += content;
    }
  });
}
