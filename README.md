# Aptos Lottery

As part of Encode's Aptos bootcamp, the team (Aashish and Akshar) worked on the project: Aptos Lottery. This project implements a decentralized lottery system on the Aptos blockchain using the Move programming language. The smart contract allows users to participate in a lottery by buying tickets with AptosCoin, and uses on-chain randomness to select a winner.

## Key Features

1. **Ticket Purchase**: Users can buy lottery tickets using AptosCoin.
2. **Random Winner Selection and Payout**: Utilizes Aptos' on-chain randomness module for fair winner selection and pays out the prize to the winner in same transaction.
3. **View Functions**: Provides functions to check lottery status, prize amount, and participant count.

## Learnings Applied

This project demonstrates several key concepts learned from the Move bootcamp:

1. **Struct and Resource Management**: Using `struct Lottery has key` to create a resource that can only exist in one place in global storage.
2. **Access Control**: Implementing `public entry` and `public(friend)` functions to control who can call certain functions.
3. **On-Chain Randomness**: Utilizing the `#[randomness]` attribute and `randomness::u64_range()` for secure random number generation.
4. **Coin Handling**: Managing AptosCoin transfers using the `coin` module.
5. **Error Handling**: Defining and using custom error codes for better error management.
6. **View Functions**: Implementing `#[view]` functions for easy data retrieval without modifying state.
7. **Timestamp Usage**: Using `timestamp::now_seconds()` for time-based operations.

This project showcases the power and flexibility of Move in creating complex, secure, and efficient smart contracts on the Aptos blockchain.

<!-- # Lottery Psuedocode

- Initialize lottery 
    - define structure to store participants, prize, winner
    - initialize lottery with a minimum ticket prize

- Buy ticket
    - users can by tickets by sending Aptos coins to the lottery contract
    - add user's address to the participants list and increase the total prize

- Draw winner
    - ensure lottery has at least three participants
    - use aptos on-chain randomness modulte to select a winner from the participants list
    - transfer the total prize to the winner's address

- End lottery
    - mark lottery as ended -->
