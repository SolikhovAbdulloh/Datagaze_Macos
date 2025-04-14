import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "~/utils";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const token = getToken();
  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

  return token && <>{children}</>;
};

export default PrivateRoute;
