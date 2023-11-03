import React from "react";
import StripeCheckout from "react-stripe-checkout";
import { UserApi } from "../../configs/api";
import { toast } from "react-hot-toast";
import axios from "axios";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";

const UpgradePremium = () => {
  const amount = 1000;
  const publishableKey =
    "pk_test_51NnZNQSCHRF9RPPWsxW5yF4ncPLLrR1Rc2svGQE5sK7DmkYyq47cRGIl1Yt5IwSwQyv4733qE0wxt4fCguIykQz300vFWMcSuW";
  const seeker = useSelector((state) => {
    return state?.seekerDetails.seekerToken;
  });

  const payNow = async (token, amount) => {
    try {
      const response = await axios.post(`${UserApi}upgradePayment`, {
        userToken: seeker,
        token: token.id,
        amount: amount.toString(),
        currency: "INR",
      });

      if (response.status === 200) {
        if (response.data.requires_action) {
          const clientSecret = response.data.client_secret;
          const { paymentIntent, error } = await stripe.confirmCardPayment(
            clientSecret
          );

          if (error) {
            console.error("Payment confirmation error:", error);
          } else {
            window.open(
              paymentIntent.next_action.redirect_to_url.url,
              "_blank"
            );
            navigate("/posts");
            showToast("Payment successful", "#00ff00");
          }
        } else {
          window.open(response.data.data, "_blank");
          navigate("/posts");
          showToast(response.data.message, "#00ff00");
        }
      } else {
        console.error("Payment failed:", response.data.message);
        toast.error(response.data.message, {
          duration: 3000,
          position: "top-center",
          style: {
            background: "#ff0000",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment error. Please try again.", {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#ff0000",
          color: "#fff",
        },
      });
    }
  };

  const showToast = (message, backgroundColor) => {
    toast.success(message, {
      duration: 3000,
      position: "top-center",
      style: {
        background: backgroundColor,
        color: "#fff",
      },
    });
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center">
        <div className="w-full md:w-6/12 p-6 mt-24 bg-gray-100">
          <h1 className="text-center text-2xl font-bold mb-4">
            Unlock the Full Potential of SkillSet Network!
          </h1>
          <p>
            Upgrade to our Premium seeker Account for 9 months and supercharge
            your hiring process.
            <br />
            With Premium, your account gains exclusive access to a powerful
            suite of features and benefits:
          </p>
          <br />
          <ul className="ml-4 md:ml-11 list-disc">
            <li>
              Post unlimited posts to hire fast by attracting your account.
            </li>
            <li>Highlight your profile to attract top-tier candidates.</li>
            <li>
              Advanced search filters to find the perfect match for your skills.
            </li>
            <li>Premium badge to boost your account credibility.</li>
          </ul>
          <br />
          <p>
            Join SkillSet Network Premium today and discover the future of
            recruitment!
          </p>
          <br />
          <div className="flex justify-center">
            <StripeCheckout
              stripeKey={publishableKey}
              token={(token) => payNow(token, amount)}
              name="Premium Registration"
              description="Your company registration"
              amount={amount * 100}
              currency="INR"
              billingAddress
              zipCode
              image="/skillset-logo.jpg"
            >
              <button className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded">
                Pay Now
              </button>
            </StripeCheckout>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpgradePremium;
