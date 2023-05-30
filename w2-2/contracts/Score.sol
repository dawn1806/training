// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Score {

    address public teacher;

    mapping(address => uint256) public scoresOf;

    constructor(address _teacher) {
        teacher = _teacher;
    }

    modifier onlyTeacher {
        require(msg.sender == teacher, "only teacher");
        _;
    }

    function setScore(address stu, uint256 score) external onlyTeacher {
        scoresOf[stu] = score;
    }
}

interface IScore {
    function setScore(address stu, uint256 score) external;
}

contract Teacher {

    address public owner;

    constructor () {
        owner = msg.sender;
    }

    function setStudentScore(address c, address stu, uint256 score) external {
        require(msg.sender == owner, "not owner");
        require(score <= 100, "score error");
        IScore(c).setScore(stu, score);
    }
}
