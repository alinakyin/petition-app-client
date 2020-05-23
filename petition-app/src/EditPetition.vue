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

    <div class="form-inline" style="margin-left: 10px; margin-bottom: 20px">
      <router-link :to="{ name: 'petition', params: {petitionId: currentPetition.petitionId }}"><i class="fa fa-angle-left fa-3x"></i></router-link>
      <div style="margin-left: 42%"><h2 class="text-center" style="margin: 10px auto 0px">Edit petition</h2></div>
    </div>

    <div id="editPhoto" class="text-center">
      <button class="btn" data-toggle="modal" data-target="#updatePhoto"><img :src=heroImage class="border border-dark img-thumbnail img-fluid" height="200" width="250"></button>
      <div class="modal fade" id="updatePhoto" tabindex="-1" role="dialog" aria-labelledby="updatePhotoLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="updatePhotoLabel">Update petition photo</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div v-if="photoErrorFlag" style="color: red;">
                {{ photoError }}
              </div>
              <img :src=previewImage class="img-fluid">
            </div>
            <div class="modal-footer">
              <form v-on:submit.prevent="setPetitionPhoto()">
                <i class="fa fa-pencil" style="margin-right: 10px"></i>
                <input type="file" accept="image/*" v-on:change="readFile($event)" id="userImage">
                <button type="submit" class="btn btn-primary">Save</button>
              </form>
<!--              <button type="button" class="btn btn-secondary" data-dismiss="modal">-->
<!--                Cancel-->
<!--              </button>-->
            </div>
          </div>
        </div>
      </div>
    </div>
    <br>
    <form class="col-6 text-center" style="margin-left: 25%" id="patchPetition" v-on:submit.prevent="patchPetition($route.params.petitionId)">
      <label>{{ currentPetition.title }}</label>
      <input v-model="title" type="text" class="form-control" id="title" placeholder="New title">
      <br>
      <label>{{ currentPetition.description }}</label>
      <textarea v-model="description" type="text" class="form-control" id="description" placeholder="New description"></textarea>
      <br>
      <label>{{ currentPetition.category }}</label>
      <select v-model="category" class="form-control" id="category">
        <option selected disabled>Move to a new category?</option>
        <option>Animals</option>
        <option>Environment</option>
        <option>Entertainment</option>
        <option>Human rights</option>
        <option>Immigration</option>
        <option>Justice</option>
        <option>Other</option>
      </select>
      <br>
      <label>{{ niceDate }}</label>
      <input v-model="closingDate" type="datetime-local" class="form-control" id="closingDate">
      <div v-if="invalidClosingDate">
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
          Closing date must be in the future!
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>
      <br>
      <button type="submit" class="btn btn-primary" style="margin-bottom: 50px">Save changes</button>
    </form>

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
          currentPetition: null,
          heroImage: null,
          previewImage: null,
          title: null,
          description: null,
          category: null,
          closingDate: null
        }
      },
      computed: {
        categoryId: function () {
          let categoryArray = [{"categoryId": 1, "name": "Animals"}, {
            "categoryId": 2,
            "name": "Environment"
          }, {"categoryId": 3, "name": "Entertainment"},
            {"categoryId": 4, "name": "Human rights"}, {"categoryId": 5, "name": "Immigration"},
            {"categoryId": 6, "name": "Justice"}, {"categoryId": 7, "name": "Other"}];
          let category;
          for (category of categoryArray) {
            if (category.name == this.category) {
              return category.categoryId;
            }
          }
        },
        invalidClosingDate: function () {
          if (Date.parse(this.closingDate) < Date.now()) {
            return true;
          } else {
            return false;
          }
        },
        niceDate: function () {
          if(this.currentPetition.closingDate) {
            return 'Currently closing on: ' + new Date(this.currentPetition.closingDate);
          } else {
            return 'This petition has no closing date. Want to set one?';
          }
        }
      },
      mounted: function () {
        this.getPetition(this.$route.params.petitionId)
      },
      methods: {
        getPetition: function (petitionId) {
          this.$http.get('http://127.0.0.1:4941/api/v1/petitions/' + petitionId)
            .then((response) => {
              this.currentPetition = response.data;
              this.heroImage = 'http://127.0.0.1:4941/api/v1/petitions/' + petitionId + '/photo';
              this.previewImage = 'http://127.0.0.1:4941/api/v1/petitions/' + petitionId + '/photo';
            })
            .catch((error) => {
              this.error = error;
              this.errorFlag = true;
            });
        },
        patchPetition: function (petitionId) {
          let petitionData;
          if (this.title) {
            petitionData = $.extend(petitionData, {"title": this.title});
          }
          if (this.description) {
            petitionData = $.extend(petitionData, {"description": this.description});
          }
          if (this.category) {
            petitionData = $.extend(petitionData, {"categoryId": this.categoryId});
          }
          if (this.closingDate) {
            petitionData = $.extend(petitionData, {"closingDate": this.closingDate});
          }

          if (!(petitionData)) {
            this.error = "Error: No changes made!";
            this.errorFlag = true;
          } else {
            this.$http.patch('http://127.0.0.1:4941/api/v1/petitions/' + petitionId, petitionData,
              {headers: {'X-Authorization': localStorage.getItem('token')}})
              .then((response) => {
                console.log(response.status);
                this.$router.go(-1);
              })
              .catch((error) => {
                if (error.response.status === 400) {
                  this.error = "Invalid closing date, unable to save changes!";
                  this.errorFlag = true;
                } else {
                  this.error = error;
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
        setPetitionPhoto: function () {
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
            this.$http.put('http://127.0.0.1:4941/api/v1/petitions/' + this.currentPetition.petitionId + '/photo', this.photo, config)
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
        }
      }
    }
</script>

<style scoped>

</style>
