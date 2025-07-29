import { Card } from "flowbite-react";

export default function SubscriptionPlans() {
  const plans = [
    {
      title: "1 Month Subscription",
      price: "₪500",
      description: "Perfect to try out the system for short-term goals.",
      rating: 4,
      image: "https://cdn-icons-png.flaticon.com/512/10030/10030852.png", // replace as needed
    },
    {
      title: "3 Months Subscription",
      price: "₪1300",
      description: "Best for trainers managing several clients regularly.",
      rating: 5,
      image: "https://cdn-icons-png.flaticon.com/512/5045/5045923.png", // replace as needed
    },
    {
      title: "6 Months Subscription",
      price: "₪2800",
      description: "Long-term plan with full features and best value.",
      rating: 5,
      image: "https://cdn-icons-png.flaticon.com/512/1165/1165675.png", // replace as needed
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-6 my-10">
      {plans.map((plan, index) => (
        <Card
          key={index}
          className="max-w-sm w-full"
          imgAlt={plan.title}
          imgSrc={plan.image}
        >
          <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {plan.title}
          </h5>

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            {plan.description}
          </p>

          {/* Rating */}
          {/* <div className="mb-3 flex items-center">
            {[...Array(plan.rating)].map((_, i) => (
              <svg
                key={i}
                className="h-1 w-1 text-yellow-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-2 text-sm font-medium text-cyan-700 dark:text-cyan-300">
              {plan.rating}.0
            </span>
          </div> */}

          {/* Price and Button */}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {plan.price}
            </span>
            <button className="rounded-lg bg-cyan-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800">
              Subscribe
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}
