import axios from 'axios';

const BASE_URL = 'http://localhost:32216/api/';

export const ENDPOINTS = {
   CUSTOMER: 'Customer',
   FOODITEM: 'FoodItem',
   ORDER: 'Order'
}

export const createAPIEndpoint = endpoint => {
   let URL = BASE_URL + endpoint + '/';
   return {
      fetchAll: () => axios.get(URL),
      fetachById: id => axios.get(URL + id),
      create: newRecord => axios.post(URL, newRecord),
      update: (id, updatedRecord) => axios.put(URL + id, updatedRecord),
      delete: id => axios.delete(URL + id)
   }
}