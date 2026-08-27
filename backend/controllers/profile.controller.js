import {
    getProfile,
    createProfile,
    updateProfile
} from "../services/profile.service.js";


// Get Profile
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.userId;

        const profile = await getProfile(userId);

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        return res.status(200).json({
            success: true,
            profile
        });

    } catch (error) {
        console.error("Get Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get profile"
        });
    }
};


// Create Profile
export const createUserProfile = async (req, res) => {
    try {
       const userId = req.userId;

        const profile = await createProfile(
            userId,
            req.body
        );

        return res.status(201).json({
            success: true,
            message: "Profile created successfully",
            profile
        });

    } catch (error) {
        console.error("Create Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create profile"
        });
    }
};


// Update Profile
export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.userId;

        const profile = await updateProfile(
            userId,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profile
        });

    } catch (error) {
        console.error("Update Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update profile"
        });
    }
};