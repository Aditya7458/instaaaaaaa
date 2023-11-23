
// var went_to = document.querySelector(".went_to");
// var degree = document.querySelector(".degree");
// var field_of_study = document.querySelector(".field_of_study");
// var website = document.querySelector(".website");
// var birthdate = document.querySelector(".birthdate");
// var lives_in = document.querySelector(".lives_in");
// var from = document.querySelector(".from");
// var popupOverlay = document.querySelector(".popup-overlay");
// var saveedit = document.querySelector(".save-edit");
// var went_to = document.querySelector(".went_to");
// var lives_in = document.querySelector(".lives_in");
// var from = document.querySelector(".from");
// var gender = document.querySelector(".gender");

// async function Saveedit() {
//   console.log("gender", gender.value);
//   const user = {
//     went_to: went_to.value,
//     lives_in: lives_in.value,
//     from: from.value,
//     field_of_study: field_of_study.value,
//     degree: degree.value,
//     website: website.value,
//     birthdate: birthdate.value,
//     gender: gender.value,
//   };

//   await axios.post("/save-edit", user).then((res) => {
//     if (res.data.message === "success") {
//       popupOverlay.style.display = "none";
//       went_to.innerHTML = res.data.user.went_to;
//       lives_in.innerHTML = res.data.user.lives_in;
//       from.innerHTML = res.data.user.from;
//     }
//   });
// }
// saveedit.addEventListener("click", Saveedit);



var editBtn = document.querySelector(".profile-edit-btn");
      var popupOverlay = document.querySelector(".popup-overlay");
      var closeBtn = document.querySelector(".close-btn");
      var cancelBtn = document.querySelector(".cancel-btn");

      editBtn.addEventListener("click", function () {
          popupOverlay.style.display = "block";
          editBtn.style.color="red"
      });

      closeBtn.addEventListener("click", function () {
        popupOverlay.style.display = "none";
      });

      cancelBtn.addEventListener("click", function () {
        popupOverlay.style.display = "none";
      });

    //   var Profile_images = document.getElementById("Profile_images");
    //   var Cover_image = document.getElementById("Cover_image");
    //   var coverimagebtn = document.getElementById("cover-image-btn");
    //   var inp_file = document.getElementById("inp_file");
    //   var inp_file2 = document.getElementById("inp_file2");
    //   Profile_images.onclick = function () {
    //     inp_file.click();
    //   };
    //   inp_file.onchange = function (e) {
    //     var file = e.target.files[0];
    //     var reader = new FileReader();
    //     reader.onload = function () {
    //       Profile_images.src = reader.result;
    //     };
    //     reader.readAsDataURL(file);
    //     const formData = new FormData();
    //     formData.append("profile_image", file);
    //     axios
    //       .post("/uploadprofile", formData, {
    //         headers: {
    //           "Content-Type": "multipart/form-data",
    //         },
    //       })
    //       .then((res) => {
    //         console.log(res);
    //       });
    //   };
    //   coverimagebtn.onclick = function () {
    //     inp_file2.click();
    //   };
    //   inp_file2.onchange = function (e) {
    //     var file = e.target.files[0];
    //     var reader = new FileReader();
    //     reader.onload = function () {
    //       Cover_image.src = reader.result;
    //     };
    //     reader.readAsDataURL(file);
    //     const formData = new FormData();
    //     formData.append("cover_image", file);
    //     axios
    //       .post("/uploadcover", formData, {
    //         headers: {
    //           "Content-Type": "multipart/form-data",
    //         },
    //       })
    //       .then((res) => {
    //         console.log(res);
    //       });
    //   };

