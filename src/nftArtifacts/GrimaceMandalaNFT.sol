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

    constructor(address _grimaceCoinAddress) ERC721("GrimaceMandalaNFT", "GMNFT") {
        grimaceCoinAddress = _grimaceCoinAddress;
        grimaceCoin = IERC20(_grimaceCoinAddress);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        sequentialToTokenId[sequentialCounter] = tokenId;
        sequentialCounter++;
    }

    // Used to get auction data from frontend without need of owning nft.
    function getNFTBySequentialId(uint256 sequentialId) public view returns (uint256) {
        return sequentialToTokenId[sequentialId];
    }

    function startAuction(
        uint256 tokenId,
        uint256 initialPrice,
        uint256 bidStep,
        uint256 auctionDurationInDays
    ) public onlyOwner {
        require(ownerOf(tokenId) == owner(), "You can only start an auction for your own NFT");
        require(tokenIdToAuction[tokenId].endTime == 0, "Auction already exists for this token");

        uint256 auctionDuration = auctionDurationInDays * 1 days;
        uint256 endTime = block.timestamp + auctionDuration;

        Auction memory newAuction = Auction(tokenId, initialPrice, bidStep, endTime, address(0), 0);
        tokenIdToAuction[tokenId] = newAuction;
    }

    function placeBid(uint256 tokenId, uint256 bidAmount) public {
        Auction storage auction = tokenIdToAuction[tokenId];
        require(auction.endTime > 0, "Auction does not exist for this token");
        require(block.timestamp <= auction.endTime, "Auction has ended");
        require(bidAmount >= auction.highestBid + auction.bidStep, "Bid amount must be greater than current highest bid");

        if (auction.highestBidder != address(0)) {
            // Refund the previous highest bidder if exists
            require(grimaceCoin.transfer(auction.highestBidder, auction.highestBid), "Failed to refund previous highest bidder");
        }

        require(grimaceCoin.transferFrom(msg.sender, address(this), bidAmount), "Failed to transfer bid amount");
        auction.highestBidder = msg.sender;
        auction.highestBid = bidAmount;
    }

    function withdrawFunds() public onlyOwner {
        uint256 contractBalance = grimaceCoin.balanceOf(address(this));
        require(grimaceCoin.transfer(owner(), contractBalance), "Transfer failed");
    }

    function getAuctionDetails(uint256 tokenId)
    public
    view
    returns (
        uint256 tokenId,
        uint256 initialPrice,
        uint256 bidStep,
        uint256 endTime,
        address highestBidder,
        uint256 highestBid
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

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
    internal
    whenNotPaused
    override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable, ERC721URIStorage)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
