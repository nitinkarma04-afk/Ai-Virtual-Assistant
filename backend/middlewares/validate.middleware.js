const validateMessage = (req, res, next) => {
    const { message } = req.body;

    // 1. Message must exist
    if (!message) {
        return res.status(400).json({
            success: false,
            message: "Message is required",
        });
    }

    // 2. Message must be a string
    if (typeof message !== "string") {
        return res.status(400).json({
            success: false,
            message: "Message must be a string",
        });
    }

    // 3. Message cannot be empty
    if (!message.trim()) {
        return res.status(400).json({
            success: false,
            message: "Message cannot be empty",
        });
    }

    // 4. Limit message length
    if (message.trim().length > 2000) {
        return res.status(400).json({
            success: false,
            message: "Message is too long. Maximum 2000 characters allowed.",
        });
    }

    next();
};

export default validateMessage;