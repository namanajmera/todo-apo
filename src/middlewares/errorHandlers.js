
export const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const isOperational = err.isOperational || false;
    const status = err.status || 'error';
    
    res.status(statusCode).json({
        status,
        statusCode,
        message,
        isOperational,
    });
}