import React from 'react';

const FilterSideBar = ({
    allProducts,
    priceRange,
    search,
    setSearch,
    category,
    setCategory,
    brand,
    setBrand,
    setPriceRange
}) => {

    const Categories = allProducts.map(p => p.category);
    const uniqueCategories = ["All", ...new Set(Categories)];

    const Brands = allProducts.map(p => p.brand);
    const uniqueBrands = ["All", ...new Set(Brands)];

    // ✅ safe values (fix undefined issue)
    const min = priceRange?.[0] ?? 0;
    const max = priceRange?.[1] ?? 999999;

    const handleCategoryClick = (val) => {
        setCategory(val);
    };

    const handleBrandChange = (e) => {
        setBrand(e.target.value);
    };

    // ✅ fixed array update
    const handleMinChange = (e) => {
        const value = Number(e.target.value) || 0;
        if (value <= max) {
            setPriceRange([value, max]);
        }
    };

    const handleMaxChange = (e) => {
        const value = Number(e.target.value) || 0;
        if (value >= min) {
            setPriceRange([min, value]);
        }
    };

    const resetFilter = () => {
        setSearch("");
        setCategory("All");
        setBrand("All");
        setPriceRange([0, 999999]);
    };

    return (
        <div className='bg-gray-100 mt-10 rounded-md h-max p-4 hidden md:block w-64 min-h-screen'>

            {/* Search */}
            <input
                type="text"
                placeholder='Search...'
                className='bg-white p-2 rounded-md border-gray-400 border-2 w-full'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Category */}
            <h1 className="mt-5 text-xl font-semibold">Category</h1>
            <div className="flex flex-col mt-3 gap-2">
                {uniqueCategories.map((item, index) => (
                    <div key={index} className="flex gap-2 items-center">
                        <input
                            type="radio"
                            name="category"
                            checked={category === item}
                            onChange={() => handleCategoryClick(item)}
                        />
                        <label>{item}</label>
                    </div>
                ))}
            </div>

            {/* Brand */}
            <h1 className="mt-5 text-xl font-semibold">Brand</h1>
            <div className="flex flex-col mt-3">
                <select
                    className="bg-white border border-gray-300 px-3 py-2 rounded-md outline-none"
                    value={brand}
                    onChange={handleBrandChange}
                >
                    {uniqueBrands.map((item, index) => (
                        <option key={index} value={item}>
                            {item}
                        </option>
                    ))}
                </select>
            </div>

            {/* Price Range */}
            <h1 className="mt-5 text-xl font-semibold">Price Range</h1>
            <div className="flex flex-col gap-2">
                <label>{`PKR ${min} - ${max}`}</label>

                <div className="flex gap-2 items-center">
                    <input
                        type="number"
                        min="0"
                        max="5000"
                        value={min}
                        onChange={handleMinChange}   // ✅ FIXED
                        className='w-20 p-1 border border-gray-300 rounded'
                    />
                    <span>-</span>
                    <input
                        type="number"
                        min="0"
                        max="999999"
                        value={max}
                        onChange={handleMaxChange}   // ✅ FIXED
                        className='w-20 p-1 border border-gray-300 rounded'
                    />
                </div>

                <input
                    type="range"
                    min="0"
                    max="5000"
                    value={min}
                    onChange={handleMinChange}   // ✅ FIXED
                    className='w-full p-1 border border-gray-300 rounded'
                    step="100"
                />

                <input
                    type="range"
                    min="0"
                    max="999999"
                    value={max}
                    onChange={handleMaxChange}   // ✅ FIXED
                    className='w-full p-1 border border-gray-300 rounded'
                    step="100"
                />
            </div>

            {/* Reset */}
            <button
                onClick={resetFilter}   // ✅ FIXED
                className='bg-pink-600 hover:bg-gray-600 transition mb-3 w-full px-3 py-2 text-white font-semibold rounded-lg flex items-center justify-center gap-2'
            >
                <span>Reset Filters</span>
            </button>

        </div>
    );
};

export default FilterSideBar;