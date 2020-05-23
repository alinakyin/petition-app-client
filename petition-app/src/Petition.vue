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

    <div v-if="!loggedIn && !isClosed">
      <div class="alert alert-info alert-dismissible fixed-bottom" role="alert">
        Log in to sign this petition!
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>

    <router-link :to="{ name: 'petitions'}" style="margin-left: 10px"><i class="fa fa-angle-left fa-3x"></i></router-link>

    <div v-if="isAuthor && isClosed">
      <div class="form-inline" id="delete">
        <div style="margin-left: 88%">
          <button class="btn" data-toggle="modal" data-target="#deletePetition"><i class="fa fa-trash"></i></button>
          <div class="modal fade" id="deletePetition" tabindex="-1" role="dialog" aria-labelledby="deletePetitionLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="deletePetitionLabel">Delete petition</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  Are you sure you want to delete {{ petition.title }}? This action cannot be undone.
                </div>
                <div class="modal-footer">
                  <button v-on:click="deletePetition(petition.petitionId)" type="button" class="btn btn-primary" data-dismiss="modal">
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
    </div>

    <div v-else-if="isAuthor && !isClosed">
      <div class="form-inline" id="edit" style="float: right;margin-right: 10%">
        <div style="margin-left: 5px">
          <form id="editPetition" v-on:submit="$router.push({ name: 'editPetition', params: { petitionId: petition.petitionId}})">
            <button type="submit" class="btn btn-outline-primary"><i class="fa fa-pencil"></i></button>
          </form>
        </div>
      </div>

      <div class="form-inline" id="delete1">
        <div style="margin-left: 97%">
          <button class="btn" data-toggle="modal" data-target="#deletePetition1"><i class="fa fa-trash"></i></button>
          <div class="modal fade" id="deletePetition1" tabindex="-1" role="dialog" aria-labelledby="deletePetitionLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="deletePetitionLabel1">Delete petition</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  Are you sure you want to delete {{ petition.title }}? This action cannot be undone.
                </div>
                <div class="modal-footer">
                  <button v-on:click="deletePetition(petition.petitionId)" type="button" class="btn btn-primary" data-dismiss="modal">
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

    </div>

    <img :src="heroImage" class="img-fluid rounded mx-auto d-block" style="margin-bottom: 10px" height="350" width="400">

    <div class="form-inline">
      <div v-if="loggedIn && !hasSigned && !isClosed" id="sign" style="margin-left: auto;margin-right: auto;margin-bottom: 10px">
          <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#signPetitionModal">
            Sign this petition
          </button>

          <div class="modal fade" id="signPetitionModal" tabindex="-1" role="dialog"
               aria-labelledby="signPetitionModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="signPetitionModalLabel">Add signature</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  Are you sure you want to sign {{ petition.title }}?
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-primary" data-dismiss="modal"
                          v-on:click="signPetition()">
                    Sign
                  </button>
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
      </div>

      <div v-if="loggedIn && hasSigned && !isAuthor && !isClosed" id="unsign" style="margin-left: auto;margin-right: auto;margin-bottom: 10px">
        <button type="button" class="btn btn-outline-primary" data-toggle="modal" data-target="#removeSignature">
          Remove my signature
        </button>

        <div class="modal fade" id="removeSignature" tabindex="-1" role="dialog" aria-labelledby="removeSignatureLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="removeSignatureLabel">Remove signature</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                Are you sure you want to remove your signature from {{ petition.title }}?
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-dismiss="modal"
                        v-on:click="removeSignature()">
                  Remove
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

    <div class="row">
      <div class="col-sm-6">
        <div class="card text-center" style="margin-left:10%; width: 40rem;">
          <div class="card-body">
            <h5 class="card-title">{{ petition.title }}</h5>
            <p class="card-text">{{ petition.description }}</p>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item"><h6>Category:</h6>{{ petition.category }}</li>
            <li class="list-group-item"><h6>Status:</h6>{{ niceClosingDate }}</li>
            <li class="list-group-item"><h6>Author:</h6>
              <div v-if="isAuthor">
                <router-link :to="{ name: 'user'}"><img :src=authorImage @error="imageUrlAlt" style="margin: 8px" class="img-thumbnail img-fluid" height="50" width="75"></router-link>
              </div>
              <div v-else>
                <img :src="authorImage" style="margin: 8px" class="img-fluid rounded" height="50" width="75">
              </div>
              {{ petition.authorName }}<br>
              {{ locationString }}</li>
            <li class="list-group-item">{{ niceCreatedDate }}</li>
          </ul>
          <div class="card-body">
            <a href="javascript:void(0)" v-on:click="shareOnFacebook()" class="card-link" target="_blank"><i class="fa fa-facebook-square fa-2x"></i></a>
            <a href="javascript:void(0)" onclick="window.open('https://twitter.com/intent/tweet?text=Check this out!&url=' + window.location)" class="card-link" target="_blank"><i class="fa fa-twitter fa-2x"></i></a>
            <a href="javascript:void(0)" onclick="window.open('mailto:?subject=Check this petition out&body=I thought you might be interested in this cause: ' + window.location)" target="_blank" class="card-link">
              <i class="fa fa-envelope fa-2x"></i></a>
          </div>
        </div>
      </div>
      <div class="col-sm-6">
        <div id="signatories" class="text-center">
          <div class="card w-75" style="float: right; margin-right: 20%">
            <div class="card-header" style="transform: rotate(0);">
              <button class="btn stretched-link" data-toggle="collapse" data-target="#signatures" aria-expanded="false" aria-controls="signatures">
                <div>{{ petition.signatureCount }} {{ signatureString }}</div>
                <!--              <i class="fa fa-chevron-down"></i>-->
              </button>
            </div>
            <div id="signatures" class="collapse" data-parent="#signatories">
              <div class="card-body">
                <table>
                  <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>City</th>
                    <th>Country</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="signature in signatures">
                    <td>
                      <img :src=getSignatoryImageUrl(signature.signatoryId) @error="imageUrlAlt" class="img-fluid rounded" height="50" width="75">
                    </td>
                    <td>{{ signature.name }}</td>
                    <td>{{ signature.city }}</td>
                    <td>{{ signature.country }}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
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
        petition: "",
        heroImage: null,
        authorImage: null,
        signatures: [],
        hasSigned: false
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
      isAuthor: function () {
        if (localStorage.getItem('userId') == this.petition.authorId) {
          return true;
        } else {
          return false;
        }
      },
      isClosed: function () {
        if (Date.parse(this.petition.closingDate) < Date.now()) {
          return true;
        } else {
          return false;
        }
      },
      niceClosingDate: function () {
        if (this.isClosed) {
          return 'Closed';
        }
        if(this.petition.closingDate) {
          return 'Closing on ' + new Date(this.petition.closingDate);
        } else {
          return 'Open';
        }
      },
      niceCreatedDate: function () {
        return 'Created ' + new Date(this.petition.createdDate);
      },
      locationString: function () {
        if (this.petition.authorCity) {
          if (this.petition.authorCountry) {
            return this.petition.authorCity + ', ' + this.petition.authorCountry;
          } else {
            return this.petition.authorCity;
          }
        } else if (this.petition.authorCountry) {
          return this.petition.authorCountry;
        } else {
          return ''
        }
      },
      signatureString: function () {
        if (this.petition.signatureCount > 1) {
          return 'signatures';
        } else {
          return 'signature';
        }
      }
    },
    mounted: function () {
      this.getPetition(this.$route.params.petitionId)
    },
    methods: {
      imageUrlAlt(event) {
          event.target.src = "../src/assets/default-profile.png";
        },
      getPetition: function (petitionId) {
        this.$http.get('http://127.0.0.1:4941/api/v1/petitions/' + petitionId)
          .then((response) => {
            this.petition = response.data;
            this.heroImage = 'http://127.0.0.1:4941/api/v1/petitions/' + this.petition.petitionId + '/photo';
            this.authorImage = 'http://127.0.0.1:4941/api/v1/users/' + this.petition.authorId + '/photo';
            this.getSignatures(petitionId);
          })
          .catch((error) => {
            this.error = error;
            this.errorFlag = true;
          });
        },
      getSignatures: function (petitionId) {
        this.$http.get('http://127.0.0.1:4941/api/v1/petitions/' + petitionId + '/signatures')
          .then((response) => {
            this.signatures = response.data;
            let signature;
            for (signature of this.signatures) {
              if (localStorage.getItem('userId') == signature.signatoryId) {
                this.hasSigned = true;
              }
            }
          })
          .catch((error) => {
            this.error = error;
            this.errorFlag = true;
          });
        },
      getSignatoryImageUrl: function (signatoryId) {
        return 'http://127.0.0.1:4941/api/v1/users/' + signatoryId + '/photo';
      },
      signPetition: function () {
        this.$http.post('http://127.0.0.1:4941/api/v1/petitions/' + this.petition.petitionId + '/signatures', {},
          {headers: {'X-Authorization': localStorage.getItem('token')}})
          .then((response) => {
            console.log(response.status);
            this.$router.go(0);
          })
          .catch((error) => {
              this.error = error;
              this.errorFlag = true;
          });
      },
      removeSignature: function () {
        this.$http.delete('http://127.0.0.1:4941/api/v1/petitions/' + this.petition.petitionId + '/signatures',
          {headers: {'X-Authorization': localStorage.getItem('token')}})
          .then((response) => {
            console.log(response.status);
            this.$router.go(0);
          })
          .catch((error) => {
              this.error = error;
              this.errorFlag = true;
          });
      },
      deletePetition: function (petitionId) {
          this.$http.delete('http://127.0.0.1:4941/api/v1/petitions/' + this.petition.petitionId,
            {headers: {'X-Authorization': localStorage.getItem('token')}})
            .then((response) => {
              console.log(response.status);
              this.$router.go(-1);
            })
            .catch((error) => {
              this.error = error;
              this.errorFlag = true;
            });
      },
      shareOnFacebook : function () {
        window.open('https://www.facebook.com/sharer/sharer.php?u=https://canterbury.ac.nz/petitions/' + this.petition.petitionId);
      },
    }
  }
</script>

<style scoped>

</style>
