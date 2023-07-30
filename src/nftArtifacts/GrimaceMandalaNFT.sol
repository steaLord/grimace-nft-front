// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title GrimaceMandalaNFT contract
 * @dev ERC721 token contract for Grimace Mandala NFTs with auction functionality.
 */
contract GrimaceMandalaNFT is ERC721, ERC721URIStorage, ERC721Enumerable, Pausable, Ownable, ERC721Burnable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    uint256 public sequentialCounter;

    address private grimaceCoinAddress;
    IERC20 private grimaceCoin;
    mapping(uint256 => uint256) public sequentialToTokenId;

    struct Auction {
        uint256 tokenId;
        uint256 initialPrice;
        uint256 bidStep;
        uint256 endTime;
        address highestBidder;
        uint256 highestBid;
    }

    mapping(uint256 => Auction) private tokenIdToAuction;

    // New mapping to store bids for each token ID
    mapping(uint256 => Bid[]) public tokenBids;
    // Struct representing a bid
    struct Bid {
        uint256 bidAmount;
        address bidder;
        uint256 timestamp;
    }

    /**
     * @dev Contract constructor.
     * @param _grimaceCoinAddress Address of the Grimace Coin ERC20 token.
     */
    constructor(address _grimaceCoinAddress) ERC721("GrimaceMandalaNFT", "GMNFT") {
        grimaceCoinAddress = _grimaceCoinAddress;
        grimaceCoin = IERC20(_grimaceCoinAddress);
    }

    /**
     * @dev Pauses all token transfers.
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Unpauses token transfers.
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Safely mints a new NFT and assigns it to the given address.
     * @param to Address to which the NFT will be minted.
     * @param uri URI of the token metadata.
     */
    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        sequentialToTokenId[sequentialCounter] = tokenId;
        sequentialCounter++;
    }

    /**
     * @dev Retrieves the token ID associated with the given sequential ID.
     * @param sequentialId Sequential ID of the token.
     * @return tokenId The corresponding token ID.
     */
    function getNFTBySequentialId(uint256 sequentialId) public view returns (uint256) {
        return sequentialToTokenId[sequentialId];
    }

    /**
     * @dev Starts an auction for the specified token.
     * @param tokenId Token ID for which the auction will be started.
     * @param initialPrice Initial price for the auction.
     * @param bidStep Bid increment for each bid.
     * @param auctionDurationInSeconds Duration of the auction in seconds.
     */
    function startAuction(
        uint256 tokenId,
        uint256 initialPrice,
        uint256 bidStep,
        uint256 auctionDurationInSeconds
    ) public onlyOwner {
        require(ownerOf(tokenId) == owner(), "You can only start an auction for your own NFT");
        require(tokenIdToAuction[tokenId].endTime == 0, "Auction already exists for this token");

        uint256 endTime = block.timestamp + auctionDurationInSeconds;

        Auction memory newAuction = Auction(tokenId, initialPrice, bidStep, endTime, address(0), 0);
        tokenIdToAuction[tokenId] = newAuction;
    }
    /**
     * @dev Ends an ongoing auction for the specified token.
     * @param tokenId Token ID for which the auction will be ended.
     */
    function endAuction(uint256 tokenId) public onlyOwner {
        Auction storage auction = tokenIdToAuction[tokenId];
        require(auction.endTime > 0, "Auction does not exist for this token");
        // require(block.timestamp >= auction.endTime, "Auction has not ended yet");

        if (auction.highestBidder != address(0)) {
            // Transfer the token to the highest bidder
            _transfer(ownerOf(tokenId), auction.highestBidder, tokenId);

            // Transfer tokens from auction to owner
            // require(grimaceCoin.transfer(owner(), auction.highestBid), "Transfer failed");
        }
    }

    struct BidResult {
        uint256 highestBid;
        address highestBidder;
    }
    /**
     * @dev Places a bid on the specified token auction.
     * @param tokenId Token ID for which the bid is placed.
     * @param bidAmount Bid amount in Grimace Coin.
     */
    function placeBid(uint256 tokenId, uint256 bidAmount) public returns (BidResult memory) {
        Auction storage auction = tokenIdToAuction[tokenId];
        require(auction.endTime > 0, "Auction does not exist for this token");
        require(block.timestamp <= auction.endTime, "Auction has ended");
        require(bidAmount >= auction.highestBid + auction.bidStep, "Bid amount must be greater than current highest bid");

        // Transfer the bid amount from the bidder to the contract
        require(grimaceCoin.transferFrom(msg.sender, address(this), bidAmount), "Failed to transfer bid amount");

        // Refund the previous highest bidder if there was one
        if (auction.highestBidder != address(0)) {
            require(grimaceCoin.transfer(auction.highestBidder, auction.highestBid), "Failed to refund previous highest bidder");
        }

        // Update auction data with the new highest bidder and bid amount
        auction.highestBidder = msg.sender;
        auction.highestBid = bidAmount;

        // Store the bid in the tokenBids mapping
        tokenBids[tokenId].push(Bid(bidAmount, msg.sender, block.timestamp));

        return BidResult(auction.highestBid, auction.highestBidder);
    }

    /**
     * @dev Retrieves the bid history for the specified token ID.
     * @param tokenId Token ID for which the bid history is retrieved.
     * @return bids An array of Bid structs representing the bid history.
     */
    function getBidHistory(uint256 tokenId) public view returns (Bid[] memory bids) {
        return tokenBids[tokenId];
    }

    /**
     * @dev Withdraws the remaining Grimace Coin funds from the contract to the owner's address.
     */
    function withdrawFunds(address withdtawAddress) public onlyOwner {
        uint256 contractBalance = grimaceCoin.balanceOf(address(this));
        require(grimaceCoin.transfer(withdtawAddress, contractBalance), "Transfer failed");
    }

    /**
     * @dev Retrieves the details of an auction for the specified token.
     * @param tokenId Token ID for which the auction details are retrieved.
     * @return Auction details including token ID, initial price, bid step, end time, highest bidder, and highest bid.
     */
    function getAuctionDetails(uint256 tokenId)
    public
    view
    returns (
        uint256,
        uint256,
        uint256,
        uint256,
        address,
        uint256
    )
    {
        Auction memory auction = tokenIdToAuction[tokenId];
        return (
        auction.tokenId,
        auction.initialPrice,
        auction.bidStep,
        auction.endTime,
        auction.highestBidder,
        auction.highestBid
        );
    }

    /**
     * @dev Hook function called before any token transfer.
     * @param from Address from which the token is transferred.
     * @param to Address to which the token is transferred.
     * @param tokenId Token ID being transferred.
     * @param batchSize Number of tokens being transferred.
     */
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
    internal
    whenNotPaused
    override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    /**
     * @dev Hook function called before token burn.
     * @param tokenId Token ID being burned.
     */
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    /**
     * @dev Retrieves the token URI for the specified token ID.
     * @param tokenId Token ID for which the URI is retrieved.
     * @return The token URI.
     */
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev Checks if the contract supports the specified interface.
     * @param interfaceId Interface ID being checked.
     * @return Whether the interface is supported or not.
     */
    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable, ERC721URIStorage)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
