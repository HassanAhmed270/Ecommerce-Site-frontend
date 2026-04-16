import React from 'react'
import ProductImg from '../components/ProductImg'
import ProductDesc from '../components/ProductDesc'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import BreadCrumbs from '../components/BreadCrumbs'

const SingleProduct = () => {
    const { id } = useParams();

    const products = useSelector(store => store.products.products);

    const product = products?.find((item) => item._id === id);
    console.log(id);
    console.log(product);
    console.log(products);
    // ✅ Prevent crash
    if (!product) {
        return (
            <div className="pt-20 text-center text-lg">
                Loading product...
            </div>
        );
    }

    return (
        <div className="pt-20 py-10 max-w-7xl mx-auto">

            <BreadCrumbs product={product} />

            <div className='mt-10 grid grid-cols-2 items-start gap-10 px-8 '>
                <ProductImg images={product.productImg} />
                <ProductDesc  product={product} />
            </div>
        </div>
    )
}

export default SingleProduct