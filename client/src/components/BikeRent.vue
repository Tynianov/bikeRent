<template>
  <v-app>
    <v-content>
      <v-container class="main-container">
        <v-layout column>
          <template>
            <h1 class="text-left">Bike rent</h1>
            <h3 class="text-left mt-5">Create a new bike</h3>
            <v-card
              elevation="5"
            >
              <v-card-title>
                <p>Add new Bike</p>
              </v-card-title>
              <v-card-text>
                <div
                  v-bind:class="{'row': $vuetify.breakpoint.smAndUp}"
                >
                  <v-col xs12>
                    <v-text-field
                      outlined
                      label="Bike name"
                      v-model="bikeName"
                    />
                  </v-col>
                  <v-col xs12>
                    <v-select
                      outlined
                      label="Bike type"
                      :items="pageMetadata.bikeTypeChoices"
                      v-model="bikeType"
                    />
                  </v-col>
                  <v-col xs12>
                    <v-text-field
                      label="Rent price"
                      outlined
                      type="number"
                      v-model="price"
                    />
                  </v-col>
                  <v-col
                    xs12
                    v-bind:class="{'text-end': $vuetify.breakpoint.smAndUp}"
                  >
                    <v-btn
                      class="success"
                      x-large
                      @click="createBike"
                    >
                      Create
                    </v-btn>
                  </v-col>
                </div>
              </v-card-text>
            </v-card>
            <v-dialog
              v-if="selectedBike"
              v-model="showCreateRentDialog"
              width="600"
            >
              <v-card>
                <v-card-title>
                  <span>Create rent</span>
                  <v-spacer/>
                  <v-btn
                    icon
                    @click="() => {this.selectedBike = undefined; this.showCreateRentDialog = false;}"
                  >
                    <v-icon>close</v-icon>
                  </v-btn>
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <span>Bike details: </span>
                    <span class="ml-4">{{ selectedBike.bikeName }} / {{ selectedBike.bikeType }} / ${{ selectedBike.price }}</span>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-datetime-picker
                        v-model="timeFrom"
                        label="From"
                      />
                    </v-col>
                    <v-col>
                      <v-datetime-picker
                        v-model="timeTo"
                        label="To"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-btn
                      class="success"
                      @click="createRent"
                    >
                      Create
                    </v-btn>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-dialog>
            <div class="mt-10">
                <h3 class="text-start">Your rent (${{ calculateTotalRentPrice }})</h3>
                <v-card
                  v-for="(rent, i) in rents"
                  :key="i"
                  class="mt-2"
                  elevation="5"
                >
                  <v-card-text>
                    <v-flex row class="justify-space-between">
                      <span class="ml-4">{{ rent.bike.bikeName }} / {{ rent.bike.bikeType }} / ${{ rent.rentalPrice }}</span>
                      <v-btn
                        class="error"
                        @click="deleteRent(rent._id)"
                      >
                        Cancel rent
                      </v-btn>
                    </v-flex>
                  </v-card-text>
                </v-card>
            </div>
            <div class="mt-10">
              <h3 class="text-start">Available bikes ({{ availableBikes.length }})</h3>
              <v-card
                v-for="(bike, i) in availableBikes"
                :key="i"
                class="mt-2"
                elevation="5"
              >
                <v-card-text>
                  <v-flex row class="justify-space-between">
                    <span class="ml-4">{{ bike.bikeName }} / {{ bike.bikeType }} / ${{ bike.price }}</span>
                    <div>
                      <v-btn
                        class="primary"
                        @click="openRentDialog(bike)"
                      >
                        Rent
                      </v-btn>
                      <v-btn
                        class="error"
                        @click="deleteBike(bike._id)"
                      >
                        Delete
                      </v-btn>
                    </div>
                  </v-flex>
                </v-card-text>
              </v-card>
            </div>
          </template>
          <v-snackbar
            v-model="snackbar"
          >
            {{ snackbarMessage }}
            <template v-slot:action="{ attrs }">
              <v-btn
                color="pink"
                text
                v-bind="attrs"
                @click="snackbar = false"
              >
                Close
              </v-btn>
            </template>
          </v-snackbar>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>

import apiService from "../services/main";

export default {
  name: "BikeRent",
  data: () => ({
    availableBikes: [],
    snackbar: false,
    snackbarMessage: "",
    bikeName: undefined,
    bikeType: undefined,
    price: undefined,
    pageMetadata: {},
    rents: [],
    showCreateRentDialog: false,
    timeFrom: undefined,
    timeTo: undefined,
    selectedBike: undefined
  }),
  methods: {
    getAvailableBikes(){
      apiService.getAvailableBikesList()
        .then(res => {
          this.availableBikes = res.data.bikes;
        })
        .catch(err => {
          this.snackbar = true;
          this.snackbarMessage = err.data.error;
        })
    },
    updateBikeLists(){
      this.getRentList();
      this.getAvailableBikes();
    },
    deleteBike(id){
      apiService.deleteBike(id)
        .then(res => {
          this.snackbar = true;
          this.snackbarMessage = res.data.message;
          this.updateBikeLists();
        })
        .catch(err => {
          this.snackbar = true;
          this.snackbarMessage = err.data.error;
        })
    },
    createBike(){
      const data = {
        bikeName: this.bikeName,
        bikeType: this.bikeType,
        price: this.price
      };
      apiService.createBike(data)
        .then(res => {
          this.snackbar = true;
          this.snackbarMessage = res.data.message;
          this.updateBikeLists();
          this.bikeName = this.bikeType = this.price = undefined;
        })
        .catch(err => {
          this.snackbar = true;
          this.snackbarMessage = err.response.data.errors.message;
        })
    },
    getPageMetadata(){
      apiService.getPageMetadata()
        .then(res => {
          this.pageMetadata = res.data
        })
        .catch(err => {
          this.snackbar = true;
          this.snackbarMessage = "Error occurred while requesting page metadata"
        })
    },
    getRentList(){
      apiService.rentList()
        .then(res => {
          this.rents = res.data.rents;
        })
        .catch(err => {
          this.snackbar = true;
          this.snackbarMessage = err.data.error;
        })
    },
    deleteRent(id){
      apiService.deleteRent(id)
        .then(res => {
          this.snackbar = true;
          this.snackbarMessage = res.data.message;
          this.updateBikeLists();
        })
        .catch(err => {
          this.snackbar = true;
          this.snackbarMessage = err.response.data.errors.message;
        })
    },
    openRentDialog(bike){
      this.selectedBike = bike;
      this.showCreateRentDialog = true;
    },
    createRent(){
      const data = {
        bike: this.selectedBike,
        timeFrom: this.timeFrom,
        timeTo: this.timeTo
      }
      apiService.createRent(data)
        .then(res => {
          this.updateBikeLists();
          this.snackbar = true;
          this.snackbarMessage = res.data.message;
          this.showCreateRentDialog = false;
          this.selectedBike = this.timeTo = this.timeFrom = undefined;
        })
        .catch(err => {
          this.snackbar = true;
          this.snackbarMessage = err.response.data.error;
        })
    }
  },
  computed: {
    calculateTotalRentPrice(){
      return this.rents.reduce((sum, bike) => {
        return sum + bike.rentalPrice
      }, 0)
    }
  },
  created() {
    this.updateBikeLists();
    this.getPageMetadata();
  }

}
</script>

<style scoped>
  .main-container{
    /*max-width: 75%;*/
    margin-left: auto;
    margin-right: auto;
  }
  #app {
    background-color: gainsboro;
  }
</style>
<style>
  html {
    background-color: gainsboro !important;
  }
</style>
