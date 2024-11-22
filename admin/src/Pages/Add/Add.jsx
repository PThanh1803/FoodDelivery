import React, { useEffect } from 'react';
import './Add.css';
import { assets } from "../../assets/assets";
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = ({ url, foodData, isEditMode, closeModal }) => {
    const [image, setImage] = React.useState(null); // Stores the actual image file
    const [imagePreview, setImagePreview] = React.useState(null);
    const [data, setData] = React.useState({
        name: '',
        description: '',
        category: 'Salad',
        price: ''
    });

    useEffect(() => {
        if (isEditMode && foodData) {
            setData({
                name: foodData.name,
                description: foodData.description,
                category: foodData.category,
                price: foodData.price
            });
            setImagePreview(`${url}/images/${foodData.image}`);
        }
    }, [isEditMode, foodData, url]);

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    const onImageChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
        setImagePreview(URL.createObjectURL(file)); // Show a preview of the selected image
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData();

        // Append the image file only if one is selected (either new or existing in edit mode)
        if (image) {
            formData.append('image', image);
        }

        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('category', data.category);
        formData.append('price', data.price);

        if (isEditMode) {
            formData.append('id', foodData._id);
        }
        if(isEditMode){
            try {
                const response = await axios.put(`${url}/api/food/${foodData._id}`, formData) ;
                console.log(response.data) 
                if (response.data.success) {
                    toast.success(response.data.message);
                    closeModal(); // Close modal on success
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error("Error uploading the product");
                console.log(error)
            }
        }
        else{
            try {
                const response =  await axios.post( `${url}/api/food/`, formData);
                console.log(response.data) 
                if (response.data.success) {
                    toast.success(response.data.message);
                    closeModal(); // Close modal on success
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error("Error uploading the product");
                console.log(error)
            }
        }
    };

    return (
        <div className='add'>
            <form className="flex-col" onSubmit={onSubmitHandler}>
                <div className="add-img-upload flex-col">
                    <p>Upload Image</p>
                    <label htmlFor="image">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Food" className="food-image-preview" />
                        ) : (
                            <img
                                src={assets.upload_area}
                                alt="Upload Placeholder"
                                className="food-image-preview"
                            />
                        )}
                    </label>

                    <input
                        onChange={onImageChange}
                        type="file"
                        name="image"
                        id="image"
                        hidden
                        required={!isEditMode} // Require only in add mode
                    />
                </div>
                <div className="add-product-name flex-col">
                    <p>Product Name</p>
                    <input
                        onChange={onChangeHandler}
                        value={data.name}
                        type="text"
                        name="name"
                        id="name"
                        required
                        placeholder='Product Name'
                    />
                </div>

                <div className="add-product-desc flex-col">
                    <p>Product Description</p>
                    <textarea
                        onChange={onChangeHandler}
                        value={data.description}
                        required
                        name="description"
                        id="desc"
                        cols="30"
                        rows="6"
                    />
                </div>

                <div className="add-category-price">
                    <div className="add-category flex-col">
                        <p>Product Category</p>
                        <select
                            onChange={onChangeHandler}
                            value={data.category}
                            name="category"
                            id="category"
                        >
                            <option value="Salad">Salad</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Desserts">Desserts</option>
                            <option value="Sandwich">Sandwich</option>
                            <option value="Cake">Cake</option>
                            <option value="Pasta">Pasta</option>
                        </select>
                    </div>
                    <div className="add-price flex-col">
                        <p>Product Price</p>
                        <input
                            onChange={onChangeHandler}
                            value={data.price}
                            type="number"
                            min ="0"
                            name="price"
                            id="price"
                            required
                            placeholder='20$'
                        />
                    </div>
                </div>

                <button type="submit" className="add-btn">{isEditMode ? "Save" : "Add Product"}</button>
            </form>
        </div>
    );
};

export default Add;
