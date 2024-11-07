
import React, { useState, useContext } from 'react';
import './UserProfile.css';
import edit_icon from '../../assets/edit-alt-regular-24.png';
import default_avatar from '../../assets/profile_icon.png'; // Placeholder avatar
import FoodDisplay from '../FoodDisplay/FoodDisplay';
import { StoreContext } from '../../context/StoreContext';

const UserProfile = () => {
    const { userInfo, setUserInfo } = useContext(StoreContext);
    console.log(userInfo); // Use StoreContext to get userInfo
    const [activeTab, setActiveTab] = useState('profile');


    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="user-profile-container">
            <div className="sidebar">
                <button
                    className={activeTab === 'profile' ? 'active' : ''}
                    onClick={() => handleTabClick('profile')}
                >
                    My Profile
                </button>
                <button
                    className={activeTab === 'update-password' ? 'active' : ''}
                    onClick={() => handleTabClick('update-password')}
                >
                    Update Password
                </button>
                <button
                    className={activeTab === 'wishlist' ? 'active' : ''}
                    onClick={() => handleTabClick('wishlist')}
                >
                    Wishlist
                </button>
            </div>

            <div className="content">
                {activeTab === 'profile' && (
                    <MyProfile
                        userInfo={userInfo}
                        setUserInfo={setUserInfo}
                    />
                )}
                {activeTab === 'update-password' && <UpdatePassword />}

                {activeTab === 'wishlist' && <Wishlist wishlist={userInfo.wishlist} />} {/* Use wishlist from userInfo */}

            </div>
        </div>
    );
};

const MyProfile = ({ userInfo, setUserInfo }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedInfo, setEditedInfo] = useState({ ...userInfo });

    const [selectedAvatar, setSelectedAvatar] = useState(userInfo.avatar || default_avatar);


    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        setUserInfo({ ...editedInfo, avatar: selectedAvatar });
        setIsEditing(false);
    };

    const handleChange = (e) => {
        setEditedInfo({
            ...editedInfo,
            [e.target.name]: e.target.value,
        });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="profile-section">
            <div className="profile-header">
                <h2>My Profile</h2>
                <img
                    src={edit_icon}
                    alt="Edit"
                    className="edit-icon"
                    onClick={handleEditClick}
                />
            </div>
            <div className="avatar-section">
                <img
                    src={selectedAvatar}
                    alt="Avatar"
                    className="avatar-image"
                />
                {isEditing && (
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="avatar-input"
                    />
                )}
            </div>
            <div className="profile-details">
                <p>
                    <strong>Name:</strong>{' '}
                    {isEditing ? (
                        <input
                            type="text"
                            name="name"
                            value={editedInfo.name}
                            onChange={handleChange}
                        />
                    ) : (
                        userInfo.name
                    )}
                </p>
                <p>
                    <strong>Email:</strong>{' '}
                    <input
                        type="email"
                        name="email"
                        value={userInfo.email}
                        readOnly
                    />
                </p>
                <p>
                    <strong>Address:</strong>{' '}
                    {isEditing ? (
                        <input
                            type="text"
                            name="address"
                            value={editedInfo.address}
                            onChange={handleChange}
                        />
                    ) : (
                        userInfo.address
                    )}
                </p>
                <p>
                    <strong>Password:</strong> {userInfo.password}
                </p>
            </div>
            {isEditing && (
                <button className="save-button" onClick={handleSaveClick}>
                    Save
                </button>
            )}
        </div>
    );
};

const UpdatePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        if (newPassword === confirmPassword) {
            alert('Password updated successfully!');
        } else {
            alert('Passwords do not match.');
        }
    };

    return (
        <div className="update-password-section">
            <h2>Update Password</h2>
            <form onSubmit={handlePasswordUpdate}>
                <div>
                    <label>Current Password</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Confirm New Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Update Password</button>
            </form>
        </div>
    );
};


const Wishlist = ({ wishlist }) => {
    return (
        <div className="wishlist-section">
            <h2>Wishlist</h2>
            {wishlist && wishlist.length > 0 ? (
                <FoodDisplay wishlist={wishlist.map(item => item.id)} />
            ) : (
                <p>Your wishlist is empty.</p>
            )}
        </div>
    );
};



export default UserProfile;
