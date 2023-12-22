// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract CertificateService {
    
    //variables
    address public admin;           //address of contract admin
    struct Certificate {            //struct which represents a certificate 
        uint256 id;                 //certificate id
        address issuer;             //certificate issuer
        address owner;              //certficate owner
        string certificateDataHash; //data hash of the certificate, passed down from the upper layes such as javascript
        bool isApproved;            //field to track approval status
    }
    struct VerificationRequest {    //struct which represents a certificate 
        uint256 requestId;          //certificate id
        uint256 certificateId;      //certificate id
        address requester;          //Requesters's address
        address issuer;             //issuer's address
        bool isVerified;            //verification status 
        bool dataHashMatches;       //check to see if incoming certificate data matched with the oner on server
    }
    uint256 public nextCertificateId = 1; //stores the next certificate id to be assigned
    uint256 public nextRequestId = 1; //stores the next request id to be assigned
    mapping(uint256 => Certificate) public certificates; //maps certificate ids to their Certificate
    mapping(address => uint256[]) public ownedCertificatesIds; //maps owner addresses to their certificate ids
    mapping(address => uint256[]) public certificateCreationRequests; //maps owner addresses to their certificate requests
    mapping(address => uint256[]) public ownedVerificationRequests; //maps owner addresses to their verification request ids
    mapping(uint256 => VerificationRequest) public verificationRequests; //maps request ids to their VertificationRequest

    constructor() {
        admin = msg.sender;
    }

    //events
    event CertificateCreationRequested(uint256 indexed id, address indexed owner, string certificateDataHash);
    event CertificateCreationApproved(uint256 indexed id, address indexed issuerAddress);
    event VerificationRequested(uint256 indexed requestId, uint256 indexed certificateId, address indexed requester);
    event VerificationCompleted(uint256 indexed requestId, bool isVerified, address indexed issuerAddress);

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
    // Request the creation of a new certificate
    function requestCertificateCreation(address _owner, string calldata _certificateDataHash) external returns (uint256) {
        uint256 _certificateId = nextCertificateId++;
        certificates[_certificateId] = Certificate({
            id: _certificateId,
            issuer: address(0),  // Set issuer to the zero address initially
            owner: _owner,
            certificateDataHash: _certificateDataHash,
            isApproved: false
        });
        certificateCreationRequests[_owner].push(_certificateId);
        emit CertificateCreationRequested(_certificateId, _owner, _certificateDataHash);
        return _certificateId;
    }

    // Approve a certificate creation
    function certificateCreationApproved(uint256 certificateId, address _issuerAddress) external onlyAdmin {
        Certificate storage certificate = certificates[certificateId];
        certificate.isApproved = true;
        certificate.issuer = _issuerAddress;  // Set issuer to the provided address
        ownedCertificatesIds[certificate.owner].push(certificateId);
        emit CertificateCreationApproved(certificateId, _issuerAddress);
    }
    // function requestVerification(uint256 _certificateId) external returns (uint256) {
    //     uint256 _requestId = nextRequestId++;
    //     verificationRequests[_requestId] = VerificationRequest({
    //         requestId: _requestId,
    //         certificateId: _certificateId,
    //         requester: msg.sender,
    //         isVerified: false
    //     });

    //     emit VerificationRequested(_requestId, _certificateId, msg.sender);
    //     return _requestId;
    // }
    //creates a verification request
    function requestVerification(uint256 _certificateId, string calldata verifierCertificateDataHash, address verifierAddress) external returns (uint256) {
        bool _dataHashMatches = keccak256(abi.encodePacked(certificates[_certificateId].certificateDataHash)) == keccak256(abi.encodePacked(verifierCertificateDataHash));

        uint256 _requestId = nextRequestId++;
        verificationRequests[_requestId] = VerificationRequest({
            requestId: _requestId,
            certificateId: _certificateId,
            requester: verifierAddress,
            issuer: address(0),
            isVerified: false,
            dataHashMatches: _dataHashMatches
        });

        ownedVerificationRequests[verifierAddress].push(_requestId);
        emit VerificationRequested(_requestId, _certificateId, verifierAddress);
        return _requestId;
    }

    //complete verification
    function completeVerification(uint256 requestId, bool isVerified, address issuerAddress) external onlyAdmin {
        verificationRequests[requestId].isVerified = isVerified;
        verificationRequests[requestId].issuer = issuerAddress;
        emit VerificationCompleted(requestId, isVerified, issuerAddress);
    }
    //return Certificate from id
    function getCertificate(uint256 certificateId) external view returns (Certificate memory) {
        return certificates[certificateId];
    }
    //return owned certificate ids
    // function getOwnedCertificates(address owner) external view returns (uint256[] memory) {
    //     return ownedCertificatesIds[owner];
    // }
    //return owned certificate requests
    function getCertificateCreationRequests(address owner) external view returns (uint256[] memory) {
        return certificateCreationRequests[owner];
    }
    //return all verification requests made by a specific address
    // function getOwnedVerificationRequests(address verifier) external view returns (uint256[] memory) {
    //     return ownedVerificationRequests[verifier];
    // }
    //return VerificationRequest from id
    function getVerificationRequest(uint256 requestId) external view returns (VerificationRequest memory) {
        return verificationRequests[requestId];
    }
    // Function to get all pending verification requests
    function getPendingVerificationRequests() external view returns (VerificationRequest[] memory) {
        uint count = 0;
        for (uint i = 1; i < nextRequestId; i++) {
            if (!verificationRequests[i].isVerified) {
                count++;
            }
        }
        VerificationRequest[] memory requests = new VerificationRequest[](count);
        uint index = 0;
        for (uint i = 1; i < nextRequestId; i++) {
            if (!verificationRequests[i].isVerified) {
                VerificationRequest storage request = verificationRequests[i];
                requests[index] = request;
                index++;
            }
        }
        return requests;
    }
    // Function to get all pending certificate creation requests
    function getPendingCertificateCreationRequests() external view returns (Certificate[] memory) {
        uint count = 0;
        for (uint i = 1; i < nextCertificateId; i++) {
            if (!certificates[i].isApproved) {
                count++;
            }
        }

        Certificate[] memory requests = new Certificate[](count);
        uint index = 0;
        for (uint i = 1; i < nextCertificateId; i++) {
            if (!certificates[i].isApproved) {
                Certificate storage request = certificates[i];
                requests[index] = request;
                index++;
            }
        }
        return requests;
    }

    function getOwnedCertificates(address owner) external view returns (Certificate[] memory) {
        uint256 count = ownedCertificatesIds[owner].length;
        Certificate[] memory ownedCerts = new Certificate[](count);  // Renamed variable

        for (uint256 i = 0; i < count; i++) {
            uint256 certificateId = ownedCertificatesIds[owner][i];
            Certificate storage certificateItem = certificates[certificateId]; // Correctly using storage here
            ownedCerts[i] = certificateItem;
        }

        return ownedCerts;
    }

    function getOwnedCertificateCreationRequests(address owner) external view returns (Certificate[] memory) {
        uint count = certificateCreationRequests[owner].length;
        Certificate[] memory requests = new Certificate[](count);

        for (uint i = 0; i < count; i++) {
            uint requestId = certificateCreationRequests[owner][i];
            Certificate storage request = certificates[requestId];
            requests[i] = request;
        }
        return requests;
    }

    function getOwnedVerificationRequests(address verifier) external view returns (VerificationRequest[] memory) {
        uint count = ownedVerificationRequests[verifier].length;
        VerificationRequest[] memory requests = new VerificationRequest[](count);

        for (uint i = 0; i < count; i++) {
            uint requestId = ownedVerificationRequests[verifier][i];
            VerificationRequest storage request = verificationRequests[requestId];
            requests[i] = request;
        }
        return requests;
    }



}
