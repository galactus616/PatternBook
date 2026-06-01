export const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const userRole = req.user.role;

        if (userRole === "ADMIN") {
            return next(); // Admins bypass all role checks
        }

        if (!roles.includes(userRole)) {
            return res.status(403).json({ success: false, message: "Forbidden: Insufficient role" });
        }

        next();
    };
};

export const requirePermission = (permission) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { role, permissions } = req.user;

        if (role === "ADMIN") {
            return next(); // Admins bypass all permission checks
        }

        if (role === "MODERATOR") {
            if (permissions && permissions.includes(permission)) {
                return next();
            }
        }

        return res.status(403).json({ success: false, message: `Forbidden: Missing permission ${permission}` });
    };
};
