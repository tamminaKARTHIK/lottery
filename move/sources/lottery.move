module lottery_address::lottery {
    use std::vector;
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::randomness;
    use aptos_framework::timestamp;
    use aptos_framework::account;
    use aptos_std::table::{Self, Table};

    // Error codes
    const ENO_LOTTERY: u64 = 1;
    const ELOTTERY_ALREADY_EXISTS: u64 = 2;
    const ELOTTERY_ALREADY_DRAWN: u64 = 3;
    const ELOTTERY_NOT_DRAWN: u64 = 4;
    const EINSUFFICIENT_BALANCE: u64 = 5;
    const ENO_PARTICIPANTS: u64 = 6;
    const ENO_NOT_MODULE_OWNER: u64 = 7;
    const ELOTTERY_DIDNT_END: u64 = 8;

    const MODULE_OWNER: address = @lottery_address;
    const LOTTERY_PRICE: u64 = 10000000;

    // Struct to store the lottery details
    struct Lottery has store, key, drop {
        participants: vector<address>,
        winner: address,
        prize: u64,
        is_drawn: bool,
        start_time: u64,
        end_time: u64,
    }

    struct SignerCapabilityStore has key {
        signer_cap: account::SignerCapability
    }

    struct GlobalTable has key {
        lotteryCounter:u64,
        lotteryTable: Table<u64, Lottery>,
    }

    // Initialize the lottery
    //public entry fun initialize(deployer: &signer, duration: u64) {
        // let admin_addr = signer::address_of(admin);
        // assert!(!exists<Lottery>(admin_addr), ELOTTERY_ALREADY_EXISTS);

        // let current_time = timestamp::now_seconds();
        // let lottery = Lottery {
        //     participants: vector::empty(),
        //     winner: @0x0,
        //     prize: coin::zero<AptosCoin>(),
        //     ticket_price,
        //     is_drawn: false,
        //     start_time: current_time,
        //     end_time: current_time + duration,
        // };
        // move_to(admin, lottery);

    public entry fun initialize(deployer: &signer) {
        assert!(signer::address_of(deployer) == MODULE_OWNER, ENO_NOT_MODULE_OWNER);

        // Initialize a resource account that maintains the list of lotteries
        let (_resource, signer_cap) = account::create_resource_account(deployer, vector::empty());

        let rsrc_acc_signer = account::create_signer_with_capability(&signer_cap);

        coin::register<AptosCoin>(&rsrc_acc_signer);

        // Initialize the global table
        move_to(deployer, GlobalTable {
            // store details of lottery into a table
            lotteryCounter: 0,
            lotteryTable: table::new(),
        });

        move_to(deployer, SignerCapabilityStore{
            signer_cap,
        });
    }

    // Buy a lottery ticket
    // public entry fun buy_ticket(buyer: &signer, noOfTickets: u64) acquires GlobalTable, SignerCapabilityStore {
        // let lottery = borrow_global_mut<Lottery>(admin_addr);
        // assert!(!lottery.is_drawn, ELOTTERY_ALREADY_DRAWN);
        // assert!(timestamp::now_seconds() < lottery.end_time, ELOTTERY_ALREADY_DRAWN);

        // let payment = coin::withdraw<AptosCoin>(buyer, lottery.ticket_price);
        // coin::merge(&mut lottery.prize, payment);

        // let buyer_addr = signer::address_of(buyer);
        // vector::push_back(&mut lottery.participants, buyer_addr);

    public entry fun createLottery(admin: &signer, duration: u64) acquires GlobalTable {
        // let admin_addr = signer::address_of(admin);
        assert!(signer::address_of(admin) == MODULE_OWNER, ENO_NOT_MODULE_OWNER);
        let global_table_resource = borrow_global_mut<GlobalTable>(MODULE_OWNER);
        let counter = global_table_resource.lotteryCounter + 1;

        let currentTime = timestamp::now_seconds();
        let newLottery = Lottery {
            participants: vector::empty<address>(),
            winner: @0x0,
            prize: 0,
            is_drawn: false,
            start_time: currentTime,
            end_time: currentTime + duration,
        }; 

        table::upsert(&mut global_table_resource.lotteryTable, counter, newLottery);
        global_table_resource.lotteryCounter = counter;
    }


    public entry fun buyTicket(buyer: &signer, lotteryId: u64) acquires GlobalTable, SignerCapabilityStore {
        let global_table_resource = borrow_global_mut<GlobalTable>(MODULE_OWNER);
        // let lottery = table::borrow_mut(&mut global_table_resource.lotteryTable, lotteryId);
        // Borrow the lottery from the table
        let lottery = table::borrow_mut(&mut global_table_resource.lotteryTable, lotteryId);
        assert!(!lottery.is_drawn, ELOTTERY_ALREADY_DRAWN);

        // Take payment from the buyer
        let signer_cap_resource = borrow_global_mut<SignerCapabilityStore>(MODULE_OWNER);
        let rsrc_acc_signer = account::create_signer_with_capability(&signer_cap_resource.signer_cap);
        let rsrc_acc_address = signer::address_of(&rsrc_acc_signer);

        // Check buyer balance to ensure they can afford the ticket
        let buyer_address = signer::address_of(buyer);
        let buyer_balance = coin::balance<AptosCoin>(buyer_address);
        assert!(buyer_balance >= LOTTERY_PRICE, EINSUFFICIENT_BALANCE);
        
        // Transfer the coins from the buyer to the resource account
        // let coins = coin::withdraw<AptosCoin>(buyer, LOTTERY_PRICE);
        // aptos_account::deposit_coins(rsrc_acc_address, coins);
        coin::transfer<AptosCoin>(buyer, rsrc_acc_address, LOTTERY_PRICE);
        
         // Update the lottery prize
        lottery.prize = lottery.prize + LOTTERY_PRICE;
        // Add the buyer to the list of participants
        // let participant_address = signer::address_of(buyer);
        vector::push_back(&mut lottery.participants, buyer_address);
    }

    // Draw the lottery winner
    #[randomness]
    public(friend) entry fun draw_winner(admin: &signer, lotteryId: u64) acquires GlobalTable, SignerCapabilityStore {
        assert!(signer::address_of(admin) == MODULE_OWNER, ENO_NOT_MODULE_OWNER);
        let global_table_resource = borrow_global_mut<GlobalTable>(MODULE_OWNER);
        let lottery = table::borrow_mut(&mut global_table_resource.lotteryTable, lotteryId);

    //     let admin_addr = signer::address_of(admin);
    //     let lottery = borrow_global_mut<Lottery>(admin_addr);
        
        assert!(!lottery.is_drawn, ELOTTERY_ALREADY_DRAWN);
        assert!(timestamp::now_seconds() >= lottery.end_time, ELOTTERY_DIDNT_END);
        assert!(!vector::is_empty(&lottery.participants), ENO_PARTICIPANTS);

        let participants_count = vector::length(&lottery.participants);
        let winner_index = randomness::u64_range(0, participants_count);
        lottery.winner = *vector::borrow(&lottery.participants, winner_index);

        let signer_cap_resource = borrow_global_mut<SignerCapabilityStore>(MODULE_OWNER);
        let (rsrc_acc_signer,  _rsrc_acc_address) = get_rsrc_acc(signer_cap_resource);

        coin::transfer<AptosCoin>(&rsrc_acc_signer, lottery.winner, participants_count * LOTTERY_PRICE);
        lottery.is_drawn = true;
    }


    fun get_rsrc_acc(signer_cap_resource: &SignerCapabilityStore): (signer, address) {
        let rsrc_acc_signer = account::create_signer_with_capability(&signer_cap_resource.signer_cap);
        let rsrc_acc_addr = signer::address_of(&rsrc_acc_signer);

        (rsrc_acc_signer, rsrc_acc_addr)
    }

    // // Claim the prize (can only be called by the winner)
    // public entry fun claim_prize(winner: &signer, admin_addr: address) acquires Lottery {
    //     let lottery = borrow_global_mut<Lottery>(admin_addr);
    //     assert!(lottery.is_drawn, ELOTTERY_NOT_DRAWN);
    //     assert!(signer::address_of(winner) == lottery.winner, ENO_LOTTERY);

    //     let prize = coin::extract_all(&mut lottery.prize);
    //     coin::deposit(signer::address_of(winner), prize);
    // }

    // View functions
    #[view]
    public fun get_ticket_price(): u64 {
        LOTTERY_PRICE
    }

    #[view]
    public fun get_prize_amount(lotteryId: u64): u64 acquires GlobalTable {
        // Access the global table resource
        let global_table_resource = borrow_global<GlobalTable>(MODULE_OWNER);

        // vector::length(&table::borrow(&borrow_global<GlobalTable>(MODULE_OWNER).lotteryTable, lotteryId).participants) * LOTTERY_PRICE

        // Borrow the lottery entry from the table
        let lottery = table::borrow(&global_table_resource.lotteryTable, lotteryId);

        // Return the prize amount stored in the lottery struct
        lottery.prize
    }

    #[view]
    public fun get_participants_count(lotteryId: u64): u64 acquires GlobalTable {
        let global_table_resource = borrow_global<GlobalTable>(MODULE_OWNER);
        let lottery = table::borrow(&global_table_resource.lotteryTable, lotteryId);
        vector::length(&lottery.participants)
        // vector::length(&borrow_global<Lottery>(admin_addr).participants)
    }

    #[view]
    public fun is_lottery_drawn(lotteryId: u64): bool acquires GlobalTable {
        let global_table_resource = borrow_global<GlobalTable>(MODULE_OWNER);
        let lottery = table::borrow(&global_table_resource.lotteryTable, lotteryId);
        lottery.is_drawn
        // borrow_global<Lottery>(admin_addr).is_drawn
    }

    #[view]
    public fun get_winner(lotteryId: u64): address acquires GlobalTable {
        let global_table_resource = borrow_global<GlobalTable>(MODULE_OWNER);
        let lottery = table::borrow(&global_table_resource.lotteryTable, lotteryId);
        assert!(lottery.is_drawn, ELOTTERY_NOT_DRAWN);
        lottery.winner
        // let lottery = borrow_global<Lottery>(admin_addr);
        // assert!(lottery.is_drawn, ELOTTERY_NOT_DRAWN);
        // lottery.winner
    }

    #[view]
    public fun get_lottery_duration(lotteryId: u64): u64 acquires GlobalTable {
        let global_table_resource = borrow_global<GlobalTable>(MODULE_OWNER);
        let lottery = table::borrow(&global_table_resource.lotteryTable, lotteryId);
        lottery.end_time - lottery.start_time
    }

    #[view]
    public fun get_lottery_end_time(lotteryId: u64): u64 acquires GlobalTable {
        let global_table_resource = borrow_global<GlobalTable>(MODULE_OWNER);
        let lottery = table::borrow(&global_table_resource.lotteryTable, lotteryId);
    lottery.end_time
}

    #[view]
    public fun get_last_lottery_id(): u64 acquires GlobalTable {
        let global_table_resource = borrow_global<GlobalTable>(MODULE_OWNER);
        global_table_resource.lotteryCounter
    }
}