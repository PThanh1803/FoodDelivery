/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cardItems, url  } = React.useContext(StoreContext);

  const [data, setData] = React.useState({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"",
    state:"",
    zipcode:"",
    country:"",
    phone:""
  })


  const onChangeHandeler = (event)=>{
    const name = event.target.name;
    const value = event.target.value;
    setData(data=>({...data,[name]:value}))
  }

  const placeOrder = async (event) => {
      event.preventDefault();
      let orderItems = [];
      food_list.map((item)=>{
        if (cardItems[item._id]>0)
        {
          let itemInfo = item;
          itemInfo["quantity"] = cardItems[item._id];
          orderItems.push(itemInfo);
        }
      })
      console.log(orderItems);
      let orderData = {
        address: data,
        items: orderItems,
        amount: getTotalCartAmount()+2,
      }
    
      let response = await axios.post(`${url}/api/order/place`, orderData, {headers: {token}})
      console.log(response);
      if(response.data.success){
        const {session_url}= response.data;
        console.log(session_url);
        window.location.replace(session_url);
      }
      else{
        alert("error :"+response.data.message);
      }

      const navigate = useNavigate();
      
      useEffect(() => {
        if (token) {
          navigate("/cart");
        }
        else if(getTotalCartAmount()===0){
          navigate("/cart");
        }

      }, [token]);
  }


  return (
    <form className="place-order" onSubmit={placeOrder}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name="firstName" onChange={onChangeHandeler} value={data.firstName} type="text" placeholder="First Name" />
          <input required name="lastName" onChange={onChangeHandeler} value={data.lastName} type="text" placeholder="Last Name" />
        </div>
        <input required name="email" onChange={onChangeHandeler} value={data.email} className="" type="email" placeholder="Email" />
        <input required name ="street" onChange={onChangeHandeler} value={data.street} type="text" placeholder="Street" />
        <div className="multi-fields">
          <input required name ="city" onChange={onChangeHandeler} value={data.city} type="text" placeholder="City" />
          <input required name ="state" onChange={onChangeHandeler} value={data.state} type="text" placeholder="State" />
        </div>
        <div className="multi-fields">
          <input required name="zipcode" onChange={onChangeHandeler} value={data.zipcode} type="text" placeholder="Zip Code" />
          <input required name="country" onChange={onChangeHandeler} value={data.country} type="text" placeholder="Country" />
        </div>
        <input required name ="phone" onChange={onChangeHandeler} value= {data.phone} type="text" placeholder="Phone Number" />
      </div>
      <div className="place-order-right">
        <div className="card-total">
            <h2>Cart Totals</h2>
            <div>
              <div className="card-total-details">
                <p>Subtotal</p>
                <p>$ {getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className="card-total-details">
                <p>Delivery free</p>
                <p>$ {getTotalCartAmount()===0?0:2}</p>
              </div>
              <hr />
              <div className="card-total-details">
                <p>Total</p>
                <b>$ {getTotalCartAmount()===0?0:getTotalCartAmount()+2}</b>
              </div>
              
            </div>
            <button type="submit">Proceed to payment</button>
        </div>
      </div>
      
    </form>
  );
};

export default PlaceOrder;
