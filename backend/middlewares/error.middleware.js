const errorMiddleware = (err, req, res, next) => {
    console.error("Global Error:", err);

    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal server error";

    // Mongoose invalid ObjectId
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID";
    }
    // Mongoose validation error
if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
}

    return res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && {
            stack: err.stack,
        }),
    });
};

export default errorMiddleware;