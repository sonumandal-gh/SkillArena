exports.adminMiddleware = (req, res, next) =>{
    if(req.userExist.role !== "admin"){
        return res.status(403).json({
      message: "Access denied. Admin only",
    });
  }

  next();
};

