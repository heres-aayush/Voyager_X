// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract TravelBookingV2 {
    struct Booking {
        uint256 packageId;
        address user;
        uint256 amountPaid;
        bool isBooked;
    }

    address public constant RECEIVER = 0xCd14338ab62d86D17756807E536A607675D1D246; // Hardcoded receiver address
    mapping(uint256 => Booking) public bookings;
    mapping(address => mapping(uint256 => bool)) public userBookings; // Track bookings by user and package
    uint256 public bookingCount;

    event PackageBooked(uint256 indexed packageId, address indexed user, uint256 amountPaid);

    function bookPackage(uint256 packageId) external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        require(!userBookings[msg.sender][packageId], "Package already booked by user");

        // Record the booking
        bookingCount++;
        bookings[bookingCount] = Booking({
            packageId: packageId,
            user: msg.sender,
            amountPaid: msg.value,
            isBooked: true
        });

        // Mark this package as booked by this user
        userBookings[msg.sender][packageId] = true;

        // Forward the funds to the receiver
        (bool success, ) = RECEIVER.call{value: msg.value}("");
        require(success, "Transfer to receiver failed");

        emit PackageBooked(packageId, msg.sender, msg.value);
    }

    function getBookingStatus(uint256 bookingId) external view returns (bool) {
        return bookings[bookingId].isBooked;
    }

    function hasUserBookedPackage(address user, uint256 packageId) external view returns (bool) {
        return userBookings[user][packageId];
    }
} 