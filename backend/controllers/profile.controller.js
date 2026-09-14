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

    // Duplicate profile
    if (error.code === 11000) {
        return res.status(409).json({
            success: false,
            message: "Profile already exists"
        });
    }

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

        // Type validation
        const { bio, role, skills, interests, location } = req.body;

       if (
    (bio !== undefined && typeof bio !== "string") ||
    (role !== undefined && typeof role !== "string") ||
    (location !== undefined && typeof location !== "string") ||

    (skills !== undefined &&
        (!Array.isArray(skills) ||
         !skills.every((skill) => typeof skill === "string"))) ||

    (interests !== undefined &&
        (!Array.isArray(interests) ||
         !interests.every((interest) => typeof interest === "string")))
) {
    return res.status(400).json({
        success: false,
        message: "Invalid profile data"
    });
}

        // Unknown field validation
        const allowedFields = [
            "bio",
            "role",
            "skills",
            "interests",
            "location"
        ];
       

        if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
        success: false,
        message: "At least one profile field is required"
    });
}
        const unknownFields = Object.keys(req.body).filter(
            (field) => !allowedFields.includes(field)
        );
        
        if (unknownFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid profile field"
            });
        }

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