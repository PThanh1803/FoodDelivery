import { useContext } from "react";
import { StoreContext } from "../../Context/StoreContext";
import "./Card.css";
import { useNavigate } from "react-router-dom";

const Card = () => {
  const { cardItems, removeFromCard, food_list, getTotalCartAmount, url } = useContext(StoreContext);
  const navigate = useNavigate();
  return (
    <div className="card">
      <div className="card-items">
        <div className="card-items-title">
          <p> Items </p>
          <p> Title </p>
          <p> Price </p>
          <p> Quantity</p>
          <p> Total </p>
          <p> Remove </p>
        </div>
        <br />
        <hr />

        {food_list.map((item, index) => {
          if (cardItems[item._id] > 0) {
            return (
              <div key={index}>
                <div className="card-items-title card-items-item">
                  <img src={url+"/images/"+item.image} alt="food" />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <p>{cardItems[item._id]}</p>
                  <p>${cardItems[item._id] * item.price}</p>
                  <p className="cross" onClick={() => removeFromCard(item._id)}>
                    X
                  </p>
                </div>
                <hr />
              </div>
            );
          }
        })}

        <div className="card-bottom">
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
            <button disabled={getTotalCartAmount()===0} onClick={() => navigate("/placeorder")}>Proceed to checkout</button>
          </div>
          <div className="card-promocode">
            <div>
              <p>If you have a promocode, Enter here</p>
              <div className="card-promocode-input">
                <input type="text" placeholder="Enter Promocode" />
                <button >Apply</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
