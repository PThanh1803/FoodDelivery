import { useContext, useState } from "react";
import { StoreContext } from "../../Context/StoreContext";
import "./Card.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Card = ({ setShowLogin }) => {
  const { cardItems, removeFromCard, food_list, getTotalCartAmount, url, token } = useContext(StoreContext);
  const navigate = useNavigate();
  const [voucherCode, setVoucherCode] = useState("");
  const [voucher, setVoucher] = useState(null);

  const handleClick = async (code) => {
    try {
      const response = await fetch(`${url}/api/voucher?code=${code}&type=getByCode`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data);
      if (data.success) {
        setVoucher(data.voucher);  // Lưu voucher vào state
        toast.success(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to apply voucher");
    }
  };

  const calculateDiscount = (originalPrice, voucher) => {
    let discountAmount = 0;
    console.log(originalPrice);
    // Kiểm tra nếu voucher hợp lệ và có thể áp dụng
    if (voucher && originalPrice > voucher.minOrder) {
      alert("Voucher hop le");
      console.log(voucher);
      if (voucher.discountType === "Percentage") {
        discountAmount = (originalPrice * voucher.discountAmount) / 100;
      }
      else if (voucher.discountType === "Fixed") {
        discountAmount = voucher.discountAmount;
      }

      if (discountAmount > voucher.maxDiscount) {
        discountAmount = voucher.maxDiscount;
      }
    }
    else if (voucher && originalPrice < voucher.minOrder) {
      alert("Voucher khong hop le" + voucher.minOrder);
    }
    return discountAmount;
  };

  const subtotal = getTotalCartAmount();
  const discount = calculateDiscount(subtotal, voucher);  // Tính lại discount dựa trên voucher
  const deliveryFee = subtotal === 0 ? 0 : 2; // Phí giao hàng
  const totalAmount = subtotal + deliveryFee - discount;

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
                  <img src={url + "/images/" + item.image} alt="food" />
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
                <p>${subtotal}</p>
              </div>
              <hr />
              <div className="card-total-details">
                <p>Delivery Fee</p>
                <p>${deliveryFee}</p>
              </div>
              <hr />
              <div className="card-total-details">
                <p>Discount</p>
                <p>-${discount}</p>
              </div>
              <hr />
              <div className="card-total-details">
                <p>Total</p>
                <b>${totalAmount}</b>
              </div>
            </div>
            <button
              disabled={subtotal === 0}
              onClick={() => {
                if (!token) {
                  setShowLogin(true)
                  return
                }
                navigate("/placeorder", {
                  state: {
                    discountAmount: discount,
                    voucher: voucher,
                  },
                })
              }
              }
            >
              Proceed to checkout
            </button>

          </div>

          <div className="card-promocode">
            <div>
              <p>If you have a promocode, enter here</p>
              <div className="card-promocode-input">
                <input
                  type="text"
                  placeholder="Enter Promocode"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                />
                <button onClick={() => handleClick(voucherCode)}>Apply</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
