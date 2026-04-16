import React from 'react'
import { Headphones, Shield, Truck } from 'lucide-react'

const Features = () => {
    return (
        <section className='py-16 bg-gray-50'>
            
            <div className='max-w-7xl mx-auto px-4'>
                
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    
                    {/* Feature 1 */}
                    <div className="flex flex-col items-center space-y-3">
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Truck className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-lg">Free Shipping</h3>
                        <p className="text-gray-500">On orders over $50</p>
                    </div>

                    {/* Feature 2 */}
                    <div className="flex flex-col items-center space-y-3">
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Shield className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-lg">Secure Payment</h3>
                        <p className="text-gray-500">100% safe transactions</p>
                    </div>

                    {/* Feature 3 */}
                    <div className="flex flex-col items-center space-y-3">
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Headphones className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-lg">24/7 Support</h3>
                        <p className="text-gray-500">We’re here to help anytime</p>
                    </div>

                </div>

            </div>
        </section>
    )
}

export default Features