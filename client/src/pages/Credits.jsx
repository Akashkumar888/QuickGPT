import React, { useEffect, useState } from 'react';
import Loading from './Loading';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { useAppContext } from '../context/AppContext';



const Credits = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token,setUser } = useAppContext();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await api.get("/api/credit/plan", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (data.success) setPlans(data.plans);
        else toast.error(data.message || "Failed to fetch plans");
      } catch (error) {
        toast.error(error.message);
      }
      setLoading(false);
    };
    fetchPlans();
  }, []);

  const purchasePlan = async (planId) => {
  try {
    const { data } = await api.post("/api/credit/purchase", { planId }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!data.success) return toast.error(data.message);

    const { transactionId, amount, currency, displayAmount } = data;

    // create Razorpay order
    const { data: orderData } = await api.post("/api/credit/create-order", { amount, currency, transactionId }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.order.amount,
      currency: orderData.order.currency,
      name: "QuickGPT",
      description: `${displayAmount}$ - Credits Purchase`,
      order_id: orderData.order.id,
      handler: async function (response) {
        // <<< ADD THE FOLLOWING HERE
        const verifyRes = await api.post("/api/credit/verify-order", {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          transactionId
        }, { headers: { Authorization: `Bearer ${token}` } });

        if (verifyRes.data.success) {
          toast.success("Payment successful!");
          // update user in context
          const { data } = await api.get("/api/user/data", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (data.success) setUser(data.user);
        } else {
          toast.error("Payment verification failed!");
        }
      },
      theme: { color: "#6b46c1" }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (error) {
    toast.error(error.message);
  }
};


  if (loading) return <Loading />;

  return (
    <div className='max-w-7xl h-screen overflow-y-scroll mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <h2 className="text-3xl font-semibold text-center mb-10 xl:mt-30 text-gray-800 dark:text-white">Credit plans</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {plans.map(plan => (
          <div key={plan._id} className={`border border-gray-200 dark:border-purple-700 rounded-lg shadow hover:shadow-lg transition-shadow p-6 min-w-[300px] flex flex-col ${plan._id === 'pro' ? "bg-purple-50 dark:bg-purple-900" : "bg-white dark:bg-transparent"}`}>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-300 mb-4">
                ${plan.price}
                <span className="text-base font-normal text-gray-600 dark:text-purple-200"> / {plan.credits} credits</span>
              </p>
              <ul className='list-disc list-inside text-sm text-gray-700 dark:text-purple-200 space-y-1'>
                {plan.features.map((feature, index) => <li key={index}>{feature}</li>)}
              </ul>
            </div>
            <button
              onClick={() => purchasePlan(plan._id)}
              className='mt-6 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-medium py-2 rounded transition-colors cursor-pointer'
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Credits;
