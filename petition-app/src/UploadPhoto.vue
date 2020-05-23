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

    <div v-if="user">
      <h2 class="text-center" style="margin: 10px auto 5px">Add a profile photo</h2>
      <br>
      <img v-if="previewPhoto" :src=previewPhoto class="img-thumbnail img-fluid mx-auto d-block" height="300" width="350">
      <img v-else src="../src/assets/default-profile.png" class="img-thumbnail img-fluid mx-auto d-block" height="300" width="350">
      <br>
      <br>
      <form class="text-center" v-on:submit.prevent="setUserPhoto()">
        <input type="file" accept="image/*" v-on:change="readFile($event)" id="userImage">
        <button type="submit" class="btn btn-primary">Save</button>
      </form>
      <button v-on:click="skipUserPhoto()" type="submit" style="margin-left:59%;margin-top: 5px" class="btn btn-link">Skip</button>
    </div>

    <div v-if="petition">
      <h2 class="text-center" style="margin: 10px auto 5px">Set petition photo</h2>
      <br>
      <img :src=previewPhoto class="img-thumbnail img-fluid mx-auto d-block" height="300" width="350">
      <br>
      <br>
      <form class="text-center" v-on:submit.prevent="setPetitionPhoto($route.params.petitionId)">
        <input type="file" accept="image/*" v-on:change="readFile($event)" id="petitionImage" required>
        <button type="submit" class="btn btn-primary">Save</button>
      </form>
    </div>

  </div>
</template>

<script>
    export default {
      data() {
        return {
          error: "",
          errorFlag: false,
          user: false,
          petition: false,
          imageUrl: null,
          photo: null,
          previewPhoto: null
        }
      },
      mounted: function () {
        this.getRoute()
      },
      methods: {
        getRoute: function () {
          if (this.$route.name == 'userPhoto') {
            this.user = true;
          } else if (this.$route.name == 'petitionPhoto') {
            this.petition = true;
          }
        },
        skipUserPhoto: function () {
          this.$router.push({name: 'user'});
        },
        readFile: function (event) {
          let file = event.target.files[0];
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = event => {
            this.imageUrl = reader.result;
            this.previewPhoto = reader.result;
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
                this.$router.push({name: 'user'});
              })
              .catch((error) => {
                this.error = error;
                this.errorFlag = true;
              })
          } else {
            this.error = "Please choose a photo!";
            this.errorFlag = true;
          }
        },
        setPetitionPhoto: function (petitionId) {
          if (this.imageUrl) {
            let dataUrlArray = this.imageUrl.split(",");
            let mimeType = dataUrlArray[0].match(/[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/)[0];
            let config = {
              headers: {
                'Content-Type': mimeType, 'X-Authorization': localStorage.getItem('token')
              }
            };
            this.$http.put('http://127.0.0.1:4941/api/v1/petitions/' + petitionId + '/photo', this.photo, config)
              .then((response) => {
                console.log(response.status);
                this.$router.push({name: 'petition', params: { petitionId: petitionId}});
              })
              .catch((error) => {
                this.error = error;
                this.errorFlag = true;
              })
          } else {
            this.error = "Please choose a photo!";
            this.errorFlag = true;
          }
        }
      }
    }
</script>

<style scoped>

</style>
