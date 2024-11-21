import axios from 'axios'
const path = 'http://localhost:4000'
export default class APIClient {
  // Constructor để khởi tạo thuộc tính
  constructor(object) {
    this.object = object
    this.api = `${path}/api/${object}` 
    this.token = localStorage.getItem('token')
  }

  async authenticate(account) {
    try {
      const data = await axios.post(`${this.api}`, {
        email: account.email,
        password: account.password,
        role: account.role
      })
      return data
    } catch (error) {   
      return error
    }
  }


  async find(params) {
    try {
      const data = await axios.get(`${this.api}`, {
        headers: {
          token : this.token
        },
        params : params
      })
      return data
    } catch (error) {
      return error
    }
  }

  async findByID(id) {
    const data = await axios.get(`${this.api}/${id}`, {
      headers: {
        token : this.token
      }
    })
    return data
  }

  async create(newData) {
    const data = await axios.post(`${this.api}`, newData, {
      headers: {
        token : this.token
      }
    })
    return data // data = true/false
  }

  async update(id, newData) {
    const data = await axios.put(`${this.api}/${id}`, newData, {
      headers: {
        token : this.token
      }
    })
    return data
  }


  async delete(id) {
    const data = await axios.delete(`${this.api}/${id}`, {
      headers: {
        token : this.token
      }
    })
    return data
  }
}
