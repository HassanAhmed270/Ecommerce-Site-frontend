import React from 'react'
import { Button } from '@mui/material'

const Hero = () => {
    return (
        <section className='bg-gradient-to-r from-blue-600 to-purple-600 text-white  py-24 pt-44 px-12'>
            
            <div className='max-w-7xl mx-auto px-4'>
                
                <div className='grid md:grid-cols-2 gap-8 items-center'>
                    
                    {/* Left Content */}
                    <div>
                        <h1 className='text-4xl md:text-6xl font-bold mb-4'>
                            Latest Electronics at Best Prices
                        </h1>

                        <p className='text-xl mb-6 text-blue-100'>
                            Discover cutting-edge technology with unbeatable deals on smartphones, laptops, and more.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            
                            <Button
                                variant="contained"
                                sx={{
                                    py: 1,
                                    px: 3,
                                    backgroundColor: "#f3f1f2",
                                    color: "#220ce7",
                                    "&:hover": {
                                        backgroundColor: "#d6d3d4"
                                    }
                                }}
                            >
                                Shop Now
                            </Button>

                            <Button
                                variant="outlined"
                                sx={{
                                    py: 1,
                                    px: 3,
                                    backgroundColor: "#220ce7",
                                    borderColor:"#f3f1f2",
                                    color: "#f3f1f2",
                                    "&:hover": {
                                        backgroundColor: "#1505a5",
                                    }
                                }}
                            >
                                View Deals
                            </Button>

                        </div>
                    </div>

                    {/* Right Image */}
                    <div className='relative'>
                        <img
                            src="/ekart-hero.png"
                            alt="hero"
                            className='rounded-lg shadow-2xl w-full max-w-md mx-auto'
                        />
                    </div>

                </div>

            </div>

        </section>
    )
}

export default Hero