import { Link } from "react-router-dom"
import { useDispatch , useSelector } from "react-redux";
import { addCart , setUser } from "../redux/action";
import Axios from "axios";
const Card = ({product}) => {
    const user = useSelector((state) => state.handleUser)
    const dispatch = useDispatch()
    const addProduct = async(product) => {
        if (user!==null) {
            dispatch(setUser({ ...user, brand: product.Brand }))
            await Axios.post('http://localhost:4000/brand', { username: user.email, brand: product.Brand })
          }
        dispatch(addCart(product))
      }
    return (
        <div id={product.Link} key={product.Link} className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
            <div className="card text-center h-100" key={product.Link}>
                <img
                    className="card-img-top p-3"
                    src={product.Image_Link}
                    alt="Card"
                    height={300}
                    width={"100%"}
                />
                <div className="card-body">
                    <h5 className="card-title">
                        {product.Name.substring(0, 12)}...
                    </h5>
                    <p className="card-text">
                        {product.Brand}{product.Fabric} {product.Color}...
                    </p>
                </div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item lead">Rs {product.Price}</li>
                </ul>
                <div className="card-body">
                    <Link to={"/product/" + product.Name} className="btn btn-dark m-1" target="_blank">
                        Buy Now
                    </Link>
                    <button className="btn btn-dark m-1" onClick={() => addProduct(product)}>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Card