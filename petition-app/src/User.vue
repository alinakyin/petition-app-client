<template>
  <div>
    <div v-if="errorFlag">
      <div class="alert alert-danger alert-dismissible fixed-top" role="alert">
        {{ error }}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>

    <div v-if="success">
      <div class="alert alert-success alert-dismissible fixed-top" role="alert">
        Password was successfully updated!
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>

    <router-link :to="{ name: 'petitions'}" style="margin: 20px 10px"><i class="fa fa-angle-left fa-3x"></i></router-link>

      <div id="editUser" style="margin-right: 25%">
        <button class="btn btn-outline-primary" style="float: right" data-toggle="modal" data-target="#editDetails"><i class="fa fa-pencil"></i></button>
        <div class="modal fade" id="editDetails" tabindex="-1" role="dialog" aria-labelledby="editDetailsLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="editDetailsLabel">Edit profile</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form id="editing">
                  <label>{{ userDetails.name }}</label>
                  <input v-model="name" type="text" class="form-control" id="name" placeholder="New name">
                  <br>
                  <label>{{ userDetails.email }}</label>
                  <input v-model="email" type="email" class="form-control" id="email" placeholder="New email">
                  <div v-if="invalidEmail">
                    <div class="alert alert-warning alert-dismissible fade show" role="alert">
                      Enter a valid email!
                      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                  </div>
                  <br>
                  <label>{{ niceCity }}</label>
                  <input v-model="city" type="text" class="form-control" id="city" placeholder="New city">
                  <br>
                  <label>{{ niceCountry }}</label>
                  <input v-model="country" type="text" class="form-control" id="country" placeholder="New country">
                </form>
              </div>
              <div class="modal-footer">
                <button v-on:click="editUser()" type="button" class="btn btn-primary" data-dismiss="modal">
                  Save changes
                </button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="editPassword"style="margin-right: 25%">
        <button class="btn btn-link" style="float: right" data-toggle="modal" data-target="#confirmPassword">Change password</button>
        <div class="modal fade" id="confirmPassword" tabindex="-1" role="dialog" aria-labelledby="confirmPasswordLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="confirmPasswordLabel">Change password</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form id="enterPassword">
                  <input v-model="password" type="password" class="form-control" id="newPassword" placeholder="New password...">
                  <br>
                  <input v-model="currentPassword" type="password" class="form-control" id="currentPassword" placeholder="Current password...">
                </form>
              </div>
              <div class="modal-footer">
                <button v-on:click="changePassword()" type="button" class="btn btn-primary" data-dismiss="modal">
                  Confirm
                </button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="editPhoto" style="margin-left: 39%" class="text-center">
        <button class="btn" data-toggle="modal" data-target="#updatePhoto"><img :src=userImage @error="imageUrlAlt" class="border border-dark img-thumbnail img-fluid" height="100" width="150"></button>
          <div class="modal fade" id="updatePhoto" tabindex="-1" role="dialog" aria-labelledby="updatePhotoLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="updatePhotoLabel">Update profile photo</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body text-center">
                  <div v-if="photoErrorFlag" style="color: red;">
                    {{ photoError }} <br>
                  </div>
                  <img :src=previewImage @error="imageUrlAlt" class="img-fluid">
                </div>
                <div class="modal-footer">
                  <button class="btn" data-toggle="modal" data-target="#removePhoto"><i class="fa fa-trash"></i></button>
                  <form v-on:submit.prevent="setUserPhoto()">
                    <i class="fa fa-pencil" style="margin-left: 25px"></i>
                    <input type="file" accept="image/*" style="margin-left: 9px" v-on:change="readFile($event)" id="userImage">
                    <button type="submit" class="btn btn-primary">Save</button>
                  </form>
<!--                  <button type="button" class="btn btn-secondary" data-dismiss="modal">-->
<!--                    Cancel-->
<!--                  </button>-->
                </div>
            </div>
          </div>
        </div>
      </div>

      <br>
      <div class="text-center">
        <h2>{{ userDetails.name }}</h2>
        {{ userDetails.email }}<br>
        {{ locationString }}
      </div>

      <div id="deletePhoto">
        <div class="modal fade" id="removePhoto" tabindex="-1" role="dialog" aria-labelledby="removePhotoLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="deletePhotoLabel">Remove photo</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                Are you sure you want to remove your profile photo?
              </div>
              <div class="modal-footer">
                <button v-on:click="removePhoto()" type="button" class="btn btn-primary" data-dismiss="modal">
                  Yes
                </button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br>
      <div id="authored" class="text-center">
        <div class="card w-50" style="margin-left: auto; margin-right: auto">
          <div class="card-header" style="transform: rotate(0);">
            <button class="btn stretched-link" data-toggle="collapse" data-target="#petitions" aria-expanded="false" aria-controls="petitions">
              <div>My petitions</div>
<!--              <i class="fa fa-chevron-down"></i>-->
            </button>
          </div>
          <div id="petitions" class="collapse" data-parent="#authored">
            <div class="card-body">
              <div class="row justify-content-center">
                <table v-if="petitions">
                  <tr>
                    <th></th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Signature count</th>
                  </tr>
                  <tr v-for="petition of petitions">
                    <td><img :src=getPetitionImageUrl(petition.petitionId) class="img-fluid rounded" height="50" width="75"></td>
                    <td><router-link :to="{ name: 'petition', params: { petitionId: petition.petitionId}}">{{ petition.title }}</router-link></td>
                    <td>{{ petition.category }}</td>
                    <td>{{ petition.signatureCount }}</td>
                  </tr>
                </table>
              <div v-else>You haven't created any petitions!</div>
              </div>
            </div>
            </div>
          </div>
        </div>

    </div>

</template>

<script>
    export default {
      data() {
        return {
          error: "",
          errorFlag: false,
          photoError: "",
          photoErrorFlag: false,
          success: false,
          userDetails: [],
          name: null,
          email: null,
          password: null,
          currentPassword: null, // can't be blank
          city: null,
          country: null,
          photo: null, // setting the user's photo
          userImage: null, // what's shown
          previewImage: null,
          petitions: []
        }
      },
      computed: {
        niceCity: function () {
          if (this.userDetails.city) {
            return this.userDetails.city;
          } else {
            return 'Add your city?'
          }
        },
        niceCountry: function () {
          if (this.userDetails.country) {
            return this.userDetails.country;
          } else {
            return 'Add your country?'
          }
        },
        invalidEmail: function () { // super basic check for warning
          if (this.email) {
            if (!(this.email.includes('.')) || !(this.email.includes('@'))) {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        },
        locationString: function () {
          if (this.userDetails.city) {
            if (this.userDetails.country) {
              return this.userDetails.city + ', ' + this.userDetails.country;
            } else {
              return this.userDetails.city;
            }
          } else if (this.userDetails.country) {
              return this.userDetails.country;
          } else {
            return ''
          }
        }
      },
      mounted: function () {
          this.getUser()
      },
      methods: {
        imageUrlAlt(event) {
          event.target.src = "./src/assets/default-profile.png";
        },
        getPetitions: function () {
          this.$http.get('http://127.0.0.1:4941/api/v1/petitions',
            {params: {authorId: localStorage.getItem('userId')}})
            .then((response) => {
              if (response.data.length === 0) {
                this.petitions = null;
              } else {
                this.petitions = response.data;
              }
            })
            .catch((error) => {
              this.error = error;
              this.errorFlag = true;
            });
        },
        getPetitionImageUrl: function (petitionId) {
          return 'http://127.0.0.1:4941/api/v1/petitions/' + petitionId + '/photo';
        },
        getUser: function () {
          this.$http.get('http://127.0.0.1:4941/api/v1/users/' + localStorage.getItem('userId'),
            {headers: {'X-Authorization': localStorage.getItem('token')}})
            .then((response) => {
              this.userDetails = response.data;
              this.userImage = 'http://127.0.0.1:4941/api/v1/users/' + localStorage.getItem('userId') + '/photo';
              this.previewImage = 'http://127.0.0.1:4941/api/v1/users/' + localStorage.getItem('userId') + '/photo';
              this.getPetitions();
            })
            .catch((error) => {
              this.error = error;
              this.errorFlag = true;
            });
        },
        editUser: function () {
          // currentPassword is what they confirm with
          // only works if password is given, otherwise any currentPassword works
          let editedDetails = {};
          if (this.name) {
            $.extend(editedDetails, {"name": this.name})
          }
          if (this.email) {
            $.extend(editedDetails, {"email": this.email})
          }
          if (this.city) {
            $.extend(editedDetails, {"city": this.city})
          }
          if (this.country) {
            $.extend(editedDetails, {"country": this.country})
          }

          if (Object.keys(editedDetails).length === 0) {
            this.error = "No changes entered!";
            this.errorFlag = true;
          } else {
            this.$http.patch('http://127.0.0.1:4941/api/v1/users/' + localStorage.getItem('userId'), editedDetails,
              {headers: {'X-Authorization': localStorage.getItem('token')}})
              .then((response) => {
                console.log(response.status);
                this.$router.go(0);
              })
              .catch((error) => {
                if (error.response.status === 400) {
                  this.error = "Invalid email, unable to save changes!";
                  this.errorFlag = true;
                } else {
                  this.error = error.response.statusText;
                  this.errorFlag = true;
                }
              });
          }
        },
        changePassword: function () {
          if (!(this.password)) {
            this.error = "Password cannot be empty!";
            this.errorFlag = true;
          } else {
            let edits = {"password": this.password, "currentPassword": this.currentPassword};
            this.$http.patch('http://127.0.0.1:4941/api/v1/users/' + localStorage.getItem('userId'), edits,
              {headers: {'X-Authorization': localStorage.getItem('token')}})
              .then((response) => {
                console.log(response.status);
                this.success = true;
              })
              .catch((error) => {
                if (error.response.status === 400) {
                  this.error = "Incorrect password, unable to save changes!";
                  this.errorFlag = true;
                } else {
                  this.error = error.response.statusText;
                  this.errorFlag = true;
                }
              });
          }
        },
        readFile: function (event) {
          if (this.photoErrorFlag) {
            this.photoErrorFlag = false;
          }
          let file = event.target.files[0];
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = event => {
            this.imageUrl = reader.result;
            this.previewImage = reader.result;
            this.photo = file;
          };
          reader.onerror = event => {
            this.error = reader.error;
            this.errorFlag = true;
          };
        },
        setUserPhoto: function () {
          if (this.imageUrl) {
            let dataUrlArray = this.imageUrl.split(",");
            let mimeType = dataUrlArray[0].match(/[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/)[0];
            let userId = localStorage.getItem('userId');
            let config = {
              emulateJSON: false,
              headers: {
                'Content-Type': mimeType, 'X-Authorization': localStorage.getItem('token')
              }
            };
            this.$http.put('http://127.0.0.1:4941/api/v1/users/' + userId + '/photo', this.photo, config)
              .then((response) => {
                console.log(response.status);
                this.$router.go(0);
              })
              .catch((error) => {
                this.error = error;
                this.errorFlag = true;
              })
          } else {
            this.photoError = "Please choose a photo!";
            this.photoErrorFlag = true;
          }
        },
        removePhoto: function () {
          let userId = localStorage.getItem('userId');

          this.$http.delete('http://127.0.0.1:4941/api/v1/users/' + userId + '/photo',
            {headers: {'X-Authorization': localStorage.getItem('token')}})
            .then((response) => {
              console.log(response.status);
              this.$router.go(0);
            })
            .catch((error) => {
              if (error.response.status === 404) {
                this.photoError = "Cannot remove default profile photo!";
                this.photoErrorFlag = true;
              } else {
                this.error = error;
                this.errorFlag = true;
              }
            })
          }
        }
    }
</script>

<style scoped>

</style>
