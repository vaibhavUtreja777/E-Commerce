import React, { useState, useEffect } from "react";
import Axios from "axios"
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Card from "./Card"
const Products = () => {
  const [mainData,setMainData] = useState([])
  const [filter, setFilter] = useState(mainData);
  
  const [loading, setLoading] = useState(false);
  let componentMounted = true;

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const res = await Axios.get('http://127.0.0.1:5000/product')
      if (componentMounted) {
        setMainData(res.data)
        setLoading(false);
      }

      return () => {
        componentMounted = false;
      };
    };

    getProducts();
  }, []);

  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
      </>
    );
  };

  const filterProduct = (cat) => {
    const updatedList = mainData[cat]
    setFilter(updatedList);
  }
  const setFilters = () =>{
    const categories = Object.keys(mainData)
    return(
      categories.map((cat)=>{
        return(
          <button className="btn btn-outline-dark btn-sm m-2" onClick={() => filterProduct(cat)}>{cat}</button>
        )
      })
    )
  }
  const ShowProducts = () => {
    return (
      <>
        <div className="buttons text-center py-5">
          {setFilters()}
        </div>

        {filter.map((product) => {
          return (
            <Card product={product}/>
          );
        })}
      </>
    );
  };
  return (
    <>
      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-12">
            <h2 className="display-5 text-center">Latest Products</h2>
            <hr />
          </div>
        </div>
        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
    </>
  );
};

export default Products;
