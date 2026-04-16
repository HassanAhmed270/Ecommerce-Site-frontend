import React from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useLocation, Link as RouterLink } from "react-router-dom";

const BreadCrumbs = () => {
  const location = useLocation();

  // Split path into parts
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className="px-6 py-3">
      <Breadcrumbs aria-label="breadcrumb">

        {/* Home Link */}
        <Link
          component={RouterLink}
          to="/"
          underline="hover"
          color="inherit"
        >
          Home
        </Link>

        {/* Dynamic Paths */}
        {pathnames.map((value, index) => {
          const to = "/" + pathnames.slice(0, index + 1).join("/");
          const isLast = index === pathnames.length - 1;

          return isLast ? (
            <Typography key={to} color="text.primary">
              {value.replace("-", " ").toUpperCase()}
            </Typography>
          ) : (
            <Link
              key={to}
              component={RouterLink}
              to={to}
              underline="hover"
              color="inherit"
            >
              {value.replace("-", " ").toUpperCase()}
            </Link>
          );
        })}
      </Breadcrumbs>
    </div>
  );
};

export default BreadCrumbs;