// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateService {
    
    //variables
    address public admin;           //address of contract admin
    struct Certificate {            //struct which represents a certificate 
        uint256 id;                 //certificate id
        address issuer;             //certificate issuer
        address owner;              //certficate owner
        string certificateDataHash; //data hash of the certificate, passed down from the upper layes such as javascript
    }
    struct VerificationRequest {    //struct which represents a certificate 
        uint256 requestId;          //certificate id
        uint256 certificateId;      //certificate id
        address requester;          // Requesters's address
        bool isVerified;            //verification status 
    }
    uint256 public nextCertificateId = 1; //stores the next certificate id to be assigned
    uint256 public nextRequestId = 1; //stores the next request id to be assigned
    mapping(uint256 => Certificate) public certificates; //maps certificate ids to their Certificate
    mapping(address => uint256[]) public ownedCertificatesIds; //maps owner addresses to their certificate ids
    mapping(uint256 => VerificationRequest) public verificationRequests; ////maps request ids to their VertificationRequest

    constructor() {
        admin = msg.sender;
    }

    //events
    event CertificateIssued(uint256 indexed id, address indexed owner, string certificateDataHash);
    event CertificateVerified(uint256 indexed id, address indexed verifier);
    event VerificationRequested(uint256 indexed requestId, uint256 indexed certificateId, address indexed requester);
    event VerificationCompleted(uint256 indexed requestId, bool isVerified);

    //modfiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Admin access only!");
        _;
    }

    modifier onlyOwner(uint256 certificateId) {
        require(msg.sender == certificates[certificateId].owner, "Certificate Owner access only!");
        _;
    }

    modifier onlyIssuerOrAdmin() {
        require(msg.sender == admin || certificates[nextCertificateId].issuer == msg.sender, "Admin or Certificate owner access only!");
        _;
    }

    //Functions
    //issue a certificate
    function issueCertificate(address _owner, string calldata _certificateDataHash) external onlyIssuerOrAdmin returns (uint256) {
        uint256 _certificateId = nextCertificateId++;
        certificates[_certificateId] = Certificate({
            id: _certificateId,
            issuer: msg.sender,
            owner: _owner,
            certificateDataHash: _certificateDataHash
        });
        ownedCertificatesIds[_owner].push(_certificateId);

        emit CertificateIssued(_certificateId, _owner, _certificateDataHash);
        return _certificateId;
    }
    //creates a verification request
    function requestVerification(uint256 _certificateId) external returns (uint256) {
        uint256 _requestId = nextRequestId++;
        verificationRequests[_requestId] = VerificationRequest({
            requestId: _requestId,
            certificateId: _certificateId,
            requester: msg.sender,
            isVerified: false
        });

        emit VerificationRequested(_requestId, _certificateId, msg.sender);
        return _requestId;
    }
    //complete verification
    function completeVerification(uint256 requestId, bool isVerified) external onlyAdmin {
        verificationRequests[requestId].isVerified = isVerified;
        emit VerificationCompleted(requestId, isVerified);
    }
    //return Certificate from id
    function getCertificate(uint256 certificateId) external view returns (Certificate memory) {
        return certificates[certificateId];
    }
    //return owned certificate ids
    function getOwnedCertificates(address owner) external view returns (uint256[] memory) {
        return ownedCertificatesIds[owner];
    }
    //return VerificationRequest from id
    function getVerificationRequest(uint256 requestId) external view returns (VerificationRequest memory) {
        return verificationRequests[requestId];
    }
}
