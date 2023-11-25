// // var dark = document.getElementById("clicked");
// var white = document.getElementById("white-color");
// var lol = document.getElementById("white-2color");
// dark.onclick = function () {
//   document.body.classList.toggle("dark-mode");
//   if (document.body.classList.contains("dark-mode")) {
//     white.style.filter = "brightness(5)";
//     lol.style.filter = "brightness(5)";
//   } else {
//     white.style.filter = "none";
//     lol.style.filter = "none";
//   }
// };

// cross post button overlay
var post_area = document.querySelector(".post-area");
var overlay = document.querySelector(".overlay");
var btnoverlay = document.querySelector(".createpost");

btnoverlay.addEventListener("click", () => {
  overlay.style.display = "block";
});
overlay.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("overlay") ||
    e.target.classList.contains("cross")
  ) {
    overlay.style.display = "none";
  }
});

var posts = [];
var user = {};

var temp = "";
const likeHandler = async function (e) {
  const res = await axios.get(`/like/${e}`);
  loadPosts();
};

const loadPosts = async function () {
  try {
    const res = await axios.get("/posts");
    user = res.data.user;
    const likesCount = res.data.likesPopulate.map((e) => {
      if (e.likes.length !== 0) {
        // console.log(e.likes[(e.likes.length-1)].fullName)
        return e.likes[e.likes.length - 1].fullName;
      }
      return null;
    });
    // console.log(likesCount[likesCount.length-1])
    handle(res.data.posts, user);
  } catch (error) {
    console.error("Error loading posts:", error);
  }
};
loadPosts();

const timeSince = (timestamp) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return `${interval} years ago`;
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return `${interval} months ago`;
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return `${interval} days ago`;
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return `${interval} hours ago`;
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return `${interval} minutes ago`;
  }
  return `${Math.floor(seconds)} seconds ago`;
};

const handle = (data, user) => {
  temp = "";
  data.reverse().forEach((e, index) => {
    // console.log(like[index]);
    temp += `<div  class="post-main" >
              <div class="post-header">
                <div class="post-left-header">
                  <div class="post-image">
                    <img src="${e.author.profile_picture}" alt="" />
                  </div>
                  <a href="/profile/${e.author._id} "
                    ><p class="post-username">${e.author.fullName}</p></a
                  >
                  <i class="fa-solid fa-certificate"></i>
                  <span class="one-day"
                    > ${timeSince(Date.now() - parseInt(e.updatedAt))} </span
                  >
                </div>
                <i class="fa-solid fa-grip-lines"></i>
              </div>
              <div class="post-main-image">
                ${
                  e.filetype == "video"
                    ? `<video class="feeds" controls loop src="${e.file}"></video>`
                    : `<img class="feeds" src="${e.file}" alt="" />`
                }
              </div>
              <div class="post-fotter">
                <div class="post-fotter-left">
                  ${
                    e.likes.includes(user._id)
                      ? `<i class="fa-solid fa-heart like " style="color: red;" id="${e._id}"></i>`
                      : `<i class="fa-regular fa-heart like" id="${e._id}"></i>`
                  }
                  <i class="fa-regular fa-message comment " id=${e._id}></i>
                  <i class="fa-regular fa-paper-plane"></i>
                </div>
                ${
                  user.bookmarks.includes(e._id)
                    ? ` <i class="fa-solid fa-bookmark" id="${e._id}"></i>`
                    : `<i class="fa-regular fa-bookmark" id="${e._id}"></i>`
                }
              </div>
              <div class="post-description">
                <p class="post-liked">Liked by 
                "No one"  and others</p>
                <p class="title">
                  <span>${e.title} </span>
                </p>
                <p class="comments">view all comments</p>
              </div>
            </div>`;
  });
  post_area.innerHTML = temp;
};

var overlay2 = document.querySelector(".overlay2");
var handdleBookmark = async (e) => {
  const res = await axios.get(`/bookmark-post/${e}`);
  loadPosts()
};

post_area.addEventListener("click", async (e) => {
  if (e.target.classList.contains("like")) {
    likeHandler(e.target.id);
  } else if (e.target.classList.contains("fa-bookmark")) {
    handdleBookmark(e.target.id);
  } else if (e.target.classList.contains("comment")) {
    const { data } = await axios.get(`/post/${e.target.id}`);
    overlay2.style.display = "block";
    document.body.style.overflow = "hidden";
    overlay2.innerHTML = `<div class="comment-popup-container">
    <ul class="comments-list">
    ${
      data.post.comments.length === 0
        ? `<li class="comment">
      <div class="comment-details">
        <h4 class="comment-username">No Comments</h4>
      </div>
    </li>`
        : ""
    }
      ${data.post.comments.map(
        (comment) =>
          `<li class="comment">
        <img class="comment-avatar" src="${
          comment.author.profile_picture
        }" alt="" />
        <a class="comment-details" href="/profile/${comment.author._id}">
          <h4 class="comment-username">${comment.author.fullName}</h4>
          <p class="comment-text">${comment.comment}</p>
        </a>
        ${
          comment.author._id === data.user._id
            ? `<a href="/deletecomment/${data.post._id}/${comment._id}">
        <button class="delete-comment">Delete</button>
      </a>`
            : ""
        } 
      </li>`
      )}
    </ul>
    <form class="comment-form" action="/comment/${data.post._id}" method="POST">
      <textarea name="comment" class="comment-textarea" placeholder="Write a comment..."></textarea>
      <button class="comment-button">Post</button>
    </form>
  </div>`;
  }
});

overlay2.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("overlay2") ||
    e.target.classList.contains("cross")
  ) {
    overlay2.style.display = "none";
    document.body.style.overflow = "auto";
  }
});
var content = document.querySelector(".search-content");
document.querySelector(".search-btn").addEventListener("click", () => {
  content.innerHTML = "";
  document.querySelector(".search-card").style.display = "flex";
  document.querySelector(".mdl-textfield__input").focus();
  document.querySelector(".mdl-textfield__input").value = "";
});
document.querySelector(".search-inp").addEventListener("keydown", function (e) {
  console.log(e.target.value);
  if (e.target.value.length > 0) {
    axios.get(`/username/${e.target.value}`).then((res) => {
      content.innerHTML = "";
      console.log(res.data);
      res.data.foundUser.forEach((user) => {
        content.innerHTML += `<a href="/profile/${user._id}"> <div class="search-img">
          <img src="${user.profile_picture}" alt="">
        </div>
        <div class="search-name">
          <h3>${user.fullName}</h3>
        </div></a>`;
      });
    });
  }
});
document.querySelector(".search-inp").addEventListener("focusout", () => {
  setTimeout(() => {
    document.querySelector(".search-card").style.display = "none";
  }, 500);
});
