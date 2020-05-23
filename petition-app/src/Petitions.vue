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

    <div v-if="loggedIn">
      <div style="float: right; margin-right: 34px; margin-top: 2px">
        <router-link :to="{ name: 'user'}"><img :src=userImage @error="imageUrlAlt" style="margin: 8px" class="border border-primary img-thumbnail img-fluid" height="50" width="75"></router-link>
        <div id="logOut">
          <button type="button" style="margin: 5px" class="btn btn-outline-primary" data-toggle="modal" data-target="#logOutModal">
            Log out
          </button>

          <div class="modal fade" id="logOutModal" tabindex="-1" role="dialog"
               aria-labelledby="logOutModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="logOutModalLabel">Log out</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  Are you sure you want to log out?
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-primary" data-dismiss="modal"
                          v-on:click="logout()">
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
      </div>

      <div class="form-inline">
        <div style="float: left; margin-left: 50px; margin-top: 10px">
          <form id="createPetition" v-on:submit="$router.push({ name: 'create'})">
            <button type="submit" class="btn btn-primary btn-lg">Create a petition</button>
          </form>
        </div>

        <h2 class="text-center" style="margin-bottom: 10px;margin-top: 10px; margin-left:24%">SENG365 Petitions</h2>
      </div>
    </div>

    <div v-if="!loggedIn">
      <div style="float: right; margin-right: 15px; margin-top: 10px" class="form-inline">
        <form id="register" v-on:submit="$router.push({ name: 'register'})">
          <button type="submit" class="btn btn-outline-primary">Sign up</button>
        </form>
        <form id="login" v-on:submit="$router.push({ name: 'login'})">
          <button type="submit" class="btn btn-primary" style="margin-left: 7px">Log in</button>
        </form>
      </div>

      <div class="form-inline">
        <div style="float: left; margin-left: 50px; margin-top: 10px">
          <div id="noCreate">
            <button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#noCreateModal">Create a petition</button>

            <div class="modal fade" id="noCreateModal" tabindex="-1" role="dialog"
                 aria-labelledby="noCreateModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="noCreateModalLabel">Login required</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    Log in or sign up now to create a petition!
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-primary" style="margin-left: auto; margin-right: auto" data-dismiss="modal">
                      OK
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 class="text-center" style="margin-bottom: 10px;margin-top: 10px; margin-left: 26%">SENG365 Petitions</h2>
      </div>
    </div>

    <form v-on:submit.prevent="searchPetitions()" id="search" class="form-inline" style="margin-top:12px">
      <input v-model="q" class="form-control col-4" style="margin-left: 50px; margin-right: 20px" type="search" placeholder="Search..." aria-label="Search">

      <button class="btn btn-outline-primary" style="margin-right: 30px" type="submit"><i class="fa fa-search"></i></button>

      <label>Filter: </label>
      <select v-model="category" class="form-control" style="margin-left: 15px; margin-right: 30px" id="category">
        <option>Category: Any</option>
        <option>Animals</option>
        <option>Environment</option>
        <option>Entertainment</option>
        <option>Human rights</option>
        <option>Immigration</option>
        <option>Justice</option>
        <option>Other</option>
      </select>

      <label>Sort by: </label>
      <select v-model="sortBySelected" class="form-control" style="margin-left: 15px; margin-right: 30px" id="sortBy">
        <option>Sort by: Signature count desc</option>
        <option>Signature count asc</option>
        <option>Alphabetical desc</option>
        <option>Alphabetical asc</option>
      </select>

    </form>

    <div id="navigation" style="margin-right: 20%; margin-top: 20px; margin-left: 18%">
      <div v-if="lastPage === 0">
      <nav id="navigation bar1">
        <ul class="pagination justify-content-center">
            <li class="page-item"><a class="page-link" v-on:click="jumpToFirst()" href="javascript:void(0)"><i class="fa fa-angle-double-left"></i></a></li>
            <li class="page-item disabled"><a class="page-link" v-on:click="pageBackward()" href="javascript:void(0)" tabindex="-1"><i class="fa fa-angle-left"></i></a></li>
            <li class="page-item disabled"><a class="page-link" v-on:click="pageForward()" href="javascript:void(0) "><i class="fa fa-angle-right"></i></a></li>
            <li class="page-item disabled"><a class="page-link" v-on:click="jumpToLast()" href="javascript:void(0)"><i class="fa fa-angle-double-right"></i></a></li>
        </ul>
      </nav>
      </div>

      <div v-else-if="currentPage === 0">
      <nav id="navigation bar2">
        <ul class="pagination justify-content-center">
            <li class="page-item disabled"><a class="page-link" v-on:click="jumpToFirst()" href="javascript:void(0)"><i class="fa fa-angle-double-left"></i></a></li>
            <li class="page-item disabled"><a class="page-link" v-on:click="pageBackward()" href="javascript:void(0)" tabindex="-1"><i class="fa fa-angle-left"></i></a></li>
            <li class="page-item"><a class="page-link" v-on:click="pageForward()" href="javascript:void(0) "><i class="fa fa-angle-right"></i></a></li>
            <li class="page-item"><a class="page-link" v-on:click="jumpToLast()" href="javascript:void(0)"><i class="fa fa-angle-double-right"></i></a></li>
        </ul>
      </nav>
      </div>

      <div v-else-if="currentPage === lastPage">
      <nav id="navigation bar3">
        <ul class="pagination justify-content-center">
            <li class="page-item"><a class="page-link" v-on:click="jumpToFirst()" href="javascript:void(0)"><i class="fa fa-angle-double-left"></i></a></li>
            <li class="page-item"><a class="page-link" v-on:click="pageBackward()" href="javascript:void(0)" tabindex="-1"><i class="fa fa-angle-left"></i></a></li>
            <li class="page-item disabled"><a class="page-link" v-on:click="pageForward()" href="javascript:void(0) "><i class="fa fa-angle-right"></i></a></li>
            <li class="page-item disabled"><a class="page-link" v-on:click="jumpToLast()" href="javascript:void(0)"><i class="fa fa-angle-double-right"></i></a></li>
        </ul>
      </nav>
      </div>

      <div v-else>
      <nav id="navigation bar4">
        <ul class="pagination justify-content-center">
            <li class="page-item"><a class="page-link" v-on:click="jumpToFirst()" href="javascript:void(0)"><i class="fa fa-angle-double-left"></i></a></li>
            <li class="page-item"><a class="page-link" v-on:click="pageBackward()" href="javascript:void(0)" tabindex="-1"><i class="fa fa-angle-left"></i></a></li>
            <li class="page-item"><a class="page-link" v-on:click="pageForward()" href="javascript:void(0) "><i class="fa fa-angle-right"></i></a></li>
            <li class="page-item"><a class="page-link" v-on:click="jumpToLast()" href="javascript:void(0)"><i class="fa fa-angle-double-right"></i></a></li>
        </ul>
      </nav>
      </div>
    </div>

    <div id="petitions">
        <table class="table table-hover text-center">
          <thead>
          <tr>
            <th></th><th>Title</th>
            <th>Category</th>
            <th>Author</th>
            <th>Signature count</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="petition of petitions">
            <td><img :src=getImageUrl(petition.petitionId) class="img-fluid rounded" height="75" width="100"></td>
            <td><router-link :to="{ name: 'petition', params: { petitionId: petition.petitionId}}">{{ petition.title }}</router-link></td>
            <td>{{ petition.category }}</td>
            <td>{{ petition.authorName }}</td>
            <td>{{ petition.signatureCount }}</td>
          </tr>
          </tbody>
        </table>
        <p style="text-align: center" v-if="currentPage === lastPage">End of results!</p>

      </div>

  </div>
</template>

<script>
    export default {
      data() {
        return {
          error: "",
          errorFlag: false,
          petitions: [],
          queryString: null,
          q: null,
          category: null, // name selected by user,
          sortBySelected: null,
          currentPage: 0,
          pageMoved: false,
          numPetitions: null
        }
      },
      computed: {
        loggedIn: function () {
          if (localStorage.getItem('token')) {
            return true;
          } else {
            return false;
          }
        },
        userImage: function () {
          return 'http://127.0.0.1:4941/api/v1/users/' + localStorage.getItem('userId') + '/photo';
        },
        categoryId: function () {
          let categoryArray = [{"categoryId":null,"name":"Category: Any"}, {"categoryId":1,"name":"Animals"},
            {"categoryId":2,"name":"Environment"},{"categoryId":3,"name":"Entertainment"},
            {"categoryId":4,"name":"Human rights"},{"categoryId":5,"name":"Immigration"},
            {"categoryId":6,"name":"Justice"},{"categoryId":7,"name":"Other"}];
          let category;
          for (category of categoryArray) {
            if (category.name == this.category) {
              return category.categoryId;
            }
          }
        },
        sortBy: function () {
          let sortByArray = [{"selected": "Alphabetical asc", "id":"ALPHABETICAL_ASC"},
              {"selected": "Alphabetical desc", "id":"ALPHABETICAL_DESC"},
              {"selected": "Signature count asc", "id":"SIGNATURES_ASC"},
              {"selected": "Sort by: Signature count desc", "id":"SIGNATURES_DESC"}];
          let s;
          for (s of sortByArray) {
            if (s.selected == this.sortBySelected) {
              return s.id;
            }
          }
        },
        startIndex: function () {
          return this.currentPage * 10;
        },
        lastPage: function () {
          if (Math.floor(this.numPetitions / 10) > 0) {
            return Math.floor(this.numPetitions / 10);
          } else {
            return 0;
          }
        }
      },
      watch: {
        $route(to, from) {
          if (to !== from) {
            this.getPetitions()
          }
        }
      },
      mounted: function () {
        this.getPetitions()
      },
      methods: {
        imageUrlAlt(event) {
          event.target.src = "./src/assets/default-profile.png";
        },
        getPetitions: function () {
          // javascript:void(0) instead of # maybe
          // startIndex = number of items to skip before returning results
          // count = number of items to include in results
          let fakeQueries = {};
          if (this.$route.query.q) {
            fakeQueries = $.extend(fakeQueries, {"q": this.$route.query.q});
          }
          if (this.$route.query.categoryId) {
            fakeQueries = $.extend(fakeQueries, {"categoryId": this.$route.query.categoryId});
          }
          if (this.$route.query.sortBy) {
            fakeQueries = $.extend(fakeQueries, {"sortBy": this.$route.query.sortBy});
          }
          this.$http.get('http://127.0.0.1:4941/api/v1/petitions', {params: fakeQueries})
            .then((response) => {
              this.numPetitions = response.data.length;
            })
            .catch((error) => {
              this.error = error;
              this.errorFlag = true;
            });

          let queries = {"count": 10, "startIndex": this.startIndex};
          if (this.$route.query.q) {
            queries = $.extend(queries, {"q": this.$route.query.q});
          }
          if (this.$route.query.categoryId) {
            queries = $.extend(queries, {"categoryId": this.$route.query.categoryId});
          }
          if (this.$route.query.sortBy) {
            queries = $.extend(queries, {"sortBy": this.$route.query.sortBy});
          }

          this.$http.get('http://127.0.0.1:4941/api/v1/petitions', {params: queries})
            .then((response) => {
              this.petitions = response.data;
            })
            .catch((error) => {
              this.error = error;
              this.errorFlag = true;
            });
        },
        pageForward: function () {
          this.currentPage++;
          this.pageMoved = true;
          this.searchPetitions();
        },
        pageBackward: function () {
          this.currentPage--;
          this.pageMoved = true;
          this.searchPetitions();
        },
        jumpToFirst: function () {
          this.currentPage = 0;
          this.pageMoved = true;
          this.searchPetitions();
        },
        jumpToLast: function () {
          this.currentPage = this.lastPage;
          this.pageMoved = true;
          this.searchPetitions();
        },
        getImageUrl: function (petitionId) {
          return 'http://127.0.0.1:4941/api/v1/petitions/' + petitionId + '/photo'
        },
        logout: function () {
          this.$http.post('http://127.0.0.1:4941/api/v1/users/logout', {},
            {headers: {'X-Authorization': localStorage.getItem('token')}})
            .then((response) => {
              localStorage.removeItem('userId');
              localStorage.removeItem('token');
              this.$router.go(0);
            })
            .catch((error) => {
              this.error = error;
              this.errorFlag = true;
            })
        },
        searchPetitions: function () {
          this.queryString = null;
          if (this.q) {
            this.queryString = $.extend(this.queryString, {q: this.q});
          }
          if (this.category) {
              this.queryString = $.extend(this.queryString, {categoryId: this.categoryId});
          }
          if (this.sortBy) {
            this.queryString = $.extend(this.queryString, {sortBy: this.sortBy});
          }
          if (this.pageMoved) {
            this.queryString = $.extend(this.queryString, {p: this.currentPage+1});
          }

          if (this.queryString) {
            this.$router.push({ name: 'petitions', query: this.queryString });
          }
        }
      }
    }
</script>

<style scoped>

</style>
