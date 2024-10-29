import React, { useState, useContext } from 'react';
import './BookingTable.css';
import BookingMenu from './BookingMenu/BookingMenu'; // Import custom BookingMenu component
import { StoreContext } from '../../context/StoreContext';

const BookingTable = () => {
    const { food_list, url } = useContext(StoreContext);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [guests, setGuests] = useState(1);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [note, setNote] = useState('');
    const [preOrder, setPreOrder] = useState(false);
    const [selectedFoods, setSelectedFoods] = useState({});

    const handleFoodSelect = (food) => {
        setSelectedFoods((prev) => {
            const currentFood = prev[food._id];
            const newQuantity = currentFood ? currentFood.quantity + 1 : 1; // Increment quantity
            return {
                ...prev,
                [food._id]: { ...food, quantity: newQuantity }
            };
        });
    };

    const handleIncreaseQuantity = (food) => {
        const currentFood = selectedFoods[food._id];
        const quantityToAdd = currentFood ? currentFood.quantity : 0;
        
        setSelectedFoods((prev) => ({
          ...prev,
          [food._id]: { ...food, quantity: quantityToAdd + food.quantity } // Update with new quantity
        }));
      };
    const handleDecreaseQuantity = (foodId) => {
        setSelectedFoods((prev) => {
            const currentFood = prev[foodId];
            if (currentFood && currentFood.quantity > 1) {
                return {
                    ...prev,
                    [foodId]: { ...currentFood, quantity: currentFood.quantity - 1 }
                };
            } else {
                const { [foodId]: _, ...rest } = prev;
                return rest;
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const formData = {
            reservationId: 'reservation_id_1', // Replace with dynamic ID generation if needed
            userId: 'user_id_1', // Replace with actual user ID if available
            phone,
            email,
            reservationTime: new Date(`${date}T${time}:00Z`).toISOString(), // Combine date and time
            numberOfPeople: guests,
            notes: note,
            preOrderedItems: Object.values(selectedFoods).map(food => ({
                menuItemId: food._id,
                quantity: food.quantity,
            })),
            status: 'pending', // Default status
        };

        console.log(formData); // Use formData as needed
        alert(`Bạn đã đặt bàn cho ${guests} khách vào lúc ${time} ngày ${date}.`);
    };

    return (
        <div className="booking-table-container">
            <form className="booking-form" onSubmit={handleSubmit}>
                <div className="left-section">
                    <h2>Đặt Bàn</h2>
                    <div className="form-group">
                        <label htmlFor="name">Tên:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Số điện thoại:</label>
                        <input
                            type="tel"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="guests">Số lượng khách:</label>
                        <input
                            type="number"
                            id="guests"
                            value={guests}
                            onChange={(e) => setGuests(Number(e.target.value))}
                            min="1"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="date">Ngày:</label>
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="time">Giờ:</label>
                        <input
                            type="time"
                            id="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="note">Ghi chú:</label>
                        <textarea         
                            id="note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Nhập ghi chú tại đây..."
                        />
                    </div>
                    <div className="form-group">
                        <label>Chọn món trước:</label>
                        <div>
                            <input
                                type="radio"
                                id="preOrderYes"
                                name="preOrder"
                                value="yes"
                                checked={preOrder === true}
                                onChange={() => setPreOrder(true)}
                            />
                            <label htmlFor="preOrderYes">Có</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                id="preOrderNo"
                                name="preOrder"
                                value="no"
                                checked={preOrder === false}
                                onChange={() => setPreOrder(false)}
                            />
                            <label htmlFor="preOrderNo">Không</label>
                        </div>
                    </div>
                </div>

                {/* Show menu section when "Yes" is selected */}
                {preOrder && (
                    <div className="right-section">
                        <h3>Danh sách món ăn đã chọn</h3>
                        <div className="selected-foods">
                            {Object.values(selectedFoods).map((food) => (
                                <div key={food._id} className="selected-food-item">
                                    <img src={`${url}/images/${food.image}`} alt={food.name} />
                                    <div className="food-details">
                                        <p>{food.name}</p>
                                        <p>{food.price} VND</p>
                                    </div>
                                    <div className="food-quantity">
                                        <button type="button" onClick={() => handleDecreaseQuantity(food._id)}>-</button>
                                        <span>{food.quantity}</span>
                                        <button type="button" onClick={() => handleFoodSelect(food)}>+</button>
                                    </div>
                                </div>
                            ))}
                            {Object.keys(selectedFoods).length === 0 && (
                                <p>Chưa chọn món nào</p>
                            )}
                        </div>
                    </div>
                )}
            </form>

            {/* Always show the order button outside the form */}
            <div className="order-button-container">
                <button type="submit" className="order-button" onClick={handleSubmit}>
                    Đặt bàn
                </button>
            </div>

            {/* Display menu when "Yes" is selected */}
            {preOrder && (
                <div className="menu-section">
                    <BookingMenu onFoodSelect={handleIncreaseQuantity} />
                </div>
            )}
        </div>
    );
};
export default BookingTable;
