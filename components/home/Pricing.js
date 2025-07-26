'use client';

import { Check, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const Pricing = () => {
    const { isSignedIn, isLoaded } = useUser();
    const router = useRouter();
    const pricingPlans = [
        {
            title: 'Starter',
            desc: 'Perfect for getting started',
            price: '$0',
            period: 'month',
            features: ['2 PDF summaries Daily', 'Standard processing', 'Community support'],
            gradient: 'from-gray-700 to-gray-900',
        },
        {
            title: 'Pro',
            desc: 'Best value for professionals',
            price: '$2',
            period: 'month',
            features: [
                '10 PDF summaries Daily',
                'Priority processing',
                '24/7 support',
                'Download Summary',
            ],
            gradient: 'from-rose-700 to-pink-500',
            highlight: true,
            url: 'https://buy.stripe.com/test_9B614na8N27x6ndeMe2sM00',
        },
        {
            title: 'Enterprise',
            desc: 'For teams and businesses',
            price: '$12',
            period: 'month',
            features: [
                'Unlimited everything',
                "Unlimited PDF summaries",
                "unlimited Download Summary",
                'Dedicated support',
            ],
            gradient: 'from-purple-700 to-indigo-500',
            url: 'https://buy.stripe.com/test_cNiaEX5Sx13taDt5bE2sM01',
        },
    ];

    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
    };
    return (
        <section id='pricing' className="py-20 px-6 sm:px-10 lg:px-20 bg-white text-gray-800">

            <motion.div
                className="text-center mb-12"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.6 }}
                variants={{
                    hidden: {},
                    visible: {
                        transition: { staggerChildren: 0.2 },
                    },
                }}
            >
                <motion.h2
                    className="text-pink-600 font-semibold text-sm uppercase tracking-wide"
                    variants={fadeUp}
                >
                    Pricing
                </motion.h2>
                <motion.p
                    className="text-3xl sm:text-4xl font-bold mt-2"
                    variants={fadeUp}
                >
                    Choose the plan that fits your needs
                </motion.p>
            </motion.div>


            <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                variants={{
                    hidden: {},
                    visible: {
                        transition: { staggerChildren: 0.4 },
                    },
                }}
            >
                {pricingPlans.map((plan, index) => (
                    <motion.div
                        key={index}
                        variants={{
                            hidden: { opacity: 0, y: 40 },
                            visible: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <Card
                            className={`min-h-[340px] sm:min-h-[360px] md:min-h-[380px] lg:min-h-[400px] h-auto relative group p-6 rounded-2xl transition-all duration-300 hover:shadow-xl ${plan.highlight
                                ? 'border-2 border-pink-500'
                                : 'border border-gray-200 hover:border-pink-400'
                                }`}
                        >
                            <CardContent className="p-0">
                                <h3 className="text-xl font-semibold mb-1">{plan.title}</h3>
                                <p className="text-sm text-gray-500 mb-4">{plan.desc}</p>

                                <div className="text-4xl font-bold mb-1">
                                    {plan.price}
                                    <span className="text-sm text-gray-600 font-medium ml-1">USD</span>
                                </div>
                                <p className="text-sm text-gray-500 mb-6">/ {plan.period}</p>

                                <ul className="mb-8 space-y-2 text-sm">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <Check className="w-4 h-4 mt-1 text-green-600" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                {plan.title === 'Starter' ? (
                                    <span className="inline-block text-sm font-semibold text-green-600 border border-green-500 rounded-full px-4 py-1 bg-green-50">
                                        Free
                                    </span>
                                ) : (
                                    <Button
                                        onClick={() => {
                                            if (isLoaded && isSignedIn) {
                                                router.push(`/payment-warning?link=${encodeURIComponent(plan.url)}`);
                                            } else {
                                                toast.error('Login required to purchase. Redirecting to sign in...');
                                                setTimeout(() => {
                                                    router.push('/sign-in');
                                                }, 1500);
                                            }
                                        }}
                                        size="lg"
                                        className={`w-full font-semibold rounded-full text-white bg-gradient-to-r ${plan.gradient} hover:opacity-90 transition`}
                                    >
                                        Buy Now <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                )}

                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};

export default Pricing;
