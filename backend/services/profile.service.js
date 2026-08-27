import Profile from "../models/profile.model.js";


// Get user profile
export const getProfile = async (userId) => {
    return await Profile.findOne({ userId });
};


// Create user profile
export const createProfile = async (userId, profileData) => {
    return await Profile.create({
        userId,
        ...profileData
    });
};


// Update user profile
export const updateProfile = async (userId, profileData) => {
    return await Profile.findOneAndUpdate(
        { userId },
        { $set: profileData },
        {
            new: true,
            upsert: true
        }
    );
};