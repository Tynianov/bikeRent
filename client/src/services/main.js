import axios from 'axios'

const BASE_URL = process.env.VUE_APP_API_ORIGIN || "http://localhost:8000"
const BASE_API_URl = `${BASE_URL}/api/v1`


const apiService = axios.create({
  baseURL: BASE_API_URl,
  params: {json: true},
});

export default{
  getAvailableBikesList(){
    return apiService.get('/bikes/available');
  },

  deleteBike(id){
    return apiService.delete(`/bikes/delete/${id}`);
  },
  createBike(data){
    return apiService({
      url: "/bikes/add",
      method: "POST",
      data
    })
  },
  getPageMetadata(){
    return apiService.get('/bikes/page_metadata')
  },
  rentList(){
    return apiService.get('/rent/list');
  },
  createRent(data){
    return apiService({
      "url": "/rent/create",
      "method": "POST",
      data
    })
  },
  deleteRent(id){
    return apiService.delete(`/rent/delete/${id}`)
  }
}

