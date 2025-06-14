// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract TravelBookingV3 {
    struct Booking {
        uint256 packageId;
        address user;
        uint256 amountPaid;
        bool isBooked;
    }

    address public constant RECEIVER = 0xCd14338ab62d86D17756807E536A607675D1D246;

    mapping(uint256 => Booking) public bookings;
    mapping(address => mapping(uint256 => bool)) public userBookings;

    uint256 public bookingCount;

    event PackageBooked(uint256 indexed packageId, address indexed user, uint256 amountPaid);

    ///Book a travel package by paying ETH
    function bookPackage(uint256 packageId) external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        require(!userBookings[msg.sender][packageId], "Package already booked by user");

        bookingCount++;
        bookings[bookingCount] = Booking({
            packageId: packageId,
            user: msg.sender,
            amountPaid: msg.value,
            isBooked: true
        });

        userBookings[msg.sender][packageId] = true;

        (bool success, ) = RECEIVER.call{value: msg.value}("");
        require(success, "Transfer to receiver failed");

        emit PackageBooked(packageId, msg.sender, msg.value);
    }

    ///Get status of a booking by its ID
    function getBookingStatus(uint256 bookingId) external view returns (bool) {
        return bookings[bookingId].isBooked;
    }

    ///Check if a user has already booked a specific package
    function hasUserBookedPackage(address user, uint256 packageId) external view returns (bool) {
        return userBookings[user][packageId];
    }

    /// Get detailed booking info (booking ID, amount, isBooked) for a user and package
    /// Loops over bookings, suitable for frontend calls with known user & package
    function getUserBookingDetails(address user, uint256 packageId)
        external
        view
        returns (uint256 bookingId, uint256 amountPaid, bool isBooked)
    {
        for (uint256 i = 1; i <= bookingCount; i++) {
            Booking memory b = bookings[i];
            if (b.user == user && b.packageId == packageId) {
                return (i, b.amountPaid, b.isBooked);
            }
        }
        revert("No booking found");
    }
}
