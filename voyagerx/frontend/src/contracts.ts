// src/contracts.ts
export const TravelBookingABI = [
    // Paste the ABI here
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "packageId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountPaid",
          "type": "uint256"
        }
      ],
      "name": "PackageBooked",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "RECEIVER",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "packageId",
          "type": "uint256"
        }
      ],
      "name": "bookPackage",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "bookingCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "bookings",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "packageId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amountPaid",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isBooked",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "bookingId",
          "type": "uint256"
        }
      ],
      "name": "getBookingStatus",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "packageId",
          "type": "uint256"
        }
      ],
      "name": "getUserBookingDetails",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "bookingId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountPaid",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isBooked",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "packageId",
          "type": "uint256"
        }
      ],
      "name": "hasUserBookedPackage",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "userBookings",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
      ];
  
  export const TravelBookingAddress = "0x9Cc1DDcdB49A2A5a2457a020753F457FFb2DE66e";