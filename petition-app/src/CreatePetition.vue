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

    <div class="form-inline" style="margin-left: 10px">
      <router-link :to="{ name: 'petitions'}"><i class="fa fa-angle-left fa-3x"></i></router-link>
      <h2 class="text-center" style="margin: 10px auto 5px">Create a petition</h2>
    </div>

    <br>
    <form class="col-6 text-center" style="margin-left: 25%"  id="createPetition" v-on:submit.prevent="createPetition()">
      <label>Title</label>
      <input v-model="title" type="text" class="form-control" id="title" placeholder="Title..." required>
      <br>
      <label>Description</label>
      <textarea v-model="description" type="text" class="form-control" id="description" placeholder="Description..." required></textarea>
      <br>
      <label>Category</label>
      <select v-model="category" class="form-control" id="category" required>
        <option selected disabled>Choose a category...</option>
        <option>Animals</option>
        <option>Environment</option>
        <option>Entertainment</option>
        <option>Human rights</option>
        <option>Immigration</option>
        <option>Justice</option>
        <option>Other</option>
      </select>
      <br>
      <label>Closing date (optional)</label>
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
      <button type="submit" class="btn btn-primary">Create</button>
    </form>

  </div>
</template>

<script>
    export default {
      data() {
        return {
          error: "",
          errorFlag: false,
          title: "",
          description: "",
          category: "",
          // categoryId: "",
          closingDate: null,
          petitionId: ""
        }
      },
      computed: {
        categoryId: function () {
          let categoryArray = [{"categoryId":1,"name":"Animals"},{"categoryId":2,"name":"Environment"},{"categoryId":3,"name":"Entertainment"},
            {"categoryId":4,"name":"Human rights"},{"categoryId":5,"name":"Immigration"},
            {"categoryId":6,"name":"Justice"},{"categoryId":7,"name":"Other"}];
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
        }
      },
      methods: {
        createPetition: function () {
          let petitionData = {"title": this.title, "description": this.description, "categoryId": this.categoryId};
          if (this.closingDate) {
            petitionData = $.extend(petitionData, {"closingDate": this.closingDate});
          }
          this.$http.post('http://127.0.0.1:4941/api/v1/petitions', petitionData,
            {headers: {'X-Authorization': localStorage.getItem('token')}})
            .then((response) => {
              this.petitionId = response.data.petitionId;
              this.signPetition(this.petitionId);
            })
            .catch((error) => {
              if (error.response.status === 400) {
                this.error = "Closing date must be in the future!";
                this.errorFlag = true;
              } else {
                this.error = error;
                this.errorFlag = true;
              }
            });
        },
        signPetition: function (petitionId) {
          this.$http.post('http://127.0.0.1:4941/api/v1/petitions/' + petitionId + '/signatures', {},
            {headers: {'X-Authorization': localStorage.getItem('token')}})
            .then((response) => {
              console.log(response.status);
              this.$router.push({ name: 'petitionPhoto', params: {petitionId: petitionId}});
            })
            .catch((error) => {
              this.error = error;
              this.errorFlag = true;
            });
        }
      }
    }
</script>

<style scoped>

</style>
