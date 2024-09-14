import { Link, useNavigate, useLocation, useParams, useSearchParams } from "react-router-dom";
export const withRouter = (Component) => {
    const Wrapper = (props) => {
        const params = useParams();
        const [searchParams] = useSearchParams();
        const history = useNavigate();
        const location = useLocation();
        return <Component searchParams={searchParams} location={location} params={params} history={history} {...props} />
    }
    return Wrapper;
}