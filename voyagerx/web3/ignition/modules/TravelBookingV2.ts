import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const BookingModule = buildModule("BookingModule", (m) => {
  const booking = m.contract("TravelBookingV2");
  return { booking };
});

export default BookingModule;
