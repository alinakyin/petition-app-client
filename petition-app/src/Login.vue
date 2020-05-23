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
      <h2 class="text-center" style="margin: 10px 45% 0px">Log in</h2>
    </div>
    <br>
    <form class="col-6 text-center" style="margin-left: 25%"  id="login" v-on:submit.prevent="loginUser()">
      <label>Email</label>
      <input v-model="email" type="email" class="form-control" id="email" placeholder="Email" required>
      <br>
      <label>Password</label>
      <input v-model="password" type="password" class="form-control" id="password" placeholder="Password" required>
      <br>
      <button type="submit" class="btn btn-primary">Log in</button>
    </form>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        error: "",
        errorFlag: false,
        email: "",
        password: ""
      }
    },
    methods: {
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
            this.$router.push({ name: 'petitions'});
          })
          .catch((error) => {
            if (error.response.status === 400) {
              this.error = "Incorrect password!";
              this.errorFlag = true;
            } else {
              this.error = error;
              this.errorFlag = true;
            }
          });
        }
    }
  }
</script>

<style scoped>

</style>
