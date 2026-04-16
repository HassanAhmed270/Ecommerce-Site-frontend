import ProductCard from '../components/ProductCard';
import FilterSideBar from '../components/FilterSIdeBar';
import LoaderScreen from '../components/LoaderScreen';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Snackbar, Alert } from "@mui/material";
import { setProducts } from '../redux/productSlice';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from '../components/Navbar';

const Products = () => {
    const products=useSelector(store=>store?.products?.products || []);
    const [filter, setFilter] = useState('');
    const [allProducts, setAllProducts] = useState([]);
    const [search,setSearch]=useState("");
    const [category,setCategory]=useState("All");
    const [brand,setBrand]=useState("All");
    const [loading, setLoading] = useState(true);
    const [priceRange,setPriceRange]=useState([0,999999]);
    const [displayOrder, setDisplayOrder] = useState('lowToHigh');
    const dispatch=useDispatch();

    const [toastState, setToastState] = useState({
        open: false,
        message: "",
        severity: "success"
    });
    
    const handleChange = (event) => {
        setFilter(event.target.value);
    };

    // ✅ useEffect with async function (clean way)
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                console.log("🚀 Fetching products...");

                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/product/get-all-products`
                );

                console.log("📦 FULL RESPONSE:", res.data);

                if (res.data.success) {
                    console.log("✅ PRODUCTS:", res.data.products);

                    setAllProducts(res.data.products);
                      
                    dispatch(setProducts(res.data.products));
                    setToastState({
                        open: true,
                        message: "Products Displayed",
                        severity: "success"
                    });
                }

            } catch (error) {
                console.error("❌ ERROR:", error);
                setToastState({
                    open: true,
                    message: "Failed to load products",
                    severity: "error"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
        
    }, []);
     useEffect(() => {
        if(allProducts.length===0){
          return;
        }
        let filtered=[...allProducts];
        if(search.trim()!== ""){
             filtered=filtered.filter(p=>p.productName?.toLowerCase().includes(search.toLowerCase()))
        }
        if(category!= "All"){
             filtered=filtered.filter(p=>p.category===category)
        }
         if(brand!= "All"){
             filtered=filtered.filter(p=>p.brand===brand)
        }
        filtered=filtered.filter(p=>p.productPrice>=priceRange[0] && p.productPrice<=priceRange[1] )
         if(displayOrder=== "lowToHigh"){
             filtered.sort((a,b)=>a.productPrice-b.productPrice)
        }else if(displayOrder=== "highToLow"){
             filtered.sort((a,b)=>b.productPrice-a.productPrice)
        }
        console.log("FILTERED:", filtered);
        dispatch(setProducts(filtered));
        console.log("Dispatched:",products);
    }, [search, category, brand, displayOrder, priceRange, allProducts,dispatch]);

    // ✅ Sorting Logic
   const sortedProducts = [...products].sort((a, b) => {
    if (filter === "lowToHigh") {
        return a.productPrice - b.productPrice;
    } else if (filter === "highToLow") {
        return b.productPrice - a.productPrice;
    }
    return 0;
});

    return (
        <>
        <Navbar/>
            <div className='pt-26 pb-10 bg-gray-50'>
                <div className='max-w-7xl mx-auto flex gap-7'>

                    {/* Sidebar */}
                    <FilterSideBar  allProducts={allProducts} priceRange={priceRange} search={search} brand={brand} setSearch={setSearch}
                     setBrand={setBrand} category={category} setCategory={setCategory} setPriceRange={setPriceRange} />

                    <div className="flex flex-col flex-1">

                        {/* Sort */}
                        <div className="flex justify-end mb-4">
                            <Box sx={{ minWidth: 200 }}>
                                <FormControl fullWidth>
                                    <Select
                                        value={filter}
                                        onChange={handleChange}
                                        displayEmpty
                                    >
                                        <MenuItem value="">Sort By Price</MenuItem>
                                        <MenuItem value="lowToHigh">Low → High</MenuItem>
                                        <MenuItem value="highToLow">High → Low</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </div>

                        {/* Products */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">

                            {
                                loading ? (
                                   <LoaderScreen/>
                                ) : sortedProducts.length > 0 ? (
                                    sortedProducts.map((product) => (
                                        <ProductCard key={product._id} product={product} />
                                    
                                    ))
                                ) : (
                                    <p className="col-span-full text-center">No products found</p>
                                )
                            }

                        </div>

                    </div>
                </div>
            </div>

            {/* ✅ Toast */}
            <Snackbar
                open={toastState.open}
                autoHideDuration={3000}
                onClose={() => setToastState({ ...toastState, open: false })}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    severity={toastState.severity}
                    onClose={() => setToastState({ ...toastState, open: false })}
                    variant="filled"
                >
                    {toastState.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default Products;