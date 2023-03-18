const asyncHandler = require("express-async-handler");
const Match = require("../models/matchModel");
const User = require("../models/userModel");

const createMatches = asyncHandler(async (req, res) => {
  //grab all users Id and rightswipe
  const { users } = await User.find({}, "_id rightSwipe");

  if (!users) {
    throw new Error("no users found");
  }
  //return array cotaining objects
  const matches = findPotentialMatch(users);

  matches.forEach((match) => {
    console.log(Object.entries(match));
  });

  const match = await Match.create({
    userId: email,
    password: hashedPassword,
  });

  if (match) {
    res.status(201).json({
      _id: user.id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//two pointer findpotentialmatch
function findPotentialMatch(userCollection) {
  let matches = [];
  let i = 0; // Pointer for the first user
  let j = 1; // Pointer for the second user

  while (j < userCollection.length) {
    let swipeArr = userCollection[i];
    let nextSwipeArr = userCollection[j];

    if (findMatches(swipeArr, nextSwipeArr)) {
      matches.push(
        { [userCollection[i].id]: userCollection[j].id },
        { [userCollection[j].id]: userCollection[i].id }
      );
    }

    // Move the pointers
    if (j === userCollection.length - 1) {
      i++;
      j = i + 1;
    } else {
      j++;
    }
  }
  return matches;
}

function findMatches(obj, obj2) {
  return obj2.rightSwipe.includes(obj.id) && obj.rightSwipe.includes(obj2.id)
    ? true
    : false;
}

module.exports = { createMatches };
