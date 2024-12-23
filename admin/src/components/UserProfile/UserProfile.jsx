import React, { useState, useContext, useEffect } from 'react';
import './UserProfile.css';
import edit_icon from '../../../../nhalauHotpot/src/assets/edit-alt-regular-24.png';
import { StoreContext } from '../../context/StoreContext';
import axios from "axios";


const UserProfile = () => {
    const { adminInfo, url, token } = useContext(StoreContext);
    const [activeTab, setActiveTab] = useState('profile');
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    if (!token) {
        alert("Please Log in");
        window.location.href = "/";
        return;
    }
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

            </div>

            <div className="content">
                {activeTab === 'profile' && (
                    <MyProfile />
                )}
                {activeTab === 'update-password' && <UpdatePassword />}

            </div>
        </div>
    );
};



const MyProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const { url, adminInfo, setAdminInfo } = useContext(StoreContext);
    const [previewImage, setPreviewImage] = useState(null);
    const [image, setImage] = useState(null);
    const [userEdit, setUserEdit] = useState(adminInfo || null);

    useEffect(() => {
        if (adminInfo) {
            setUserEdit(
                adminInfo
            );
        }
    }, [adminInfo]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        const address = {
            street: userEdit.address[0]?.street || '',
            city: userEdit.address[0]?.city || '',
            state: userEdit.address[0]?.state || '',
            zipCode: userEdit.address[0]?.zipCode || '',
            country: userEdit.address[0]?.country || '',
            phone: userEdit.address[0]?.phone || '',
        };

        const userData = new FormData();
        userData.append('firstName', userEdit.firstName);
        userData.append('lastName', userEdit.lastName);
        userData.append('name', `${userEdit.firstName} ${userEdit.lastName}`);
        userData.append('email', userEdit.email);
        userData.append('address', JSON.stringify(address));
        userEdit.name = userEdit.firstName + ' ' + userEdit.lastName;
        if (image) {
            userData.append('image', image);
        }

        const response = await saveProfile(userData);

        if (response.success) {
            setAdminInfo({ ...adminInfo, ...response.user, avatar: response.user.avatar });
            localStorage.setItem("user", JSON.stringify(response.user));
            alert('Profile updated successfully!');
        } else {
            alert('Error updating profile!');
        }

        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserEdit((prevUserEdit) => ({
            ...prevUserEdit,
            [name]: value,
        }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setUserEdit((prevUserEdit) => ({
            ...prevUserEdit,
            address: [
                {
                    ...prevUserEdit.address[0],
                    [name]: value,
                },
            ],
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const saveProfile = async (userData) => {
        try {
            const response = await axios.put(`${url}/api/user/${adminInfo._id}`, userData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            console.error('Error saving profile:', error);
            return { success: false, message: 'Error updating profile' };
        }
    };

    return (
        <div className="profile-section">
            <img
                src={edit_icon}
                alt="Edit"
                className="edit-icon"
                onClick={handleEditClick}
            />
            <div className="profile-header">
                <h2>My Profile</h2>
            </div>
            <div className="avatar-section">
                <img
                    src={previewImage ? previewImage : `${url}/images/avatars/${adminInfo.avatar}`}
                    alt="Avatar"
                    className="avatar-image"
                />
                {isEditing && (
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="avatar-input"
                    />
                )}
            </div>
            <div className="profile-details place-order-left">
                <div>
                    <div className="multi-fields">
                        <input
                            required
                            name="firstName"
                            onChange={handleChange}
                            value={userEdit.firstName || ''}
                            type="text"
                            placeholder="First Name"
                            disabled={!isEditing}
                        />
                        <input
                            required
                            name="lastName"
                            onChange={handleChange}
                            value={userEdit.lastName || ''}
                            type="text"
                            placeholder="Last Name"
                            disabled={!isEditing}
                        />
                    </div>
                    <input
                        required
                        name="email"
                        value={userEdit.email || ''}
                        type="email"
                        placeholder="Email"
                        disabled={true}
                    />
                    <input
                        required
                        name="street"
                        onChange={handleAddressChange}
                        value={userEdit.address[0]?.street || ''}
                        type="text"
                        placeholder="Street"
                        disabled={!isEditing}
                    />
                    <div className="multi-fields">
                        <input
                            required
                            name="city"
                            onChange={handleAddressChange}
                            value={userEdit.address[0]?.city || ''}
                            type="text"
                            placeholder="City"
                            disabled={!isEditing}
                        />
                        <input
                            required
                            name="state"
                            onChange={handleAddressChange}
                            value={userEdit.address[0]?.state || ''}
                            type="text"
                            placeholder="State"
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="multi-fields">
                        <input
                            required
                            name="zipCode"
                            onChange={handleAddressChange}
                            value={userEdit.address[0]?.zipCode || ''}
                            type="text"
                            placeholder="Zip Code"
                            disabled={!isEditing}
                        />
                        <input
                            required
                            name="country"
                            onChange={handleAddressChange}
                            value={userEdit.address[0]?.country || ''}
                            type="text"
                            placeholder="Country"
                            disabled={!isEditing}
                        />
                    </div>
                    <input
                        required
                        name="phone"
                        onChange={handleAddressChange}
                        value={userEdit.address[0]?.phone || ''}
                        type="text"
                        placeholder="Phone Number"
                        disabled={!isEditing}
                    />
                    {isEditing && (
                        <button className="save-button" onClick={handleSaveClick}>
                            Save
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};


const UpdatePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { adminInfo, setAdminInfo, url } = useContext(StoreContext);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setErrorMessage('New passwords do not match!');
            return;
        }
        try {
            // Gửi dữ liệu dưới dạng userData
            const response = await axios.put(`${url}/api/user/${adminInfo._id}`, {
                userData: {
                    currentPassword,
                    newPassword
                }
            });
            if (response.data.success) {
                alert('Password updated successfully!');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setErrorMessage(response.data.message || 'Error updating password');
            }
        } catch (error) {
            console.error('Error updating password:', error);
            setErrorMessage('Error updating password');
        }
    };
    return (
        <div className="update-password-section">
            <h2>Update Password</h2>
            <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <button onClick={handleChangePassword}>Update Password</button>
        </div>
    );
};



export default UserProfile;
