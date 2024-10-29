import React, { useEffect } from 'react'
import './Add.css'
import {assets} from "../../assets/assets"
import axios from 'axios'
import { toast } from 'react-toastify'

const Add = ({url}) => {
    const [image,setImage] = React.useState(false)
    const [data,setData] = React.useState({
        name:'',
        description:'',
        category:'Salad',
        price:''
    })

    const onChangeHandeler = (event)=>{
        const name = event.target.name;
        const value = event.target.value;
        setData(data=>({...data,[name]:value}))
    }

   const onSumitHandler = async (event)=>{
    event.preventDefault();
    const formData = new FormData();
    formData.append('image',image)
    formData.append('name',data.name)
    formData.append('description',data.description)
    formData.append('category',data.category)
    formData.append('price',data.price)
    console.log(formData)
    const respone = await axios.post(`${url}/api/food/add`,formData)
    if(respone.data.success){
        setData({
            name:'',
            description:'',
            category:'Salad',
            price:''
        })
        setImage(false)
        toast.success(respone.data.message)
    }
    else{
        toast.error(respone.data.message)
    }
   }
  return (
    <div className='add'>
        <form className="flex-col" onSubmit={onSumitHandler}>
            <div className="add-img-upload flex-col">
                <p>Upload Image</p>
                <label htmlFor="image">
                    <img src={image?URL.createObjectURL(image):assets.upload_area} alt="" />
                </label>
                <input onChange={(e)=>setImage(e.target.files[0])} type="file" name="image" id="image" hidden required/>
            </div> 
            <div className="add-product-name flex-col">
                <p>Product Name</p>
                <input onChange={onChangeHandeler} value={data.name} type="text" name="name" id="name" required placeholder='Product Name'/>
            </div>
            
            <div className="add-product-desc flex-col">
                <p>Product Description</p>
                <textarea 
                onChange={onChangeHandeler} 
                value={data.description} 
                required
                name="description" 
                id="desc" 
                cols="30" 
                rows="6"/>
            </div>

            <div className="add-category-price">
                <div className="add-category flex-col">
                    <p>Product Category</p>
                    <select onChange={onChangeHandeler} value={data.category} name="category" id="category">
                        <option value="Salad">Salad</option>
                        <option value="Rolls">Rolls</option>
                        <option value="Deserts">Deserts</option>
                        <option value="Sandwich">Sandwich</option>
                        <option value="Cake">CakePasta</option>
                        <option value="Pasta">Pasta</option>
                    </select>
                </div>
                <div className="add-price flex-col">
                    <p>Product Price</p>
                    <input onChange={onChangeHandeler} value={data.price} type="number" name="price" id="price" required placeholder='20$'/>
                </div>                                
            </div>

            <button type="submit" className="add-btn">Add Product</button>

        </form>
    </div>
  )
}

export default Add