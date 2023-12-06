// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.19;

contract BackOnChain {
    struct utilisateur{
        uint256 solde;
        uint256 caution;
        uint256 delai;
    }

    mapping(address => utilisateur) public utilisateurs;

    struct claim {
        uint256 moment;
    }

    mapping(address => mapping(address => claim)) public claims;

    struct map_claim1 {
        address[] claims_adresses1;
    }

    mapping(address => address[]) public map_claims1;

    struct map_claim2 {
        address[] claims_adresses2;
    }

    mapping(address => address[]) public map_claims2;

    struct special {
        uint256 montant;
        uint256 delai_s;
    }

    mapping(address => mapping(address => special)) public specials;

    struct map_special1 {
        address[] specials_adresses1;
    }

    mapping(address => address[]) public map_specials1;

    struct map_special2 {
        address[] specials_adresses2;
    }

    mapping(address => address[]) public map_specials2;

    struct token_i {
        address adresse;
        uint256 id;
    }

    struct token {
        uint256 montant_t;
    }

    mapping(address => mapping(address => mapping(uint256 => token))) public tokens;

    struct map_token {
        token_i[] tokens_adresses;
    }

    mapping(address => token_i[]) private map_tokens;

    function longueur_map_claims1(address a) public view returns (uint256) {
        return map_claims1[a].length;
    }

    function longueur_map_claims2(address a) public view returns (uint256) {
        return map_claims2[a].length;
    }

    function longueur_map_specials1(address a) public view returns (uint256) {
        return map_specials1[a].length;
    }

    function longueur_map_specials2(address a) public view returns (uint256) {
        return map_specials2[a].length;
    }

    function longueur_map_tokens(address a) public view returns (uint256) {
        return map_tokens[a].length;
    }

    function retirer_map_claims1(address a) private {
        for (uint256 i = 0; i < map_claims1[a].length; i++) {
            if (map_claims1[msg.sender][i] == a) {
                map_claims1[msg.sender][i] = map_claims1[msg.sender][map_claims1[msg.sender].length - 1];
                map_claims1[msg.sender].pop();
            }
        }
    }

    function retirer_map_claims2(address a) private {
        for (uint256 i = 0; i < map_claims2[msg.sender].length; i++) {
            if (map_claims2[a][i] == msg.sender) {
                map_claims2[a][i] = map_claims2[a][map_claims2[a].length - 1];
                map_claims2[a].pop();
            }
        }
    }

    function retirer_map_specials1(address a) private {
        for (uint256 i = 0; i < map_specials1[a].length; i++) {
            if (map_specials1[a][i] == msg.sender) {
                map_specials1[a][i] = map_specials1[a][map_specials1[a].length - 1];
                map_specials1[a].pop();
            }
        }
    }

    function retirer_map_specials2(address a) private {
        for (uint256 i = 0; i < map_specials2[msg.sender].length; i++) {
            if (map_specials2[msg.sender][i] == a) {
                map_specials2[msg.sender][i] = map_specials2[msg.sender][map_specials2[msg.sender].length - 1];
                map_specials2[msg.sender].pop();
            }
        }
    }

    function securiser(uint256 c, uint256 d) public payable {
        if (utilisateurs[msg.sender].solde == 0) {
            utilisateurs[msg.sender].solde = msg.value;
            
        } else {
            utilisateurs[msg.sender].solde += msg.value;
        }
        utilisateurs[msg.sender].caution = c;
        utilisateurs[msg.sender].delai = d;
    }

    function demande_1(address a) public payable {
        if (specials[msg.sender][a].montant != 0) {
            claims[msg.sender][a].moment = block.timestamp;
        } else {
            claims[msg.sender][a].moment = block.timestamp;
            utilisateurs[a].solde += msg.value;
        }
        map_claims1[msg.sender].push(a);
        map_claims2[a].push(msg.sender);
    }

    function demande_2(address a) public payable {
        if (specials[msg.sender][a].montant != 0) {
            if (specials[msg.sender][a].delai_s + claims[msg.sender][a].moment < block.timestamp) {
                payable(msg.sender).transfer(specials[msg.sender][a].montant);
                utilisateurs[a].solde -= specials[msg.sender][a].montant;
                claims[msg.sender][a].moment = 0;
                specials[msg.sender][a].montant = 0;
                retirer_map_claims1(a);
                retirer_map_claims2(a);
            } else {
                claims[msg.sender][a].moment = block.timestamp;
            }
        } else {
            if (utilisateurs[a].delai + claims[msg.sender][a].moment < block.timestamp) {
                payable(msg.sender).transfer(utilisateurs[a].solde);
                utilisateurs[a].solde = 0;
                claims[msg.sender][a].moment = 0;
                retirer_map_claims1(a);
                retirer_map_claims2(a);
            } else {
                claims[msg.sender][a].moment = block.timestamp;
            }
        }
    }

    function refuser(address a) public {
        claims[a][msg.sender].moment = 0;
        retirer_map_claims1(a);
        retirer_map_claims2(a);
    }

    function super_wallet(address a, uint256 m, uint256 d) public {
        specials[a][msg.sender].montant = m;
        specials[a][msg.sender].delai_s = d;
        map_specials1[a].push(msg.sender);
        map_specials2[msg.sender].push(a);
    }

    function retirer_fonds(uint256 s) public payable {      
        utilisateurs[msg.sender].solde -= s;
        payable(msg.sender).transfer(s);
    
    }

    function retirer_special(address a) public {
        specials[a][msg.sender].montant = 0;
        retirer_map_specials1(a);
        retirer_map_specials2(a);
    }
}