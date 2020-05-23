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
      <div style="margin-left: 44%"><h2 class="text-center" style="margin: 10px auto 0px">Register</h2></div>
    </div>

    <br>
    <form class="col-6 text-center" style="margin-left: 25%"  id="createPetition" v-on:submit.prevent="registerUser()">
      <label>Name</label>
      <input v-model="name" type="text" class="form-control" id="name" placeholder="Name" required>
      <br>
      <label>Email</label>
      <input v-model="email" type="email" class="form-control" id="email" placeholder="Email" required>
      <br>
      <label>Password</label>
      <input v-model="password" type="password" class="form-control" id="password" placeholder="Password" required>
      <br>
      <label>City (optional)</label>
      <input v-model="city" type="text" class="form-control" id="city" placeholder="City">
      <br>
      <label>Country (optional)</label>
      <input v-model="country" type="text" class="form-control" id="country" placeholder="Country">
      <br>
      <button type="submit" class="btn btn-primary">Register</button>
    </form>

  </div>
</template>

<script>
    export default {
      data() {
        return {
          error: "",
          errorFlag: false,
          name: "",
          email: "",
          password: "",
          city: null,
          country: null,
          image: null
        }
      },
      methods: {
        registerUser: function () {
            let userData = {"name": this.name, "email": this.email, "password": this.password};
            if (this.city) {
              userData = $.extend(userData, {"city": this.city});
            }
            if (this.country) {
              userData = $.extend(userData, {"country": this.country});
            }
            this.$http.post('http://127.0.0.1:4941/api/v1/users/register', userData)
              .then((response) => {
                this.loginUser();
              })
              .catch((error) => {
                if (error.response.status === 400) {
                  this.error = "That email is already taken!";
                  this.errorFlag = true;
                } else {
                  this.error = error;
                  this.errorFlag = true;
                }
              });
          },
        loginUser: function () {
          this.$http.post('http://127.0.0.1:4941/api/v1/users/login', {
            "email": this.email,
            "password": this.password
          })
            .then((response) => {
              let userId = response.data.userId;
              let token = response.data.token;
              localStorage.setItem('token', token);
              localStorage.setItem('userId', userId);
              this.$router.push({name: 'userPhoto'});
            })
            .catch((error) => {
              this.error = error;
              this.errorFlag = true;
            })
        }
      }
    }
</script>

<style scoped>

</style>
