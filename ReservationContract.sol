// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ReservationContract {
    struct Reservation {
        string name;
        uint age;
        string gender;
        string bookingTime;
        string bookingDate;
    }

    Reservation[] public reservations;

    function registerReservation(string memory name, uint age, string memory gender, string memory bookingTime, string memory bookingDate) public {
        reservations.push(Reservation(name, age, gender, bookingTime, bookingDate));
    }

    function getReservation(uint index) public view returns (string memory, uint, string memory, string memory, string memory) {
        require(index < reservations.length, "Invalid index");
        Reservation memory res = reservations[index];
        return (res.name, res.age, res.gender, res.bookingTime, res.bookingDate);
    }

    function getReservationCount() public view returns (uint) {
        return reservations.length;
    }
}
