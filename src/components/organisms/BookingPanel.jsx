import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import AuthModal from "@/components/organisms/AuthModal";
import { differenceInDays, addDays, format } from "date-fns";
import { toast } from "react-toastify";

const BookingPanel = ({ property }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pricing, setPricing] = useState({
    nights: 0,
    nightlyRate: property.pricing.nightlyRate,
    subtotal: 0,
    cleaningFee: property.pricing.cleaningFee,
    serviceFee: property.pricing.serviceFee,
    total: 0
  });

  // Calculate pricing when dates change
  useEffect(() => {
    if (checkIn && checkOut) {
      const nights = differenceInDays(new Date(checkOut), new Date(checkIn));
      if (nights > 0) {
        const subtotal = nights * property.pricing.nightlyRate;
        const total = subtotal + property.pricing.cleaningFee + property.pricing.serviceFee;
        
        setPricing({
          nights,
          nightlyRate: property.pricing.nightlyRate,
          subtotal,
          cleaningFee: property.pricing.cleaningFee,
          serviceFee: property.pricing.serviceFee,
          total
        });
      }
    }
  }, [checkIn, checkOut, property.pricing]);

  // Set default dates (today + 1 week)
  useEffect(() => {
    const today = new Date();
    const nextWeek = addDays(today, 7);
    setCheckIn(format(today, "yyyy-MM-dd"));
    setCheckOut(format(nextWeek, "yyyy-MM-dd"));
  }, []);

  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      toast.error("Please select your check-in and check-out dates");
      return;
    }

    if (guests > property.capacity.guests) {
      toast.error(`This property can accommodate up to ${property.capacity.guests} guests`);
      return;
    }

    const bookingData = {
      propertyId: property.Id,
      propertyTitle: property.title,
      checkIn,
      checkOut,
      guests,
      totalPrice: pricing.total
    };

    setShowAuthModal(true);
  };

  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200 sticky top-8">
        <div className="mb-6">
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-2xl font-bold text-gray-900">
              ${property.pricing.nightlyRate}
            </span>
            <span className="text-gray-600"> night</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <ApperIcon name="Star" size={16} className="text-accent fill-current" />
              <span className="font-semibold">{property.rating}</span>
            </div>
            <span className="text-gray-600">
              ({property.reviewCount} review{property.reviewCount !== 1 ? "s" : ""})
            </span>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {/* Date Selection */}
          <div className="grid grid-cols-2 gap-2 border border-gray-300 rounded-lg overflow-hidden">
            <div className="p-3 border-r border-gray-300">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide block mb-1">
                Check-in
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={format(new Date(), "yyyy-MM-dd")}
                className="w-full border-none outline-none text-sm font-medium"
              />
            </div>
            <div className="p-3">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide block mb-1">
                Check-out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || format(new Date(), "yyyy-MM-dd")}
                className="w-full border-none outline-none text-sm font-medium"
              />
            </div>
          </div>

          {/* Guest Selection */}
          <div className="border border-gray-300 rounded-lg p-3">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide block mb-1">
              Guests
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="w-full border-none outline-none text-sm font-medium bg-transparent"
            >
              {Array.from({ length: property.capacity.guests }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>
                  {num} guest{num > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button onClick={handleBooking} className="w-full mb-4">
          Reserve
        </Button>

        <p className="text-center text-sm text-gray-600 mb-6">
          You won't be charged yet
        </p>

        {/* Pricing Breakdown */}
        {pricing.nights > 0 && (
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div className="flex justify-between">
              <span className="text-gray-700">
                ${pricing.nightlyRate} × {pricing.nights} night{pricing.nights > 1 ? "s" : ""}
              </span>
              <span className="font-medium">${pricing.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Cleaning fee</span>
              <span className="font-medium">${pricing.cleaningFee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Service fee</span>
              <span className="font-medium">${pricing.serviceFee}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-semibold text-gray-900">${pricing.total}</span>
            </div>
          </div>
        )}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        bookingData={{
          propertyId: property.Id,
          propertyTitle: property.title,
          checkIn,
          checkOut,
          guests,
          totalPrice: pricing.total
        }}
      />
    </>
  );
};

export default BookingPanel;