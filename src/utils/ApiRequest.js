import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;



export function get(path, success, error){
    try{
      let apiUrl = `${API_URL}${path}`;
      axios({
          method: 'get',
          url: apiUrl,
        }).then(function(response){
            success(response.data);

        }).catch(function(e){
            error(e);
        });
    }
    catch(e){
      console.log(e)
    }
}

export function post(path, data, success, error){
    try{
      let apiUrl = `${API_URL}${path}`;
      axios({
          method: 'post',
          url: apiUrl,
          data: data
        }).then(function(response){
            success(response.data);
        }).catch(function(e){
            error(e);

        });
    }
    catch(e){
      console.log(e)
    }
}

export function put(path, data, success, error){
    try{
      let apiUrl = `${API_URL}${path}`;
      axios({
          method: 'put',
          url: apiUrl,
          data: data
        }).then(function(response){
            success(response.data);
        }).catch(function(e){
            error(e);

        });
    }
    catch(e){
      console.log(e)
    }
}

export function del(path,data, success, error){
    try{
      let apiUrl = `${API_URL}${path}`;
      axios({
          method: 'delete',
          url: apiUrl,
          data: data
        }).then(function(response){
            success(response.data);
        }).catch(function(e){
            error(e);

        });
    }
    catch(e){
      console.log(e)
    }
}
  
  
  export default {
    get
  }
