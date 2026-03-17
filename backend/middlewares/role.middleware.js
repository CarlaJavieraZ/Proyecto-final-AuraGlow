export const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.rol) {
      return res.status(403).json({
        error: "Acceso denegado",
      });
    }

    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({
        error: "No tienes permisos para acceder a esta ruta",
      });
    }

    next();
  };
};