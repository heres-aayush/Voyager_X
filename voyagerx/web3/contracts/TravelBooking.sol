// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract TravelBooking {
    struct Booking {
        uint256 packageId;
        address user;
        uint256 amountPaid;
        bool isBooked;
    }

    mapping(uint256 => Booking) public bookings;
    uint256 public bookingCount;

    event PackageBooked(uint256 indexed packageId, address indexed user, uint256 amountPaid);

    function bookPackage(uint256 packageId) external payable {
        require(msg.value > 0, "Amount must be greater than 0");

        bookingCount++;
        bookings[bookingCount] = Booking({
            packageId: packageId,
            user: msg.sender,
            amountPaid: msg.value,
            isBooked: true
        });

        emit PackageBooked(packageId, msg.sender, msg.value);
    }

    function getBookingStatus(uint256 bookingId) external view returns (bool) {
        return bookings[bookingId].isBooked;
    }
}
//testing